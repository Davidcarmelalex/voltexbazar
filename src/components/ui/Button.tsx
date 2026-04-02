"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", glow = true, children, ...props }, ref) => {
    const baseStyles = "font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2";
    
    const variants = {
      primary: "bg-gradient-to-r from-[#FF7A00] to-[#FF9500] text-white shadow-[0_0_20px_rgba(255,122,0,0.8)] hover:shadow-[0_0_40px_rgba(255,122,0,1)]",
      secondary: "bg-transparent border-2 border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#05070D]",
      ghost: "bg-transparent text-[#A0AEC0] hover:text-[#00E5FF] hover:bg-white/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: glow ? 1.05 : 1 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
