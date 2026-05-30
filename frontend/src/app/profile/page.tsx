'use client';

import React, { useEffect, useRef, useState } from 'react';
import { projectService, ProjectResponse } from '@/api/project/projectServ';
import { 
  User, Shield, Terminal, LogOut, Loader2, 
  Cpu, Activity, Radio, HardDrive, LayoutDashboard, Settings,
  FolderCode, Plus, Calendar, ExternalLink, Wrench
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CreateProjectModal } from '@/components/profile/createProjectModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';
import { getStatusStyles } from '@/utils/status';

type TabType = 'console' | 'config';

// Массив доступных статусов для админки
const AVAILABLE_STATUSES = [
  'Создан', 
  'На рассмотрении', 
  'Одобрен', 
  'Разработка', 
  'Тестирование', 
  'Ожидание оплаты', 
  'Завершен', 
  'Отклонен'
];

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const router = useRouter();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('console');
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = () => {
    projectService.getProjects()
      .then((data) => {
        if (user?.role === 'admin') {
          setProjects(data);
        } else if (user) {
          const currentUserId = user.id;
          const userProjects = data.filter((project: any) => {
            return project.client && String(project.client.id) === String(currentUserId);
          });
          setProjects(userProjects);
        }
      })
      .catch((err) => console.error('Ошибка пула проектов:', err))
      .finally(() => setIsProjectsLoading(false));
  };

  const handleStatusChange = async (projectId: number, newStatus: string) => {
    const currentProject = projects.find(p => p.id === projectId);
    if (!currentProject) return;

    try {
      const payload = {
        name: currentProject.name,
        description: currentProject.description,
        price: currentProject.price,
        deadline: currentProject.deadline,
        target_users_count: currentProject.target_users_count || 0,
        language_id: currentProject.language?.id,
        platform_id: currentProject.platform?.id,
        architecture_id: currentProject.architecture?.id,
        software_type_id: currentProject.software_type?.id,
        links: currentProject.links || [],
        status: newStatus 
      };

    //   await projectService.updateProject(projectId, payload);
      
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    } catch (err: any) {
      console.error('Сбой обновления ноды проекта:', err);
      if (err.response?.data) {
        console.log('Детали ошибки FastAPI:', err.response.data);
      }
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) router.push('/auth');
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  useGSAP(() => {
    gsap.fromTo(
      '.tab-content-animate',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );
  }, { scope: containerRef, dependencies: [activeTab] });

  if (isAuthLoading || isProjectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-slate-400 font-mono text-xs gap-2">
        <Loader2 size={14} className="animate-spin text-blue-500" />
        <span className="tracking-widest uppercase">Чтение системных секторов...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main 
      ref={containerRef}
      className="relative flex min-h-screen w-full bg-[#030303] text-white p-4 md:p-8 font-mono overflow-x-hidden"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className={`absolute top-1/4 right-1/4 pointer-events-none h-[500px] w-[500px] rounded-full blur-[160px] transition-colors duration-1000 ${
        user.role === 'admin' ? 'bg-emerald-500/[0.015]' : 'bg-blue-500/[0.015]'
      }`} />

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-4 md:mt-12">
        
        <section className="border border-white/[0.04] bg-[#09090b]/40 rounded-2xl p-5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.04]">
            <div className={`p-2 rounded-xl border ${user.role === 'admin' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-blue-500/5 border-blue-500/10 text-blue-400'}`}>
              <Cpu size={18} className="animate-pulse" />
            </div>
            <div className="truncate">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 truncate">{user.username}</h2>
              <span className={`text-[9px] uppercase tracking-widest font-bold ${user.role === 'admin' ? 'text-emerald-500' : 'text-blue-500'}`}>
                node // {user.role}
              </span>
            </div>
          </div>

          <nav className="space-y-1 mb-6">
            <button 
              onClick={() => setActiveTab('console')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                activeTab === 'console' 
                  ? 'bg-white/[0.02] border-white/[0.06] text-white' 
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutDashboard size={14} className={activeTab === 'console' ? (user.role === 'admin' ? 'text-emerald-400' : 'text-blue-400') : ''} />
              <span>Главная консоль</span>
            </button>
            
            {user.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('config')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                  activeTab === 'config' 
                    ? 'bg-white/[0.02] border-white/[0.06] text-white' 
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <Settings size={14} className={activeTab === 'config' ? 'text-emerald-400' : ''} />
                <span>Конфигурация</span>
              </button>
            )}
          </nav>

          <Button 
            variant="glass" 
            icon={LogOut} 
            iconPosition="left"
            animateIcon="shift"
            onClick={logout}
            className="w-full text-[10px] tracking-wider uppercase hover:border-red-500/20 hover:bg-red-500/[0.01] hover:text-red-400 py-2"
          >
            Выйти из системы
          </Button>
        </section>

        <div className="lg:col-span-3 space-y-6 tab-content-animate">
          
          {activeTab === 'console' || user.role !== 'admin' ? (
            <>
              <section className="border border-white/[0.04] bg-[#09090b]/40 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r ${user.role === 'admin' ? 'from-emerald-500/30 via-transparent' : 'from-blue-500/30 via-transparent'}`} />
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Архив параметров</h3>
                  <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-0.5">Оперативные данные текущей сессии</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-600 text-[9px] block uppercase tracking-widest mb-1">Идентификатор</span>
                      <span className="text-xs font-bold text-slate-300">{user.username}</span>
                    </div>
                    <User size={15} className="text-slate-700" />
                  </div>

                  <div className="bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-600 text-[9px] block uppercase tracking-widest mb-1">Уровень привилегий</span>
                      <span className={`text-xs font-bold uppercase ${user.role === 'admin' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {user.role}
                      </span>
                    </div>
                    {user.role === 'admin' ? <Shield size={15} className="text-emerald-600/50" /> : <Terminal size={15} className="text-blue-600/50" />}
                  </div>
                </div>
              </section>

              <section className="border border-white/[0.04] bg-[#09090b]/40 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5 flex items-center gap-2">
                  <FolderCode size={14} className={user.role === 'admin' ? 'text-emerald-500' : 'text-blue-500'} />
                  <span>
                    {user.role === 'admin' ? 'Активный пул проектов' : 'Мои заказы'} ({projects.length})
                  </span>
                </h3>

                {projects.length === 0 ? (
                  <div className="border border-dashed border-white/5 bg-white/[0.005] rounded-xl p-8 text-center">
                    <p className="text-xs text-slate-600 uppercase tracking-widest">У вас пока нет заказанных проектов.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => {
                      const statusClass = getStatusStyles(project.status);
                      const isAdmin = user.role === 'admin';

                      return (
                        <div 
                          key={project.id} 
                          className="group relative border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.07] p-4 rounded-xl flex flex-col justify-between transition-all duration-300 overflow-hidden"
                        >
                          <div className={`absolute top-0 left-0 bottom-0 w-[2px] opacity-40 transition-opacity group-hover:opacity-100 ${
                            project.status === 'Отклонен' ? 'bg-red-500' :
                            project.status === 'Разработка' || project.status === 'Одобрен' ? 'bg-emerald-500' :
                            ['На рассмотрении', 'Тестирование', 'Ожидание оплаты'].includes(project.status) ? 'bg-amber-500' :
                            project.status === 'Завершен' ? 'bg-purple-500' : 'bg-blue-500'
                          }`} />

                          <div className="pl-1">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide group-hover:text-white transition-colors truncate max-w-[60%]">
                                {project.name}
                              </h4>
                              
                              {isAdmin ? (
                                <select
                                  value={project.status || 'Создан'}
                                  onChange={(e) => handleStatusChange(project.id, e.target.value)}
                                  className={`text-[9px] font-bold uppercase px-1 py-0.5 rounded border bg-[#0c0c0e] outline-none cursor-pointer tracking-wider transition-all ${statusClass}`}
                                >
                                  {AVAILABLE_STATUSES.map(status => (
                                    <option key={status} value={status} className="bg-[#09090b] text-slate-300">
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border tracking-wider transition-all ${statusClass}`}>
                                  {project.status || 'Системный'}
                                </span>
                              )}

                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 font-sans leading-relaxed">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {project.language?.name && (
                                <span className="bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded text-[9px] text-slate-400">
                                  {project.language.name}
                                </span>
                              )}
                              {project.platform?.name && (
                                <span className="bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded text-[9px] text-slate-400">
                                  {project.platform.name}
                                </span>
                              )}
                              {project.architecture?.name && (
                                <span className="bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded text-[9px] text-slate-500 font-mono">
                                  arc:{project.architecture.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between text-[10px] text-slate-500 pl-1">
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-400 font-bold tracking-wide">
                                {project.price.toLocaleString()} RUB
                              </span>
                              <span className="flex items-center gap-1 opacity-70">
                                <Calendar size={10} />
                                {project.deadline}
                              </span>
                            </div>
                            
                            {project.links?.[0]?.url && (
                              <a 
                                href={project.links[0].url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="hover:text-white flex items-center gap-1 transition-colors group/link"
                              >
                                <span className="text-[9px] text-slate-600 group-hover/link:text-slate-300 transition-colors">src</span>
                                <ExternalLink size={8} className="text-slate-600 group-hover/link:text-slate-300" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className="border border-white/[0.04] bg-[#09090b]/40 rounded-2xl p-6 backdrop-blur-xl min-h-[300px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-emerald-500/30 via-transparent" />
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                  <Wrench size={14} className="text-emerald-400" />
                  <span>Панель configuration среды</span>
                </h3>
                <p className="text-[11px] text-slate-500 max-w-xl leading-relaxed">
                  Добро пожаловать в центр управления ядром. Здесь вам доступны расширенные инженерные инструменты развертывания репозиториев, менеджмент токенов среды и создание новых проектов.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.03] flex justify-start">
                <Button 
                  variant="primary" 
                  icon={Plus} 
                  iconPosition="left" 
                  animateIcon="rotate"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-300 font-bold text-[10px] uppercase py-2 px-4 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.1)]"
                >
                  Развернуть новый проект
                </Button>
              </div>
            </section>
          )}

          <section className="border border-white/[0.04] bg-[#09090b]/40 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Activity size={12} className="text-slate-500" />
              <span>Статус подключения ноды</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-[11px]">
              <div className="border border-white/[0.03] bg-white/[0.01] p-3 rounded-xl">
                <span className="text-slate-600 block text-[9px] uppercase tracking-wider mb-1">База данных</span>
                <span className="text-emerald-500 flex items-center gap-1.5 font-bold"><span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />ONLINE</span>
              </div>
              <div className="border border-white/[0.03] bg-white/[0.01] p-3 rounded-xl">
                <span className="text-slate-600 block text-[9px] uppercase tracking-wider mb-1">Защита сессии</span>
                <span className="text-blue-400 font-bold flex items-center gap-1.5"><HardDrive size={10} />JWT ACTIVE</span>
              </div>
              <div className="border border-white/[0.03] bg-white/[0.01] p-3 rounded-xl col-span-2 md:col-span-1">
                <span className="text-slate-600 block text-[9px] uppercase tracking-wider mb-1">Пинг ядра</span>
                <span className="text-slate-300 font-bold">0.03 ms</span>
              </div>
            </div>
          </section>

        </div>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects} 
      />
    </main>
  );
}
