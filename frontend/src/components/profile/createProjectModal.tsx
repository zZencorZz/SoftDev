'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, FolderPlus, DollarSign, Calendar, Link2, Users, Code, Monitor, Layers, Settings2, Loader2 } from 'lucide-react';
import { projectService, CreateProjectPayload, LookupItem } from '@/api/project/projectServ';
import gsap from 'gsap';
import { Button } from '../ui/button';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true); 

  const [languages, setLanguages] = useState<LookupItem[]>([]);
  const [platforms, setPlatforms] = useState<LookupItem[]>([]);
  const [architectures, setArchitectures] = useState<LookupItem[]>([]);
  const [softwareTypes, setSoftwareTypes] = useState<LookupItem[]>([]);

  const [formData, setFormData] = useState<CreateProjectPayload>({
    name: '',
    description: '',
    language_id: 0,
    platform_id: 0,
    architecture_id: 0,
    software_type_id: 0,
    target_users_count: 0,
    links: [{ name: 'Github', url: '' }],
    price: 0,
    deadline: new Date().toISOString().split('T')[0],
  });


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsDataLoading(true);
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(modalRef.current, 
        { scale: 0.95, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );

      Promise.all([
        projectService.getLanguages(),
        projectService.getPlatforms(),
        projectService.getArchitectures(),
        projectService.getSoftwareTypes()
      ])
        .then(([langs, plats, archs, types]) => {
          setLanguages(langs);
          setPlatforms(plats);
          setArchitectures(archs);
          setSoftwareTypes(types);

          setFormData(prev => ({
            ...prev,
            language_id: langs[0]?.id || 0,
            platform_id: plats[0]?.id || 0,
            architecture_id: archs[0]?.id || 0,
            software_type_id: types[0]?.id || 0,
          }));
        })
        .catch(err => console.error('Критический сбой инициализации справочников:', err))
        .finally(() => setIsDataLoading(false));
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(modalRef.current, { 
      scale: 0.95, y: 15, opacity: 0, duration: 0.2, ease: 'power2.in', 
      onComplete: onClose 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await projectService.createProject(formData);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Ошибка коммита ноды проекта:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md opacity-0 font-mono"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.06] bg-[#09090b]/95 p-6 shadow-2xl opacity-0 max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <FolderPlus size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Инициализация ноды проекта</h3>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <X size={16} />
          </button>
        </div>

        {isDataLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
            <Loader2 size={18} className="animate-spin text-emerald-500" />
            <span>Маппинг репозиториев метаданных...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Имя проекта</label>
              <input 
                type="text" required value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., СУБД Гранит"
                className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-slate-700 outline-none focus:border-emerald-500/30 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Спецификация</label>
              <textarea 
                rows={2} required value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Описание бизнес-логики и целей..."
                className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-slate-700 outline-none focus:border-emerald-500/30 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                  <Code size={10} /> Язык разработки
                </label>
                <select
                  value={formData.language_id}
                  onChange={e => setFormData({...formData, language_id: Number(e.target.value)})}
                  className="w-full rounded-xl border border-white/[0.05] bg-[#0c0c0e] px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500/30 transition-all cursor-pointer"
                >
                  {languages.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                  <Monitor size={10} /> Целевая платформа
                </label>
                <select
                  value={formData.platform_id}
                  onChange={e => setFormData({...formData, platform_id: Number(e.target.value)})}
                  className="w-full rounded-xl border border-white/[0.05] bg-[#0c0c0e] px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500/30 transition-all cursor-pointer"
                >
                  {platforms.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                  <Layers size={10} /> Архитектура
                </label>
                <select
                  value={formData.architecture_id}
                  onChange={e => setFormData({...formData, architecture_id: Number(e.target.value)})}
                  className="w-full rounded-xl border border-white/[0.05] bg-[#0c0c0e] px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500/30 transition-all cursor-pointer"
                >
                  {architectures.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                  <Settings2 size={10} /> Тип ПО
                </label>
                <select
                  value={formData.software_type_id}
                  onChange={e => setFormData({...formData, software_type_id: Number(e.target.value)})}
                  className="w-full rounded-xl border border-white/[0.05] bg-[#0c0c0e] px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500/30 transition-all cursor-pointer"
                >
                  {softwareTypes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                  <Users size={10} /> Целевые MAU
                </label>
                <input 
                  type="number" required value={formData.target_users_count || ''}
                  onChange={e => setFormData({...formData, target_users_count: Number(e.target.value)})}
                  placeholder="5000"
                  className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-slate-700 outline-none focus:border-emerald-500/30 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                  <DollarSign size={10} /> Бюджет (RUB)
                </label>
                <input 
                  type="number" required value={formData.price || ''}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  placeholder="120000"
                  className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-slate-700 outline-none focus:border-emerald-500/30 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                  <Calendar size={10} /> Дедлайн
                </label>
                <input 
                  type="date" required value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/30 transition-all [color-scheme:dark]"
                />
              </div>

            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                <Link2 size={10} /> Репозиторий Github
              </label>
              <input 
                type="url" required value={formData.links[0].url}
                onChange={e => setFormData({ ...formData, links: [{ name: 'Github', url: e.target.value }] })}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-slate-700 outline-none focus:border-emerald-500/30 transition-all"
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              className="w-full bg-emerald-500 border-emerald-300 hover:bg-emerald-400 text-black text-[11px] font-bold uppercase tracking-wider pt-2.5 pb-2.5 mt-4 shadow-[0_0_25px_rgba(16,185,129,0.1)]"
            >
              Закоммитить проект в пул
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};