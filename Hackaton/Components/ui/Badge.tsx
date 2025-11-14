import React, { ReactNode, HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
}

export function Badge({ children, variant = "primary", className = "", style, ...props }: BadgeProps) {
  const baseStyle = "px-2 py-1 text-xs font-semibold rounded";
  let variantStyle = "";

  switch (variant) {
    case "primary":
      variantStyle = "bg-blue-100 text-blue-800";
      break;
    case "secondary":
      variantStyle = "bg-gray-100 text-gray-800";
      break;
    case "tertiary":
      variantStyle = "bg-green-100 text-green-800";
      break;
  }

  return (
    <div
      className={`${baseStyle} ${variantStyle} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
