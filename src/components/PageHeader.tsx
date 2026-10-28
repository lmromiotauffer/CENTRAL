import { Box, Typography } from '@mui/material';
import SectionEyebrow from './SectionEyebrow';
import { useSinfra } from '@/theme/ThemeModeProvider';

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, description }: Props) {
  const sinfra = useSinfra();
  return (
    <Box component="header" sx={{ mb: { xs: 4, md: 4.5 } }}>
      <SectionEyebrow sx={{ mb: 2.5 }}>{eyebrow}</SectionEyebrow>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 35, md: 58 },
          lineHeight: 1,
          color: sinfra.ink,
          mb: description ? 2 : 0,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="subtitle1"
          sx={{
            color: sinfra.ink,
            opacity: 0.7,
            maxWidth: 560,
            fontSize: { xs: 16, md: 17.5 },
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
