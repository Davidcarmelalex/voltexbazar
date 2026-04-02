"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  className?: string;
  hover?: boolean;
  glow?: boolean;
  children?: ReactNode;
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hover = true, glow = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
        className={`
          bg-[#0A0F1C] border border-white/10 rounded-2xl p-6
          transition-all duration-300
          ${hover ? "hover:border-[#00E5FF] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]" : ""}
          ${glow ? "shadow-[0_0_30px_rgba(0,229,255,0.2)]" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
