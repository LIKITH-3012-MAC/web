import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import FooterSection from './components/FooterSection';
import PrometheusChat from './components/PrometheusChat';
import CollabModal from './components/CollabModal';
import { trackVisit } from './utils/analytics';

export default function App() {
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  useEffect(() => {
    trackVisit();

    const handleOpenModal = () => {
      setIsCollabOpen(true);
    };

    window.addEventListener('open-collab-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-collab-modal', handleOpenModal);
    };
  }, []);

  return (
    <main className="bg-[#0C0C0C] font-kanit" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <FooterSection />
      <PrometheusChat />
      <CollabModal isOpen={isCollabOpen} onClose={() => setIsCollabOpen(false)} />
    </main>
  );
}
