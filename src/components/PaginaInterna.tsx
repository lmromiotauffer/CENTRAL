import type { ComponentProps, ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Breadcrumb from '@/components/Breadcrumb';

// Casca comum das páginas internas: contêiner xl, respiro padrão e breadcrumb.
export default function PaginaInterna({
  crumbs,
  children,
}: {
  crumbs: ComponentProps<typeof Breadcrumb>['crumbs'];
  children: ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '70vh' }}>
      {/* React 19 leva o <title> para o <head>; o último item da trilha é o nome da página. */}
      <title>{`${crumbs[crumbs.length - 1].label} — SINFRALOG Central de Ajuda`}</title>
      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 5.5 }, pb: { xs: 7.5, md: 11 } }}>
        <Breadcrumb crumbs={crumbs} />
        {children}
      </Container>
    </Box>
  );
}
