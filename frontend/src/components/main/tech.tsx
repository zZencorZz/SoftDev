'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layers, Terminal, Monitor, Server, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TechSpecs: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('Web-приложение');
  const [selectedLang, setSelectedLang] = useState('TypeScript / Next.js');
  const [selectedArch, setSelectedArch] = useState('Монолит (Fast Delivery)');

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (optionsRef.current) {
        gsap.fromTo(
          optionsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: optionsRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      gsap.fromTo(
        previewRef.current,
        { 
          opacity: 0, 
          x: 40, 
          rotateY: 15,
          scale: 0.95 
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power4.out',
          force3D: true, 
          scrollTrigger: {
            trigger: previewRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!previewRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.preview-line',
        { opacity: 0.3, x: -5 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [selectedPlatform, selectedLang, selectedArch]);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-[#0a0a0a] px-4 py-24 text-white relative z-20 [perspective:1200px]"
    >
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-16 text-center md:text-left opacity-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <Layers size={14} className="text-blue-400" />
            <span className="text-xs font-mono tracking-widest text-blue-400 uppercase">
              flexible_configuration
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Конструктор под любые задачи
          </h2>
          <p className="mt-2 text-slate-400 max-w-xl">
            Никаких шаблонов. Вы сами определяете входные параметры системы, а наша команда собирает продукт строго под ваши метрики.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          <div ref={optionsRef} className="space-y-8 lg:col-span-7">
            <div className="opacity-0">
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
                01 // Выберите целевую платформу
              </label>
              <div className="flex flex-wrap gap-3">
                {['Web-приложение', 'Desktop (Windows/macOS)', 'Мобильный софт', 'Telegram бот / IoT'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedPlatform(item)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 active:scale-95 ${
                      selectedPlatform === item
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="opacity-0">
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
                02 // Основной технологический стек
              </label>
              <div className="flex flex-wrap gap-3">
                {['TypeScript / Next.js', 'Python / FastAPI', 'Fullstack решение', 'Go / Highload'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedLang(item)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 active:scale-95 ${
                      selectedLang === item
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="opacity-0">
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
                03 // Архитектурное решение
              </label>
              <div className="flex flex-wrap gap-3">
                {['Монолит (Fast Delivery)', 'Микросервисы', 'Serverless структура'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedArch(item)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 active:scale-95 ${
                      selectedArch === item
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 w-full [transform-style:preserve-3d]">
            <div
              ref={previewRef}
              className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-2xl shadow-2xl opacity-0 will-change-transform"
            >

              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500/70" />
                  <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">manifest.json</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                
                <div className="preview-line flex items-start gap-3 p-3 rounded-lg bg-white/[0.01] border border-white/[0.02]">
                  <Monitor size={16} className="text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase">Target Platform</p>
                    <p className="text-slate-200 font-medium mt-0.5">{selectedPlatform}</p>
                  </div>
                </div>

                <div className="preview-line flex items-start gap-3 p-3 rounded-lg bg-white/[0.01] border border-white/[0.02]">
                  <Terminal size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase">Core Engine / Lang</p>
                    <p className="text-slate-200 font-medium mt-0.5">{selectedLang}</p>
                  </div>
                </div>

                <div className="preview-line flex items-start gap-3 p-3 rounded-lg bg-white/[0.01] border border-white/[0.02]">
                  <Server size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase">System Architecture</p>
                    <p className="text-slate-200 font-medium mt-0.5">{selectedArch}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 mt-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5"><Users size={12} /> Объем юзеров:</span>
                    <span className="text-slate-200">Динамический таргет</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> Контроль дедлайна:</span>
                    <span className="text-slate-200">Через кабинет ПМ</span>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2 text-emerald-400 text-[11px]">
                  <CheckCircle2 size={14} />
                  <span>Готов к автоматической генерации ТЗ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};