import { useId } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getInitials } from '@/lib/initials';
import { motion } from '@/theme';
import { useSinfra } from '@/theme/ThemeModeProvider';
import type { Contact } from '@/content/contacts';

type ContactCardProps = {
  contact: Contact;
  onCopy: (email: string) => void;
};

export default function ContactCard({ contact, onCopy }: ContactCardProps) {
  const sinfra = useSinfra();
  const headingId = useId();
  const initials = getInitials(contact.nome);

  return (
    <Card
      component="article"
      aria-labelledby={headingId}
      elevation={0}
      sx={{
        height: '100%',
        p: { xs: 2, md: 2.25 },
        transition: `border-color ${motion.base}`,
        '&:hover, &:focus-within': {
          borderColor: sinfra.accent,
        },
      }}
    >
      <Stack
        spacing={1.5}
        sx={{
          height: '100%',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Avatar
          sx={{
            bgcolor: sinfra.accent,
            color: sinfra.paper,
            width: 48,
            height: 48,
            fontWeight: 600,
          }}
          aria-hidden
        >
          {initials}
        </Avatar>

        <Box
          sx={{
            width: '100%',
            minHeight: 'calc(2 * 1.3 * 1.125rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            id={headingId}
            variant="h3"
            sx={{ fontSize: '1rem', lineHeight: 1.25, m: 0 }}
          >
            {contact.nome}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {contact.setor}
        </Typography>

        <Box
          sx={{
            mt: 'auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(2 * 1.5 * 0.875rem)',
          }}
        >
          <MuiLink
            href={`mailto:${contact.email}`}
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.4,
              overflowWrap: 'anywhere',
            }}
          >
            {contact.email}
          </MuiLink>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon fontSize="small" />}
          onClick={() => onCopy(contact.email)}
          aria-label={`Copiar e-mail de ${contact.nome}`}
          sx={{
            borderColor: sinfra.rule,
            color: sinfra.ink,
            '&:hover': {
              borderColor: sinfra.accent,
              bgcolor: 'transparent',
            },
          }}
        >
          Copiar
        </Button>
      </Stack>
    </Card>
  );
}
