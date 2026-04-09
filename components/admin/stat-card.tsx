import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  accent
}: {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#fbfdf8_0%,#f3f8ec_100%)] p-5 shadow-[0_18px_40px_rgba(22,49,27,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(22,49,27,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            {label}
          </p>
          <h3 className="mt-3 font-display text-[1.7rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.85rem]">
            {value}
          </h3>
        </div>
        <div
          className={`rounded-[22px] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${accent ?? "bg-brand-100 text-brand-700"}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
