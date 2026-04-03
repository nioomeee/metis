'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      setIsVisible(true);
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    const lerp = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        const size = isHoveringCTA ? 48 : 24;
        const offset = size / 2;
        ringRef.current.style.transform = `translate(${ring.current.x - offset}px, ${ring.current.y - offset}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
      }
      rafId.current = requestAnimationFrame(lerp);
    };

    const onEnterCTA = () => setIsHoveringCTA(true);
    const onLeaveCTA = () => setIsHoveringCTA(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    const ctaEls = document.querySelectorAll('a, button, [data-cursor="expand"]');
    ctaEls.forEach((el) => {
      el.addEventListener('mouseenter', onEnterCTA);
      el.addEventListener('mouseleave', onLeaveCTA);
    });

    rafId.current = requestAnimationFrame(lerp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      ctaEls.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterCTA);
        el.removeEventListener('mouseleave', onLeaveCTA);
      });
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isHoveringCTA]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Inner dot */}
          <div
            ref={dotRef}
            className="cursor-dot"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              pointerEvents: 'none',
              zIndex: 9999,
              transition: 'opacity 0.2s',
            }}
          />
          {/* Outer ring */}
          <div
            ref={ringRef}
            className="cursor-ring"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '1.5px solid var(--accent-primary)',
              pointerEvents: 'none',
              zIndex: 9998,
              opacity: 0.6,
              transition: 'width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
