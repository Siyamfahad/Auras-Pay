import React from "react";
import GradientBackgroundImage from "../components/backgrounds/GradientBackgroundImage";
import Container from "../components/containers/Container";
import RedGradientBackground from "@/assets/images/LargeRedBackground.Gradient.svg";
import PricingCard, { PricingCardType } from "../components/cards/PricingCard";

export type PricingTableType = {
  plans: PricingCardType[];
};

export default function PricingTable({ plans }: PricingTableType) {
  return (
    <>
      <GradientBackgroundImage
        src={RedGradientBackground}
        position="bottom-0"
      />
      <Container className="z-10 grid grid-cols-1 gap-10 sm:gap-20 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
        {plans.map((plan, index) => (
          <PricingCard {...plan} key={index} />
        ))}
      </Container>
    </>
  );
}
