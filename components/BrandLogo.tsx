import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function BrandLogo({ href = "/", onClick, className = "" }: BrandLogoProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center select-none leading-none max-w-full">
      <Image
        src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png"
        alt="Enlight Lab"
        width={130}
        height={36}
        className={`h-6 min-[375px]:h-7 sm:h-8 w-auto object-contain transition-all duration-200 ${className}`}
        unoptimized
        onClick={onClick}
      />
      <span className="text-[7px] min-[375px]:text-[8px] sm:text-[10px] font-bold text-[#0A1F6B] tracking-[0.15em] uppercase mt-1 transition-all duration-200">
        PRD GENERATOR
      </span>
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
