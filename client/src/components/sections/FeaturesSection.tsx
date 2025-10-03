import { Code2, Zap, Trophy, Users, Globe, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: 'Multi-Language Support',
      description:
        'Execute challenges in Z--, C++, Python, Java, JavaScript, and Rust',
      command: 'z-lang --list',
      output: '6 languages loaded ✓',
    },
    {
      icon: Zap,
      title: 'Lightning Execution',
      description:
        'Sub-second code compilation and execution with detailed metrics',
      command: 'z-exec --benchmark',
      output: 'avg: 0.12s | 99th: 0.45s',
    },
    {
      icon: Trophy,
      title: 'Global Leaderboards',
      description:
        'Real-time ranking system with competitive scoring algorithms',
      command: 'z-rank --global',
      output: 'your_rank: #247 📈',
    },
    {
      icon: Users,
      title: 'Community Solutions',
      description: 'Browse optimized solutions and learn from top performers',
      command: 'z-solutions --top',
      output: '1.2M solutions shared',
    },
    {
      icon: Shield,
      title: 'Secure Sandbox',
      description:
        'Isolated execution environment with resource limits and monitoring',
      command: 'z-security --status',
      output: 'sandbox: active 🛡️',
    },
    {
      icon: Globe,
      title: 'Open Platform',
      description: 'Community-driven development with transparent algorithms',
      command: 'z-contrib --stats',
      output: '47 contributors active',
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
