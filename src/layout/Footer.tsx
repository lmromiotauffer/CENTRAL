import { Box, Container, Typography, Stack, Divider, IconButton, Tooltip } from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { sinfraLogo, typeScale, motion, curva } from '@/theme';
import { useSinfra } from '@/theme/ThemeModeProvider';
import govLogo from '@/public/_logo_govmt_horizontal.png';

const footerLinks = [
  {
    label: 'Instagram oficial da SINFRA',
    href: 'https://www.instagram.com/sinframtoficial/?hl=pt-br',
    Icon: InstagramIcon,
  },
  {
    label: 'SINFRALOG',
    href: 'https://sinfralog.sinfra.mt.gov.br/login/',
    Icon: LoginOutlinedIcon,
  },
  {
    label: 'SINFRA',
    href: 'https://www.sinfra.mt.gov.br/',
    Icon: AccountBalanceOutlinedIcon,
  },
  {
    label: 'YouTube do SINFRALOG',
    href: 'https://www.youtube.com/@Sinfralog',
    Icon: YouTubeIcon,
  },
];

export default function Footer() {
  const sinfra = useSinfra();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        color: sinfra.ink,
        borderTop: `1px solid ${sinfra.rule}`,
        py: { xs: 2, md: 2.5 },
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ alignItems: { sm: 'center' } }}
          >
            <Box
              component="img"
              src={govLogo}
              alt="Governo de Mato Grosso"
              sx={{
                height: { xs: 52, md: 64 },
                width: 'auto',
                display: 'block',
                userSelect: 'none',
                flexShrink: 0,
                alignSelf: 'flex-start',
              }}
            />
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                width: '1px',
                alignSelf: 'stretch',
                bgcolor: sinfra.rule,
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  ...sinfraLogo,
                  color: sinfra.ink,
                }}
              >
                SINFRALOG — Central de Ajuda
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: sinfra.ink, opacity: 0.7, mt: 0.5, fontSize: typeScale.micro }}
              >
                © {currentYear} SINFRA / MT
              </Typography>
            </Box>
          </Stack>

          <Divider
            flexItem
            sx={{
              display: { xs: 'block', md: 'none' },
              borderColor: sinfra.rule,
            }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {footerLinks.map(({ label, href, Icon }) => (
              <Tooltip key={label} title={label}>
                <IconButton
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    color: sinfra.ink,
                    opacity: 0.64,
                    transition: `opacity ${motion.base}, color ${motion.base}, transform ${motion.base} ${curva.suave}`,
                    '&:hover': {
                      opacity: 1,
                      color: sinfra.accent,
                      bgcolor: 'transparent',
                      transform: 'translateY(-2px)',
                    },
                    '&:focus-visible': {
                      opacity: 1,
                      color: sinfra.accent,
                      outline: `2px solid ${sinfra.accent}`,
                      outlineOffset: 3,
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      '&:hover': {
                        transform: 'none',
                      },
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
