'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}

export function TypewriterText({
  text,
  className,
  speed = 35,
  delay = 0,
  cursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {cursor && !done && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: 'var(--accent-primary)',
            marginLeft: '2px',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }}
        />
      )}
    </span>
  );
}
