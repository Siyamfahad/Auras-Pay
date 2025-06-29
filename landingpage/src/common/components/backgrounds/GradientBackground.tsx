import { useTheme } from "@/common/contexts/ThemeProvider";
import chroma from "chroma-js";
import React from "react";

type Props = {
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  from?: string;
  to?: string;
};

export default function GradientBackground({ position, from, to }: Props) {
  const { gradient } = useTheme();
  const gradientFrom = chroma(from ? from : gradient.from).alpha(0.2);
  const gradientTo = chroma(to ? to : gradient.to).alpha(0.2);
  const gradientBorder = chroma(from ? from : gradient.from)
    .brighten(0.2)
    .alpha(0.2)
    .hex();

  const bottomLeftGradient = {
    backgroundImage: `linear-gradient(to top right, ${gradientFrom} 0%,transparent 50%, transparent 100%)`,
    borderColor: gradientBorder,
  };

  const bottomRightGradient = {
    backgroundImage: `linear-gradient(to top left, ${gradientTo} 0%,transparent 50%, transparent 100%)`,
    borderColor: gradientBorder,
  };

  const topLeftGradient = {
    backgroundImage: `linear-gradient(to bottom right, ${gradientFrom} 0%,transparent 50%, transparent 100%)`,
    borderColor: gradientBorder,
  };

  const topRightGradient = {
    backgroundImage: `linear-gradient(to bottom left, ${gradientTo} 0%,transparent 50%, transparent 100%)`,
    borderColor: gradientBorder,
  };

  switch (position) {
    case "bottom-left":
      return (
        <div
          className="absolute bottom-0 left-0 z-0 h-1/3 w-full border-b"
          style={bottomLeftGradient}
        ></div>
      );

    case "bottom-right":
      return (
        <div
          className="absolute bottom-0 right-0 z-0 h-1/3 w-full"
          style={bottomRightGradient}
        ></div>
      );

    case "top-left":
      return (
        <div
          className="absolute left-0 top-0 h-1/3 w-full border-t"
          style={topLeftGradient}
        ></div>
      );

    case "top-right":
      return (
        <div
          className="absolute right-0 top-0 h-1/3 w-full"
          style={topRightGradient}
        ></div>
      );
  }
}
