import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Distance from mouse to center
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      
      // Active radius (half size of element + padding)
      const threshold = Math.max(rect.width, rect.height) / 2 + padding;

      if (dist < threshold) {
        setIsActive(true);
        // Translate3d transform divided by strength factor
        setTransform(`translate3d(${distX / strength}px, ${distY / strength}px, 0)`);
      } else {
        if (isActive) {
          setIsActive(false);
          setTransform('translate3d(0, 0, 0)');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, strength, isActive]);

  return (
    <div
      ref={ref}
      style={{
        transform,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}
