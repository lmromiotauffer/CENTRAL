import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { InputBase, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EastIcon from '@mui/icons-material/East';
import { useNavigate } from 'react-router-dom';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { fonts, iconSize, typeScale, radius, motion, curva, type SinfraPalette } from '@/theme';
import { search, linkFor, KIND_ORDER, MIN_CHARS, groupByKind, type SearchResult } from '@/lib/searchIndex';
import { modules } from '@/content/modules';
import { useRecentQueries } from '@/hooks/useRecentQueries';
import SearchSuggestions from '@/components/SearchSuggestions';

interface Props {
  variant: 'underline' | 'navChip';
  sx?: object;
  defaultValue?: string;
}

// Submit arrow: same nudge-on-hover in both variants.
const submitButtonSx = (sinfra: SinfraPalette) => ({
  color: sinfra.accent,
  '&:hover': { bgcolor: 'transparent', transform: 'translateX(3px)' },
  transition: `transform ${motion.base} ${curva.suave}`,
  '@media (prefers-reduced-motion: reduce)': {
    '&:hover': { transform: 'none' },
  },
});

const DEBOUNCE_MS = 150;
const RESULT_LIMIT = 8;
const POPULAR = modules.slice(0, 3).map(m => m.title);

export default function SearchBar({ variant, sx, defaultValue }: Props) {
  const sinfra = useSinfra();
  const navigate = useNavigate();
  const { recent, addRecent, clearRecent } = useRecentQueries();
  const listboxId = useId();

  const [q, setQ] = useState(defaultValue ?? '');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [chipExpanded, setChipExpanded] = useState(false);

  const wrapperRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q]);

  const rawResults = useMemo<SearchResult[]>(
    () => (debouncedQ.trim().length >= MIN_CHARS ? search(debouncedQ, RESULT_LIMIT) : []),
    [debouncedQ]
  );
  // Ordem visual (mesma que SearchSuggestions renderiza, agrupada por KIND_ORDER),
  // para que highlight/aria-activedescendant/Enter sempre apontem para o mesmo item.
  const results = useMemo<SearchResult[]>(() => {
    const grouped = groupByKind(rawResults);
    return KIND_ORDER.flatMap(k => grouped[k]);
  }, [rawResults]);

  const close = () => {
    setOpen(false);
    setHighlight(-1);
  };

  const submitAll = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    addRecent(trimmed);
    close();
    navigate(`/busca?q=${encodeURIComponent(trimmed)}`);
  };

  const selectResult = (r: SearchResult) => {
    addRecent(q.trim());
    close();
    if (r.kind === 'documentation') {
      window.open(r.href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(linkFor(r));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (highlight >= 0 && highlight < results.length) {
      selectResult(results[highlight]);
      return;
    }
    submitAll(q);
  };

  const closeAndCollapse = () => {
    close();
    if (variant === 'navChip' && q.trim().length === 0) setChipExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const hasFooter = results.length > 0;
    const total = results.length + (hasFooter ? 1 : 0);
    if (e.key === 'ArrowDown' && total > 0) {
      e.preventDefault();
      setHighlight(prev => (prev + 1) % total);
      return;
    }
    if (e.key === 'ArrowUp' && total > 0) {
      e.preventDefault();
      setHighlight(prev => (prev <= 0 ? total - 1 : prev - 1));
      return;
    }
    if (e.key === 'Escape' || e.key === 'Tab') closeAndCollapse();
  };

  const shouldOpen = (value: string) => value.length >= MIN_CHARS || value.length === 0;

  const scrollBarIntoView = (block: ScrollLogicalPosition) => {
    requestAnimationFrame(() => {
      const bar = wrapperRef.current;
      if (!bar) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior = prefersReducedMotion ? ('auto' as const) : ('smooth' as const);
      if (block === 'center') {
        // centraliza o conjunto barra + HUD de sugestões (a HUD é absoluta e
        // não entra na caixa do wrapper, então scrollIntoView sozinho não basta)
        const hud = document.getElementById(listboxId);
        const top = bar.getBoundingClientRect().top;
        const bottom = (hud ?? bar).getBoundingClientRect().bottom;
        window.scrollBy({ top: (top + bottom) / 2 - window.innerHeight / 2, behavior });
        return;
      }
      bar.scrollIntoView({ behavior, block });
    });
  };

  const handleFocus = () => {
    if (variant === 'navChip') setChipExpanded(true);
    if (shouldOpen(q)) setOpen(true);
    if (variant === 'underline') scrollBarIntoView('start');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQ(next);
    // Zera já na tecla: o Enter antes do debounce não pode abrir um item da lista antiga.
    setHighlight(-1);
    setOpen(shouldOpen(next));
    if (variant === 'underline') scrollBarIntoView('center');
  };

  // Fecha ao perder o foco para fora do form (substitui o listener global de mousedown).
  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    if (e.relatedTarget && wrapperRef.current?.contains(e.relatedTarget as Node)) return;
    closeAndCollapse();
  };

  const handleFormMouseDown = (e: React.MouseEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, button, a, [role="button"]')) return;

    e.preventDefault();
    setChipExpanded(true);
    inputRef.current?.focus();
  };

  const activeOptionId =
    highlight >= 0 && highlight <= results.length ? `${listboxId}-opt-${highlight}` : undefined;
  const suggestions = open ? (
    <SearchSuggestions
      id={listboxId}
      results={results}
      recent={recent}
      popular={POPULAR}
      query={debouncedQ}
      highlightIndex={highlight}
      onSelect={selectResult}
      onSelectTerm={term => {
        setQ(term);
        setOpen(true);
        inputRef.current?.focus();
      }}
      onSubmitAll={() => submitAll(q)}
      onHoverIndex={setHighlight}
      onClear={clearRecent}
      topOffset={variant === 'underline' ? 2 : 1}
    />
  ) : null;

  const commonInputAria = {
    role: 'combobox' as const,
    'aria-expanded': open,
    'aria-controls': listboxId,
    'aria-autocomplete': 'list' as const,
    'aria-activedescendant': activeOptionId,
  };

  const isNavChip = variant === 'navChip';
  const expanded = chipExpanded || q.trim().length > 0 || open;

  return (
    <Box
      ref={wrapperRef}
      component="form"
      data-expanded={isNavChip ? (expanded ? 'true' : 'false') : undefined}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onMouseDown={handleFormMouseDown}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        ...(isNavChip
          ? {
              width: '100%',
              height: 40,
              px: 1.5,
              bgcolor: expanded ? sinfra.paperAlt : 'transparent',
              border: `1.5px solid ${expanded ? sinfra.ink : sinfra.accent}`,
              borderRadius: radius.pill,
              color: expanded ? sinfra.ink : sinfra.accent,
              transition:
                `border-color ${motion.base}, background-color ${motion.base}`,
              '&:hover': {
                borderColor: sinfra.ink,
                bgcolor: expanded ? sinfra.paperAlt : `${sinfra.accent}0A`,
              },
              '&:focus-within': {
                borderColor: sinfra.ink,
                bgcolor: sinfra.paperAlt,
              },
            }
          : {
              borderBottom: `2px solid ${sinfra.accent}`,
              pb: 1,
              scrollMarginTop: { xs: 260, md: 460 },
              transition: `border-color ${motion.base}`,
              '&:focus-within': { borderColor: sinfra.ink },
            }),
        ...sx,
      }}
    >
      <SearchIcon
        sx={
          isNavChip
            ? { color: 'currentColor', fontSize: iconSize.control, flexShrink: 0 }
            : { color: sinfra.ink, opacity: 0.6, fontSize: { xs: iconSize.control, md: iconSize.medium } }
        }
      />
      <InputBase
        inputRef={inputRef}
        value={q}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={isNavChip && !expanded ? 'BUSCAR' : 'Pesquisar na Central'}
        inputProps={{
          ...commonInputAria,
          ...(isNavChip ? { 'aria-label': 'Buscar na Central', id: 'search-nav' } : { id: 'search-underline' }),
          name: 'q',
        }}
        sx={{
          flex: 1,
          fontFamily: fonts.body,
          ...(isNavChip
            ? {
                minWidth: 0,
                color: 'currentColor',
                fontSize: typeScale.micro,
                '& input': {
                  p: 0,
                  fontWeight: expanded ? 400 : 700,
                  letterSpacing: expanded ? 0 : '0.1em',
                  textTransform: expanded ? 'none' : 'uppercase',
                },
                '& input::placeholder': { color: 'currentColor', opacity: 1 },
              }
            : {
                color: sinfra.ink,
                '& input::placeholder': { color: `${sinfra.ink}99`, opacity: 1 },
              }),
        }}
      />
      {!isNavChip || expanded ? (
        <IconButton
          type="submit"
          aria-label="Buscar"
          size={isNavChip ? 'small' : 'medium'}
          sx={{ ...submitButtonSx(sinfra), flexShrink: isNavChip ? 0 : undefined }}
        >
          <EastIcon />
        </IconButton>
      ) : null}
      {suggestions}
    </Box>
  );
}
