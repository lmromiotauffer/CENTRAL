import type { SvgIconComponent } from '@mui/icons-material';
import Gavel from '@mui/icons-material/Gavel';
import Construction from '@mui/icons-material/Construction';
import Assessment from '@mui/icons-material/Assessment';
import AccountTree from '@mui/icons-material/AccountTree';
import FactCheck from '@mui/icons-material/FactCheck';
import Folder from '@mui/icons-material/Folder';
import Groups from '@mui/icons-material/Groups';
import type { ModuleMeta } from '@/types/content';
import CartaoCatalogo from '@/components/CartaoCatalogo';

const ICONES: Record<string, SvgIconComponent> = {
  Gavel, Construction, Assessment, AccountTree, FactCheck, Folder, Groups,
};

export default function HomeModuleTile({ module: m }: { module: ModuleMeta }) {
  const Icon = ICONES[m.icon] ?? Folder;

  return (
    <CartaoCatalogo
      icone={<Icon />}
      iconeFontSize={30}
      titulo={m.title}
      descricao={m.description}
      rotuloCta="Explorar módulo"
      para={`/modulos/${m.slug}`}
      moverSeta
    />
  );
}
