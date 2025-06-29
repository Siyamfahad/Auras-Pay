import Container from "@/common/components/containers/Container";
import H2 from "@/common/components/typography/H2";
import React from "react";
import TagWrapper from "@/common/components/tags/TagWrapper";
import Tag, { TagType } from "@/common/components/tags/Tag";
import NextImage, { ImageType } from "@/common/components/images/NextImage";

export type FeatureContentType = {
  align?: "left" | "right";
  kicker?: string;
  title?: string;
  description?: string;
  tags?: TagType[];
  image?: ImageType;
};

export default function FeatureContent({
  align = "right",
  kicker,
  title,
  description,
  tags,
  image,
}: FeatureContentType) {
  const alignClass = align === "right" ? "flex-row" : "flex-row-reverse";

  return (
    <Container className={"flex flex-wrap justify-between " + alignClass}>
      <div className="sm:text mx-auto max-w-lg text-center md:w-1/2 md:text-left">
        <span className="text-main my-3 block  font-medium uppercase tracking-wider ">
          {kicker}
        </span>
        <H2>{title}</H2>
        <p className=" my-4 bg-transparent  font-medium leading-relaxed tracking-wide text-gray-400">
          {description}
        </p>
        <TagWrapper>
          {tags && tags.map((tag, index) => <Tag {...tag} key={index} />)}
        </TagWrapper>
      </div>
      <div className="flex w-full items-center justify-center md:w-1/2 md:px-8">
        {image && <NextImage {...image} />}
      </div>
    </Container>
  );
}
