import { useTheme } from "@/common/contexts/ThemeProvider";
import { IconCircleCheck } from "@tabler/icons";
import chroma from "chroma-js";
import classNames from "classnames";
import React from "react";
import NextButton, { ButtonType } from "../buttons/NextButton";

export type PricingCardType = {
  name: string;
  description: string;
  interval?: string;
  price?: number | string;
  buttton: ButtonType;
  features: string[];
  includeLocalTaxesInformation?: boolean;
  featured?: boolean;
};

export default function PricingCard({
  name,
  description,
  interval,
  price,
  buttton,
  features,
  includeLocalTaxesInformation,
  featured,
}: PricingCardType) {
  const { gradient } = useTheme();

  const gradientStyle = () => {
    if (featured)
      return {
        backgroundImage: `linear-gradient(to bottom right, ${
          gradient.from
        } 0%,${chroma.mix(gradient.from, gradient.to).hex()} 50%, ${
          gradient.to
        } 100%)`,
      };
  };

  const featuredBackgroundWrapperClass = featured
    ? "relative -top-6"
    : "bg-neutral-900/60";

  const featuredBackgroundClass = featured
    ? "bg-black/80 backdrop-blur h-full"
    : "";

  return (
    <div
      className={classNames(
        "rounded-md border border-neutral-800 p-1 shadow-sm backdrop-blur",
        featuredBackgroundWrapperClass
      )}
      style={gradientStyle()}
    >
      <div className={classNames("p-6 sm:p-8", featuredBackgroundClass)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-medium">{name}</h2>
          {featured && (
            <div className="bg-main button-text flex rounded-full py-1 px-2 text-[10px] uppercase">
              Most Popular
            </div>
          )}
        </div>
        <p className="my-2 mt-4  font-normal">{description}</p>
        <div className="my-8 w-3/4 rounded-md border border-neutral-800/50 bg-neutral-900/60 p-4 sm:w-1/2 md:w-full md:p-6">
          <div
            className={classNames(
              "flex flex-wrap items-center gap-4 md:justify-center",
              price || interval || includeLocalTaxesInformation ? "mb-6" : ""
            )}
          >
            {price && (
              <p className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {price}
              </p>
            )}
            <div className="text-xs">
              {interval && <p className=" text-sm text-white ">{interval}</p>}
              {includeLocalTaxesInformation && (
                <p className="text-xs font-normal text-neutral-500">
                  plus local taxes
                </p>
              )}
            </div>
          </div>
          {featured ? (
            <NextButton
              {...buttton}
              className="text-center md:w-full"
              type="primary"
            />
          ) : (
            <NextButton
              {...buttton}
              className="text-center md:w-full"
              type="secondary"
            />
          )}
        </div>
        <ul className="flex flex-col gap-5 text-slate-300">
          {features.map((feature, index) => (
            <li className="flex items-start gap-4" key={index}>
              <span>
                <IconCircleCheck
                  className="mt-[2px] shrink-0 text-green-500"
                  size={20}
                />
              </span>
              <div>{feature}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
