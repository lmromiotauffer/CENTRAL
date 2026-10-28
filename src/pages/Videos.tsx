import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import PageHeader from '@/components/PageHeader';
import PaginaInterna from '@/components/PaginaInterna';
import SectionEyebrow from '@/components/SectionEyebrow';
import { useSinfra } from '@/theme/ThemeModeProvider';
import { typeScale } from '@/theme';
import { cascaCartaoSx } from '@/components/CartaoCatalogo';
import { videos, type Video } from '@/content/videos';
import { modules } from '@/content/modules';

// Categorias na ordem dos módulos, com o Diário de Obras (fora dos módulos) ao final.
const categories = [...modules, { slug: 'diario-de-obras', title: 'App Diário de Obras' }];

function VideoCard({ video }: { video: Video }) {
  const sinfra = useSinfra();
  return (
    <Card
      component="article"
      id={video.id}
      sx={{
        ...cascaCartaoSx(sinfra),
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        component="iframe"
        src={`https://www.youtube-nocookie.com/embed/${video.id}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        sx={{ width: '100%', aspectRatio: '16 / 9', border: 'none', display: 'block', bgcolor: sinfra.rule }}
      />

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p: { xs: 1.75, md: 2 },
        }}
      >
        <SectionEyebrow sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
          <OndemandVideoOutlinedIcon sx={{ fontSize: 16 }} />
          Vídeo
        </SectionEyebrow>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 18, md: 19 },
            lineHeight: 1.18,
            color: sinfra.ink,
            mb: 1,
          }}
        >
          {video.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: 15,
            lineHeight: 1.45,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {video.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Videos() {
  const groups = categories
    .map(cat => ({ title: cat.title, items: videos.filter(v => v.module === cat.slug) }))
    .filter(group => group.items.length > 0);

  useScrollToHash('center');

  return (
    <PaginaInterna crumbs={[{ label: 'Início', to: '/' }, { label: 'Vídeos' }]}>
        <PageHeader
          eyebrow="Vídeos"
          title={
            <>
              Tutoriais em <em>vídeo</em>.
            </>
          }
          description="Assista aos tutoriais do canal SINFRALOG no YouTube e aprenda a usar o sistema passo a passo."
        />

        {groups.map((group, i) => (
          <Box component="section" key={group.title} sx={{ mt: i === 0 ? 0 : { xs: 6, md: 7 } }}>
            <SectionEyebrow sx={{ mb: { xs: 2.5, md: 3 }, opacity: 0.75, fontSize: typeScale.body }}>
              {group.title}
            </SectionEyebrow>
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {group.items.map(video => (
                <Grid key={video.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <VideoCard video={video} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
    </PaginaInterna>
  );
}
