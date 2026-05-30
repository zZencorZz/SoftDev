"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import Link from "next/link";
import { MousePointerClick, Menu, X, LogOut, User, Shield, ChevronDown } from "lucide-react";
import { navLinks } from "@/types/navbar/navLinks";
import { useAuth } from "@/context/authContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const container = useRef<HTMLDivElement>(null);
  const navBox = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".nav-anim-item", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "+=60",
      scrub: true,
      onEnter: () => navBox.current?.classList.add("nav-scrolled"),
      onLeaveBack: () => navBox.current?.classList.remove("nav-scrolled"),
    });
  }, { scope: container });

  return (
    <nav 
      ref={container}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-0 md:p-0"
    >
      <div 
        ref={navBox}
        className="
          flex items-center justify-between w-full border border-transparent bg-transparent transition-all duration-300 ease-out
          max-w-[1300px] px-6 py-4 mt-0 rounded-none
          max-md:px-4 max-md:py-3
          [&.nav-scrolled]:mt-3 
          [&.nav-scrolled]:max-w-[1100px] 
          [&.nav-scrolled]:bg-white/[0.03] 
          [&.nav-scrolled]:backdrop-blur-xl 
          [&.nav-scrolled]:border-white/[0.08] 
          [&.nav-scrolled]:px-5 
          [&.nav-scrolled]:py-2.5
          [&.nav-scrolled]:rounded-full 
          [&.nav-scrolled]:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
          max-md:[&.nav-scrolled]:w-[calc(100%-24px)]
          max-md:[&.nav-scrolled]:py-2
        "
      >
        <Link href="/" className="nav-anim-item font-bold text-xl tracking-tighter flex items-center gap-2 text-white relative z-50">
          <MousePointerClick size={20} />
          SoftDev
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="nav-anim-item text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:block nav-anim-item relative">
          {isLoading ? (
            <div className="h-5 w-16 bg-white/5 rounded animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} 
                className="flex items-center gap-2 text-sm font-mono font-bold text-gray-300 hover:text-white transition-colors border border-white/5 bg-white/[0.02] px-3 py-1.5 rounded-xl backdrop-blur-md"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${user.role === 'admin' ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
                <span>{user.username}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl border border-white/[0.06] bg-[#0c0c0e] p-1.5 shadow-xl backdrop-blur-2xl transition-all duration-200 origin-top-right ${
                  isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <Link
                  href="/profile"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-mono text-slate-400 hover:bg-white/[0.03] hover:text-white transition-colors"
                >
                  {user.role === 'admin' ? <Shield size={13} className="text-emerald-400" /> : <User size={13} className="text-blue-400" />}
                  <span>Профиль</span>
                </Link>
                <div className="my-1 h-[1px] w-full bg-white/[0.04]" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-mono text-red-400/80 hover:bg-red-500/[0.03] hover:text-red-400 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
              Войти
            </Link>
          )}
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 text-gray-300 hover:text-white transition-colors nav-anim-item relative z-50"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div 
          className={`
            fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-2xl flex flex-col justify-center items-center gap-8 transition-all duration-300 md:hidden z-40
            ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
        >
          <div className="flex flex-col items-center gap-6 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-semibold text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-[1px] w-12 bg-white/10 my-2" />
            
            {isLoading ? (
              <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
            ) : user ? (
              <div className="flex flex-col items-center gap-4">
                <Link 
                  href="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-mono font-bold text-slate-200 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className={`h-2 w-2 rounded-full ${user.role === 'admin' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                  {user.username}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="text-sm font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  <span>Покинуть инстанс</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Войти в личный кабинет
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}