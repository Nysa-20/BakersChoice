import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cream';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  // Specs from 02-design.md: 8-10px corner radius (rounded-lg), Poppins medium, sentence case
  const baseStyles = "inline-flex items-center justify-center font-poppins font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-[#1F3A18] text-white hover:bg-[#264A1E] active:scale-[0.99] focus:ring-[#1F3A18] shadow-sm",
    secondary: "bg-white text-[#1F3A18] border border-[#1F3A18]/20 hover:bg-cream/40 focus:ring-[#1F3A18]",
    cream: "bg-cream text-[#1F3A18] hover:bg-[#F9F3D8] border border-[#1F3A18]/20 focus:ring-[#1F3A18]",
    outline: "border border-[#1F3A18] text-[#1F3A18] hover:bg-[#1F3A18] hover:text-white focus:ring-[#1F3A18]",
    ghost: "text-[#333333] hover:text-[#1F3A18] hover:bg-[#1F3A18]/5 focus:ring-[#1F3A18]"
  };
  
  const sizes = {
    sm: "h-9 px-4 text-xs tracking-wide",
    md: "h-11 px-6 text-sm tracking-wide",
    lg: "h-13 px-8 text-base tracking-wide"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
