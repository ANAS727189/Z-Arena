import { motion } from 'framer-motion';
import { Code, Play, ArrowRight, CheckCircle, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShowcaseSection = () => {
  const navigate = useNavigate();

  const languages = [
    { name: 'Z--', color: 'from-purple-500 to-pink-500', popularity: 95 },
    { name: 'C++', color: 'from-blue-500 to-cyan-500', popularity: 90 },
    { name: 'Python', color: 'from-green-500 to-emerald-500', popularity: 85 },
    { name: 'Java', color: 'from-orange-500 to-red-500', popularity: 80 },
    { name: 'JavaScript', color: 'from-yellow-500 to-orange-500', popularity: 88 },
    { name: 'Rust', color: 'from-red-500 to-rose-500', popularity: 75 }
  ];

  const sampleChallenges = [
    {
      title: 'Hello World',
      difficulty: 'Easy',
      points: 20,
      description: 'Get started with Z-- basics and syntax fundamentals',
      solved: 1247,
      difficultyColor: 'text-green-400 bg-green-400/10'
    },
    {
      title: 'Two Sum Array',
      difficulty: 'Medium', 
      points: 50,
      description: 'Master array manipulation and hash table optimization',
      solved: 823,
      difficultyColor: 'text-yellow-400 bg-yellow-400/10'
    },
    {
      title: 'String Reversal',
      difficulty: 'Easy',
      points: 25,
      description: 'Learn string manipulation and algorithmic thinking',
      solved: 956,
      difficultyColor: 'text-green-400 bg-green-400/10'
    }
  ];

  return (
    <section className="py-24 bg-[var(--background-primary)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Master{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]">
              Multiple Languages
            </span>
          </h2>
          <p className="font-body text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            From Z-- fundamentals to advanced algorithms in popular programming languages
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Languages Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-heading text-3xl font-bold text-white mb-8">
              6 Programming Languages
            </h3>
            <div className="space-y-4">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-purple)]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${lang.color}`} />
                      <span className="font-semibold text-white">{lang.name}</span>
                      {lang.name === 'Z--' && (
                        <span className="px-2 py-1 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white text-xs rounded-full font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm">{lang.popularity}%</span>
                  </div>
                  <div className="mt-2 w-full bg-[var(--background-primary)] rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${lang.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.popularity}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sample Challenges */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-heading text-3xl font-bold text-white mb-8">
              Popular Challenges
            </h3>
            <div className="space-y-4">
              {sampleChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="group p-6 bg-[var(--background-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-purple)]/50 transition-all cursor-pointer"
                  onClick={() => navigate('/challenges')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                          {challenge.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${challenge.difficultyColor}`}>
                            {challenge.difficulty}
                          </span>
                          <span className="text-[var(--text-secondary)] text-sm flex items-center">
                            <Trophy className="w-3 h-3 mr-1" />
                            {challenge.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-[var(--text-secondary)] text-sm mb-3 leading-relaxed">
                    {challenge.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4 text-[var(--text-secondary)]">
                      <span className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                        {challenge.solved.toLocaleString()} solved
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        5-15 min
                      </span>
                    </div>
                    <button className="flex items-center text-[var(--accent-purple)] group-hover:text-[var(--accent-cyan)] transition-colors">
                      <Play className="w-3 h-3 mr-1" />
                      Try Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => navigate('/challenges')}
                className="inline-flex items-center bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                View All Challenges
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;