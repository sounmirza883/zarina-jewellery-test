import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "dark" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 min-h-11";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-white hover:bg-gold-light hover:text-navy",
  secondary: "border border-gold text-gold hover:bg-gold hover:text-white",
  dark: "bg-navy text-ivory hover:bg-gold",
  ghost: "text-charcoal underline-offset-4 hover:text-gold hover:underline",
};

export function buttonClasses(variant: Variant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...rest} />;
}

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}

export function ButtonLink({ href, children, variant = "primary", className = "", external }: ButtonLinkProps) {
  const cls = buttonClasses(variant, className);
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
