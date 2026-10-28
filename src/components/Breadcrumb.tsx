import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { fonts, typeScale, motion } from '@/theme';

interface Crumb {
  label: string;
  to?: string;
}

// Trilha de navegação compartilhada por todas as páginas internas.
export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const sinfra = useSinfra();
  return (
    <Breadcrumbs
      aria-label="Trilha de navegação"
      separator="/"
      sx={{
        mb: 2.5,
        '& .MuiBreadcrumbs-separator': { color: sinfra.ink, opacity: 0.4, mx: 1 },
        '& a, & p': {
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: typeScale.nano,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
        '& a': {
          color: sinfra.ink,
          opacity: 0.6,
          textDecoration: 'none',
          borderBottom: '1.5px solid transparent',
          // Amplia a área de toque para ≥24px sem mexer no visual (texto nano tem só 15px de altura).
          position: 'relative',
          '&::after': { content: '""', position: 'absolute', inset: '-6px -4px' },
          transition: `opacity ${motion.base}, color ${motion.base}, border-color ${motion.base}`,
          '&:hover': { opacity: 1, color: sinfra.accent, borderBottomColor: sinfra.accent },
          '&:focus-visible': { outline: `2px solid ${sinfra.accent}`, outlineOffset: 3 },
        },
        '& p': { color: sinfra.accent },
      }}
    >
      {crumbs.map(c =>
        c.to ? (
          <MuiLink key={c.label} component={RouterLink} to={c.to}>
            {c.label}
          </MuiLink>
        ) : (
          <Typography key={c.label}>{c.label}</Typography>
        )
      )}
    </Breadcrumbs>
  );
}
