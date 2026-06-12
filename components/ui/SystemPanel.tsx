import type { ReactNode } from "react";

type SystemPanelProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

export default function SystemPanel({ label, children, className = "" }: SystemPanelProps) {
  return (
    <div className={`system-panel ${className}`}>
      {label ? (
        <div className="mb-5 flex items-center justify-between gap-4 border-b hairline pb-4">
          <span className="mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">{label}</span>
          <span className="status-dot" aria-hidden="true" />
        </div>
      ) : null}
      {children}
    </div>
  );
}
