type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
};

export default function SectionHeader({ eyebrow, title, copy, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`section-head ${align === "center" ? "mx-auto text-center items-center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="title">{title}</h2>
      {copy ? <p className="lead">{copy}</p> : null}
    </div>
  );
}
