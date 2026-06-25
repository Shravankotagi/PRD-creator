import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function BrandLogo({ href = "/", onClick, className = "" }: BrandLogoProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center select-none leading-none">
      <Image
        src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png"
        alt="Enlight Lab"
        width={130}
        height={36}
        className={`h-8 w-auto object-contain ${className}`}
        unoptimized
        onClick={onClick}
      />
      <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#0A1F6B", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "4px" }}>PRD GENERATOR</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
