import {
  ANIMATE_BUTTON,
  ANIMATE_SUBTITLE,
} from "@/common/animations/Animations";
import Container from "@/common/components/containers/Container";
import NextImage, { ImageType } from "@/common/components/images/NextImage";
import { motion } from "framer-motion";
import React from "react";
import BigTitle from "@/common/components/typography/BigTitle";
import NotificationTag, {
  NotificationType,
} from "@/common/components/tags/NotificationTag";
import { ButtonType } from "@/common/components/buttons/NextButton";
import NextButton from "@/common/components/buttons/NextButton";

export type HeroType = {
  notfication?: NotificationType;
  title: string;
  description?: string;
  buttons?: ButtonType[];
  image: ImageType;
};

export default function Hero({
  notfication,
  buttons,
  title,
  description,
  image,
}: HeroType) {
  return (
    <Container>
      <div className="my-6 mx-auto w-full max-w-4xl pt-4 text-center lg:pt-14">
        <NotificationTag
          text={notfication?.text}
          tag={notfication?.tag}
          href={notfication?.href}
          button={notfication?.button}
        />
        <BigTitle>{title}</BigTitle>

        <motion.p
          initial="hidden"
          whileInView="show"
          variants={ANIMATE_SUBTITLE}
          viewport={{ once: true }}
          className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400"
        >
          {description}
        </motion.p>

        <div className="mt-4 flex flex-wrap justify-center gap-4 sm:mt-6 sm:gap-6">
          {buttons &&
            buttons.map((button, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="show"
                variants={ANIMATE_BUTTON}
                viewport={{ once: true }}
                className="relative flex  items-center justify-center"
              >
                <NextButton
                  href={button.href}
                  title={button.title}
                  type={button.type}
                />
              </motion.div>
            ))}
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center overflow-hidden sm:mt-14 sm:px-10 md:px-0">
        <NextImage
          src={image.src}
          width={image.width}
          className=""
          priority
          sizes="(max-width: 768px) 70vw, 100vw"
        />
      </div>
    </Container>
  );
}
