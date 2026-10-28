import { useMemo } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { search, linkFor, keyFor, groupByKind, KIND_LABELS, KIND_ORDER } from '@/lib/searchIndex';
import SearchBar from '@/components/SearchBar';
import PageHeader from '@/components/PageHeader';
import PaginaInterna from '@/components/PaginaInterna';
import SectionEyebrow from '@/components/SectionEyebrow';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { spacing, motion, curva } from '@/theme';

export default function SearchResults() {
  const sinfra = useSinfra();
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const results = useMemo(() => search(q), [q]);
  const grouped = groupByKind(results);

  const countLabel = `${results.length} resultado${results.length === 1 ? '' : 's'}`;

  // Container policy: maxWidth="xl" — breadcrumb alinhado com páginas internas; conteúdo em largura de leitura
  // Density: compact
  return (
    <PaginaInterna crumbs={[{ label: 'Início', to: '/' }, { label: 'Busca' }]}>
        <Box component="section" sx={{ maxWidth: 720, mx: 'auto' }}>
          <PageHeader
            eyebrow={q ? `Busca · ${countLabel}` : 'Busca interna'}
            title={
              q ? (
                <>
                  Resultados para <em>“{q}”</em>.
                </>
              ) : (
                <>Busca interna.</>
              )
            }
          />
          <Box sx={{ mb: spacing.section }}>
            <SearchBar key={q} variant="underline" defaultValue={q} />
          </Box>
        {KIND_ORDER.map(kind =>
          grouped[kind].length > 0 ? (
            <Box key={kind} sx={{ mb: spacing.section }}>
              <SectionEyebrow sx={{ mb: spacing.cozy, opacity: 0.75 }}>
                {KIND_LABELS[kind]} · {grouped[kind].length}
              </SectionEyebrow>
              <Stack divider={<Box sx={{ borderTop: `1px solid ${sinfra.rule}` }} />}>
                {grouped[kind].map((r) => (
                  <Box
                    key={keyFor(r)}
                    component={r.kind === 'documentation' ? 'a' : RouterLink}
                    {...(r.kind === 'documentation'
                      ? { href: linkFor(r), target: '_blank', rel: 'noopener noreferrer' }
                      : { to: linkFor(r) })}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing.item,
                      py: spacing.item,
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover .sr-title': { color: sinfra.accent },
                      '&:hover .sr-cta': { transform: 'translateX(4px)' },
                      '&:focus-visible': {
                        outline: `2px solid ${sinfra.accent}`,
                        outlineOffset: 4,
                      },
                      '@media (prefers-reduced-motion: reduce)': {
                        '& .sr-cta': { transition: 'none' },
                        '&:hover .sr-cta': { transform: 'none' },
                      },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h4"
                        className="sr-title"
                        sx={{
                          lineHeight: 1.2,
                          color: sinfra.ink,
                          mb: 0.5,
                          transition: `color ${motion.base}`,
                        }}
                      >
                        {r.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: sinfra.ink, opacity: 0.65, lineHeight: 1.6 }}>
                        {r.description}
                      </Typography>
                    </Box>
                    <EastIcon
                      className="sr-cta"
                      sx={{
                        color: sinfra.accent,
                        flexShrink: 0,
                        transition: `transform ${motion.base} ${curva.suave}`,
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : null
        )}
        {results.length === 0 && q && (
          <Typography sx={{ color: sinfra.ink, opacity: 0.6, mt: spacing.group }}>
            Nada encontrado para “{q}”. Tente outros termos.
          </Typography>
        )}
        </Box>
    </PaginaInterna>
  );
}
