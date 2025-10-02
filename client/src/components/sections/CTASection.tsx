import { motion } from 'framer-motion';
import { ArrowRight, Users, Code, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-[var(--accent-purple)]/10 via-[var(--background-primary)] to-[var(--accent-cyan)]/10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-24 translate-y-24" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Start Your
                <br />
                <span className="text-yellow-300">Coding Journey?</span>
              </h2>
              <p className="font-body text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of developers mastering Z-- and competing in challenges that matter
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
            >
              <motion.button
                onClick={() => navigate('/challenges')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-[var(--accent-purple)] px-10 py-5 rounded-xl font-bold text-xl shadow-2xl hover:shadow-white/20 transition-all duration-300"
              >
                <div className="flex items-center">
                  <Users className="w-6 h-6 mr-3" />
                  Join the Challenge
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              <motion.button
                onClick={() => navigate('/leaderboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white hover:text-[var(--accent-purple)] transition-all duration-300"
              >
                <div className="flex items-center">
                  <Trophy className="w-6 h-6 mr-3" />
                  View Rankings
                </div>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 text-white/80 text-sm"
            >
              <div className="flex items-center">
                <Code className="w-4 h-4 mr-2" />
                <span>No Setup Required</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                <span>Instant Feedback</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                <span>Global Rankings</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;