import { IconBook } from "@tabler/icons";
import React from "react";
import NextImage, { ImageType } from "../images/NextImage";
import H2 from "../typography/H2";
import Kicker from "../typography/Kicker";
import Link from "next/link";
import classNames from "classnames";

export interface BlogExcerpt {
  category?: string;
  title?: string;
  description?: string;
  date?: string;
  readTime?: string;
  image: ImageType;
}

export interface BlogCardType extends BlogExcerpt {
  link: string;
  type?: "small" | "large";
}

export default function BlogCard({
  category,
  title,
  description,
  date,
  readTime,
  image,
  link,
  type = "large",
}: BlogCardType) {
  return (
    <Link href={link}>
      <div className="group flex cursor-pointer flex-col items-start justify-center gap-4 transition-all duration-300 hover:opacity-80">
        <div
          className={classNames("w-full", type == "small" ? "h-44" : "h-64")}
        >
          <NextImage {...image} fill className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col items-start">
          <Kicker>{category}</Kicker>
          <H2
            className={classNames(
              "mb-3",
              type == "small" ? "text-xl" : "text-3xl"
            )}
          >
            {title}
          </H2>
          <p className={classNames(type == "small" ? "text-sm" : "")}>
            {description}
          </p>
          <div className="mt-4 flex gap-6 text-sm text-neutral-500">
            <span>{date}</span>
            <span className="flex items-center gap-1">
              <IconBook size={18} /> {readTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
