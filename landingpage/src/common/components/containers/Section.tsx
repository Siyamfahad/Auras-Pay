import classNames from "classnames";
import React from "react";

type Props = {
  children?: React.ReactNode;
  background?: "regular" | "lighter";
  className?: string;
  id?: string;
};

export default function Section({
  children,
  background = "regular",
  className,
  id,
}: Props) {
  const sectionBackground = () => {
    switch (background) {
      case "regular":
        return "";
      case "lighter":
        return "border-t border-b border-neutral-900 bg-neutral-900/30";
    }
  };

  return (
    <section
      id={id}
      className={classNames(
        "relative block px-6 py-10 md:py-20 md:px-10 ",
        sectionBackground(),
        className
      )}
    >
      {children}
    </section>
  );
}
