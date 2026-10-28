import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useSinfra } from '@/theme/ThemeModeProvider';

interface Props {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function SectionEyebrow({ children, sx }: Props) {
  const sinfra = useSinfra();
  return (
    <Typography variant="overline" component="p" sx={{ color: sinfra.accent, ...sx }}>
      {children}
    </Typography>
  );
}
