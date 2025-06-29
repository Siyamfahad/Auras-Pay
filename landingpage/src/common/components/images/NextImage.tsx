import React from "react";
import Image, { StaticImageData } from "next/image";
import classNames from "classnames";
import GradientImageWrapper from "./GradientImageWrapper";

export type ImageType = {
  src: string | StaticImageData;
  width?: number;
  height?: number;
  alt?: string;
  grayscale?: boolean;
  priority?: boolean;
  border?: boolean;
  gradientWrapper?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
};

export default function NextImage({
  src,
  alt = "",
  width,
  height,
  grayscale,
  priority,
  border = true,
  gradientWrapper = false,
  className = "",
  fill,
  sizes,
}: ImageType) {
  const grayscaleClass = grayscale ? "grayscale saturate-[20%] " : "";
  const borderClass = border ? "border" : "";

  const ImageContainer = () => (
    <div
      className={classNames(
        "relative inline-block overflow-hidden rounded-lg border-neutral-800",
        grayscaleClass,
        borderClass,
        className
      )}
    >
      <Image
        priority={priority}
        src={src}
        alt={alt}
        className={"inline-block " + className}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
      />
    </div>
  );

  return gradientWrapper ? (
    <GradientImageWrapper>
      <ImageContainer />
    </GradientImageWrapper>
  ) : (
    <ImageContainer />
  );
}
