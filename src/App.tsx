import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import Home from '@/pages/Home';
import Modules from '@/pages/Modules';
import ModuleDetail from '@/pages/ModuleDetail';
import TutorialPage from '@/pages/TutorialPage';
import SearchResults from '@/pages/SearchResults';
import Documentation from '@/pages/Documentation';
import Contacts from '@/pages/Contacts';
import Videos from '@/pages/Videos';
import NotFound from '@/pages/NotFound';
import ScrollToTop from '@/components/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/modulos" element={<Modules />} />
          <Route path="/modulos/:moduloSlug" element={<ModuleDetail />} />
          <Route path="/modulos/:moduloSlug/:tutorialSlug" element={<TutorialPage />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/busca" element={<SearchResults />} />
          <Route path="/documentacao" element={<Documentation />} />
          <Route path="/contatos" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
