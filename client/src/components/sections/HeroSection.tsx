import { motion } from 'framer-motion';
import { ArrowRight, Play, Code, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--background-primary)]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-purple)]/5 via-transparent to-[var(--accent-cyan)]/5" />
        
        {/* Floating Code Snippets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 overflow-hidden"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[var(--text-secondary)] text-sm font-mono"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 12)}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {i % 3 === 0 && 'start ... end'}
              {i % 3 === 1 && 'let x = 42'}
              {i % 3 === 2 && 'print("Z--")'}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Animated Logo/Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-[var(--accent-purple)]/20">
                <Code className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
                <span className="block text-white mb-2">Master</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-cyan)] to-[var(--accent-purple)] animate-pulse">
                  Z-Challenge
                </span>
              </h1>
              
              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="font-body text-xl md:text-2xl text-[var(--text-secondary)] max-w-4xl mx-auto leading-relaxed"
              >
                Compete in <span className="font-accent text-[var(--accent-cyan)] font-semibold">Z--</span> programming challenges,
                <br className="hidden md:block" />
                climb leaderboards, and become a coding champion
              </motion.p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              {[
                { icon: Code, label: '4+ Challenges', value: 'Growing Daily' },
                { icon: Trophy, label: '6 Languages', value: 'Multi-Platform' },
                { icon: Zap, label: 'Real-time', value: 'Instant Feedback' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[var(--background-secondary)]/50 backdrop-blur-sm border border-[var(--border-primary)] rounded-xl p-4 min-w-[140px]"
                >
                  <stat.icon className="w-6 h-6 text-[var(--accent-purple)] mx-auto mb-2" />
                  <div className="text-white font-semibold text-sm">{stat.label}</div>
                  <div className="text-[var(--text-secondary)] text-xs">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                onClick={() => navigate('/challenges')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden shadow-2xl shadow-[var(--accent-purple)]/30"
              >
                <div className="flex items-center relative z-10">
                  <Play className="w-5 h-5 mr-2" />
                  Start Coding Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/leaderboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-[var(--accent-purple)] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--accent-purple)]/10 transition-all duration-300"
              >
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                </div>
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border-2 border-[var(--accent-purple)] rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-[var(--accent-purple)] rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;