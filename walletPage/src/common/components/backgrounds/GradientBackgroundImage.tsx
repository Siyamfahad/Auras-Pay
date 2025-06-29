import React from "react";
import Image from "next/image";

type Props = {
  src: string;
  position?: string;
  className?: string;
};

export default function GradientBackgroundImage({
  src,
  position = "left-0 top-0 ",
  className = "",
}: Props) {
  return (
    <div
      className={"absolute left-0 -z-10 h-2/3 w-full " + position + className}
    >
      <Image
        src={src}
        fill
        className="bg-top object-contain"
        alt=""
        priority
        sizes="30vw"
      />
    </div>
  );
}
