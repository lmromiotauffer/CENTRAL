import { useState } from 'react';
import { Box, ButtonBase, Collapse, Divider, Typography, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LockResetIcon from '@mui/icons-material/LockReset';
import { fonts, iconSize, typeScale, controlSize, radius, motion, curva } from '@/theme';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined';
import type { SvgIconComponent } from '@mui/icons-material';
import type { FAQItem as FAQType } from '@/types/content';
import { useSinfra } from '@/theme/ThemeModeProvider';

const ICONES: Record<string, SvgIconComponent> = {
  Acesso: LockResetIcon,
  Documentos: AttachFileIcon,
  Relatórios: AssessmentIcon,
  Prazos: ScheduleIcon,
};

export default function FAQItem({ item }: { item: FAQType }) {
  const sinfra = useSinfra();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [open, setOpen] = useState(false);
  const Icon = ICONES[item.categoria] ?? HelpOutlineOutlined;

  return (
    <Box
      component="article"
      sx={{
        borderTop: '1.5px solid',
        borderTopColor: open ? sinfra.accent : sinfra.rule,
        transition: `border-top-color ${motion.content}`,
      }}
    >
      <ButtonBase
        aria-expanded={open}
        aria-label={`${item.categoria}: ${item.pergunta}`}
        onClick={() => setOpen(o => !o)}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          textAlign: 'left',
          gap: 1.5,
          py: 2,
          minHeight: controlSize.md,
          '&:focus-visible': {
            boxShadow: `inset 3px 0 0 ${sinfra.accent}`,
            bgcolor: sinfra.paper,
          },
        }}
      >
        {/* Category icon */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: radius.control,
            bgcolor: open ? sinfra.accent : sinfra.paperAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: `background-color ${motion.base}`,
          }}
        >
          <Icon sx={{ color: open ? sinfra.paper : sinfra.ink, fontSize: iconSize.control }} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            component="p"
            sx={{
              fontFamily: fonts.display,
              fontWeight: 700,
              color: sinfra.ink,
              mb: 0.5,
              lineHeight: 1.4,
            }}
          >
            {item.pergunta}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: typeScale.nano,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: sinfra.accent,
            }}
          >
            {item.categoria}
          </Typography>
        </Box>

        {/* O + gira 45° e vira ×: o mesmo controle abre e fecha. */}
        <AddIcon
          sx={{
            color: open ? sinfra.accent : sinfra.ink,
            opacity: open ? 1 : 0.45,
            transform: open ? 'rotate(45deg)' : 'none',
            transition: `color ${motion.base}, opacity ${motion.base}, transform ${motion.content} ${curva.suave}`,
            flexShrink: 0,
            fontSize: iconSize.inline,
          }}
        />
      </ButtonBase>

      <Collapse in={open} unmountOnExit timeout={prefersReducedMotion ? 0 : { enter: 220, exit: 160 }}>
        <Divider sx={{ borderColor: sinfra.rule }} />
        <Box sx={{ pt: 1.5, pb: 2.5, pl: 6 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
            {item.resposta}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
