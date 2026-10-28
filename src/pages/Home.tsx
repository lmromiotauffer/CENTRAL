import { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Button, Grid } from '@mui/material';
import { keyframes } from '@emotion/react';
import EastIcon from '@mui/icons-material/East';
import { Link as RouterLink } from 'react-router-dom';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import SearchBar from '@/components/SearchBar';
import HomeModuleTile from '@/components/HomeModuleTile';
import FAQItem from '@/components/FAQItem';
import SectionEyebrow from '@/components/SectionEyebrow';
import { modules } from '@/content/modules';
import { faq } from '@/content/faq';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { fonts, typeScale, spacing, motion, curva } from '@/theme';

// Container policy: maxWidth="xl" (1440 @ xl+; 1200 @ lg) — índice hero
// Density: compact — spacing.section

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Accessibility: if user prefers reduced motion, skip the animation and reveal instantly.
const reveal = {
  opacity: 0,
  '@media (prefers-reduced-motion: reduce)': { opacity: 1, animation: 'none !important' },
};

const heroImages = Object.values(
  import.meta.glob<string>('/src/public/home-hero/*.webp', { eager: true, import: 'default' }),
);

const HERO_IMAGE_INTERVAL_MS = 6500;
const currentContentYear = new Date().getFullYear();

function getNextHeroImageIndex(currentIndex: number) {
  const nextOffset = Math.floor(Math.random() * (heroImages.length - 1)) + 1;
  return (currentIndex + nextOffset) % heroImages.length;
}

export default function Home() {
  const sinfra = useSinfra();
  useScrollToHash('start');
  const [heroImageState, setHeroImageState] = useState(() => ({
    activeIndex: 0,
    preloadIndex: getNextHeroImageIndex(0),
  }));
  const visibleHeroImageIndexes = [heroImageState.activeIndex, heroImageState.preloadIndex];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setHeroImageState((currentState) => {
        const activeIndex = currentState.preloadIndex;
        return {
          activeIndex,
          preloadIndex: getNextHeroImageIndex(activeIndex),
        };
      });
    }, HERO_IMAGE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <Box
        component="section"
        sx={{
          minHeight: {
            xs: 'min(56svh, 480px)',
            sm: 'min(58svh, 520px)',
            md: 'min(68vh, 640px)',
            lg: 'min(70vh, 680px)',
          },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 6, md: 0 },
          pb: { xs: 4, md: 0 },
        }}
      >
        {/* Decorative layers (bg image + scrim) clipped to hero bounds so they can't leak under sibling sections */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
            // Some na base para emendar com o fundo animado em vez de terminar em cor sólida.
            maskImage: 'linear-gradient(180deg, #000 70%, transparent 100%)',
          }}
        >
          {visibleHeroImageIndexes.map((imageIndex) => (
            <Box
              key={heroImages[imageIndex]}
              component="img"
              src={heroImages[imageIndex]}
              alt=""
              aria-hidden="true"
              data-home-hero-image="true"
              loading={imageIndex === heroImageState.activeIndex ? 'eager' : 'lazy'}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: { xs: 'center', md: 'right center' },
                filter: 'grayscale(0.4) saturate(0.75) contrast(1.08)',
                opacity: imageIndex === heroImageState.activeIndex ? 1 : 0,
                transition: 'opacity 1100ms ease-in-out',
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            />
          ))}

          {/* Readability scrim — paper wash from left + soft fade to solid background at bottom for seamless section blend */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              background: {
                xs: `linear-gradient(180deg, ${sinfra.paperAlt}f2 0%, ${sinfra.paperAlt}d9 45%, ${sinfra.paperAlt}f2 80%, ${sinfra.paperAlt} 100%)`,
                md: `linear-gradient(180deg, transparent 0%, transparent 55%, ${sinfra.paperAlt}80 78%, ${sinfra.paperAlt} 100%), linear-gradient(90deg, ${sinfra.paperAlt} 0%, ${sinfra.paperAlt}f0 38%, ${sinfra.paperAlt}a6 62%, ${sinfra.paperAlt}4d 100%)`,
              },
            }}
          />
        </Box>

        {/* Container: maxWidth="xl" (1440) → índice hero, respira em displays 1920+ */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <SectionEyebrow
            sx={{
              mb: 4,
              ...reveal,
              animation: `${fadeUp} ${motion.hero} ease-out 120ms forwards`,
            }}
          >
            ATUALIZADO PARA {currentContentYear}
          </SectionEyebrow>

          <Typography
            variant="h1"
            sx={{
              fontSize: typeScale.display,
              lineHeight: 0.95,
              color: sinfra.ink,
              maxWidth: { xs: '100%', md: '78%' },
              mb: { xs: 6, md: 8 },
              textShadow: `0 1px 0 ${sinfra.paper}`,
              ...reveal,
              animation: `${fadeUp} ${motion.hero} ease-out 240ms forwards`,
            }}
          >
            Central de Ajuda
            <Box component="span" sx={{ display: 'block', color: sinfra.accent }}>
              SINFRALOG
            </Box>
          </Typography>

          <Box
            data-home-hero-search="true"
            sx={{
              maxWidth: 640,
              ...reveal,
              animation: `${fadeUp} ${motion.hero} ease-out 420ms forwards`,
            }}
          >
            <SearchBar variant="underline" />
          </Box>
        </Container>
      </Box>

      {/* ── Module Launchpad ── */}
      <Box
        component="section"
        aria-labelledby="home-modules-title"
      >
        <Container
          maxWidth="xl"
          sx={{
            pt: spacing.pagePy,
            pb: { xs: 3, md: 4 },
          }}
        >
          <SectionEyebrow sx={{ mb: 3, opacity: 0.75 }}>
            ÍNDICE DE SISTEMAS — {currentContentYear}
          </SectionEyebrow>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(280px, 420px)' },
              gap: { xs: 2.5, md: 4 },
              alignItems: 'end',
              mb: { xs: 4, md: 5 },
            }}
          >
            <Typography
              id="home-modules-title"
              component="h2"
              variant="h1"
              sx={{ fontSize: { xs: 35, md: 58 }, lineHeight: 1, color: sinfra.ink }}
            >
              Módulos do <em>sistema</em>.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: 16, md: 17.5 },
                lineHeight: 1.5,
                maxWidth: 500,
              }}
            >
              Acesse rapidamente o módulo relacionado ao seu fluxo de trabalho e encontre
              tutoriais, orientações e contatos de apoio.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {modules.map((m) => (
              <Grid key={m.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                <HomeModuleTile module={m} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FAQ ── */}
      <Box
        component="section"
        id="duvidas"
        sx={{
          pt: { xs: 3, md: 4 },
          pb: spacing.pagePy,
        }}
      >
        <Container maxWidth="xl">
          <SectionEyebrow sx={{ mb: 3, opacity: 0.75 }}>
            DÚVIDAS FREQUENTES
          </SectionEyebrow>

          <Typography
            component="h2"
            variant="h1"
            sx={{ fontSize: { xs: 35, md: 58 }, lineHeight: 1, color: sinfra.ink, mb: 4.5 }}
          >
            O que mais <em>perguntam</em>.
          </Typography>

          <Stack spacing={1.5} sx={{ width: '100%' }}>
            {faq.map((f) => (
              <FAQItem key={f.pergunta} item={f} />
            ))}
          </Stack>

          <Box sx={{ mt: 6 }}>
            <Button
              component={RouterLink}
              to="/documentacao"
              variant="text"
              endIcon={<EastIcon />}
              disableFocusRipple
              sx={{
                position: 'relative',
                color: sinfra.accent,
                px: 0,
                py: 1,
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: typeScale.bodySmall,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                gap: 0.5,
                bgcolor: 'transparent',
                '& .MuiButton-endIcon': { transition: `transform ${motion.base} ${curva.suave}`, ml: 1 },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 2,
                  height: '1.5px',
                  bgcolor: sinfra.accent,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: `transform ${motion.base} ${curva.suave}`,
                },
                '&:hover': {
                  bgcolor: 'transparent',
                  color: sinfra.accent,
                  '&::after': { transform: 'scaleX(1)' },
                  '& .MuiButton-endIcon': { transform: 'translateX(4px)' },
                },
                '&.Mui-focusVisible': {
                  bgcolor: 'transparent',
                  outline: `2px solid ${sinfra.accent}`,
                  outlineOffset: 4,
                },
                '&.Mui-focusVisible::after': { transform: 'scaleX(1)' },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                  '& .MuiButton-endIcon': { transition: 'none' },
                  '&::after': { transition: 'none' },
                  '&:hover .MuiButton-endIcon': { transform: 'none' },
                },
                transition: `color ${motion.base}`,
              }}
            >
              Ver a documentação do sistema
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
