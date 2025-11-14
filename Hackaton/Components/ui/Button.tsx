import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * Reusable Material-style button
 * Supports custom className, onClick, and children (icons + text)
 */
export function Button({ children, className = "", style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`material-button material-elevation-4 hover:material-elevation-8 px-6 py-3 md:px-12 md:py-8 text-lg md:text-xl font-bold rounded-2xl smooth-transition group ${className}`}
      style={{
        backgroundColor: "var(--md-accent)",
        color: "var(--md-text-primary)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
