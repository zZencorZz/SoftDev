'use client';

import React, { useRef } from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  animateIcon?: 'rotate' | 'shift' | 'none';
  isLoading?: boolean; 
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  animateIcon = 'none',
  className = '',
  isLoading = false,
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (!iconRef.current || animateIcon === 'none' || isLoading) return;

    if (animateIcon === 'rotate') {
      gsap.to(iconRef.current, { rotate: 90, duration: 0.3, ease: 'power2.out' });
    } else if (animateIcon === 'shift') {
      gsap.to(iconRef.current, { x: 3, y: -3, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (!iconRef.current || animateIcon === 'none' || isLoading) return;

    if (animateIcon === 'rotate') {
      gsap.to(iconRef.current, { rotate: 0, duration: 0.3, ease: 'power2.out' });
    } else if (animateIcon === 'shift') {
      gsap.to(iconRef.current, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  };

  const baseStyles = 'relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary: 'bg-white text-black hover:bg-slate-100 shadow-[0_4px_20px_rgba(255,255,255,0.1)]',
    glass: 'border border-white/10 bg-white/5 text-slate-300 backdrop-blur-md hover:border-white/20 hover:bg-white/10 hover:text-white',
  };

  const CurrentIcon = isLoading ? Loader2 : Icon;
  const shouldRenderLeftIcon = CurrentIcon && (iconPosition === 'left' || isLoading);
  const shouldRenderRightIcon = CurrentIcon && iconPosition === 'right' && !isLoading;

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {shouldRenderLeftIcon && (
        <span ref={iconRef} className={`flex items-center justify-center ${isLoading ? 'animate-spin' : ''}`}>
          <CurrentIcon size={16} />
        </span>
      )}

      <span>{children}</span>

      {shouldRenderRightIcon && (
        <span ref={iconRef} className="flex items-center justify-center">
          <CurrentIcon size={16} />
        </span>
      )}
    </button>
  );
};