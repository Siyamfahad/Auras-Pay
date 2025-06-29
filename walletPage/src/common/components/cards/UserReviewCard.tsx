import { IconStar } from "@tabler/icons";
import React from "react";
import NextImage, { ImageType } from "../images/NextImage";

export type UserReviewType = {
  stars?: 1 | 2 | 3 | 4 | 5;
  quote?: string;
  name?: string;
  role?: string;
  image?: ImageType;
};

export default function UserReviewCard({
  stars = 3,
  quote,
  image,
  name,
  role,
}: UserReviewType) {
  const starClass = (star: number) =>
    star <= stars ? "text-main" : "text-neutral-700";

  return (
    <div className=" flex flex-col justify-between rounded-md border border-neutral-800 bg-neutral-900/50 p-8 shadow-sm ">
      <div className="text-main flex gap-2">
        <IconStar size={20} className={starClass(1)} />
        <IconStar size={20} className={starClass(2)} />
        <IconStar size={20} className={starClass(3)} />
        <IconStar size={20} className={starClass(4)} />
        <IconStar size={20} className={starClass(5)} />
      </div>
      <p className="my-4 mb-0 text-base font-normal leading-relaxed tracking-wide text-gray-400">
        {quote}
      </p>
      <div className="mt-6 flex items-center gap-6 ">
        {image && (
          <div className="h-10 w-10 overflow-hidden rounded-full shadow-sm outline-neutral-800">
            <NextImage {...image} width={50} height={50} border={false} />
          </div>
        )}
        <div>
          <p className="leading-relaxed tracking-wide text-gray-200">{name}</p>
          <p className="text-xs leading-relaxed tracking-wide text-gray-400">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
