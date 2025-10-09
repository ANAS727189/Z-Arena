import { ArrowRight, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DotGrid from '../ui/dot-grid';
import TargetCursor from '../ui/target-cursor';
import Shuffle from '../ui/shuffle-text';
import { 
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, 
  SiExpress, SiDocker, SiAppwrite, SiAxios 
} from "react-icons/si";
import LogoLoop from '../ui/logo-loop';

const HeroSection = () => {
  const navigate = useNavigate();

  const techLogos = [
    { node: <SiReact />, title: "React" },
    { node: <SiNextdotjs />, title: "Next.js" },
    { node: <SiTypescript />, title: "TypeScript" },
    { node: <SiTailwindcss />, title: "Tailwind CSS" },
    { node: <SiNodedotjs />, title: "Node.js" },
    { node: <SiExpress />, title: "Express" },
    { node: <SiDocker />, title: "Docker" },
    { node: <SiAppwrite />, title: "Appwrite" },
    { node: <SiAxios />, title: "Axios" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      <DotGrid
        dotSize={1.5}
        gap={25}
        baseColor="#22c55e"
        activeColor="#22c55e"
        proximity={80}
        shockRadius={150}
        shockStrength={2}
        className="absolute inset-0 z-0"
      />
     <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_50%_40%_at_50%_20%,rgba(34,197,94,0.15),rgba(255,255,255,0))]"></div>

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          className="flex w-full flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-heading text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl"
            variants={itemVariants}
          >
            Unleash Your <span className="cursor-target">Code.</span>
            <br />
            <Shuffle
              text="Dominate the Arena."
              shuffleDirection="right"
              className="text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.7)]"
              duration={0.35}
              triggerOnHover={true}
            />
          </motion.h1>
          <motion.p
            className="font-body mx-auto mt-6 max-w-2xl text-lg text-gray-400 cursor-target"
            variants={itemVariants}
          >
            The ultimate competitive programming platform. Battle in real-time, climb the leaderboards, and conquer challenges.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <button
              onClick={() => navigate('/challenges')}
              className="group relative inline-flex h-12 w-full cursor-target items-center justify-center overflow-hidden rounded-md bg-green-500 px-8 py-3 font-bold text-black transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.green.500)] sm:w-auto"
            >
              <span className="absolute h-0 w-0 rounded-full bg-green-400 transition-all duration-300 group-hover:h-56 group-hover:w-full"></span>
              <span className="relative flex items-center justify-center gap-2">
                Enter the Arena
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="group w-full cursor-target rounded-md border border-gray-700 bg-gray-900/40 px-8 py-3 font-semibold text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-gray-500 hover:text-white sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <Code2 className="h-5 w-5" />
                Explore Features
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-20 w-full px-4 pb-20">
        <motion.div 
            className="mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Image Showcase */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-2 shadow-2xl shadow-green-500/10 backdrop-blur-md">
              <img 
                src='/Z-Arena-showcase/Hero-section-new.png' 
                alt='Z-Arena Application Showcase'
                className="rounded-lg w-full"
              />
            </div>
            
        </motion.div>
         {/* Logo Loop */}
          <div className="mt-8">
              <LogoLoop
                logos={techLogos}
                speed={120}
                direction="left"
                logoHeight={48}
                gap={40}
                pauseOnHover
                scaleOnHover
                fadeOut
                fadeOutColor="#000000"
                ariaLabel="Technology partners"
              />
            </div>
      </div>
    </section>
  );
};

export default HeroSection;