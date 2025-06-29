import { ANIMATE_HEADING } from "@/common/animations/Animations";
import classNames from "classnames";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function BigTitle({ children, className }: Props) {
  return (
    <motion.h1
      initial={"hidden"}
      whileInView="show"
      variants={ANIMATE_HEADING}
      viewport={{ once: true }}
      className={classNames(
        "mx-auto block w-full max-w-lg bg-gradient-to-b from-white to-gray-400 bg-clip-text py-1 text-center text-4xl  font-bold text-transparent sm:text-5xl md:max-w-4xl md:text-6xl lg:text-7xl",
        className
      )}
    >
      {children}
    </motion.h1>
  );
}
