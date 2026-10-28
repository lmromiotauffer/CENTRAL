import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { fonts, sinfraLogo, iconSize, typeScale, motion, curva } from '@/theme';
import { useSinfra } from '@/theme/ThemeModeProvider';
import SearchBar from '@/components/SearchBar';
import ThemeModeToggle from '@/components/ThemeModeToggle';

const siteLogo = '/logo-mt.png';
const NAV_SEARCH_COMPACT_WIDTH = 240;
const NAV_SEARCH_EXPANDED_WIDTH = 440;
const NAV_SEARCH_MAX_WIDTH = 520;
const MOBILE_NAVIGATION_ID = 'mobile-navigation';

const navBrandRuleIn = keyframes`
  from { opacity: 0; transform: scaleY(0.35); }
  to { opacity: 1; transform: scaleY(1); }
`;

const navBrandRevealIn = keyframes`
  from { max-width: 0; opacity: 0; transform: translateX(-6px); }
  to { max-width: 176px; opacity: 1; transform: translateX(0); }
`;

const links = [
  { to: '/', label: 'INÍCIO', Icon: HomeOutlinedIcon },
  { to: '/videos', label: 'VÍDEOS', Icon: OndemandVideoOutlinedIcon },
  { to: '/modulos', label: 'MÓDULOS', Icon: ViewModuleOutlinedIcon },
  { to: '/documentacao', label: 'DOCUMENTAÇÃO', Icon: MenuBookOutlinedIcon },
  { to: '/contatos', label: 'CONTATOS', Icon: MailOutlinedIcon },
];

export default function TopNavBar() {
  const sinfra = useSinfra();
  const [open, setOpen] = useState(false);
  const [hasScrolledHome, setHasScrolledHome] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const showNavSearch = !isHome || hasScrolledHome;

  useEffect(() => {
    if (!isHome) {
      setHasScrolledHome(false);
      return;
    }

    const heroSearch = document.querySelector('[data-home-hero-search="true"]');
    if (!heroSearch) return;

    const observer = new IntersectionObserver(([entry]) => {
      setHasScrolledHome(!entry.isIntersecting && window.scrollY > 0);
    });
    observer.observe(heroSearch);
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: sinfra.vidro,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${sinfra.rule}`,
        transition: `background-color ${motion.content}`,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          '& .nav-brand:hover + .nav-search-slot, & .nav-brand:focus-visible + .nav-search-slot': {
            '--nav-search-logo-push': '3px',
          },
        }}
      >
        <Box
          className="nav-brand"
          component={RouterLink}
          to="/"
          aria-label="SINFRALOG Central de Ajuda"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            position: 'relative',
            textDecoration: 'none',
            color: 'inherit',
            '@media (prefers-reduced-motion: reduce)': {
              '& .nav-brand-rule, & .nav-brand-reveal': {
                transform: 'none',
              },
            },
          }}
        >
          <Box
            component="img"
            src={siteLogo}
            alt="SINFRA — Mato Grosso"
            sx={{
              height: { xs: 40, md: 48 },
              width: 'auto',
              display: 'block',
              userSelect: 'none',
              flexShrink: 0,
            }}
          />
          <Box
            className="nav-brand-rule"
            sx={{
              width: '1px',
              alignSelf: 'stretch',
              bgcolor: sinfra.rule,
              opacity: 1,
              transform: 'scaleY(1)',
              transformOrigin: 'center',
              animation: `${navBrandRuleIn} 520ms cubic-bezier(0.2,0.8,0.2,1) 120ms both`,
            }}
          />
          <Box
            className="nav-brand-reveal"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
              maxWidth: 176,
              opacity: 1,
              transform: 'translateX(0)',
              whiteSpace: 'nowrap',
              animation: `${navBrandRevealIn} 720ms ${curva.suave} 180ms both`,
            }}
          >
            <Typography
              component="span"
              sx={{ ...sinfraLogo, color: sinfra.accent, lineHeight: 1.1 }}
            >
              SINFRALOG
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: fonts.body,
                fontWeight: 400,
                fontSize: typeScale.nano,
                color: sinfra.ink,
                lineHeight: 1.2,
              }}
            >
              Central de Ajuda
            </Typography>
          </Box>
        </Box>

        <Box
          className="nav-search-slot"
          inert={!showNavSearch ? true : undefined}
          sx={{
            display: { xs: 'none', lg: 'flex' },
            width: NAV_SEARCH_COMPACT_WIDTH,
            maxWidth: NAV_SEARCH_MAX_WIDTH,
            ml: 2,
            mr: 2,
            opacity: showNavSearch ? 1 : 0,
            visibility: showNavSearch ? 'visible' : 'hidden',
            transform: showNavSearch
              ? 'translateX(var(--nav-search-logo-push, 0px))'
              : 'translateX(-6px)',
            overflow: showNavSearch ? 'visible' : 'hidden',
            '&:focus-within': showNavSearch
              ? {
                  width: NAV_SEARCH_EXPANDED_WIDTH,
                }
              : undefined,
            transition:
              showNavSearch
                ? `opacity 520ms ease 120ms, transform 720ms ${curva.suave}, width ${motion.content} ${curva.suave}, visibility 0ms linear`
                : `opacity 220ms ease, transform 360ms ${curva.suave}, visibility 0ms linear 220ms`,
            '@media (prefers-reduced-motion: reduce)': {
              transform: 'none',
            },
          }}
        >
          <SearchBar
            variant="navChip"
            sx={{
              scrollMarginTop: 96,
              '& .MuiIconButton-root': { p: 0.5 },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, ml: 'auto' }}>
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.5, mr: 0.5 }}>
            {links.map(l => {
              const { Icon } = l;
              return (
                <Button
                  key={l.to}
                  component={NavLink}
                  to={l.to}
                  end={l.to === '/'}
                  color="inherit"
                  size="small"
                  startIcon={<Icon sx={{ fontSize: iconSize.control }} />}
                  sx={{
                    position: 'relative',
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: typeScale.nano,
                    letterSpacing: '0.1em',
                    minWidth: 0,
                    px: 1.5,
                    pb: 0.75,
                    color: sinfra.ink,
                    transition: `color ${motion.base}`,
                    '& .MuiButton-startIcon': { mr: 0.5 },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: 4,
                      height: '1.5px',
                      bgcolor: sinfra.accent,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: `transform ${motion.base} ${curva.suave}`,
                    },
                    '&:hover': {
                      color: sinfra.accent,
                      bgcolor: 'transparent',
                    },
                    '&.active': { color: sinfra.accent },
                    '&:hover::after, &.Mui-focusVisible::after, &.active::after': { transform: 'scaleX(1)' },
                    '&.Mui-focusVisible': { bgcolor: 'transparent' },
                  }}
                >
                  {l.label}
                </Button>
              );
            })}
          </Box>

          <ThemeModeToggle />

          <IconButton
            sx={{ display: { xs: 'inline-flex', lg: 'none' }, color: sinfra.ink }}
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls={MOBILE_NAVIGATION_ID}
          >
            <MenuIcon />
          </IconButton>
        </Box>

      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { id: MOBILE_NAVIGATION_ID } }}>
        <Box sx={{ width: { xs: 280, sm: 320 }, bgcolor: sinfra.paper, height: '100%' }}>
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ ...sinfraLogo, color: sinfra.ink, fontSize: typeScale.micro }}>
              MENU
            </Typography>
          </Box>
          <Divider sx={{ borderColor: sinfra.rule }} />
          <Box sx={{ px: 2, py: 1.5 }}>
            <SearchBar
              variant="navChip"
              sx={{
                '& .MuiIconButton-root': { p: 0.5 },
              }}
            />
          </Box>
          <Divider sx={{ borderColor: sinfra.rule }} />
          <List>
            {links.map(l => {
              return (
                <ListItemButton
                  key={l.to}
                  component={NavLink}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  sx={{
                    '&.active .MuiListItemIcon-root, &.active .MuiListItemText-primary': { color: sinfra.accent },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: sinfra.ink }}>
                    <l.Icon sx={{ fontSize: iconSize.control }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={l.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: fonts.display,
                          fontWeight: 700,
                          fontSize: typeScale.micro,
                          letterSpacing: '0.1em',
                          color: sinfra.ink,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
