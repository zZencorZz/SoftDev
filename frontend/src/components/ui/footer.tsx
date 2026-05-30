'use client';

import React from 'react';
import Link from 'next/link';
import { MousePointerClick, Send, Mail } from 'lucide-react';
import { navLinks } from '@/types/navbar/navLinks';
import Image from 'next/image';


export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/5 text-slate-400 relative z-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 pointer-events-none h-80 w-full max-w-4xl rounded-full bg-blue-500/[0.02] blur-[100px]" />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
          <div className="md:col-span-5 space-y-4">
            <Link 
              href="/" 
              className="font-bold text-xl tracking-tighter flex items-center gap-2 text-white hover:opacity-90 transition-opacity w-fit"
            >
              <MousePointerClick size={20} className="text-emerald-400" />
              SoftDev
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Внутренняя экосистема автоматизации и разработки цифровых продуктов. Проектируем, кодим и разворачиваем сервисы для задач компании.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono tracking-wider text-slate-200 uppercase">
              // Навигация
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono tracking-wider text-slate-200 uppercase">
              // Контакты команды
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:support@company.com"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-200 w-fit"
              >
                <Mail size={14} className="text-slate-500" />
                <span>dev-support@softdev.io</span>
              </a>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200"
                  aria-label="Telegram"
                >
                  <Send size={15} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Image src="github-svgrepo-com.svg" 
                    width={15} 
                    height={15}
                    alt="GitHub"
                    className="brightness-0 invert"
                  />
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600">
          <div>
            &copy; {currentYear} SoftDev Ecosystem. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-700">v1.0.0_build</span>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};