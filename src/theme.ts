// src/theme.ts
/**
 * 4-point grid rule
 * -----------------
 * All sx spacing, element dimensions, and icon sizes must be multiples of 4px.
 * MUI spacing base = 8px, so any multiple of 0.5 works (0.5=4, 1=8, 1.5=12, ...).
 * Exempt: text fontSize, hairline strokes (1px, 1.5px), relative units (%, vh, em).
 */
import { createTheme, type Theme } from '@mui/material/styles';
import type { ResolvedMode } from '@/theme/themeMode';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
  }
}

// Valores do design system dos Painéis SINFRA-MT (seção 3 e 5.1).
// ink = text · accent = primary · paper = surface opaca · paperAlt = background · rule = border.
// paper/paperAlt precisam ficar em hex de 6 dígitos: há sx que concatenam alfa (`${sinfra.paper}f2`).
export type SinfraPalette = {
  ink: string;
  accent: string;
  accentHover: string;
  paper: string;
  paperAlt: string;
  rule: string;
  vidro: string;
  vidroBorda: string;
  vidroLuz: string;
  vidroSombra: string;
};

const sinfraLight: SinfraPalette = {
  ink:         '#172033',
  accent:      '#2447b5',
  accentHover: '#1a3281',
  paper:       '#ffffff',
  paperAlt:    '#eef1f6',
  rule:        '#d3dae5',
  vidro:       '#eeeeeea6',
  vidroBorda:  '#c9d0db',
  vidroLuz:    'rgba(255,255,255,.75)',
  vidroSombra: 'rgba(15,23,42,.08)',
};

const sinfraDark: SinfraPalette = {
  ink:         '#e8e9eb',
  accent:      '#8ea6ff',
  accentHover: '#a9bcff',
  paper:       '#1f2022',
  paperAlt:    '#141516',
  rule:        '#36383c',
  vidro:       '#1415167a',
  vidroBorda:  'rgba(255,255,255,.22)',
  vidroLuz:    'rgba(255,255,255,.4)',
  vidroSombra: 'rgba(0,0,0,.35)',
};

export const sinfraPalettes: Record<ResolvedMode, SinfraPalette> = {
  light: sinfraLight,
  dark: sinfraDark,
};


// Família única do design system; as duas chaves continuam para não reescrever os consumidores.
export const fonts = {
  display: `'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif`,
  body:    `'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif`,
} as const;

export const sinfraLogo = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: '0.1em',
} as const;

export const typeScale = {
  display:   'clamp(48px, 7.3vw, 140px)',
  pageH1:    'clamp(40px, 5vw, 72px)',
  h2:        'clamp(32px, 3.3vw, 48px)',
  h3:        'clamp(24px, 2.5vw, 36px)',
  h4:        'clamp(20px, 1.6vw, 28px)',
  h5:        'clamp(18px, 1.25vw, 22px)',
  subtitle:  'clamp(16px, 1.25vw, 20px)',

  bodyLarge: 20,
  body:      16,
  bodySmall: 14,
  micro:     12,
  nano:      11,
} as const;

export const iconSize = {
  inline:  16,
  control: 20,
  medium:  24,
} as const;

export const controlSize = {
  sm: 40,
  md: 48,
} as const;

// Strings em px: no sx, borderRadius numérico é multiplicado por theme.shape.borderRadius.
export const radius = {
  control: '6px',
  surface: '8px',
  pill: '999px',
} as const;

// Durações do design system: curta 150 (fast e base), média 250 (content), longa 400 (hero).
export const motion = {
  fast: '150ms',
  base: '150ms',
  content: '250ms',
  hero: '400ms',
} as const;

export const curva = {
  suave: 'cubic-bezier(0.16, 1, 0.3, 1)',
  saida: 'cubic-bezier(0.4, 0, 1, 1)',
  cor:   'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Painel de vidro (seção 5.1): filete + luz em cima/esquerda + sombra embaixo/direita.
export function vidroSx(sinfra: SinfraPalette) {
  return {
    backgroundColor: sinfra.vidro, // não `bgcolor`: também é usado em styleOverrides, que não entende atalhos do sx
    border: `1px solid ${sinfra.vidroBorda}`,
    boxShadow: [
      `inset 0 1px 0 ${sinfra.vidroLuz}`,
      `inset 1px 0 0 color-mix(in srgb, ${sinfra.vidroLuz} 50%, transparent)`,
      `inset 0 -1px 0 ${sinfra.vidroSombra}`,
      `inset -1px 0 0 color-mix(in srgb, ${sinfra.vidroSombra} 50%, transparent)`,
    ].join(', '),
    backdropFilter: 'blur(10px)',
    '@media (prefers-contrast: more)': { borderColor: 'currentColor' },
  } as const;
}

export const spacing = {
  cozy:    2,
  item:    3,
  group:   4,
  section: 6,
  pagePy:  { xs: 5, md: 8 },
} as const;

export function thinScrollbarSx(sinfra: SinfraPalette, track: string) {
  return {
    overscrollBehavior: 'contain',
    scrollbarGutter: 'stable',
    scrollbarWidth: { md: 'thin' },
    scrollbarColor: `${sinfra.rule} transparent`,
    '&::-webkit-scrollbar': { width: { md: 8 } },
    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      bgcolor: sinfra.rule,
      borderRadius: radius.control,
      border: `2px solid ${track}`,
    },
    '&::-webkit-scrollbar-thumb:hover': { bgcolor: sinfra.accent },
  } as const;
}

export function buildTheme(mode: ResolvedMode): Theme {
  const tokens = sinfraPalettes[mode];
  return createTheme({
    breakpoints: {
      values: { xs: 0, sm: 600, md: 768, lg: 1024, xl: 1440, xxl: 1920 },
    },
    palette: {
      mode,
      primary:   { main: tokens.accent, dark: tokens.accentHover,
                   contrastText: mode === 'dark' ? '#141516' : '#ffffff' },
      secondary: { main: tokens.ink },
      success:   { main: mode === 'dark' ? '#7ee2a8' : '#17703f' },
      warning:   { main: mode === 'dark' ? '#f2b84b' : '#855700' },
      error:     { main: mode === 'dark' ? '#f2665f' : '#a8201a' },
      background: { default: tokens.paperAlt, paper: tokens.paper },
      text: {
        primary: tokens.ink,
        secondary: mode === 'dark' ? '#a9acb2' : '#4a5568',
      },
      divider: tokens.rule,
    },
    shape: { borderRadius: 6 },
    typography: {
      fontFamily: fonts.body,
      fontSize: 16,
      h1: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.02em',
            fontSize: typeScale.pageH1, lineHeight: 1.05,
            '& em': { color: tokens.accent, fontStyle: 'italic' } },
      h2: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.015em',
            fontSize: typeScale.h2, lineHeight: 1.15 },
      h3: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.01em',
            fontSize: typeScale.h3, lineHeight: 1.25 },
      h4: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.005em',
            fontSize: typeScale.h4, lineHeight: 1.35 },
      h5: { fontFamily: fonts.display, fontWeight: 700,
            fontSize: typeScale.h5, lineHeight: 1.4 },
      h6: { fontFamily: fonts.display, fontWeight: 700,
            fontSize: typeScale.subtitle, lineHeight: 1.5 },
      body1:     { fontFamily: fonts.body, fontWeight: 400,
                   fontSize: typeScale.bodyLarge, lineHeight: 1.65 },
      body2:     { fontFamily: fonts.body, fontWeight: 400,
                   fontSize: typeScale.body, lineHeight: 1.6 },
      subtitle1: { fontFamily: fonts.body, fontWeight: 700,
                   fontSize: typeScale.subtitle, lineHeight: 1.5 },
      subtitle2: { fontFamily: fonts.body, fontWeight: 700,
                   fontSize: typeScale.subtitle, lineHeight: 1.45 },
      caption:   { fontFamily: fonts.body, fontWeight: 400,
                   fontSize: typeScale.bodySmall, lineHeight: 1.5 },
      overline:  { fontFamily: fonts.display, fontWeight: 700,
                   fontSize: typeScale.nano, lineHeight: 1.65,
                   letterSpacing: '0.14em', textTransform: 'uppercase' },
      button:    { fontFamily: fonts.display, fontWeight: 700, textTransform: 'none' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: theme => ({
          // A cor de fundo fica no html (styles/fundo.css) para o fundo animado aparecer atrás do body.
          body: { backgroundColor: 'transparent' },
          '::selection': { backgroundColor: tokens.accent, color: theme.palette.primary.contrastText },
          'input, textarea, [contenteditable="true"]': { caretColor: tokens.accent },
          [theme.breakpoints.down('md')]: {
            '*': {
              scrollbarWidth: 'none',
            },
            '*::-webkit-scrollbar': { display: 'none' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
              scrollBehavior: 'auto !important',
            },
          },
        }),
      },
      MuiButton: {
        styleOverrides: {
          root:      { borderRadius: radius.control, minHeight: controlSize.md },
          sizeSmall: {
            minHeight: 44,
            '& .MuiButton-startIcon > *:nth-of-type(1)': { fontSize: iconSize.control },
            '& .MuiButton-endIcon   > *:nth-of-type(1)': { fontSize: iconSize.control },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root:      { width: controlSize.md, height: controlSize.md, borderRadius: radius.control },
          sizeSmall: { width: controlSize.sm, height: controlSize.sm },
        },
      },
      MuiInputBase: {
        styleOverrides: { root: { minHeight: controlSize.md } },
      },
      MuiSvgIcon: {
        defaultProps: { fontSize: 'small' },
        styleOverrides: {
          fontSizeSmall:  { fontSize: iconSize.control },
        },
      },
      MuiContainer: {
        styleOverrides: {
          maxWidthXl:  { maxWidth: 1440 },
          root: ({ theme }) => ({
            paddingLeft:  theme.spacing(2),
            paddingRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]:  { paddingLeft: theme.spacing(3), paddingRight: theme.spacing(3) },
            [theme.breakpoints.up('md')]:  { paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) },
            [theme.breakpoints.up('xl')]:  { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(5) },
            [theme.breakpoints.up('xxl')]: { paddingLeft: theme.spacing(6), paddingRight: theme.spacing(6) },
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: 56,
            [theme.breakpoints.up('md')]: { minHeight: 64 },
          }),
        },
      },
      MuiCard: { styleOverrides: { root: { borderRadius: radius.surface, ...vidroSx(tokens) } } },
      MuiAlert: {
        styleOverrides: {
          icon: { '& > svg': { fontSize: iconSize.medium } },
        },
      },
    },
  });
}

