import {
  Navigation,
  HeroSection,
  FeaturesSection,
  ShowcaseSection,
  StatsSection,
  CTASection,
} from '@/components/sections';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <StatsSection />
      <CTASection />
    </div>
  );
};