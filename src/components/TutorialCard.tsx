import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import type { Tutorial } from '@/types/content';
import SectionEyebrow from '@/components/SectionEyebrow';
import CartaoCatalogo from '@/components/CartaoCatalogo';

export default function TutorialCard({ tutorial: t }: { tutorial: Tutorial }) {
  return (
    <CartaoCatalogo
      icone={<ArticleOutlinedIcon />}
      iconeFontSize={24}
      eyebrow={<SectionEyebrow>{String(t.order).padStart(2, '0')} · Tutorial</SectionEyebrow>}
      titulo={t.title}
      descricao={t.description}
      rotuloCta="Abrir tutorial"
      para={`/modulos/${t.moduleSlug}/${t.slug}`}
    />
  );
}
