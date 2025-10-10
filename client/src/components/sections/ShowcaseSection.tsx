import { User, Trophy, AlarmClock } from 'lucide-react';
import { motion } from 'framer-motion';
import { SiPython, SiRust, SiCplusplus} from 'react-icons/si';
import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import type { IconType } from 'react-icons';


interface Language {
  id: string;
  name: string;
  icon: IconType | React.FC<any>;
}

interface Player {
  name: string;
  languages: Language[];
  codeSnippet: string;
}

interface Challenge {
  title: string;
  difficulty: string;
  difficultyColor: string;
  languages: Language[];
  winner: string;
  winnerColor: string;
}


const ZIcon = (props: React.ComponentProps<'svg'>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4H3L12 12L3 20H21" />
  </svg>
);

// --- Richer Data ---
const challengerData: Player = {
  name: "Challenger Luffy",
  languages: [
    { id: 'python', name: 'Python', icon: SiPython },
    { id: 'rust', name: 'Rust', icon: SiRust },
  ],
  codeSnippet: `def solve(arr):\n  # Optimal solution...\n  return result`
};

const opponentData: Player = {
  name: "Opponent Davy",
  languages: [
    { id: 'cpp', name: 'C++', icon: SiCplusplus },
    { id: 'z--', name: 'Z--', icon: ZIcon },
  ],
  codeSnippet: `fn solve(arr) {\n  // Blazing fast...\n  return result;\n}`
};

const centralChallengeData: Challenge = {
  title: "Hello World",
  difficulty: "Easy",
  difficultyColor: "border-green-400/50 text-green-400",
  languages: [...challengerData.languages, ...opponentData.languages],
  winner: challengerData.name,
  winnerColor: 'text-blue-400'
};

const ShowcaseSection = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const challengerRef = useRef<HTMLDivElement>(null);
  const opponentRef = useRef<HTMLDivElement>(null);
  const centralCardRef = useRef<HTMLDivElement>(null);

const calculatePaths = useCallback(() => {
  if (!containerRef.current || !challengerRef.current || !opponentRef.current || !centralCardRef.current) return;

  const containerRect = containerRef.current.getBoundingClientRect();
  const challengerRect = challengerRef.current.getBoundingClientRect();
  const opponentRect = opponentRef.current.getBoundingClientRect();
  const centralRect = centralCardRef.current.getBoundingClientRect();

  const verticalCenter = (centralRect.top + centralRect.bottom) / 2 - containerRect.top;

  // top connections
  const path1 = `M ${challengerRect.right - containerRect.left} ${verticalCenter - 100}
                 C ${challengerRect.right + 60 - containerRect.left} ${verticalCenter - 100},
                   ${centralRect.left - 60 - containerRect.left} ${verticalCenter - 20},
                   ${centralRect.left - containerRect.left} ${verticalCenter - 20}`;

  const path2 = `M ${opponentRect.left - containerRect.left} ${verticalCenter - 100}
                 C ${opponentRect.left - 60 - containerRect.left} ${verticalCenter - 100},
                   ${centralRect.right + 60 - containerRect.left} ${verticalCenter - 20},
                   ${centralRect.right - containerRect.left} ${verticalCenter - 20}`;


  const verticalOffset = 70;

  // path3 (bottom-left): mirrors path2 direction (right → left)
  const path3 = `M ${centralRect.right - containerRect.left} ${verticalCenter + verticalOffset}
                 C ${centralRect.right + 60 - containerRect.left} ${verticalCenter + verticalOffset},
                   ${opponentRect.left - 60 - containerRect.left} ${verticalCenter + verticalOffset + 60},
                   ${opponentRect.left - containerRect.left} ${verticalCenter + verticalOffset + 80}`;

  // path4 (bottom-right): mirrors path1 direction (left → right)
  const path4 = `M ${centralRect.left - containerRect.left} ${verticalCenter + verticalOffset}
                 C ${centralRect.left - 40 - containerRect.left} ${verticalCenter + verticalOffset},
                   ${challengerRect.right + 80 - containerRect.left} ${verticalCenter + verticalOffset + 80},
                   ${challengerRect.right - containerRect.left} ${verticalCenter + verticalOffset + 80}`;


  setPaths([path1, path2, path3, path4]);
}, []);



  useEffect(() => {
    const observer = new ResizeObserver(() => {
      calculatePaths();
    });
    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
      setTimeout(calculatePaths, 100);
    }
    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [calculatePaths]);

  return (
    <section id="showcase" className="py-24 bg-black text-white overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block rounded-full bg-green-500/10 px-4 py-1.5 mb-4">
            <span className="font-semibold text-sm text-green-400">Warzone</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Real-Time Coding Duels
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Challenge opponents, bring your best skills, and solve problems under pressure.
          </p>
        </motion.div>

        <div className="relative" ref={containerRef}>
          <ConnectorSVG paths={paths} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <PlayerCard ref={challengerRef} player={challengerData} alignment="left" />
            <ChallengeCard ref={centralCardRef} challenge={centralChallengeData} />
            <PlayerCard ref={opponentRef} player={opponentData} alignment="right" />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Child Components with Typing and forwardRef ---

interface PlayerCardProps {
  player: Player;
  alignment: 'left' | 'right';
}

const PlayerCard = forwardRef<HTMLDivElement, PlayerCardProps>(({ player }, ref) => {
  const isChallenger = player.name === "Challenger Blue";
  const colorClass = isChallenger 
    ? { border: 'border-blue-400/50', bg: 'bg-blue-500/10', text: 'text-blue-400' }
    : { border: 'border-purple-400/50', bg: 'bg-purple-500/10', text: 'text-purple-400' };

  return (
    <div
      ref={ref}
      className="h-full rounded-xl border border-white/10 bg-gray-900/40 p-6 backdrop-blur-sm flex flex-col"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${colorClass.border} ${colorClass.bg}`}>
          <User className={`w-6 h-6 ${colorClass.text}`} />
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">{player.name}</h4>
          <p className="text-sm text-gray-400">Chosen Languages</p>
        </div>
      </div>
      <div className="space-y-3">
        {player.languages.map((lang) => (
          <div key={lang.id} className="flex items-center justify-between rounded-lg p-3 bg-black/30 border border-white/5">
            <div className="flex items-center gap-2">
              <lang.icon className="w-5 h-5 text-gray-300" />
              <span className="font-medium text-gray-200">{lang.name}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-white/10 flex-grow flex flex-col">
        <p className="text-sm text-gray-400 mb-2">Submission Snippet:</p>
        <pre className="text-xs bg-black/40 rounded-md p-3 flex-grow text-gray-300"><code className="language-js">{player.codeSnippet}</code></pre>
      </div>
    </div>
  );
});

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = forwardRef<HTMLDivElement, ChallengeCardProps>(({ challenge }, ref) => (
  <div
    ref={ref}
    className="relative aspect-square rounded-full border-2 border-green-400/50 bg-gray-900/50 
               p-6 backdrop-blur-sm shadow-2xl shadow-green-500/10 flex flex-col 
               items-center justify-center text-center overflow-hidden"
  >
    {/* Icon */}
    <div className="flex flex-col items-center justify-center">
    <motion.div
      className="absolute top-2 z-20"
      animate={{
        rotate: [-10, 10, -10],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/50 shadow-lg shadow-green-500/30 mb-4">
        <AlarmClock className="w-7 h-7 text-green-400" />
      </div>
    </motion.div>

      {/* Title & Difficulty */}
      <h3 className="font-bold text-lg text-white mb-2 mt-4">{challenge.title}</h3>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${challenge.difficultyColor}`}
      >
        {challenge.difficulty}
      </span>

      {/* Divider */}
      <div className="w-2/3 h-[1px] bg-white/10 my-3"></div>

      {/* Languages */}
      <div className="grid grid-cols-2 gap-2 w-3/4">
        {challenge.languages.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center justify-center gap-1 p-2 rounded-lg bg-black/30 border border-white/5"
          >
            <lang.icon className="w-4 h-4 text-gray-300" />
            <span className="text-xs text-gray-400">{lang.name}</span>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="mt-4 pt-2   w-3/4">
        <p className="text-sm text-gray-400 mb-1">Match Result</p>
        <div className="flex items-center justify-center gap-2 rounded-lg p-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          <span className="font-bold flex items-center gap-2 text-lg text-white">
            <Trophy className={`w-5 h-5 ${challenge.winnerColor}`} />
            Winner
          </span>
           <span className="text-gray-400 text-sm whitespace-nowrap"> {challenge.winner}
          </span>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
));




const ConnectorSVG = ({ paths }: { paths: string[] }) => {
  return (
    <motion.svg className="absolute inset-0 z-50 pointer-events-none " style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {paths.map((path, i) => (
  <motion.path
    key={i}
    d={path}
    fill="none"
    stroke={i < 2 ? "gray" : "url(#line-gradient)"}
    strokeWidth="2.5"
    strokeLinecap="round"
    filter="url(#glow)"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{
      pathLength: 1,
      opacity: 1,
      stroke: i === 0 || i === 1 ? "#22c55e" : "gray"
    }}
    transition={{
      duration: 1.2,
      delay: i * 0.8,
      ease: "easeInOut"
    }}
  />
))}

    </motion.svg>
  );
};

export default ShowcaseSection;