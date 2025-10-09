import {
  Navigation,
  HeroSection,
  FeaturesSection,
  ShowcaseSection,
  StatsSection,
  FAQSection,
  Footer
} from '@/components/sections';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <StatsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};
