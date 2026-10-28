import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import Footer from './Footer';
import { motion, curva } from '@/theme';

// Só opacidade: troca de rota sem deslocamento, para não atrasar a leitura.
const entradaPagina = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export default function MainLayout() {
  const { pathname } = useLocation();
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopNavBar />
      {/* key reinicia a animação a cada rota. */}
      <Box
        key={pathname}
        component="main"
        sx={{ flex: 1, animation: `${entradaPagina} ${motion.content} ${curva.cor}` }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
