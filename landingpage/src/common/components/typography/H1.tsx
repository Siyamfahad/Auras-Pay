import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function H1({ children, className }: Props) {
  return (
    <h1
      className={
        "block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text py-2 text-4xl font-bold text-transparent sm:text-5xl " +
        className
      }
    >
      {children}
    </h1>
  );
}
