import { useRef, useState, type ImgHTMLAttributes } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, ButtonBase, Dialog, IconButton, Tooltip, Typography } from '@mui/material';
import { curva, radius, typeScale } from '@/theme';
import { useSinfra } from '@/theme/ThemeModeProvider';

// Faz o painel nascer da miniatura (FLIP): a imagem ampliada parte do lugar e do tamanho da original.
function ampliarAPartirDaMiniatura(container: HTMLElement, miniatura: HTMLImageElement | null) {
  const painel = container.querySelector<HTMLElement>('.MuiDialog-paper');
  const imagem = painel?.querySelector('img');
  // onEnter pode chegar duas vezes (StrictMode); medir o painel já em movimento anularia o efeito.
  if (!painel?.animate || !imagem || !miniatura || painel.getAnimations().length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const de = miniatura.getBoundingClientRect();
  const ate = imagem.getBoundingClientRect();
  const caixa = painel.getBoundingClientRect();
  if (!ate.width || !de.width) return;
  const escala = de.width / ate.width;
  // Origem no centro do painel: leva o centro da imagem ampliada ao centro da miniatura.
  const cx = caixa.left + caixa.width / 2;
  const cy = caixa.top + caixa.height / 2;
  const dx = de.left + de.width / 2 - cx - escala * (ate.left + ate.width / 2 - cx);
  const dy = de.top + de.height / 2 - cy - escala * (ate.top + ate.height / 2 - cy);
  painel.animate(
    [{ transform: `translate(${dx}px, ${dy}px) scale(${escala})` }, { transform: 'none' }],
    { duration: 340, easing: curva.suave },
  );
}

function TutorialImage({ src, alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [open, setOpen] = useState(false);
  const miniaturaRef = useRef<HTMLImageElement>(null);
  const sinfra = useSinfra();
  const label = alt ? `Ampliar ${alt}` : 'Ampliar imagem do tutorial';
  const iconBtnSx = {
    color: sinfra.ink,
    border: `1px solid ${sinfra.rule}`,
    '&:hover': { color: sinfra.accent, borderColor: sinfra.accent, bgcolor: 'transparent' },
  };

  return (
    <>
      <ButtonBase
        className="tutorial-image-zoom"
        aria-label={label}
        onClick={() => setOpen(true)}
        sx={{
          display: 'block',
          width: 'fit-content',
          maxWidth: '100%',
          overflow: 'hidden',
          cursor: 'zoom-in',
          textAlign: 'left',
          '&:focus-visible': {
            outline: `3px solid ${sinfra.ink}`,
            outlineOffset: 3,
          },
        }}
      >
        <Box component="img" ref={miniaturaRef} src={src} alt={alt} loading="lazy" {...props} />
      </ButtonBase>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        transitionDuration={{ enter: 260, exit: 160 }}
        slotProps={{
          transition: { onEnter: (container: HTMLElement) => ampliarAPartirDaMiniatura(container, miniaturaRef.current) },
          backdrop: {
            sx: {
              bgcolor: 'rgba(10, 10, 10, 0.48)',
              backdropFilter: 'blur(3px)',
            },
          },
          paper: {
            'aria-label': 'Imagem ampliada',
            sx: {
              m: { xs: 1, sm: 3 },
              maxWidth: 'min(1180px, calc(100vw - 32px))',
              maxHeight: 'calc(100vh - 24px)',
              bgcolor: sinfra.paper,
              color: sinfra.ink,
              border: `1px solid ${sinfra.rule}`,
              borderRadius: radius.surface,
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.28)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.25, sm: 1.5 },
            borderBottom: `1px solid ${sinfra.rule}`,
          }}
        >
          <Box sx={{ minWidth: 0, pr: 1.5 }}>
            <Typography
              variant="overline"
              component="p"
              sx={{ fontWeight: 700, lineHeight: 1.2, color: sinfra.accent }}
            >
              Imagem ampliada
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: sinfra.ink,
                fontSize: typeScale.bodySmall,
                lineHeight: 1.35,
                opacity: 0.68,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {alt || 'Tutorial'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flex: '0 0 auto', gap: 1 }}>
          <Tooltip title="Abrir imagem original">
            <IconButton
              component="a"
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir imagem original"
              sx={iconBtnSx}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fechar">
            <IconButton
              aria-label="Fechar imagem ampliada"
              onClick={() => setOpen(false)}
              sx={iconBtnSx}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            p: { xs: 1, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: sinfra.paperAlt,
            borderTop: `1px solid ${sinfra.paper}`,
          }}
        >
          <Box
            component="img"
            src={src}
            alt={alt}
            sx={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 148px)',
              objectFit: 'contain',
              border: `1px solid ${sinfra.rule}`,
              bgcolor: sinfra.paper,
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}

export const mdxComponents = { img: TutorialImage };
