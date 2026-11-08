interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  tone?: "light" | "dark";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  tone = "light",
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      {eyebrow && <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">{eyebrow}</p>}
      <Tag className={`text-3xl sm:text-4xl lg:text-5xl ${tone === "dark" ? "text-ivory" : "text-charcoal"}`}>
        {title}
      </Tag>
      <span className="gold-line block w-24" aria-hidden="true" />
      {subtitle && (
        <p className={`max-w-xl text-sm sm:text-base ${tone === "dark" ? "text-ivory/70" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
