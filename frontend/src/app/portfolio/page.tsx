'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { projectService, ProjectResponse } from '@/api/project/projectServ';
import { 
  Briefcase, Loader2, Calendar, ExternalLink, ShieldCheck,
  Layers, Monitor, Code, Settings2, Search, ArrowLeft,
  X, Terminal, Cpu, CheckCircle2, Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap'; 

export default function PortfolioPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  
  const [completedProjects, setCompletedProjects] = useState<ProjectResponse[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push('/auth');
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      projectService.getProjects()
        .then((data) => {
          const released = data.filter(p => ['Завершен', 'Архивирован'].includes(p.status));
          setCompletedProjects(released);
          setFilteredProjects(released);
        })
        .catch((err) => console.error('Ошибка доступа к архиву релизов:', err))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') {
      setFilteredProjects(completedProjects);
    } else {
      const filtered = completedProjects.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.language?.name.toLowerCase().includes(query) ||
        p.software_type?.name.toLowerCase().includes(query)
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, completedProjects]);

  useEffect(() => {
    if (isLoading || filteredProjects.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.portfolio-card-animate',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [filteredProjects, isLoading]);

  useEffect(() => {
    if (selectedProject) {
      gsap.to(inspectorRef.current, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    } else {
      gsap.to(inspectorRef.current, { x: '100%', opacity: 0, duration: 0.3, ease: 'power3.in' });
    }
  }, [selectedProject]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-white font-mono text-xs gap-2">
        <Loader2 size={14} className="animate-spin text-purple-500" />
        <span className="tracking-widest uppercase font-bold text-slate-200">Дешифровка архива релизов...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main 
      ref={containerRef}
      className="relative flex min-h-screen w-full bg-[#030303] text-white p-4 md:p-8 font-mono overflow-x-hidden pt-24"
    >
      <div className="absolute inset-0 pointer-events-none  bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:5rem_5rem]" />

      <div className={`relative w-full transition-all pt-24 duration-500 space-y-6 ${selectedProject ? 'max-w-[calc(100%-440px)] pr-4 hidden xl:block' : 'max-w-7xl mx-auto'}`}>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <button 
              onClick={() => router.push('/projects')}
              className="flex items-center gap-1.5 text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-2 hover:text-purple-300 transition-colors group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              Назад в терминал
            </button>
            <div className="flex items-center gap-2 text-white text-xs uppercase tracking-widest mb-1 font-bold">
              <Award size={14} className="text-purple-400 animate-pulse" />
              <span className="text-purple-400">Deployed Solutions</span>
            </div>
            <h1 className="text-3xl font-extrabold uppercase tracking-wider text-white">Релизная Матрица</h1>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Фильтр по стеку или тегу..."
              className="w-full rounded-xl border border-white/[0.12] bg-[#0c0c0e] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500/80 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all font-bold"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-white/[0.005] rounded-2xl p-20 text-center">
            <Briefcase size={24} className="mx-auto text-slate-600 mb-3" />
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Архив пуст или ноды не соответствуют фильтру.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              const isSelected = selectedProject?.id === project.id;
              
              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(isSelected ? null : project)}
                  className={`portfolio-card-animate group relative border p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-2xl cursor-pointer ${
                    isSelected 
                      ? 'bg-purple-950/10 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
                      : 'border-white/[0.06] bg-[#09090b]/90 hover:bg-white/[0.02] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-xl pointer-events-none rounded-full group-hover:bg-purple-500/10 transition-colors" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono text-purple-400 font-extrabold tracking-widest uppercase flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-purple-400" />
                        PROD_RELEASE
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold">
                        #{project.id}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white uppercase tracking-wide truncate group-hover:text-purple-400 transition-colors mb-2">
                      {project.name}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 mb-5 font-sans leading-relaxed font-medium">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/60 border border-white/[0.04] mb-4 text-[10px] pl-3">
                      <div className="flex items-center gap-1.5"><Code size={11} className="text-purple-400" /><span className="truncate text-slate-200 font-bold">{project.language?.name || 'Core-Tech'}</span></div>
                      <div className="flex items-center gap-1.5"><Monitor size={11} className="text-emerald-400" /><span className="truncate text-slate-200 font-bold">{project.platform?.name || 'Web'}</span></div>
                      <div className="flex items-center gap-1.5"><Layers size={11} className="text-blue-400" /><span className="truncate text-slate-200 font-bold">{project.architecture?.name || 'Архитектура'}</span></div>
                      <div className="flex items-center gap-1.5"><Settings2 size={11} className="text-cyan-400" /><span className="truncate text-slate-200 font-bold">{project.software_type?.name || 'ПО'}</span></div>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span className="text-purple-300 font-extrabold font-mono text-xs uppercase tracking-wider">Успешно сдан</span>
                    <span className="flex items-center gap-1 text-slate-200"><Calendar size={11} className="text-slate-500" />{project.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div 
        ref={inspectorRef}
        className="fixed top-0 right-0 bottom-0 w-full xl:w-[440px] border-l border-white/[0.1] bg-[#050507]/99 backdrop-blur-3xl z-[100] shadow-[-20px_0_50px_rgba(0,0,0,0.9)] p-6 pt-24 flex flex-col justify-between transform translate-x-full opacity-0"
      >
        {selectedProject ? (
          <>
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-none pb-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-purple-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Case_Review_v1.0</span>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <div>
                <span className="text-[8px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 w-fit">
                  <ShieldCheck size={10} /> Проект закрыт заказчиком
                </span>
                <h2 className="text-xl font-black text-white uppercase tracking-wider mt-2 font-mono break-words">{selectedProject.name}</h2>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.06] bg-black/40 space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-400 block">Финальное ТЗ и результаты</span>
                <p className="text-xs text-slate-200 font-sans leading-relaxed font-medium break-words">{selectedProject.description}</p>
              </div>

              <div className="space-y-2.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Конфигурация релиза</span>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Главный стек:</span>
                    <span className="text-white font-bold">{selectedProject.language?.name || 'Н/Д'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Среда окружения:</span>
                    <span className="text-white font-bold">{selectedProject.platform?.name || 'Н/Д'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Архитектурный слой:</span>
                    <span className="text-blue-400 font-bold">{selectedProject.architecture?.name || 'Н/Д'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Тип решения:</span>
                    <span className="text-purple-400 font-bold">{selectedProject.software_type?.name || 'Н/Д'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Целевая аудитория (MAU):</span>
                    <span className="text-yellow-400 font-bold">{selectedProject.target_users_count?.toLocaleString() || '1,000+'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-black rounded-xl border border-white/[0.08] font-mono text-[10px] space-y-1 text-slate-400">
                <div className="text-purple-400 flex items-center gap-1"><Cpu size={10} /> [SYSTEM]: Нода переведена в статус архивного чтения</div>
                <div>&gt; Финальная стоимость: <span className="text-emerald-400 font-bold">{selectedProject.price.toLocaleString()} RUB</span></div>
                <div>&gt; Дата деплоя: {selectedProject.deadline}</div>
                <div>&gt; Целостность кода: 100% (Тесты пройдены)</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] bg-[#050507]">
              {selectedProject.links?.[0]?.url ? (
                <a 
                  href={selectedProject.links[0].url} target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs uppercase font-extrabold tracking-wider rounded-xl border border-purple-400/30 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                >
                  <ExternalLink size={13} />
                  <span>Посмотреть Production</span>
                </a>
              ) : (
                <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest py-3 bg-white/[0.01] border border-white/[0.04] rounded-xl font-bold">
                  NDA ограничение / Ссылка не предоставлена
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}