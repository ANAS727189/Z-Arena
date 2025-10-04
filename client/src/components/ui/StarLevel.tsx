import { Star } from 'lucide-react';

interface StarLevelProps {
  starLevel: {
    $id: string;
    starLevel: number;
    title: string;
    pointsRequired: number;
    color: string;
    icon: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
}

export const StarLevel: React.FC<StarLevelProps> = ({ 
  starLevel, 
  size = 'md',
  showLabel = true,
  showIcon = false
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center space-x-1">
      {showIcon ? (
        <span 
          className={`${iconSizeClasses[size]}`}
          style={{ color: starLevel.color }}
        >
          {starLevel.icon}
        </span>
      ) : (
        Array.from({ length: 7 }).map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < starLevel.starLevel 
                ? 'fill-current' 
                : 'text-gray-600'
            }`}
            style={{ 
              color: i < starLevel.starLevel ? starLevel.color : undefined 
            }}
          />
        ))
      )}
      {showLabel && (
        <span 
          className={`${textSizeClasses[size]} font-medium ml-2`}
          style={{ color: starLevel.color }}
        >
          {starLevel.title}
        </span>
      )}
    </div>
  );
};