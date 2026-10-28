import { Box, Grid } from '@mui/material';
import HomeModuleTile from '@/components/HomeModuleTile';
import PageHeader from '@/components/PageHeader';
import PaginaInterna from '@/components/PaginaInterna';
import { modules } from '@/content/modules';

// Container policy: maxWidth="xl" (1440 @ xl+; 1200 @ lg) — índice de módulos

export default function Modules() {
  return (
    <PaginaInterna crumbs={[{ label: 'Início', to: '/' }, { label: 'Módulos' }]}>
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <PageHeader
          eyebrow={`Catálogo · ${new Date().getFullYear()}`}
          title={
            <>
              Módulos do <em>sistema</em>.
            </>
          }
          description="Todos os sistemas administrados pela SINFRALOG reunidos em um único índice navegável."
        />
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {modules.map(m => (
            <Grid key={m.slug} size={{ xs: 12, sm: 6, md: 4 }}>
              <HomeModuleTile module={m} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </PaginaInterna>
  );
}
