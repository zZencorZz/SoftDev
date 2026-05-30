'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Shield, Lock, EyeOff, ServerCrash, ArrowLeft, Terminal } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function PrivacyPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      '.privacy-anim-item',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  }, { scope: containerRef });

  return (
    <main 
      ref={containerRef} 
      className="min-h-screen w-full bg-[#0a0a0a] text-white px-4 py-28 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -top-40 -right-40 pointer-events-none h-96 w-96 rounded-full bg-blue-500/[0.03] blur-[120px]" />

      <div className="mx-auto max-w-3xl relative z-10">
        
        <Link 
          href="/" 
          className="privacy-anim-item inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white transition-colors mb-8 opacity-0"
        >
          <ArrowLeft size={14} />
          <span>return_to_main</span>
        </Link>

        <div className="privacy-anim-item border-b border-white/5 pb-8 mb-12 opacity-0">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-emerald-400" />
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
              security_protocol_v2.0
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Конфиденциальность данных
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-mono">
            Последнее обновление: 2026 // Внутренний регламент SoftDev
          </p>
        </div>

        <div className="space-y-10">
          <div className="privacy-anim-item flex gap-4 opacity-0">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">1. Защита исходного кода и ТЗ</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Все технические задания, параметры архитектуры и выбранные стеки, генерируемые пользователями внутри платформы SoftDev, являются строго конфиденциальной информацией. Исходный код развернутых проектов сохраняется в изолированных внутренних репозиториях организации.
              </p>
            </div>
          </div>

          <div className="privacy-anim-item flex gap-4 opacity-0">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <EyeOff size={16} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">2. Логирование действий пользователей</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Система автоматически логирует действия сотрудников (создание заявок, смена статусов, добавление артефактов) исключительно для обеспечения прозрачности процесса разработки и предотвращения конфликтов в дедлайнах. Данные логи доступны только назначенным ПМ и администраторам системы.
              </p>
            </div>
          </div>

          <div className="privacy-anim-item flex gap-4 opacity-0">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Terminal size={16} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">3. Интеграция и API ключи</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                При интеграции внешних сервисов (GitLab, GitHub, Jira) все токены авторизации и API-ключи шифруются по стандарту AES-256 и сохраняются во внутреннем зашифрованном хранилище переменных окружения. Ни один разработчик или сторонний скрипт не имеет прямого доступа к этим ключам в открытом виде.
              </p>
            </div>
          </div>

          <div className="privacy-anim-item flex gap-4 opacity-0">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ServerCrash size={16} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">4. Безопасность хостинга</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Все готовые продукты упаковываются и изолируются в Docker-контейнерах на приватных облачных серверах компании. Доступ к логам контейнеров и базам данных жестко разграничен ролевой моделью доступа (RBAC).
              </p>
            </div>
          </div>

        </div>

        <div className="privacy-anim-item mt-16 pt-8 border-t border-white/5 text-center opacity-0">
          <p className="text-xs font-mono text-slate-600">
            [ core_security_node: active // connection_encrypted ]
          </p>
        </div>

      </div>
    </main>
  );
}