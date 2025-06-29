import React from "react";
import NextImage, { ImageType } from "@/common/components/images/NextImage";

export type LogoCloudType = {
  title?: string;
  images?: ImageType[];
};

export default function LogoClouds({ title, images }: LogoCloudType) {
  return (
    <div className="pt-10 sm:pt-16">
      <p className="mt-0 mb-10 text-center  font-medium leading-relaxed tracking-wide  text-gray-400">
        {title}
      </p>

      <div className="relative flex flex-wrap items-center justify-center gap-6 opacity-70 sm:gap-12">
        {images &&
          images.map((image, index) => (
            <NextImage
              key={index}
              {...image}
              className="max-w-[120px] sm:max-w-none"
            />
          ))}
      </div>
    </div>
  );
}
