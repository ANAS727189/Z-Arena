import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Trophy, Users, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-[var(--background-secondary)] border-b border-[var(--border-primary)] px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-white">Z-Challenge</h1>
              <p className="text-xs text-[var(--text-secondary)]">Code. Compete. Conquer.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('/challenges')}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Challenges
            </button>
            <button 
              onClick={() => navigate('/leaderboard')}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Leaderboard
            </button>
            <button className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-purple)]/10 to-[var(--accent-cyan)]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-heading text-6xl md:text-8xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]">
                  Z-Challenge
                </span>
              </h1>
              <p className="font-body text-xl md:text-2xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
                Master the <span className="font-accent text-[var(--accent-cyan)]">Z--</span> programming language through competitive coding challenges. 
                Build, compete, and climb the leaderboards!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={() => navigate('/challenges')}
                className="group bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Coding
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/leaderboard')}
                className="border border-[var(--border-primary)] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--background-secondary)] transition-colors"
              >
                View Leaderboard
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Z-Challenge?
            </h2>
            <p className="font-body text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Experience competitive programming like never before with our Z-- language platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[var(--background-primary)] p-8 rounded-2xl border border-[var(--border-primary)]"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-4">Custom Language</h3>
              <p className="font-body text-[var(--text-secondary)] leading-relaxed">
                Master the Z-- programming language with our integrated development environment and real-time compiler feedback.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[var(--background-primary)] p-8 rounded-2xl border border-[var(--border-primary)]"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-4">Real-time Challenges</h3>
              <p className="font-body text-[var(--text-secondary)] leading-relaxed">
                Solve coding challenges with instant feedback, automated testing, and performance metrics tracking.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[var(--background-primary)] p-8 rounded-2xl border border-[var(--border-primary)]"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-4">Competitive Rankings</h3>
              <p className="font-body text-[var(--text-secondary)] leading-relaxed">
                Climb the leaderboards, earn achievements, and compete with developers worldwide in Z-- mastery.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Z-- Journey?
            </h2>
            <p className="font-body text-xl text-[var(--text-secondary)] mb-8">
              Join thousands of developers mastering the future of programming
            </p>
            <button 
              onClick={() => navigate('/challenges')}
              className="group bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-12 py-6 rounded-xl font-bold text-xl hover:scale-105 transition-transform flex items-center mx-auto"
            >
              <Users className="w-6 h-6 mr-3" />
              Join the Challenge
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};