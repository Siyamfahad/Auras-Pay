import Card, { CardType } from "@/common/components/cards/Card";
import Container from "@/common/components/containers/Container";
import InnerContainer from "@/common/components/containers/InnerContainer";
import H2 from "@/common/components/typography/H2";
import React from "react";

export type FeatureGridType = {
  kicker?: string;
  title?: string;
  description?: string;
  features?: CardType[];
};

export default function FeatureGrid({
  kicker,
  title,
  description,
  features,
}: FeatureGridType) {
  return (
    <>
      <InnerContainer className="text-center">
        <span className="text-main my-3 flex items-center justify-center font-medium uppercase tracking-wider">
          {kicker}
        </span>
        <H2>{title}</H2>
        <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
          {description}
        </p>
      </InnerContainer>

      <Container className="z-10 grid grid-cols-1 gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
        {features &&
          features.map((feature, index) => <Card {...feature} key={index} />)}
      </Container>
    </>
  );
}
