import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function TagWrapper({ children }: Props) {
  return (
    <div className="my-8 mx-auto flex max-w-md flex-wrap justify-center gap-3 text-xs text-gray-400 md:mx-0 md:justify-start">
      {children}
    </div>
  );
}
