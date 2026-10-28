import { useState } from 'react';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import PaginaInterna from '@/components/PaginaInterna';
import ContactCard from '@/components/ContactCard';
import { contacts } from '@/content/contacts';

export default function Contacts() {
  const [snackOpen, setSnackOpen] = useState(false);

  const handleCopy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setSnackOpen(true);
    } catch {
      // Clipboard API blocked: silently no-op. The mailto link is still available.
    }
  };

  return (
    <PaginaInterna crumbs={[{ label: 'Início', to: '/' }, { label: 'Contatos' }]}>

        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <PageHeader
            eyebrow="Equipe"
            title={
              <>
                Fale com a <em>UNIGEP</em>.
              </>
            }
            description="Equipe responsável pelos sistemas e processos da Sinfra. Use os canais abaixo para tirar dúvidas, reportar incidentes e solicitar acessos."
          />

          <Grid container spacing={{ xs: 2, md: 2.25 }}>
            {contacts.map((contact) => (
              <Grid key={contact.email} size={{ xs: 12, sm: 6, md: 4 }}>
                <ContactCard contact={contact} onCopy={handleCopy} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Snackbar
          open={snackOpen}
          autoHideDuration={2000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            variant="filled"
            role="status"
            onClose={() => setSnackOpen(false)}
          >
            E-mail copiado
          </Alert>
        </Snackbar>
    </PaginaInterna>
  );
}
