import CursorReactiveCard from "./CursorReactiveCard";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export default function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <CursorReactiveCard className="p-5">
      <span className="mono text-[0.66rem] uppercase tracking-[0.15em] text-faint">{label}</span>
      <strong className="mt-5 block text-3xl leading-none text-lk-beige">{value}</strong>
      <p className="mt-4 text-sm leading-6 text-lk-gray-light">{detail}</p>
    </CursorReactiveCard>
  );
}
