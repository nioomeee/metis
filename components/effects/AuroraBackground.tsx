'use client';

import React, { useEffect, useRef } from 'react';

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let animationFrameId: number;
    let mouse = { x: width / 2, y: height / 2 };
    let targetMouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    class Ribbon {
      color: string;
      offsetX: number;
      offsetY: number;
      points: { x: number; y: number }[];
      yPhase: number;
      xPhase: number;
      speed: number;
      width: number;

      constructor(color: string, speed: number, width: number) {
        this.color = color;
        this.speed = speed;
        this.width = width;
        this.offsetX = Math.random() * width;
        this.offsetY = Math.random() * height;
        this.yPhase = Math.random() * Math.PI * 2;
        this.xPhase = Math.random() * Math.PI * 2;
        this.points = [];
      }

      update(time: number, mx: number, my: number) {
        this.yPhase += this.speed;
        this.xPhase += this.speed * 0.8;
      }

      draw(ctx: CanvasRenderingContext2D, time: number, mx: number, my: number) {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        
        // Complex bezier curves influenced by mouse
        const p1x = width * 0.25 + Math.sin(time * this.speed * 0.5 + this.xPhase) * 200 + (mx - width/2) * 0.2;
        const p1y = height * 0.5 + Math.cos(time * this.speed * 0.7 + this.yPhase) * 200 + (my - height/2) * 0.2;
        
        const p2x = width * 0.75 + Math.sin(time * this.speed * 0.6 + this.xPhase) * 200 + (mx - width/2) * 0.3;
        const p2y = height * 0.5 + Math.cos(time * this.speed * 0.4 + this.yPhase) * 200 + (my - height/2) * 0.3;

        ctx.bezierCurveTo(p1x, p1y, p2x, p2y, width, height / 2 + Math.sin(time * this.speed) * 100);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    const ribbons = [
      new Ribbon('rgba(123, 110, 246, 0.15)', 0.001, 80),
      new Ribbon('rgba(76, 201, 240, 0.12)', 0.0015, 120),
      new Ribbon('rgba(247, 37, 133, 0.1)', 0.0008, 100),
      new Ribbon('rgba(123, 110, 246, 0.08)', 0.002, 160),
      new Ribbon('rgba(76, 201, 240, 0.05)', 0.0012, 140)
    ];

    let time = 0;

    const render = () => {
      time += 16; // approx ms per frame
      
      // Lerp mouse
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Clear with slight trailing effect or just clear
      ctx.clearRect(0, 0, width, height);
      
      // Global composition for blending
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(30px)';

      ribbons.forEach(ribbon => {
        ribbon.update(time, mouse.x, mouse.y);
        ribbon.draw(ctx, time, mouse.x, mouse.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-surface-dim">
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
    </div>
  );
}
