import React, { useEffect, useState } from 'react';

export const MouseGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="mouse-glow-bg fixed hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};

export default MouseGlow;
