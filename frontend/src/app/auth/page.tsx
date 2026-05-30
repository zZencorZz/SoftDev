'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { User, Lock, LogIn, UserPlus, ShieldAlert, Fingerprint, RefreshCw } from 'lucide-react';
import { authService } from '@/api/auth/authServ';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';


export default function AuthPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [sysLog, setSysLog] = useState('system_node: idle_awaiting_handshake');

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const scrambleText = (element: HTMLElement | null, targetText: string) => {
    if (!element) return;
    const chars = '!@#$%^&*()_+~`|}{[]:;?><,./-=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iterations = 0;
    
    const interval = setInterval(() => {
      element.innerText = targetText
        .split('')
        .map((_, index) => { 
          if (index < iterations) return targetText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
        
      if (iterations >= targetText.length) clearInterval(interval);
      iterations += 1 / 2; 
    }, 20);
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95, rotateX: -10 },
      { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.8, ease: 'power4.out' }
    );
    
    tl.fromTo(
      '.auth-stagger-item',
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
      '-=0.4'
    );
  }, { scope: containerRef });

  const toggleMode = () => {
    setError(null);
    setSysLog(isLogin ? 'action: deploying_registration_environment' : 'action: pulling_auth_node_protocol');
    
    const tl = gsap.timeline();

    tl.to('.auth-stagger-item', {
      opacity: 0,
      y: isLogin ? -8 : 8,
      filter: 'blur(6px)',
      duration: 0.15,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        setIsLogin(!isLogin);
      }
    });

    tl.to('.auth-stagger-item', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.35,
      stagger: 0.03,
      ease: 'power3.out',
      onComplete: () => {
        scrambleText(titleRef.current, !isLogin ? 'Авторизация ядра' : 'Развернуть окружение');
        setSysLog('system_node: core_ready');
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotationX = -(y / (rect.height / 2)) * 5;
    const rotationY = (x / (rect.width / 2)) * 5;

    gsap.to(card, { rotateX: rotationX, rotateY: rotationY, duration: 0.3, ease: 'power2.out' });
    gsap.to(glowRef.current, { x: e.clientX - rect.left - 150, y: e.clientY - rect.top - 150, duration: 0.2, ease: 'power1.out' });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Критический сбой: Пустая конфигурация');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSysLog(isLogin ? 'status: verifing_credentials...' : 'status: compiling_new_user_db...');

    try {
      if (isLogin) {
        const data = await authService.login({ username, password });
        localStorage.setItem('access_token', data.access_token);
        setSysLog('status: token_granted. syncing_ui...');
      } else {
        await authService.register({ username, password });
        const data = await authService.login({ username, password });
        localStorage.setItem('access_token', data.access_token);
        setSysLog('status: database_initialized. redirecting...');
      }

      await checkAuth();

      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.88,
        z: -150,
        filter: 'blur(12px)',
        duration: 0.4,
        ease: 'power4.in',
        onComplete: () => {
          router.push('/profile');
          router.refresh();
        },
      });
    } catch (err: any) {
      setSysLog('status: process_termination. access_denied.');
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        setError(typeof detail === 'string' ? detail : detail[0]?.msg || 'Validation Error');
      } else if (err.response?.status === 401) {
        setError('Отказ в доступе: Неверный токен пары логин/пароль');
      } else {
        setError('Ошибка линковки: auth-node не отвечает');
      }

      gsap.fromTo(
        cardRef.current,
        { x: -10 },
        { x: 0, duration: 0.4, ease: 'rough({ template: bounce.out, strength: 2.5, points: 12 })' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#030303] px-4 py-12 text-white [perspective:1200px]"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="absolute top-1/3 left-1/4 pointer-events-none h-[450px] w-[450px] rounded-full bg-blue-500/[0.02] blur-[130px]" />
      <div className="absolute bottom-1/3 right-1/4 pointer-events-none h-[450px] w-[450px] rounded-full bg-emerald-500/[0.02] blur-[130px]" />

      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md"
      >
        <div
          ref={cardRef}
          className="relative w-full overflow-hidden rounded-2xl border border-white/[0.04] bg-[#09090b]/60 p-8 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.9)] opacity-0 [transform-style:preserve-3d]"
        >
          <div
            ref={glowRef}
            className="absolute pointer-events-none h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-blue-500/5 via-emerald-500/5 to-transparent blur-[50px] opacity-80"
            style={{ left: 0, top: 0 }}
          />

          <div className={`absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r transition-all duration-500 ${isLogin ? 'from-blue-500/40 via-blue-400 to-transparent' : 'from-transparent via-emerald-400 to-emerald-500/40'}`} />

          <div className="auth-stagger-item mb-8 flex justify-between items-start [transform:translateZ(30px)]">
            <div className="text-left">
              <h2 ref={titleRef} className="text-xl font-bold tracking-tight text-slate-100 min-h-[28px]">
                {isLogin ? 'Авторизация ядра' : 'Развернуть окружение'}
              </h2>
              <p className="mt-1 text-[9px] font-mono tracking-widest text-slate-600 uppercase">
                {isLogin ? 'PROTOCOL // SECURE_AUTH' : 'PROTOCOL // INIT_ENV'}
              </p>
            </div>
            
            <div className={`p-2 rounded-lg border transition-all duration-300 ${isLogin ? 'border-blue-500/10 text-blue-500/30 bg-blue-500/[0.01]' : 'border-emerald-500/10 text-emerald-500/30 bg-emerald-500/[0.01]'}`}>
              <Fingerprint size={18} className="animate-pulse" />
            </div>
          </div>

          {error && (
            <div className="auth-stagger-item mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/10 bg-red-500/[0.02] p-3.5 text-xs text-red-400 backdrop-blur-md [transform:translateZ(20px)]">
              <ShieldAlert size={15} className="shrink-0 text-red-500 mt-0.5" />
              <span className="font-mono text-[11px] leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 [transform:translateZ(25px)]">
            <div className="auth-stagger-item space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
                  Идентификатор
                </label>
              </div>
              <div className="relative group">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  maxLength={50}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="usr_root"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/[0.05] bg-white/[0.01] py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-700 outline-none transition-all focus:border-blue-500/20 focus:bg-white/[0.02] focus:shadow-[0_0_25px_rgba(59,130,246,0.03)] disabled:opacity-50 font-mono"
                />
              </div>
            </div>

            <div className="auth-stagger-item space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
                  пароль
                </label>
              </div>
              <div className="relative group">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/[0.05] bg-white/[0.01] py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-700 outline-none transition-all focus:border-emerald-500/20 focus:bg-white/[0.02] focus:shadow-[0_0_25px_rgba(16,185,129,0.03)] disabled:opacity-50 font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              icon={isLogin ? LogIn : UserPlus}
              iconPosition="right"
              animateIcon="none"
              className={`auth-stagger-item mt-4 w-full text-[11px] font-mono font-bold tracking-wider uppercase border text-black shadow-md transition-colors ${
                isLogin 
                  ? 'bg-blue-400 border-blue-300 hover:bg-blue-300 shadow-blue-500/5' 
                  : 'bg-emerald-400 border-emerald-300 hover:bg-emerald-300 shadow-emerald-500/5'
              }`}
            >
              {isLogin ? 'Запросить токен доступа' : 'Инициализировать софт'}
            </Button>
          </form>

          <div className="auth-stagger-item mt-8 text-center [transform:translateZ(15px)]">
            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="group inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-300 transition-colors font-mono tracking-wide"
            >
              <RefreshCw size={10} className="text-slate-600 group-hover:rotate-180 transition-transform duration-500" />
              <span>{isLogin ? 'Сгенерировать новый инстанс аккаунта' : 'Вернуться к ноде авторизации'}</span>
            </button>
          </div>

          <div className="auth-stagger-item mt-6 pt-4 border-t border-white/[0.03] flex items-center font-mono text-[9px] text-slate-600 gap-2 [transform:translateZ(10px)]">
            <span className="h-1 w-1 rounded-full bg-amber-500/60 animate-ping shrink-0" />
            <span className="truncate">{sysLog}</span>
          </div>

        </div>
      </div>
    </main>
  );
}