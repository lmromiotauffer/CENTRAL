import { useLayoutEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import {
  Box,
  Stack,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  type TypographyProps,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getTutorial, getTutorialsByModule } from '@/lib/tutorials';
import { normalizeTutorialStepTitle } from '@/lib/tutorialSteps';
import { modules } from '@/content/modules';
import { mdxComponents } from '@/components/mdx';
import PageHeader from '@/components/PageHeader';
import PaginaInterna from '@/components/PaginaInterna';
import SectionEyebrow from '@/components/SectionEyebrow';
import NotFound from './NotFound';
import { useSinfra } from '@/theme/ThemeModeProvider';
import type { ModuleMeta, Tutorial } from '@/types/content';
import { fonts, typeScale, radius, thinScrollbarSx, motion, curva, vidroSx } from '@/theme';

// Shift MDX headings down 1 level so PageHeader's h1 stays the only h1 (WCAG 2.1)
const shiftTo = (level: 'h2' | 'h3' | 'h4' | 'h5') => (props: TypographyProps) => (
  <Typography variant={level} component={level} {...props} />
);

const headingShift = { h1: shiftTo('h2'), h2: shiftTo('h3'), h3: shiftTo('h4') };

// Troca de etapa: o conteúdo novo sobe um pouco para marcar que a página mudou sem sair dela.
const entradaEtapa = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
`;
const animacaoEtapa = `${entradaEtapa} ${motion.content} ${curva.suave}`;

// Numbered step badge: same design in the sidebar list, the Select value and
// the menu items, varying only in size and accent text.
type StepBadgeProps = {
  index: number;
  active: boolean;
  size?: number;
  accentText?: boolean;
};

function StepBadge({ index, active, size = 28, accentText = false }: StepBadgeProps) {
  const sinfra = useSinfra();
  return (
    <Typography
      component="span"
      sx={{
        width: size,
        height: size,
        flex: '0 0 auto',
        display: 'grid',
        placeItems: 'center',
        border: `1px solid ${active ? sinfra.accent : sinfra.rule}`,
        borderRadius: radius.control,
        transition: `border-color ${motion.base}`,
        ...(accentText && { color: sinfra.accent }),
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: typeScale.nano,
      }}
    >
      {String(index + 1).padStart(2, '0')}
    </Typography>
  );
}

export default function TutorialPage() {
  const { moduloSlug, tutorialSlug } = useParams();
  const tut = moduloSlug && tutorialSlug ? getTutorial(moduloSlug, tutorialSlug) : undefined;
  const mod = modules.find(m => m.slug === moduloSlug);
  if (!tut || !mod) return <NotFound />;
  const siblings = getTutorialsByModule(mod.slug);
  return <TutorialBody key={tut.slug} tut={tut} mod={mod} siblings={siblings} />;
}

type TutorialBodyProps = { tut: Tutorial; mod: ModuleMeta; siblings: Tutorial[] };

function TutorialBody({ tut, mod, siblings }: TutorialBodyProps) {
  const sinfra = useSinfra();
  const idx = siblings.findIndex(s => s.slug === tut.slug);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];
  const { Component } = tut;
  const contentRef = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState<string[]>(['Introdução']);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const hasMultipleSteps = steps.length > 1;

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const tituloMinusculo = tut.title.toLocaleLowerCase('pt-BR');
    const elements = Array.from(content.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
    const nextSteps: string[] = ['Introdução'];
    let currentStep = 0;
    let currentStepHasContent = false;
    let currentTitle = 'Introdução';

    elements.forEach(element => {
      const text = element.textContent?.trim() ?? '';
      // O MDX costuma repetir só parte do título ("Cadastro de Contratos" em "Cadastro de Contratos: Dados Gerais").
      const isRepeatedTitle = element.matches('h2') && text !== '' && tituloMinusculo.includes(text.toLocaleLowerCase('pt-BR'));

      if (isRepeatedTitle) {
        element.dataset.tutorialChrome = 'true';
        return;
      }

      const isSectionHeading = element.matches('h3, h4');

      if (isSectionHeading && text) {
        currentTitle = normalizeTutorialStepTitle(text);
        element.dataset.tutorialChrome = 'true';
        if (currentStep === 0 && !currentStepHasContent && nextSteps[0] === 'Introdução') {
          nextSteps[0] = currentTitle;
        } else {
          currentStep += 1;
          currentStepHasContent = false;
          nextSteps[currentStep] = currentTitle;
        }
      }

      element.dataset.tutorialStep = String(currentStep);
      if (!isSectionHeading) currentStepHasContent = true;
    });

    setSteps(nextSteps);
  }, [tut.slug, tut.title]);

  const goToStep = (index: number) => {
    setActiveStepIndex(index);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const navBtnSx = {
    ...stepControlSx(sinfra),
    maxWidth: 320,
    textAlign: 'left' as const,
    justifyContent: 'flex-start' as const,
    transition: `border-color ${motion.base}, color ${motion.base}`,
  };

  return (
    <PaginaInterna
      crumbs={[
        { label: 'Início', to: '/' },
        { label: 'Módulos', to: '/modulos' },
        { label: mod.title, to: `/modulos/${mod.slug}` },
        { label: tut.title },
      ]}
    >

        <Grid container spacing={{ xs: 3, md: 4, lg: 5 }} sx={{ alignItems: 'flex-start' }}>
          {hasMultipleSteps && (
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Box
                component="nav"
                aria-label="Etapas do tutorial"
                sx={{
                  position: { md: 'sticky' },
                  top: { md: 88 },
                  maxHeight: { md: 'calc(100vh - 112px)' },
                  overflow: 'hidden',
                  ...vidroSx(sinfra),
                  borderRadius: radius.surface,
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack direction="row" spacing={1.25} sx={{ mb: 2, alignItems: 'center' }}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 36,
                      height: 36,
                      display: 'grid',
                      placeItems: 'center',
                      color: sinfra.accent,
                      border: `1px solid ${sinfra.accent}59`,
                      borderRadius: radius.surface,
                    }}
                  >
                    <ArticleOutlinedIcon />
                  </Box>
                  <Box>
                    <SectionEyebrow>Neste tutorial</SectionEyebrow>
                    <Typography sx={{ color: sinfra.ink, opacity: 0.65, fontSize: typeScale.bodySmall }}>
                      {steps.length} etapas
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  data-testid="tutorial-step-nav-scroll"
                  spacing={1}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    minHeight: 0,
                    overflowY: { md: 'auto' },
                    ...thinScrollbarSx(sinfra, sinfra.paperAlt),
                    pr: { xs: 0, md: 1.5 },
                  }}
                >
                  {steps.map((step, stepIndex) => {
                    const active = stepIndex === activeStepIndex;
                    return (
                      <Button
                        key={`${step}-${stepIndex}`}
                        aria-label={`Abrir etapa ${stepIndex + 1}: ${step}`}
                        aria-current={active ? 'step' : undefined}
                        onClick={() => goToStep(stepIndex)}
                        sx={{
                          justifyContent: 'flex-start',
                          minHeight: 48,
                          px: 1.25,
                          py: 1,
                          borderRadius: radius.control,
                          color: active ? sinfra.accent : sinfra.ink,
                          bgcolor: active ? sinfra.paper : 'transparent',
                          border: `1px solid ${active ? sinfra.accent : 'transparent'}`,
                          textAlign: 'left',
                          '&:hover': {
                            bgcolor: sinfra.paper,
                            borderColor: sinfra.accent,
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.25} sx={{ width: '100%', alignItems: 'center' }}>
                          <StepBadge index={stepIndex} active={active} />
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: fonts.display,
                              fontWeight: 700,
                              fontSize: typeScale.bodySmall,
                              lineHeight: 1.25,
                              textTransform: 'none',
                            }}
                          >
                            {step}
                          </Typography>
                        </Stack>
                      </Button>
                    );
                  })}
                </Stack>
                <Select
                  value={String(activeStepIndex)}
                  onChange={(event: SelectChangeEvent) => goToStep(Number(event.target.value))}
                  inputProps={{ 'aria-label': 'Selecionar etapa' }}
                  IconComponent={KeyboardArrowDownIcon}
                  renderValue={selected => {
                    const selectedIndex = Number(selected);
                    return (
                      <Stack direction="row" spacing={1.25} sx={{ minWidth: 0, alignItems: 'center' }}>
                        <StepBadge index={selectedIndex} active size={32} accentText />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            component="span"
                            sx={{
                              display: 'block',
                              color: sinfra.accent,
                              fontFamily: fonts.display,
                              fontWeight: 700,
                              fontSize: typeScale.nano,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              lineHeight: 1.1,
                            }}
                          >
                            Etapa {selectedIndex + 1} de {steps.length}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              display: 'block',
                              color: sinfra.ink,
                              fontFamily: fonts.display,
                              fontWeight: 700,
                              fontSize: typeScale.bodySmall,
                              lineHeight: 1.25,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {steps[selectedIndex]}
                          </Typography>
                        </Box>
                      </Stack>
                    );
                  }}
                  MenuProps={{
                    slotProps: {
                      list: {
                        id: 'tutorial-step-menu-scroll',
                      },
                      paper: {
                        sx: {
                          mt: 0.75,
                          border: `1px solid ${sinfra.rule}`,
                          borderRadius: radius.surface,
                          bgcolor: sinfra.paper,
                          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.14)',
                          maxHeight: 'min(44vh, 360px)',
                          overflow: 'hidden',
                          '& .MuiList-root': {
                            maxHeight: 'min(38vh, 280px)',
                            overflowY: 'auto',
                            ...thinScrollbarSx(sinfra, sinfra.paper),
                            pr: { xs: 0, md: 1.5 },
                            p: 0,
                          },
                          '& .MuiMenuItem-root': {
                            width: '100%',
                            boxSizing: 'border-box',
                            minHeight: 48,
                            alignItems: 'center',
                            gap: 1.25,
                            px: 1.5,
                            fontFamily: fonts.display,
                            fontWeight: 700,
                            fontSize: typeScale.bodySmall,
                            color: sinfra.ink,
                          },
                          '& .Mui-selected': {
                            bgcolor: `${sinfra.accent}14 !important`,
                            color: sinfra.accent,
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    width: '100%',
                    minHeight: 64,
                    borderRadius: radius.surface,
                    bgcolor: sinfra.paper,
                    color: sinfra.ink,
                    boxShadow: `inset 0 0 0 1px ${sinfra.rule}`,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '64px !important',
                      py: 0,
                      pl: 1.25,
                      pr: 5,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 0,
                    },
                    '&:hover': {
                      boxShadow: `inset 0 0 0 1.5px ${sinfra.accent}`,
                    },
                    '&.Mui-focused': {
                      boxShadow: `inset 0 0 0 2px ${sinfra.accent}`,
                    },
                    '& .MuiSelect-icon': {
                      color: sinfra.accent,
                      right: 12,
                    },
                  }}
                >
                  {steps.map((step, stepIndex) => (
                    <MenuItem key={`${step}-${stepIndex}`} value={String(stepIndex)}>
                      <StepBadge index={stepIndex} active={stepIndex === activeStepIndex} />
                      <Typography
                        component="span"
                        sx={{
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: hasMultipleSteps ? 8 : 12, lg: hasMultipleSteps ? 9 : 12 }}>
            <Box
              data-testid="tutorial-reader-column"
              sx={{
                maxWidth: hasMultipleSteps ? 860 : 720,
                mx: hasMultipleSteps ? 0 : 'auto',
              }}
            >
              <PageHeader
                eyebrow={`Tutorial · ${String(tut.order).padStart(2, '0')}`}
                title={tut.title}
                description={tut.description}
              />
              <Box
                component="article"
                sx={{
                  color: sinfra.ink,
                  '& h2': { mt: 5, mb: 3 },
                  '& p': { lineHeight: 1.75, mb: 2, color: sinfra.ink, opacity: 0.88, maxWidth: 760 },
                  '& a': {
                    color: sinfra.accent,
                    textDecoration: 'underline',
                    textDecorationThickness: '1.5px',
                    textUnderlineOffset: '3px',
                  },
                  '& ul, & ol': { pl: 3, mb: 2, lineHeight: 1.75 },
                  '& .tutorial-image-zoom': { my: 3 },
                  '& .tutorial-image-zoom img': {
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: { xs: '70vh', md: 680 },
                    height: 'auto',
                    objectFit: 'contain',
                    border: `1px solid ${sinfra.rule}`,
                  },
                }}
              >
                <Typography
                  data-testid="tutorial-step-progress"
                  variant="overline"
                  component="div"
                  sx={{ color: sinfra.accent, mb: 1.5 }}
                >
                  Etapa {activeStepIndex + 1} de {steps.length}
                </Typography>
                <Typography
                  key={activeStepIndex}
                  variant="h2"
                  sx={{
                    fontSize: { xs: 30, md: 42 },
                    lineHeight: 1.12,
                    color: sinfra.ink,
                    mb: 3,
                    animation: animacaoEtapa,
                  }}
                >
                  {steps[activeStepIndex]}
                </Typography>
                <Box
                  ref={contentRef}
                  sx={{
                    [`& > [data-tutorial-chrome], & > :not([data-tutorial-step="${activeStepIndex}"])`]: { display: 'none' },
                    // Sair de display: none reinicia a animação a cada troca de etapa.
                    '& > *': { animation: animacaoEtapa },
                  }}
                >
                  <Component components={{ ...mdxComponents, ...headingShift }} />
                </Box>
                {hasMultipleSteps && (
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    sx={{
                      mt: 5,
                      pt: 3,
                      borderTop: `1.5px solid ${sinfra.rule}`,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<WestIcon />}
                      disabled={activeStepIndex === 0}
                      onClick={() => goToStep(activeStepIndex - 1)}
                      sx={stepControlSx(sinfra)}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outlined"
                      endIcon={<EastIcon />}
                      disabled={activeStepIndex === steps.length - 1}
                      onClick={() => goToStep(activeStepIndex + 1)}
                      sx={stepControlSx(sinfra)}
                    >
                      Próxima etapa
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
        {(prev || next) && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              mt: 8,
              pt: 5,
              borderTop: `1.5px solid ${sinfra.rule}`,
              justifyContent: 'space-between',
            }}
          >
            {[
              { sibling: prev, label: 'Anterior', isPrev: true },
              { sibling: next, label: 'Próximo', isPrev: false },
            ].map(({ sibling, label, isPrev }) => (
              <Box key={label}>
                {sibling && (
                  <Button
                    component={RouterLink}
                    to={`/modulos/${mod.slug}/${sibling.slug}`}
                    variant="outlined"
                    startIcon={isPrev ? <WestIcon /> : undefined}
                    endIcon={isPrev ? undefined : <EastIcon />}
                    sx={isPrev ? navBtnSx : { ...navBtnSx, textAlign: 'right', justifyContent: 'flex-end' }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isPrev ? 'flex-start' : 'flex-end' }}>
                      <Typography component="span" sx={{ fontSize: typeScale.nano, opacity: 0.6, letterSpacing: '0.14em' }}>
                        {label}
                      </Typography>
                      <Typography component="span" sx={{ fontSize: typeScale.nano, textTransform: 'none', letterSpacing: 0 }}>
                        {sibling.title}
                      </Typography>
                    </Box>
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        )}
    </PaginaInterna>
  );
}

function stepControlSx(sinfra: ReturnType<typeof useSinfra>) {
  return {
    borderColor: sinfra.rule,
    borderWidth: '1.5px',
    color: sinfra.ink,
    borderRadius: radius.control,
    px: 2.5,
    py: 1.5,
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: typeScale.nano,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    '&:hover': {
      borderColor: sinfra.accent,
      borderWidth: '1.5px',
      color: sinfra.accent,
      bgcolor: 'transparent',
    },
  };
}
