import classNames from "classnames";
import React from "react";
import GradientBackground from "../components/backgrounds/GradientBackground";
import Section from "../components/containers/Section";
import H1 from "../components/typography/H1";
import Kicker from "../components/typography/Kicker";

export type PageHeaderType = {
  kicker?: string;
  title?: string;
  description?: string;
  center?: boolean;
};

export default function PageHeaderProps({
  kicker,
  title,
  description,
  center = true,
}: PageHeaderType) {
  const centerClass = center ? "text-center mx-auto" : "";
  return (
    <Section className="relative bg-black pt-20 lg:pt-28">
      <GradientBackground position="top-left" />
      <GradientBackground position="top-right" />
      <Kicker className={centerClass}> {kicker}</Kicker>
      <H1 className={classNames(centerClass)}>{title}</H1>
      <p
        className={classNames(
          "my-4 w-full max-w-xl bg-transparent font-medium leading-relaxed tracking-wide text-gray-400",
          centerClass
        )}
      >
        {description}
      </p>
    </Section>
  );
}
