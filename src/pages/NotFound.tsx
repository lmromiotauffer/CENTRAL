import { Box, Container, Typography, Button } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { Link as RouterLink } from 'react-router-dom';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { fonts, spacing, typeScale, radius, motion, curva } from '@/theme';
import SectionEyebrow from '@/components/SectionEyebrow';

export default function NotFound() {
  const sinfra = useSinfra();
  // Container policy: maxWidth="xl" — alinhado com as demais páginas internas; splash centralizado verticalmente
  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <title>Página não encontrada — SINFRALOG Central de Ajuda</title>
      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 5.5 }, pb: { xs: 7.5, md: 11 } }}>
        <SectionEyebrow sx={{ mb: spacing.item }}>Erro 404</SectionEyebrow>
        <Typography
          variant="h1"
          sx={{
            fontSize: 'clamp(56px, 11vw, 160px)',
            lineHeight: 0.95,
            color: sinfra.ink,
            mb: spacing.item,
          }}
        >
          Página não <em>encontrada</em>.
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: sinfra.ink, opacity: 0.7, maxWidth: 520, mb: 5, lineHeight: 1.6 }}
        >
          O caminho solicitado não existe ou foi movido. Volte ao início para
          retomar a navegação.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          endIcon={<EastIcon />}
          sx={{
            borderColor: sinfra.accent,
            borderWidth: '1.5px',
            color: sinfra.accent,
            borderRadius: radius.control,
            px: 4.5,
            py: 2,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: typeScale.micro,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            '& .MuiButton-endIcon': { transition: `transform ${motion.base} ${curva.suave}`, ml: 1 },
            '&:hover': {
              bgcolor: sinfra.accent,
              color: sinfra.paper,
              borderColor: sinfra.accent,
              borderWidth: '1.5px',
              '& .MuiButton-endIcon': { transform: 'translateX(4px)' },
            },
            transition: `background-color ${motion.base}, color ${motion.base}, border-color ${motion.base}`,
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              '& .MuiButton-endIcon': { transition: 'none' },
              '&:hover .MuiButton-endIcon': { transform: 'none' },
            },
          }}
        >
          Voltar ao início
        </Button>
      </Container>
    </Box>
  );
}
