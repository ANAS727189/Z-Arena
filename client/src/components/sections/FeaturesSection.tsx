import { Code2, Zap, Trophy, Users, Globe, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: 'Multi-Language Challenges',
      description:
        'Solve 49 challenges across Z--, C++, Python, Go, JavaScript, and mixed-language problems',
      command: 'z-arena --languages',
      output: 'Z--: 15 | Go: 8 | Python: 10 | C++: 5 | Mixed: 2 | JS: 4',
    },
    {
      icon: Zap,
      title: 'Real-time Battle System',
      description:
        'Compete head-to-head in live coding battles with ELO rating system',
      command: 'z-arena --war status',
      output: 'battle-room: active | elo: 1247',
    },
    {
      icon: Trophy,
      title: 'Global Leaderboards',
      description:
        'Track your progress with achievements, streaks, and competitive rankings',
      command: 'z-arena --leaderboard',
      output: 'achievements: unlocked | streak: 7 days',
    },
    {
      icon: Users,
      title: 'Z-- Language Focus',
      description: 'Master the innovative Z-- programming language with 15 dedicated challenges',
      command: 'z-compiler --version',
      output: 'Z-- compiler v1.0 | runtime: node.js',
    },
    {
      icon: Shield,
      title: 'Appwrite Backend',
      description:
        'Secure authentication, real-time updates, and cloud functions integration',
      command: 'z-arena --backend status',
      output: 'appwrite: connected ✓ | realtime: active',
    },
    {
      icon: Globe,
      title: 'Judge0 Integration',
      description: 'Execute code in multiple languages with industry-standard Judge0 API',
      command: 'z-arena --judge0 ping',
      output: 'judge0-ce: online | 6 languages supported',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          {/* <div className="inline-block rounded-lg px-4 py-2 mb-6">
                <span className="text-gray-400 font-mono text-sm">$ z-platform --features</span>
            </div> */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Platform Capabilities
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built with performance, security, and developer experience in mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => (
            <div
              key={feature.title}
              className="group border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-200"
            >
              <div className="border-b border-gray-700 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <feature.icon className="w-4 h-4 text-gray-400 ml-2" />
                <span className="text-gray-400 text-sm font-mono">
                  {feature.title.toLowerCase().replace(/\s+/g, '-')}.sh
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="bg-black rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">$</span>
                    <span className="text-gray-300">{feature.command}</span>
                  </div>
                  <div className="text-yellow-400 ml-4">{feature.output}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
