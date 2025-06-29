import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function InnerContainer({ children, className }: Props) {
  return (
    <div className={classNames("relative mx-auto max-w-5xl", className)}>
      {children}
    </div>
  );
}
