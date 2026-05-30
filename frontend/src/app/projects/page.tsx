'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { projectService, ProjectResponse, LookupItem } from '@/api/project/projectServ';

import { CreateProjectModal } from '@/components/profile/createProjectModal';
import { 
  FolderCode, Loader2, Calendar, DollarSign, ExternalLink, 
  Layers, Monitor, Code, Settings2, Search, SlidersHorizontal, 
  BarChart3, Sparkles, Briefcase, X, Terminal, Cpu, ChevronDown,
  Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getStatusStyles } from '@/utils/status';

const ALL_STATUSES = [
  'Все', 'Создан', 'На рассмотрении', 'Одобрен', 'Разработка', 
  'Тестирование', 'Завершен', 'Приостановлен', 'Архивирован'
];

interface FakeMessage {
  id: number;
  sender: 'user' | 'dev';
  text: string;
  timestamp: string;
}

export default function ProjectsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Все');
  const [selectedPlatform, setSelectedPlatform] = useState('Все');
  const [selectedSoftwareType, setSelectedSoftwareType] = useState('Все');
  const [languages, setLanguages] = useState<LookupItem[]>([]);
  const [platforms, setPlatforms] = useState<LookupItem[]>([]);
  const [softwareTypes, setSoftwareTypes] = useState<LookupItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'lang' | 'plat' | 'soft' | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<number, FakeMessage[]>>({});
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) router.push('/auth');
  }, [isAuthLoading, user, router]);

  const fetchProjects = () => {
    setIsProjectsLoading(true);
    projectService.getProjects()
      .then((data) => {
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch((err) => console.error('Ошибка чтения репозитория проектов:', err))
      .finally(() => setIsProjectsLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      setChatMessages({
        14: [
          { id: 1, sender: 'dev', text: 'Архитектура ядра развернута. Жду аппрува ТЗ от аналитиков.', timestamp: '14:22' },
          { id: 2, sender: 'user', text: 'Принял. Постараемся согласовать до конца дня.', timestamp: '14:35' }
        ]
      });

      Promise.all([
        projectService.getLanguages(),
        projectService.getPlatforms(),
        projectService.getSoftwareTypes()
      ])
        .then(([langs, plats, types]) => {
          setLanguages(langs);
          setPlatforms(plats);
          setSoftwareTypes(types);
        })
        .catch(err => console.error('Ошибка чтения метаданных фильтров:', err));
    }
  }, [user]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedProject]);


  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);


  useEffect(() => {
    let result = projects;

    if (selectedStatus === 'Все') {
      result = result.filter(p => p.status !== 'Завершен' && p.status !== 'Архивирован');
    } else {
      result = result.filter(p => p.status === selectedStatus);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (selectedLanguage !== 'Все') {
      result = result.filter(p => p.language?.name === selectedLanguage);
    }

    if (selectedPlatform !== 'Все') {
      result = result.filter(p => p.platform?.name === selectedPlatform);
    }

    if (selectedSoftwareType !== 'Все') {
      result = result.filter(p => p.software_type?.name === selectedSoftwareType);
    }

    setFilteredProjects(result);
  }, [selectedStatus, searchQuery, selectedLanguage, selectedPlatform, selectedSoftwareType, projects]);

  useGSAP(() => {
    if (!isProjectsLoading && filteredProjects.length > 0) {
      gsap.fromTo(
        '.project-card-animate',
        { opacity: 0, scale: 0.97, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, { scope: containerRef, dependencies: [filteredProjects, isProjectsLoading] });

  useGSAP(() => {
    if (selectedProject) {
      gsap.to(inspectorRef.current, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    } else {
      gsap.to(inspectorRef.current, { x: '100%', opacity: 0, duration: 0.3, ease: 'power3.in' });
    }
  }, [selectedProject]);


  const handleSendFakeMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProject) return;

    const projectId = selectedProject.id;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: FakeMessage = {
      id: Date.now(),
      sender: 'user',
      text: newMessage.trim(),
      timestamp: timeString
    };

    setChatMessages(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), userMsg]
    }));
    setNewMessage('');

    setTimeout(() => {
      const devAnswers = [
        'Запрос логирован. Изменения внесены в дев-ветку.',
        'Понял тебя. Проверяю архитектурные линтеры.',
        'Пуллреквест на ревью. Статус обновится после деплоя.',
        'Принято в работу. Код-ревьюер уже смотрит коммиты.'
      ];
      const randomAnswer = devAnswers[Math.floor(Math.random() * devAnswers.length)];

      const devMsg: FakeMessage = {
        id: Date.now() + 1,
        sender: 'dev',
        text: `[Dev-Response]: ${randomAnswer}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), devMsg]
      }));
    }, 1200);
  };

  const activeBujdet = projects
    .filter(p => p.status !== 'Завершен' && p.status !== 'Архивирован')
    .reduce((acc, curr) => acc + (curr.price || 0), 0);
    
  const productionCount = projects.filter(p => ['Разработка', 'Тестирование'].includes(p.status)).length;
  const portfolioCount = projects.filter(p => ['Завершен', 'Архивирован'].includes(p.status)).length;

  if (isAuthLoading || isProjectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-white font-mono text-xs gap-2">
        <Loader2 size={14} className="animate-spin text-blue-500" />
        <span className="tracking-widest uppercase font-bold text-slate-200">Считывание матрицы тасков...</span>
      </div>
    );
  }

  if (!user) return null;

  const currentNodeMessages = selectedProject ? (chatMessages[selectedProject.id] || []) : [];

  return (
    <main 
      ref={containerRef}
      className="relative flex min-h-screen w-full bg-[#030303] text-white p-4 md:p-8 font-mono overflow-x-hidden pt-24"
    >
      <div className="absolute inset-0  pointer-events-none bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className={`relative w-full transition-all duration-500 space-y-6 ${selectedProject ? 'max-w-[calc(100%-440px)] pr-4 hidden xl:block' : 'max-w-7xl mx-auto'}`}>
        
        <div className="flex flex-col pt-24 lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 text-white text-xs uppercase tracking-widest mb-1 font-bold">
              <FolderCode size={14} className="text-blue-400 animate-pulse" />
              <span className="text-blue-400">Production Pipeline</span>
            </div>
            <h1 className="text-3xl font-extrabold uppercase tracking-wider text-white">Терминал Разработки</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по ТЗ или ноде..."
                className="w-full rounded-xl border border-white/[0.15] bg-[#0c0c0e] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500/80 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-bold"
              />
            </div>

            {user?.role !== 'admin' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border border-blue-400/50 shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all transform active:scale-95 shrink-0"
              >
                <Sparkles size={13} className="text-cyan-200" />
                <span>Заказать проект</span>
              </button>
            )}
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-white/[0.04] bg-[#09090b]/20 p-3 rounded-2xl backdrop-blur-md z-30 relative">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'lang' ? null : 'lang'); }}
              className="w-full flex items-center justify-between bg-[#09090b] border border-white/[0.08] hover:border-white/[0.2] rounded-xl px-4 py-3 text-xs font-bold text-slate-200 transition-all text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Code size={14} className="text-blue-400 shrink-0" />
                <span className="truncate">{selectedLanguage === 'Все' ? 'Все Языки' : selectedLanguage}</span>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${openDropdown === 'lang' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'lang' && (
              <div className="absolute left-0 right-0 mt-2 bg-[#09090b]/95 border border-white/[0.1] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl z-50 max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => { setSelectedLanguage('Все'); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedLanguage === 'Все' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
                >
                  Все Языки
                </button>
                {languages.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedLanguage(item.name); setOpenDropdown(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedLanguage === item.name ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'plat' ? null : 'plat'); }}
              className="w-full flex items-center justify-between bg-[#09090b] border border-white/[0.08] hover:border-white/[0.2] rounded-xl px-4 py-3 text-xs font-bold text-slate-200 transition-all text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Monitor size={14} className="text-emerald-400 shrink-0" />
                <span className="truncate">{selectedPlatform === 'Все' ? 'Все Платформы' : selectedPlatform}</span>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${openDropdown === 'plat' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'plat' && (
              <div className="absolute left-0 right-0 mt-2 bg-[#09090b]/95 border border-white/[0.1] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl z-50 max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => { setSelectedPlatform('Все'); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedPlatform === 'Все' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
                >
                  Все Платформы
                </button>
                {platforms.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedPlatform(item.name); setOpenDropdown(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedPlatform === item.name ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'soft' ? null : 'soft'); }}
              className="w-full flex items-center justify-between bg-[#09090b] border border-white/[0.08] hover:border-white/[0.2] rounded-xl px-4 py-3 text-xs font-bold text-slate-200 transition-all text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Settings2 size={14} className="text-purple-400 shrink-0" />
                <span className="truncate">{selectedSoftwareType === 'Все' ? 'Все Типы ПО' : selectedSoftwareType}</span>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${openDropdown === 'soft' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'soft' && (
              <div className="absolute left-0 right-0 mt-2 bg-[#09090b]/95 border border-white/[0.1] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl z-50 max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => { setSelectedSoftwareType('Все'); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedSoftwareType === 'Все' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
                >
                  Все Типы ПО
                </button>
                {softwareTypes.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedSoftwareType(item.name); setOpenDropdown(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedSoftwareType === item.name ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-white/[0.08] bg-[#09090b]/50 p-4 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="border border-white/[0.04] bg-white/[0.01] p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-slate-300 block text-[9px] uppercase tracking-wider font-extrabold mb-0.5">Бюджет в производстве</span>
              <span className="text-lg font-bold text-emerald-400 font-mono tracking-wide">{activeBujdet.toLocaleString()} RUB</span>
            </div>
            <DollarSign size={18} className="text-emerald-400/40" />
          </div>
          <div className="border border-white/[0.04] bg-white/[0.01] p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-slate-300 block text-[9px] uppercase tracking-wider font-extrabold mb-0.5">Активные билды кодинга</span>
              <span className="text-lg font-bold text-blue-400 font-mono tracking-wide">{productionCount} процессов</span>
            </div>
            <BarChart3 size={18} className="text-blue-400/40" />
          </div>
          <div className="border border-white/[0.06] bg-purple-500/[0.02] p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/[0.04] transition-all group" onClick={() => router.push('/portfolio')}>
            <div>
              <span className="text-purple-400 block text-[9px] uppercase tracking-widest font-black mb-0.5 flex items-center gap-1">
                <Briefcase size={10} /> Готовых релизов
              </span>
              <span className="text-lg font-bold text-purple-300 group-hover:text-purple-100 transition-colors font-mono">{portfolioCount} кейсов →</span>
            </div>
            <SlidersHorizontal size={18} className="text-purple-400/30 group-hover:rotate-90 transition-transform duration-500" />
          </div>
        </section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.06]">
          {ALL_STATUSES.map((status) => (
            <button
              key={status} onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedStatus === status 
                  ? 'bg-white/10 border-white/30 text-white shadow-xl' 
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {status === 'Все' ? 'Текущие задачи' : status}
            </button>
          ))}
        </div>
        {filteredProjects.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-white/[0.005] rounded-2xl p-16 text-center">
            <p className="text-xs text-slate-300 uppercase tracking-widest font-bold">Активных процессов по выбранным фильтрам не запущено.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const statusClass = getStatusStyles(project.status);
              const isInspected = selectedProject?.id === project.id;

              return (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(isInspected ? null : project)}
                  className={`project-card-animate group relative border p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-2xl cursor-pointer ${
                    isInspected 
                      ? 'bg-white/[0.06] border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                      : 'border-white/[0.06] bg-[#09090b]/80 hover:bg-white/[0.03] hover:border-white/[0.15]'
                  }`}
                >
                  <div className={`absolute top-0 left-0 bottom-0 w-[3px] opacity-70 transition-opacity group-hover:opacity-100 ${
                    project.status === 'Отклонен' ? 'bg-red-500' :
                    ['Разработка', 'Одобрен'].includes(project.status) ? 'bg-emerald-500' :
                    ['На рассмотрении', 'Тестирование'].includes(project.status) ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />

                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3 pl-1">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wide truncate group-hover:text-blue-400 transition-colors">{project.name}</h3>
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-widest ${statusClass}`}>
                        {project.status || 'Системный'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 line-clamp-2 mb-5 font-sans leading-relaxed pl-1 font-medium">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/60 border border-white/[0.04] mb-5 text-[10px] pl-3">
                      <div className="flex items-center gap-1.5"><Code size={11} className="text-blue-400" /><span className="truncate text-slate-100 font-bold">{project.language?.name || 'Н/Д'}</span></div>
                      <div className="flex items-center gap-1.5"><Monitor size={11} className="text-emerald-400" /><span className="truncate text-slate-100 font-bold">{project.platform?.name || 'Н/Д'}</span></div>
                      <div className="flex items-center gap-1.5"><Layers size={11} className="text-purple-400" /><span className="truncate text-slate-100 font-mono font-bold">arc: {project.architecture?.name || 'Н/Д'}</span></div>
                      <div className="flex items-center gap-1.5"><Settings2 size={11} className="text-cyan-400" /><span className="truncate text-slate-100 font-bold">{project.software_type?.name || 'Н/Д'}</span></div>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-300 pl-1 font-bold">
                    <span className="text-emerald-400 font-extrabold font-mono text-sm">{project.price.toLocaleString()} RUB</span>
                    <span className="flex items-center gap-1 text-slate-100"><Calendar size={10} className="text-slate-400" />{project.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div 
        ref={inspectorRef}
        className="fixed top-0 right-0 bottom-0 w-full xl:w-[440px] border-l border-white/[0.1] bg-[#060608]/98 backdrop-blur-3xl z-[100] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] p-6 pt-24 flex flex-col justify-between transform translate-x-full opacity-0"
      >
        {selectedProject ? (
          <>
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-none pb-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-blue-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Node_Inspector_v2.0</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(null);
                  }} 
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/5 transition-all relative z-[110]"
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>

              <div>
                <span className="text-[8px] uppercase font-black tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">ID NODE: {selectedProject.id}</span>
                <h2 className="text-lg font-black text-white uppercase tracking-wider mt-2 font-mono break-words">{selectedProject.name}</h2>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.06] bg-black/40 space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400 block">Техническая спецификация</span>
                <p className="text-xs text-slate-100 font-sans leading-relaxed font-medium break-words">{selectedProject.description}</p>
              </div>

              <div className="space-y-2.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Архитектурная сборка</span>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400 font-medium">Язык системы:</span>
                    <span className="text-white font-bold">{selectedProject.language?.name || 'Core-Node'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400 font-medium">Платформа:</span>
                    <span className="text-white font-bold">{selectedProject.platform?.name || 'Cross-Platform'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400 font-medium">Паттерн:</span>
                    <span className="text-cyan-400 font-bold">{selectedProject.architecture?.name || 'Классический'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400 font-medium">Архитектура ПО:</span>
                    <span className="text-purple-400 font-bold">{selectedProject.software_type?.name || 'Микросервис'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-medium">Объем пользователей (MAU):</span>
                    <span className="text-yellow-400 font-bold">{selectedProject.target_users_count?.toLocaleString() || '1,000+'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-black rounded-xl border border-white/[0.08] font-mono text-[10px] space-y-1 text-slate-300">
                <div className="text-emerald-400 flex items-center gap-1"><Cpu size={10} /> [SYSTEM]: Нода успешно синхронизирована</div>
                <div>&gt; Статус среды: <span className="text-blue-400 font-bold uppercase">{selectedProject.status}</span></div>
                <div>&gt; Выделено бюджетирование: <span className="text-emerald-400 font-bold">{selectedProject.price.toLocaleString()} RUB</span></div>
                <div>&gt; Сдача релиза: {selectedProject.deadline}</div>
              </div>

              <div className="border border-white/[0.08] bg-[#09090b]/60 rounded-xl p-3.5 space-y-3 flex flex-col h-[260px]">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                  <span className="text-[9px] uppercase tracking-widest font-black text-cyan-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                    Secure_Comm_Link_v4
                  </span>
                  <span className="text-[8px] text-slate-400 uppercase">Dev_Client Connected</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none text-[11px]">
                  {currentNodeMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-[10px] text-center italic font-sans px-4">
                      Канал пуст. Отправьте директиву разработчику для инициализации логов.
                    </div>
                  ) : (
                    currentNodeMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className={`p-2 rounded-xl border font-sans ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600/10 border-blue-500/30 text-blue-100 rounded-tr-none' 
                            : 'bg-zinc-900 border-white/5 text-zinc-300 rounded-tl-none'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-line font-medium">{msg.text}</p>
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono mt-0.5 px-1">{msg.timestamp}</span>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendFakeMessage} className="flex gap-2 border-t border-white/[0.05] pt-2 shrink-0">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ввод директивы разработчику..."
                    className="flex-1 bg-black rounded-lg border border-white/[0.1] px-3 py-2 text-[11px] placeholder-slate-500 outline-none focus:border-cyan-500/50 text-white font-medium"
                  />
                  <button 
                    type="submit"
                    className="p-2 bg-zinc-900 border border-white/10 rounded-lg hover:bg-zinc-800 text-cyan-400 active:scale-95 transition-all shrink-0"
                  >
                    <Send size={12} />
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-3 shrink-0 bg-[#060608]">
              {selectedProject.links?.[0]?.url ? (
                <a 
                  href={selectedProject.links[0].url} target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs uppercase font-bold tracking-wider rounded-xl border border-white/10 transition-all shadow-md"
                >
                  <ExternalLink size={12} />
                  <span>Открыть репозиторий</span>
                </a>
              ) : (
                <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest py-2 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                  Исходный код закрыт адрейном
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </main>
  );
}