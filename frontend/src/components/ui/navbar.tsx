"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import Link from "next/link";
import { MousePointerClick, Menu, X } from "lucide-react";
import { navLinks } from "@/types/navbar/navLinks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const container = useRef<HTMLDivElement>(null);
  const navBox = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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


        <div className="hidden md:block nav-anim-item">
          <Link href="/auth" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
            Войти
          </Link>
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
            <Link 
              href="/auth" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Войти в личный кабинет
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}