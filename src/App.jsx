import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAgentDrawer from './components/AIAgentDrawer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PricingPage from './pages/PricingPage';
import TrialMVP from './pages/TrialMVP';
import './App.css';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/trial" element={<TrialMVP />} />
          </Routes>
        </main>
        <AIAgentDrawer />
        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  );
}
