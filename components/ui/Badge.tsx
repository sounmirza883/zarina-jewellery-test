type BadgeKind = "New" | "Best Seller" | "Sale";

const styles: Record<BadgeKind, string> = {
  New: "bg-navy text-gold-light",
  "Best Seller": "bg-gold text-white",
  Sale: "bg-[#8c2f39] text-white",
};

export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span className={`inline-block rounded-sm px-2 py-1 text-[10px] font-semibold tracking-wider uppercase ${styles[kind]}`}>
      {kind}
    </span>
  );
}
