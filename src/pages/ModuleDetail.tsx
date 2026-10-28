import { Box, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { modules } from '@/content/modules';
import { getTutorialsByModule } from '@/lib/tutorials';
import TutorialCard from '@/components/TutorialCard';
import PageHeader from '@/components/PageHeader';
import PaginaInterna from '@/components/PaginaInterna';
import NotFound from './NotFound';
import { useSinfra } from '@/theme/ThemeModeProvider';

// Container policy: maxWidth="xl" (1440 @ xl+; 1200 @ lg) — índice de tutoriais
// Density: compact — matches the modules catalog rhythm

export default function ModuleDetail() {
  const sinfra = useSinfra();
  const { moduloSlug } = useParams();
  const mod = modules.find(m => m.slug === moduloSlug);
  if (!mod) return <NotFound />;
  const tuts = getTutorialsByModule(mod.slug);
  return (
    <PaginaInterna
      crumbs={[
        { label: 'Início', to: '/' },
        { label: 'Módulos', to: '/modulos' },
        { label: mod.title },
      ]}
    >
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <PageHeader
          eyebrow={`Módulo · ${mod.title}`}
          title={mod.title}
          description={mod.description}
        />
        {tuts.length === 0 ? (
          <Typography sx={{ color: sinfra.ink, opacity: 0.6 }}>
            Nenhum tutorial disponível ainda.
          </Typography>
        ) : (
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {tuts.map(t => (
              <Grid key={t.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                <TutorialCard tutorial={t} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </PaginaInterna>
  );
}
