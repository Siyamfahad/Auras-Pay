import InnerContainer from "@/common/components/containers/InnerContainer";
import H2 from "@/common/components/typography/H2";
import React from "react";
import NextButton, { ButtonType } from "@/common/components/buttons/NextButton";
import chroma from "chroma-js";
import { useTheme } from "../contexts/ThemeProvider";

export type CallToActionBlockType = {
  title?: string;
  description?: string;
  buttons?: ButtonType[];
  from?: string;
  to?: string;
};

export default function CallToActionBlock({
  title,
  description,
  buttons,
  from,
  to,
}: CallToActionBlockType) {
  const { gradient } = useTheme();
  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom right, ${
      from ? from : gradient.from
    } 0%,${chroma
      .mix(from ? from : gradient.from, to ? to : gradient.to)
      .hex()} 50%, ${to ? to : gradient.to} 100%)`,
  };

  return (
    <InnerContainer>
      <div className="rounded-xl p-1" style={gradientStyle}>
        <div className="rounded-lg bg-black/80 backdrop-blur">
          <div className="flex w-full flex-wrap items-center justify-between gap-4 px-8 py-10 sm:px-16  lg:flex-nowrap">
            <div className="lg:max-w-xl">
              <H2>{title}</H2>
              <p className=" my-4 bg-transparent  font-medium leading-relaxed tracking-wide text-gray-400">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 ">
              {buttons &&
                buttons.map((button, index) => (
                  <NextButton {...button} key={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </InnerContainer>
  );
}
