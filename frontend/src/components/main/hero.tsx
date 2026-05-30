'use client';

import React, { useRef } from 'react';
import { PlusSquare, FolderGit2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '../ui/button';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {

    gsap.fromTo(
      bgGlowRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.15, scale: 1, duration: 2, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.hero-anim-item',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2,
      }
    );
  }, { scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bgGlowRef.current) return;
    
    const { clientX, clientY } = e;
    const targetX = clientX - window.innerWidth / 2;
    const targetY = clientY - window.innerHeight / 2;

    gsap.to(bgGlowRef.current, {
      x: targetX * 0.08,
      y: targetY * 0.08,
      duration: 1,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 pt-24 text-white"
    >

      <div
        ref={bgGlowRef}
        className="absolute pointer-events-none h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 opacity-0 blur-[130px]"
        style={{ top: '15%', left: '35%' }}
      />

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="relative z-10 max-w-4xl text-center">
        
        <div className="hero-anim-item inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-md mb-6 opacity-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Внутренняя платформа SoftDev
        </div>

        <h1 className="hero-anim-item bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl opacity-0">
          Автоматизация и ПО <br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text">
            в один клик
          </span>
        </h1>

        <p className="hero-anim-item mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg md:text-xl opacity-0">
          Создавайте технические заявки, выбирайте стек и архитектуру, 
          отслеживайте этапы разработки и управляйте артефактами проекта прямо внутри организации.
        </p>

        <div className="hero-anim-item mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row opacity-0">
          <Button 
            variant="primary" 
            icon={PlusSquare} 
            animateIcon="rotate"
          >
            Создать проект
          </Button>

          <Button 
            variant="glass" 
            icon={FolderGit2} 
            iconPosition="right" 
            animateIcon="shift"
          >
            Мои заявки
          </Button>
        </div>

      </div>
    </section>
  );
};