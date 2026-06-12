import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <a className={`btn ${variantClass} btn-magnetic ${className}`} {...props}>
      {children}
    </a>
  );
}
