import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { Link as RouterLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { SinfraPalette } from '@/theme';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { fonts, iconSize, typeScale, motion, curva, radius } from '@/theme';

const CLASSE_CTA = 'cartao-cta';

/** Sx externo do Card (hover de borda accent, translateY, reduced-motion) e do CTA deslizante. Reutilizado pelo VideoCard, que não tem CTA. */
export function cascaCartaoSx(sinfra: SinfraPalette) {
  return {
    height: '100%',
    transition: `border-color ${motion.base}, transform ${motion.base} ${curva.suave}`,
    '&:hover': {
      borderColor: sinfra.accent,
      transform: { md: 'translateY(-2px)' },
    },
    [`&:hover .${CLASSE_CTA}`]: { transform: 'translateX(4px)' },
    '@media (prefers-reduced-motion: reduce)': {
      '&:hover': { transform: 'none' },
      [`&:hover .${CLASSE_CTA}`]: { transform: 'none' },
    },
  };
}

interface Props {
  icone: ReactNode;
  iconeFontSize: number;
  eyebrow?: ReactNode;
  titulo: ReactNode;
  descricao: ReactNode;
  rotuloCta: string;
  para: string;
  moverSeta?: boolean;
}

/** Casca compartilhada dos cards de link do catálogo (módulo e tutorial). */
export default function CartaoCatalogo({
  icone,
  iconeFontSize,
  eyebrow,
  titulo,
  descricao,
  rotuloCta,
  para,
  moverSeta,
}: Props) {
  const sinfra = useSinfra();

  return (
    <Card component="article" sx={cascaCartaoSx(sinfra)}>
      <CardActionArea
        component={RouterLink}
        to={para}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
          '&:focus-visible': {
            outline: `2px solid ${sinfra.accent}`,
            outlineOffset: 3,
          },
        }}
      >
        <CardContent
          sx={{
            width: '100%',
            minHeight: { xs: 144, md: 156 },
            p: { xs: 1.75, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1.25,
              mb: 1.25,
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 38,
                height: 38,
                display: 'grid',
                placeItems: 'center',
                color: sinfra.accent,
                border: `1px solid ${sinfra.accent}59`,
                borderRadius: radius.surface,
                '& svg': { fontSize: iconeFontSize },
              }}
            >
              {icone}
            </Box>
            {eyebrow}
          </Box>

          {/* Sem eyebrow, o título herda o respiro que antes vinha do gap do bloco do ícone. */}
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 20, md: 22 },
              lineHeight: 1.08,
              color: sinfra.ink,
              mb: eyebrow ? 1 : 1.25,
            }}
          >
            {titulo}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: 15,
              lineHeight: 1.4,
              mb: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {descricao}
          </Typography>

          {/* moverSeta: só a seta desliza no hover; sem ele, desliza o CTA inteiro. */}
          <Box
            className={moverSeta ? undefined : CLASSE_CTA}
            sx={{
              mt: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: sinfra.accent,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: typeScale.nano,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: `transform ${motion.base} ${curva.suave}`,
            }}
          >
            {rotuloCta}
            <EastIcon
              className={moverSeta ? CLASSE_CTA : undefined}
              sx={{ fontSize: iconSize.inline, transition: `transform ${motion.base} ${curva.suave}` }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
