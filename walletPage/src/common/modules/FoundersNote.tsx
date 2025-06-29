import React from "react";
import InnerContainer from "@/common/components/containers/InnerContainer";
import H2 from "@/common/components/typography/H2";
import { ButtonType } from "@/common/components/buttons/NextButton";
import NextButton from "@/common/components/buttons/NextButton";
import NextImage, { ImageType } from "../components/images/NextImage";
import Divider from "../components/typography/Divider";

export type FoundersNoteUser = {
  name: string;
  image: ImageType;
  role: string;
};

export type FoundersNoteType = {
  kicker?: string;
  title?: string;
  note?: string;
  buttons?: ButtonType[];
  founder?: FoundersNoteUser;
};

export default function FoundersNote({
  kicker,
  title,
  note,
  buttons,
  founder,
}: FoundersNoteType) {
  return (
    <InnerContainer>
      <div className="mx-auto max-w-xl">
        <span className="text-main my-3 flex font-medium uppercase tracking-wider">
          {kicker}
        </span>
        <H2>{title}</H2>
        <div className="mt-10">
          <p className="my-4 w-full whitespace-pre-line font-medium leading-relaxed tracking-wide text-gray-400">
            {note}
          </p>
        </div>
        <Divider />
        <div className=" flex items-center gap-6">
          <div className="h-16 w-16 overflow-hidden rounded-full shadow-sm outline outline-1 outline-neutral-800">
            {founder?.image && (
              <NextImage
                {...founder?.image}
                width={100}
                height={100}
                className="h-auto w-auto"
                border={false}
              />
            )}
          </div>

          <div>
            <div className="signature -rotate-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold  text-transparent  sm:text-5xl">
              {founder?.name}
            </div>
            <div className="leading-relaxed tracking-wide text-gray-400">
              {founder?.role}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-16 sm:gap-10">
          {buttons &&
            buttons.map((button, index) => (
              <NextButton {...button} key={index} />
            ))}
        </div>
      </div>
    </InnerContainer>
  );
}
