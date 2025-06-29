import classNames from "classnames";
import React from "react";
import GradientBackground from "../components/backgrounds/GradientBackground";
import H1 from "../components/typography/H1";
import Kicker from "../components/typography/Kicker";
import { IconBook } from "@tabler/icons";
import NextImage from "../components/images/NextImage";
import Divider from "../components/typography/Divider";
import { BlogExcerpt } from "../components/cards/BlogCard";
import Section from "../components/containers/Section";

export default function BlogPageHeader({
  category,
  title,
  description,
  date,
  readTime,
  image,
}: BlogExcerpt) {
  return (
    <Section className="relative bg-black py-20 pt-20 lg:pt-28">
      <GradientBackground position="top-left" />
      <GradientBackground position="top-right" />
      <div className="flex flex-col items-center justify-center">
        <Kicker className="mx-auto text-center">{category}</Kicker>
        <H1 className="mx-auto max-w-3xl text-center">{title}</H1>
        <p
          className={classNames(
            "my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400"
          )}
        >
          {description}
        </p>
        <div className="mt-4 flex gap-6 text-sm text-neutral-500">
          <span>{date}</span>
          <span className="flex items-center gap-1">
            <IconBook size={18} /> {readTime}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-sm">
        <Divider />
      </div>

      <div className="mt-10 flex items-center justify-center overflow-hidden ">
        <NextImage {...image} width={800} />
      </div>
    </Section>
  );
}
