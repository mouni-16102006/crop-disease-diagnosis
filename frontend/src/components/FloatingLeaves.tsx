import React, { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  x: number; // percentage width
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export const FloatingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate static details for 12 leaves
    const tempLeaves: Leaf[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 20 + 10, // 10px to 30px
      duration: Math.random() * 15 + 15, // 15s to 30s fall time
      delay: Math.random() * -20, // negative delay so leaves appear immediately scattered
      rotation: Math.random() * 360,
    }));
    setLeaves(tempLeaves);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          className="absolute opacity-20"
          style={{
            left: `${leaf.x}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            top: `-50px`,
            transform: `rotate(${leaf.rotation}deg)`,
            animation: `leaf-fall-${leaf.id % 3} ${leaf.duration}s linear infinite`,
            animationDelay: `${leaf.delay}s`,
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M2 22C2 22 6 18 12 17C18 16 22 10 22 2C22 2 14 2 10 7C6 12 2 22 2 22Z"
            fill="rgba(16, 185, 129, 0.6)"
            stroke="rgba(4, 120, 87, 0.8)"
            strokeWidth="1.5"
          />
          <path d="M2 22C10 18 16 12 22 2" stroke="rgba(4, 120, 87, 0.8)" strokeWidth="1" />
        </svg>
      ))}
      <style>{`
        @keyframes leaf-fall-0 {
          0% { top: -50px; margin-left: 0px; transform: rotate(0deg); }
          50% { margin-left: 50px; }
          100% { top: 105vh; margin-left: -50px; transform: rotate(360deg); }
        }
        @keyframes leaf-fall-1 {
          0% { top: -50px; margin-left: 20px; transform: rotate(45deg) scaleX(-1); }
          50% { margin-left: -40px; }
          100% { top: 105vh; margin-left: 40px; transform: rotate(-315deg) scaleX(-1); }
        }
        @keyframes leaf-fall-2 {
          0% { top: -50px; margin-left: -10px; transform: rotate(90deg); }
          30% { margin-left: 30px; }
          70% { margin-left: -30px; }
          100% { top: 105vh; margin-left: 10px; transform: rotate(450deg); }
        }
      `}</style>
    </div>
  );
};

export default FloatingLeaves;
