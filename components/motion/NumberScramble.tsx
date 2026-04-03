'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS = '0123456789ABCDEF';

interface NumberScrambleProps {
  value: string | number;
  className?: string;
  duration?: number;
}

export function NumberScramble({ value, className, duration = 800 }: NumberScrambleProps) {
  const [display, setDisplay] = useState(String(value));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetRef = useRef(String(value));
  const iterationsRef = useRef(0);

  useEffect(() => {
    targetRef.current = String(value);
    iterationsRef.current = 0;
    const target = String(value);
    const maxIter = Math.ceil(duration / 40);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      iterationsRef.current += 1;
      const progress = iterationsRef.current / maxIter;

      setDisplay(
        target
          .split('')
          .map((char, i) => {
            if (i < Math.floor(progress * target.length)) return char;
            if (char === ' ' || char === '.' || char === ',' || char === '$' || char === '%' || char === '+' || char === '-') return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iterationsRef.current >= maxIter) {
        setDisplay(target);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [value, duration]);

  return <span className={`font-mono-numbers ${className}`}>{display}</span>;
}
