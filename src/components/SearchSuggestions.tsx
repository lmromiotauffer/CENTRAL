import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import EastIcon from '@mui/icons-material/East';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { fonts, iconSize, spacing, typeScale, radius, motion, curva, thinScrollbarSx } from '@/theme';
import SectionEyebrow from '@/components/SectionEyebrow';
import { KIND_LABELS, KIND_ORDER, MIN_CHARS, groupByKind, keyFor, type SearchResult } from '@/lib/searchIndex';

interface SearchSuggestionsProps {
  id: string;
  results: SearchResult[];
  recent: string[];
  popular: string[];
  query: string;
  highlightIndex: number;
  onSelect: (r: SearchResult) => void;
  onSelectTerm: (term: string) => void;
  onSubmitAll: () => void;
  onHoverIndex: (i: number) => void;
  onClear: () => void;
  topOffset: number;
}

const KIND_ICONS: Record<SearchResult['kind'], typeof SchoolIcon> = {
  tutorial: SchoolIcon,
  module: CategoryIcon,
  faq: HelpOutlineIcon,
  documentation: DescriptionIcon,
  contact: ContactMailIcon,
  video: OndemandVideoOutlinedIcon,
};

export default function SearchSuggestions({
  id,
  results,
  recent,
  popular,
  query,
  highlightIndex,
  onSelect,
  onSelectTerm,
  onSubmitAll,
  onHoverIndex,
  onClear,
  topOffset,
}: SearchSuggestionsProps) {
  const sinfra = useSinfra();
  const isEmptyState = results.length === 0;
  const hasQuery = query.trim().length >= MIN_CHARS;
  const grouped = groupByKind(results);
  const footerIndex = results.length;

  let runningIndex = 0;
  const scrollViewportSx = {
    flex: 1,
    minHeight: 0,
    maxHeight: !isEmptyState ? 'min(52vh, 392px)' : 'min(42vh, 320px)',
    overflowY: 'auto',
    ...thinScrollbarSx(sinfra, sinfra.paper),
  } as const;

  const chipSx = {
    all: 'unset',
    cursor: 'pointer',
    border: `1px solid ${sinfra.rule}`,
    borderRadius: radius.control,
    px: spacing.item,
    py: spacing.cozy,
    fontSize: typeScale.bodySmall,
    color: sinfra.ink,
    fontFamily: fonts.body,
    transition: `background-color ${motion.fast}, border-color ${motion.fast}`,
    '&:hover': { bgcolor: sinfra.paperAlt, borderColor: sinfra.accent },
    '&:focus-visible': { outline: `2px solid ${sinfra.accent}`, outlineOffset: 2 },
  } as const;

  const renderChipGroup = (label: string, terms: string[], mb?: number, onClearGroup?: () => void) => (
    <Box sx={mb ? { mb } : undefined}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: spacing.cozy }}>
        <SectionEyebrow sx={{ opacity: 0.75 }}>{label}</SectionEyebrow>
        {onClearGroup && (
          <Box
            component="button"
            type="button"
            onMouseDown={e => { e.preventDefault(); onClearGroup(); }}
            sx={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: typeScale.nano,
              color: sinfra.ink,
              opacity: 0.6,
              fontFamily: fonts.body,
              '&:hover': { opacity: 1, color: sinfra.accent },
              '&:focus-visible': { outline: `2px solid ${sinfra.accent}`, outlineOffset: 2 },
            }}
          >
            Limpar
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.cozy }}>
        {terms.map(term => (
          <Box
            key={term}
            component="button"
            type="button"
            onMouseDown={e => { e.preventDefault(); onSelectTerm(term); }}
            sx={chipSx}
          >
            {term}
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      role="listbox"
      id={id}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        mt: topOffset,
        bgcolor: sinfra.paper,
        border: `1.5px solid ${sinfra.rule}`,
        borderRadius: 2,
        zIndex: 10,
        maxHeight: 'min(60vh, 480px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: `sb-suggestions-in ${motion.base} ease-out`,
        '@keyframes sb-suggestions-in': {
          from: { opacity: 0, transform: 'translateY(-4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box data-testid="search-suggestions-scroll" sx={scrollViewportSx}>
        {!isEmptyState && KIND_ORDER.map(kind => {
          const group = grouped[kind];
          if (group.length === 0) return null;
          const Icon = KIND_ICONS[kind];
          return (
            <Box key={kind}>
              <Box
                role="presentation"
                sx={{
                  bgcolor: sinfra.paperAlt,
                  px: spacing.item * 2,
                  py: spacing.cozy,
                  borderBottom: `1px solid ${sinfra.rule}`,
                }}
              >
                <SectionEyebrow sx={{ opacity: 0.75 }}>
                  {KIND_LABELS[kind]} · {group.length}
                </SectionEyebrow>
              </Box>
              {group.map(r => {
                const i = runningIndex++;
                const active = i === highlightIndex;
                return (
                  <Box
                    key={keyFor(r)}
                    role="option"
                    id={`${id}-opt-${i}`}
                    aria-selected={active}
                    onMouseEnter={() => onHoverIndex(i)}
                    onMouseDown={e => {
                      e.preventDefault();
                      onSelect(r);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.item,
                      px: spacing.item * 2,
                      py: spacing.item,
                      cursor: 'pointer',
                      borderBottom: `1px solid ${sinfra.rule}`,
                      bgcolor: active ? sinfra.paperAlt : 'transparent',
                      transition: `background-color ${motion.fast}`,
                      '& .sb-title': {
                        color: active ? sinfra.accent : sinfra.ink,
                      },
                      '&:hover': {
                        bgcolor: sinfra.paperAlt,
                      },
                    }}
                  >
                    <Icon sx={{ color: sinfra.accent, fontSize: iconSize.control, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        className="sb-title"
                        sx={{
                          fontFamily: fonts.display,
                          fontWeight: 700,
                          fontSize: typeScale.body,
                          lineHeight: 1.3,
                          transition: `color ${motion.fast}`,
                        }}
                      >
                        {r.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: typeScale.bodySmall,
                          color: sinfra.ink,
                          opacity: 0.65,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          );
        })}

        {isEmptyState && (
          <Box sx={{ p: spacing.item * 2 }}>
            {hasQuery && (
              <Typography
                sx={{
                  fontSize: typeScale.bodySmall,
                  color: sinfra.ink,
                  opacity: 0.65,
                  mb: spacing.group,
                }}
              >
                Nada encontrado para &ldquo;{query}&rdquo;. Tente outros termos ou busque tudo.
              </Typography>
            )}
            {recent.length > 0 && renderChipGroup('Buscas recentes', recent, spacing.group, onClear)}
            {popular.length > 0 && renderChipGroup('Populares', popular)}
          </Box>
        )}
      </Box>

      {!isEmptyState && (
        <Box
          role="option"
          id={`${id}-opt-${footerIndex}`}
          aria-selected={highlightIndex === footerIndex}
          onMouseEnter={() => onHoverIndex(footerIndex)}
          onMouseDown={e => {
            e.preventDefault();
            onSubmitAll();
          }}
          sx={{
            position: 'sticky',
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.item,
            px: spacing.item * 2,
            py: spacing.item,
            cursor: 'pointer',
            borderTop: `1px solid ${sinfra.rule}`,
            bgcolor: highlightIndex === footerIndex ? sinfra.accent : sinfra.paperAlt,
            color: highlightIndex === footerIndex ? sinfra.paper : sinfra.ink,
            transition: `background-color ${motion.fast}, color ${motion.fast}`,
            '& .sb-footer-icon': { transition: `transform ${motion.base} ${curva.suave}` },
            '&:hover .sb-footer-icon': { transform: 'translateX(3px)' },
            '@media (prefers-reduced-motion: reduce)': {
              '&:hover .sb-footer-icon': { transform: 'none' },
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: typeScale.bodySmall,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Ver todos os resultados
          </Typography>
          <EastIcon className="sb-footer-icon" sx={{ fontSize: iconSize.control }} />
        </Box>
      )}
    </Box>
  );
}
