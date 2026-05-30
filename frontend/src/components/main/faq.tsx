'use client';

import React, { useRef } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const content = contentRef.current;
    const icon = iconRef.current;
    if (!content || !icon) return;

    // Проверяем, открыта ли панель прямо сейчас
    const isOpen = gsap.getProperty(content, 'height') !== 0;

    if (!isOpen) {
      // Открываем: плавно выставляем высоту контента в auto 
      gsap.to(content, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(icon, {
        rotate: 180,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(itemRef.current, {
        borderColor: 'rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        duration: 0.3,
      });
    } else {
      gsap.to(content, {
        height: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(icon, {
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(itemRef.current, {
        borderColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        duration: 0.3,
      });
    }
  };

  return (
    <div
      ref={itemRef}
      className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-colors duration-300"
    >
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="text-base font-semibold text-slate-200 hover:text-white transition-colors pr-4">
          {question}
        </span>
        <div
          ref={iconRef}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.03] border border-white/5 text-slate-400"
        >
          <ChevronDown size={16} />
        </div>
      </button>

      <div
        ref={contentRef}
        className="h-0 overflow-hidden will-change-[height]"
      >
        <div className="border-t border-white/5 p-6 text-sm leading-relaxed text-slate-400">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const FaqSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, { scope: containerRef });

  const faqData = [
    {
      question: 'Как формируется итоговая стоимость проекта?',
      answer: 'После того как вы оставляете заявку и выбираете стек в конструкторе, наш менеджер (ПМ) связывается с вами для уточнения деталей. Мы декомпозируем задачу на спринты, оцениваем часы разработки и формируем прозрачную смету без скрытых платежей.',
    },
    {
      question: 'Кто будет заниматься написанием кода?',
      answer: 'Ваш проект передается слаженной команде фулстек-разработчиков с подтвержденным коммерческим опытом. Мы пишем чистый, поддерживаемый код на современном стеке (Next.js, FastAPI, PostgreSQL), который легко масштабировать под любые будущие запросы компании.',
    },
    {
      question: 'Какие гарантии соблюдения дедлайнов?',
      answer: 'Каждый этап разработки жестко привязан к таймлайну внутри платформы SoftDev. Вы сможете отслеживать статус выполнения задач в реальном времени, видеть коммиты в репозиториях и контролировать каждый релиз на тестовых серверах.',
    },
    {
      question: 'Где будет развернут готовый софт?',
      answer: 'Мы берем на себя полную настройку инфраструктуры. Готовый продукт упаковывается в Docker-контейнеры и разворачивается на безопасных облачных серверах или внутренних серверах вашей организации с передачей всех доступов, логов и исходного кода.',
    },
  ];

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#0a0a0a] px-4 py-24 text-white relative z-20"
    >
      <div className="mx-auto max-w-4xl">
        
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
            <HelpCircle size={14} className="text-purple-400" />
            <span className="text-[11px] font-mono tracking-widest text-purple-400 uppercase">
              faq_support
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Остались вопросы? <br />Отвечаем на главное.
          </h2>
        </div>

        <div ref={listRef} className="space-y-4">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>

      </div>
    </section>
  );
};