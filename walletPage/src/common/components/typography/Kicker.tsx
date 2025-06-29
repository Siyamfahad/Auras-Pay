import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Kicker({ children, className }: Props) {
  return (
    <span
      className={classNames(
        "text-main my-3 block font-medium uppercase tracking-wider",
        className
      )}
    >
      {children}
    </span>
  );
}
