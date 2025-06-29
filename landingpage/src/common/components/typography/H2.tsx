import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function H2({ children, className }: Props) {
  return (
    <h2
      className={classNames(
        "block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text  font-bold text-transparent ",

        className ? className : "text-3xl sm:text-4xl"
      )}
    >
      {children}
    </h2>
  );
}
