type FlowLineProps = {
  className?: string;
};

export default function FlowLine({ className = "" }: FlowLineProps) {
  return <span className={`flow-line ${className}`} aria-hidden="true" />;
}
