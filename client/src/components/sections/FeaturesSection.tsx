import { Code2, Zap, Trophy, Users, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; 
import PixelCard from '../ui/pixel-card';
import { 
  SiCplusplus, SiPython, SiJavascript, SiRust, SiGo,
  SiKotlin, SiSwift, SiTypescript, SiDocker, SiAppwrite
} from 'react-icons/si';

const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: 'Multi-Language Support',
      description: 'Solve 50+ challenges across Z--, C++, Python, Go, JavaScript, and more. Our platform is built for polyglot programmers.',
      className: 'md:col-span-2 md:row-span-2',
      status: 'Core Feature',
    },
    { icon: Zap, title: 'Real-time Battle System', description: 'Compete head-to-head in live coding battles with an ELO rating system.', className: 'md:col-span-2', status: 'PvP Enabled' },
    { icon: Users, title: 'Z-- Language Focus', description: 'Master our innovative Z-- language with 15 dedicated challenges.', className: 'md:col-span-1', status: 'Unique' },
    { icon: Trophy, title: 'Global Leaderboards', description: 'Track progress with achievements, streaks, and competitive rankings.', className: 'md:col-span-1', status: 'Competitive' },
    { icon: Globe, title: 'Judge0 Integration', description: 'Execute code securely with the industry-standard Judge0 API.', className: 'md:col-span-2', status: 'Extensible' },
    { icon: Shield, title: 'Secure Appwrite Backend', description: 'Reliable authentication, real-time updates, and cloud functions.', className: 'md:col-span-2', status: 'Secure' },
  ];
  
  // Base icons to be repeated
  const baseLanguageIcons = [
    <SiCplusplus />, <SiPython />, <SiJavascript />, <SiRust />, <SiGo />,
    <SiRust />, <SiKotlin />, <SiSwift />, <SiTypescript />, <SiDocker />, <SiAppwrite/>
  ];
  
  // Create a large, repeating array to fill the background grid
  const repeatedLanguageIcons = Array.from({ length: 80 }).map((_, i) => 
    baseLanguageIcons[i % baseLanguageIcons.length]
  );

  const firstFeature = features[0];
  const otherFeatures = features.slice(1);

  return (
    <section id="features" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block rounded-full bg-green-500/10 px-4 py-1.5 mb-4">
            <span className="font-semibold text-sm text-green-400">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            An Arena Built for Coders
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to test your skills, compete, and conquer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] gap-2">
          
          {/* --- Special First Card --- */}
          <PixelCard
            variant='default'
            className={cn("overflow-hidden", firstFeature.className)}
          >
            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 mb-4">
                  <firstFeature.icon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{firstFeature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{firstFeature.description}</p>
              </div>
              <div className="rounded-full bg-black/30 border border-white/10 inline-block px-3 py-1 self-start">
                <span className="text-xs font-medium text-gray-300">{firstFeature.status}</span>
              </div>
            </div>

            {/* Decorative Icon Grid Background */}
            <div className="absolute inset-0 w-full h-full grid grid-cols-8 gap-0 opacity-10 blur-[2px] [mask-image:linear-gradient(to_bottom,transparent_20%,black_70%)]">
              {repeatedLanguageIcons.map((Icon, i) => (
                <div key={i} className="flex items-center justify-center text-4xl text-gray-500">
                  {Icon}
                </div>
              ))}
            </div>
          </PixelCard>
          
          {/* --- Other Cards --- */}
          {otherFeatures.map((feature) => (
            <PixelCard
              key={feature.title}
              variant='default'
              className={cn("p-6 flex flex-col justify-between", feature.className)}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 mb-4">
                  <feature.icon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
              <div className="rounded-full bg-black/30 border border-white/10 inline-block px-3 py-1 self-start">
                <span className="text-xs font-medium text-gray-300">{feature.status}</span>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;