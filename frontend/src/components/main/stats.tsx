'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal, Layers, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const StatsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!trackRef.current) return;
      gsap.fromTo(
        trackRef.current.children,
        {
          opacity: 0,
          y: 40,
          rotateX: -10,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      const targets = trackRef.current.querySelectorAll('.stat-number');
      targets.forEach((target) => {
        const endValue = parseInt(target.getAttribute('data-value') || '0', 10);
        
        gsap.fromTo(
          target,
          { textContent: '0' },
          {
            textContent: endValue,
            duration: 2,
            ease: 'power4.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: target,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            onUpdate: function () {
              const current = parseInt(target.textContent || '0', 10);
              target.textContent = current < 10 ? `0${current}` : `${current}`;
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      z: 15,
      scale: 1.015,
      force3D: true,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const shadow = e.currentTarget.querySelector('.premium-shadow');
    if (shadow) {
      gsap.to(shadow, { opacity: 1, duration: 0.3 });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      z: 0,
      scale: 1,
      force3D: true,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const shadow = e.currentTarget.querySelector('.premium-shadow');
    if (shadow) {
      gsap.to(shadow, { opacity: 0, duration: 0.3 });
    }
  };

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#0a0a0a] px-4 py-24 text-white relative z-20 [perspective:1200px]"
    >
      <div className="mx-auto max-w-6xl">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={14} className="text-emerald-400" />
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
                production_environment
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              От идеи до готового софта. <br />Внутри одной экосистемы.
            </h2>
          </div>
          <p className="max-w-xs text-sm text-slate-400 font-normal leading-relaxed">
            SoftDev объединяет внутренние запросы компании на разработку. Больше никакой бюрократии — только чистый код и результат.
          </p>
        </div>

        <div
          ref={trackRef}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 [transform-style:preserve-3d]"
        >
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-xl transition-colors duration-300 will-change-transform [transform-style:preserve-3d]"
          >
            <div className="premium-shadow absolute inset-0 -z-20 rounded-2xl bg-black/80 opacity-0 blur-2xl pointer-events-none transition-opacity duration-300 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]" />
            <div className="absolute top-0 left-8 h-[2px] w-16 bg-gradient-to-r from-amber-500 to-transparent" />
            
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 text-amber-400">
                  <Layers size={20} />
                </div>
                <span className="text-xs font-mono text-slate-600 group-hover:text-amber-500/50 transition-colors">STAGE_01</span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Архитектура и Смета</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Вы указываете платформу, дедлайн и целевую аудиторию. Система и ПМ мгновенно рассчитывают сложность и утверждают проект.
              </p>
            </div>

            <div className="mt-12 flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="stat-number text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent" data-value="1">
                  01
                </span>
                <span className="text-xs font-mono text-amber-500/70">/ на согласовании</span>
              </div>
              <ArrowRight size={18} className="text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-amber-400" />
            </div>
          </div>

          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-xl transition-colors duration-300 will-change-transform [transform-style:preserve-3d]"
          >
            <div className="premium-shadow absolute inset-0 -z-20 rounded-2xl bg-black/80 opacity-0 blur-2xl pointer-events-none transition-opacity duration-300 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]" />
            <div className="absolute top-0 left-8 h-[2px] w-16 bg-gradient-to-r from-blue-500 to-transparent" />
            
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="rounded-xl bg-blue-500/10 p-3 border border-blue-500/20 text-blue-400">
                  <Cpu size={20} />
                </div>
                <span className="text-xs font-mono text-slate-600 group-hover:text-blue-400/50 transition-colors">STAGE_02</span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Активная Разработка</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Команда приступает к реализации. Весь прогресс, от первых коммитов до сборки тестовых билдов, логируется внутри платформы.
              </p>
            </div>

            <div className="mt-12 flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="stat-number text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent" data-value="3">
                  03
                </span>
                <span className="text-xs font-mono text-blue-400/70">/ в разработке</span>
              </div>
              <ArrowRight size={18} className="text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
            </div>
          </div>

          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-xl transition-colors duration-300 will-change-transform [transform-style:preserve-3d]"
          >
            <div className="premium-shadow absolute inset-0 -z-20 rounded-2xl bg-black/80 opacity-0 blur-2xl pointer-events-none transition-opacity duration-300 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]" />
            <div className="absolute top-0 left-8 h-[2px] w-16 bg-gradient-to-r from-emerald-500 to-transparent" />
            
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-xs font-mono text-slate-600 group-hover:text-emerald-400/50 transition-colors">STAGE_03</span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Готовые Продукты</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Сервисы, которые уже прошли стадию релиза и успешно функционируют в инфраструктуре компании, решая реальные бизнес-задачи.
              </p>
            </div>

            <div className="mt-12 flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="stat-number text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-emerald-400 bg-clip-text text-transparent" data-value="12">
                  12
                </span>
                <span className="text-xs font-mono text-emerald-400/70">/ запущено</span>
              </div>
              <ArrowRight size={18} className="text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-400" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};