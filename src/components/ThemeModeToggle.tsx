import { useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { IconButton, Menu, MenuItem, ListItemIcon, Box } from '@mui/material';
import BrightnessAutoOutlined from '@mui/icons-material/BrightnessAutoOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import { useThemeMode, useSinfra } from '@/theme/ThemeModeProvider';
import { fonts, iconSize, typeScale, radius } from '@/theme';
import type { ThemeMode } from '@/theme/themeMode';

const OPTIONS: ReadonlyArray<{ mode: ThemeMode; label: string; Icon: typeof BrightnessAutoOutlined }> = [
  { mode: 'auto',  label: 'Automático', Icon: BrightnessAutoOutlined },
  { mode: 'light', label: 'Claro',      Icon: LightModeOutlined },
  { mode: 'dark',  label: 'Escuro',     Icon: DarkModeOutlined },
];

export default function ThemeModeToggle() {
  const { mode, setMode } = useThemeMode();
  const sinfra = useSinfra();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const active = OPTIONS.find((o) => o.mode === mode) ?? OPTIONS[0];
  const ActiveIcon = active.Icon;

  const open = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const close = () => setAnchor(null);
  const choose = (next: ThemeMode) => {
    close();
    // Cross-fade da página inteira na troca de tema; sem a API ou com movimento reduzido, a troca segue instantânea.
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return setMode(next);
    }
    document.startViewTransition(() => flushSync(() => setMode(next)));
  };

  return (
    <>
      <IconButton
        onClick={open}
        aria-label={`Tema: ${active.label.toLowerCase()}. Clique para alterar.`}
        aria-haspopup="menu"
        sx={{ color: sinfra.ink, borderRadius: radius.control }}
      >
        <ActiveIcon sx={{ fontSize: iconSize.control }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { borderRadius: radius.surface, border: `1px solid ${sinfra.rule}`, mt: 0.5 } } }}
      >
        {OPTIONS.map((opt) => {
          const isActive = opt.mode === mode;
          const { Icon } = opt;
          return (
            <MenuItem
              key={opt.mode}
              onClick={() => choose(opt.mode)}
              role="menuitemradio"
              aria-checked={isActive}
              sx={{
                minWidth: 180,
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: typeScale.micro,
                letterSpacing: '0.08em',
                color: isActive ? sinfra.accent : sinfra.ink,
                bgcolor: isActive ? sinfra.paperAlt : 'transparent',
                '&:hover': { bgcolor: sinfra.paperAlt },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                <Icon sx={{ fontSize: iconSize.control }} />
              </ListItemIcon>
              <Box component="span" sx={{ flex: 1, my: 0.5 }}>{opt.label.toUpperCase()}</Box>
              <Box sx={{ ml: 1, width: 20, display: 'inline-flex', justifyContent: 'flex-end' }}>
                {isActive && <CheckOutlined sx={{ fontSize: iconSize.inline }} />}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
