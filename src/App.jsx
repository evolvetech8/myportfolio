import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { SmoothScroll } from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAgentDrawer from './components/AIAgentDrawer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PricingPage from './pages/PricingPage';
import TrialMVP from './pages/TrialMVP';
import AccountantWorkspace from './pages/AccountantWorkspace';
import React, { Suspense, lazy } from 'react';
import './App.css';

/* Lazy-load the entire Three.js canvas layer (code-split) */
const SceneCanvas = lazy(() => import('./components/three/SceneCanvas'));

function AppShell() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  /* Disable smooth scroll on /trial and /cpa (native scroll needed for data tables and forms) */
  const enableSmooth = isLanding;

  return (
    <>
      <Navbar />

      {/* Three.js 3D background — only on landing page */}
      {isLanding && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}

      <SmoothScroll enabled={enableSmooth}>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/trial" element={<TrialMVP />} />
            <Route path="/cpa" element={<AccountantWorkspace />} />
            <Route path="/accountant" element={<AccountantWorkspace />} />
            <Route path="/cpa/clients/:clientId/ledger" element={<TrialMVP />} />
            <Route path="/portal" element={<AccountantWorkspace initialPortalOpen={true} />} />
          </Routes>
        </main>
        <Footer />
      </SmoothScroll>

      <AIAgentDrawer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </LanguageProvider>
  );
}
