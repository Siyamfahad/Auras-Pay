import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return (
    <div className={"relative mx-auto max-w-7xl " + className}>{children}</div>
  );
}
