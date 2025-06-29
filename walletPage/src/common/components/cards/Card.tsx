import { useTheme } from "@/common/contexts/ThemeProvider";
import chroma from "chroma-js";
import React from "react";

export type CardType = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  icon,
  className,
}: CardType) {
  const { main } = useTheme();

  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${main} 0%, ${chroma(main)
      .darken(0.5)
      .hex()} 100%)`,
    borderColor: chroma(main).brighten(0.2).hex(),
  };

  return (
    <div
      className={
        "rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow-sm" +
        className
      }
    >
      <div
        className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border "
        style={gradientStyle}
      >
        {icon}
      </div>
      <h3 className="mt-6 ">{title}</h3>
      <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
        {description}
      </p>
    </div>
  );
}
