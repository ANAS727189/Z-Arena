import { motion } from 'framer-motion';
import { TrendingUp, Users, Code, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Code,
      value: '4+',
      label: 'Active Challenges',
      description: 'Growing daily',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      value: '500+',
      label: 'Active Coders',
      description: 'Join the community',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      value: '1k+',
      label: 'Code Submissions',
      description: 'Solutions tested',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      value: '6',
      label: 'Languages Supported',
      description: 'Multi-platform',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Growing{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]">
              Community
            </span>
          </h2>
          <p className="font-body text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Developers worldwide are already mastering Z-- and competing in our challenges
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group text-center"
            >
              <div className="bg-[var(--background-primary)] p-8 rounded-2xl border border-[var(--border-primary)] hover:border-[var(--accent-purple)]/50 transition-all duration-300">
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring", bounce: 0.5 }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">
                    {stat.value}
                  </div>
                </motion.div>
                
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[var(--background-primary)] px-6 py-3 rounded-full border border-[var(--border-primary)]">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">Platform actively growing</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;