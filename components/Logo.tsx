import Image from "next/image";

type LogoVariant =
  | "likeliBlack"
  | "likeliWhite"
  | "likeliRed"
  | "likeliBlackInWhite"
  | "likeliWhiteInBlack"
  | "likeliRedInBeige"
  | "liBlack"
  | "liWhite"
  | "liRed"
  | "liBlackInWhite"
  | "liWhiteInBlack"
  | "liRedInBeige"
  | "navbar"
  | "mobile"
  | "favicon";

type LogoSize = "sm" | "md" | "lg" | "icon";

type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
};

const logoVariants: Record<LogoVariant, { src: string; alt: string; ratio: "full" | "mark" }> = {
  likeliBlack: {
    src: "/logos/likeli/likeli-black-transparent.png",
    alt: "Likeli",
    ratio: "full",
  },
  likeliWhite: {
    src: "/logos/likeli/likeli-white-transparent.png",
    alt: "Likeli",
    ratio: "full",
  },
  likeliRed: {
    src: "/logos/likeli/likeli-red-transparent.png",
    alt: "Likeli",
    ratio: "full",
  },
  likeliBlackInWhite: {
    src: "/logos/likeli/likeli-black-in-white.png",
    alt: "Likeli",
    ratio: "full",
  },
  likeliWhiteInBlack: {
    src: "/logos/likeli/likeli-white-in-black.png",
    alt: "Likeli",
    ratio: "full",
  },
  likeliRedInBeige: {
    src: "/logos/likeli/likeli-red-in-beige.png",
    alt: "Likeli",
    ratio: "full",
  },
  liBlack: {
    src: "/logos/li/li-black.png",
    alt: "Likeli",
    ratio: "mark",
  },
  liWhite: {
    src: "/logos/li/li-white.png",
    alt: "Likeli",
    ratio: "mark",
  },
  liRed: {
    src: "/logos/li/li-red.png",
    alt: "Likeli",
    ratio: "mark",
  },
  liBlackInWhite: {
    src: "/logos/li/li-black-in-white.png",
    alt: "Likeli",
    ratio: "mark",
  },
  liWhiteInBlack: {
    src: "/logos/li/li-white-in-black.png",
    alt: "Likeli",
    ratio: "mark",
  },
  liRedInBeige: {
    src: "/logos/li/li-red-in-beige.png",
    alt: "Likeli",
    ratio: "mark",
  },
  navbar: {
    src: "/logos/likeli/likeli-white-transparent.png",
    alt: "Likeli",
    ratio: "full",
  },
  mobile: {
    src: "/logos/li/li-white.png",
    alt: "Likeli",
    ratio: "mark",
  },
  favicon: {
    src: "/logos/li/li-red-in-beige.png",
    alt: "Likeli",
    ratio: "mark",
  },
};

const fullSizes: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 86, height: 28, className: "h-auto w-[86px]" },
  md: { width: 112, height: 36, className: "h-auto w-[112px]" },
  lg: { width: 148, height: 48, className: "h-auto w-[148px]" },
  icon: { width: 44, height: 44, className: "size-11" },
};

const markSizes: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 28, height: 28, className: "size-7" },
  md: { width: 36, height: 36, className: "size-9" },
  lg: { width: 48, height: 48, className: "size-12" },
  icon: { width: 44, height: 44, className: "size-11" },
};

export default function Logo({ variant = "likeliBlack", size = "md", className = "", priority = false }: LogoProps) {
  const logo = logoVariants[variant];
  const dimensions = logo.ratio === "full" ? fullSizes[size] : markSizes[size];

  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={`${dimensions.className} object-contain ${className}`}
    />
  );
}
