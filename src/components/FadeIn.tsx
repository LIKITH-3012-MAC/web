import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: keyof typeof motion;
  className?: string;
}

export default function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div', className = '' }: FadeInProps) {
  const MotionComponent = motion.create(as as any) as React.ComponentType<HTMLMotionProps<any> & { children?: React.ReactNode }>;
  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
