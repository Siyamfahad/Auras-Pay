import classNames from "classnames";
import Router from "next/router";
import React from "react";

export type ButtonType = {
  title: string;
  className?: string;
  tabIndex?: number;
  size?: "small" | "regular";
  href: string;
  type?: "primary" | "secondary";
};

export default function NextButton({
  title,
  className,
  tabIndex,
  size = "regular",
  href,
  type = "primary",
}: ButtonType) {
  const sizeClass =
    size === "small"
      ? "px-6 py-[10px] text-xs"
      : "px-8 py-3 text-xs sm:text-sm";

  const onClickHandler = () => {
    Router.push(href, href, { scroll: false });
  };

  switch (type) {
    case "primary":
      return (
        <button
          onClick={onClickHandler}
          className={classNames(
            "bg-main bg-main-hover button-text flex items-center justify-center whitespace-nowrap rounded-md transition-all duration-300",
            sizeClass,
            className
          )}
          tabIndex={tabIndex}
        >
          {title}
        </button>
      );

    case "secondary":
      return (
        <button
          onClick={onClickHandler}
          className={classNames(
            "flex items-center justify-center whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 text-center text-white backdrop-blur transition-all hover:bg-zinc-800",
            sizeClass,
            className
          )}
          tabIndex={tabIndex}
        >
          {title}
        </button>
      );
  }
}
