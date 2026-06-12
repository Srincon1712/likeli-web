type GradientOrbProps = {
  className?: string;
};

export default function GradientOrb({ className = "" }: GradientOrbProps) {
  return <span className={`gradient-orb ${className}`} aria-hidden="true" />;
}
