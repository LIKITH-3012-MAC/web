import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedText({ text, className = '', style = {} }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  // To count characters globally across words so the scroll progress matches their absolute index
  const words = text.split(' ');
  let charCounter = 0;
  const totalChars = text.length;

  return (
    <p ref={ref} className={className} style={{ ...style, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {wordChars.map((char) => {
              const globalIdx = charCounter++;
              return (
                <CharSpan
                  key={globalIdx}
                  char={char}
                  index={globalIdx}
                  total={totalChars}
                  progress={scrollYProgress}
                />
              );
            })}
          </span>
        );
      })}
    </p>
  );
}

function CharSpan({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char}
    </motion.span>
  );
}
