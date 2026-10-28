import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import PaginaInterna from '@/components/PaginaInterna';
import { sinfralogNorms } from '@/content/documentation';
import { useSinfra } from '@/theme/ThemeModeProvider';

export default function Documentation() {
  const sinfra = useSinfra();
  // Container policy: maxWidth="xl" — breadcrumb alinhado com páginas internas; conteúdo em largura de leitura
  // Density: compact
  return (
    <PaginaInterna crumbs={[{ label: 'Início', to: '/' }, { label: 'Documentação' }]}>
        <Box
          component="section"
          sx={{ maxWidth: 720, mx: 'auto', mb: 5 }}
        >
          <PageHeader
            eyebrow="Documentação"
            title={
              <>
                Normas do <em>SINFRALOG</em>.
              </>
            }
            description={
              <>
                Acesse as normas e atos relacionados ao SINFRALOG. Não encontrou o que precisa?{' '}
                <MuiLink href="https://suporte.sinfra.mt.gov.br" target="_blank" rel="noreferrer">
                  Clique aqui
                </MuiLink>
                .
              </>
            }
          />
          <Stack spacing={3}>
            {sinfralogNorms.map(section => (
              <Box key={section.title}>
                <Typography
                  variant="h3"
                  sx={{
                    color: sinfra.ink,
                    fontSize: { xs: 22, md: 30 },
                    lineHeight: 1.25,
                    mb: 1.5,
                  }}
                >
                  {section.title}
                </Typography>
                <Stack component="ul" spacing={1.5} sx={{ m: 0, pl: 2.5 }}>
                  {section.items.map(item => (
                    <Box component="li" key={item.href} sx={{ color: sinfra.ink, pl: 0.5 }}>
                      <MuiLink href={item.href} target="_blank" rel="noreferrer" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </MuiLink>
                      {item.description && (
                        <Typography component="span" sx={{ color: sinfra.ink, opacity: 0.82, lineHeight: 1.55 }}>
                          {' '}
                          - {item.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
    </PaginaInterna>
  );
}
