import { motion } from 'framer-motion';
import { Code2, Zap, Trophy, Users, Globe, Shield, Rocket, Brain } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: 'Multi-Language Support',
      description: 'Master Z-- and 5 other popular programming languages including C++, Python, Java, JavaScript, and Rust.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Real-time Execution',
      description: 'Get instant feedback with our lightning-fast code execution engine and detailed performance metrics.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Trophy,
      title: 'Competitive Rankings',
      description: 'Climb leaderboards, earn achievements, and compete with developers worldwide in coding mastery.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'Progressive difficulty levels with hints, tutorials, and personalized learning paths for every skill level.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a vibrant community of developers, share solutions, and learn from coding experts.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with sandboxed code execution and robust infrastructure.',
      gradient: 'from-red-500 to-rose-500'
    }
  ];

  return (
    <section className="py-24 bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]">
              Z-Challenge?
            </span>
          </h2>
          <p className="font-body text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Experience competitive programming like never before with our comprehensive platform designed for modern developers
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-[var(--background-primary)] p-8 rounded-2xl border border-[var(--border-primary)] hover:border-[var(--accent-purple)]/50 transition-all duration-300 relative overflow-hidden"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-purple)]/5 to-[var(--accent-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-heading text-2xl font-bold text-white mb-4 group-hover:text-[var(--accent-cyan)] transition-colors">
                  {feature.title}
                </h3>
                <p className="font-body text-[var(--text-secondary)] leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--accent-purple)]/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[var(--background-primary)] px-6 py-3 rounded-full border border-[var(--border-primary)]">
            <Rocket className="w-5 h-5 text-[var(--accent-purple)]" />
            <span className="text-white font-medium">And many more features coming soon!</span>
            <Globe className="w-5 h-5 text-[var(--accent-cyan)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;