import { IconArrowNarrowRight } from "@tabler/icons";
import React from "react";

export type NotificationType = {
  text?: string;
  tag?: string;
  href?: string;
  button?: string;
};

export default function NotificationTag({
  text,
  tag,
  href,
  button,
}: NotificationType) {
  return (
    <div className="mx-auto mb-6 hidden cursor-pointer items-center justify-center transition-all duration-300 sm:flex">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-800/50 bg-neutral-900/60 py-[5px] pr-5 pl-2 text-xs leading-[0] text-neutral-300 backdrop-blur transition-all duration-300 hover:bg-neutral-900/80 sm:rounded-full ">
        <div className="bg-main button-text flex rounded-full py-2 px-2 text-[10px] uppercase ">
          {tag}
        </div>
        {text}
        <form action={href}>
          <button className="text-[10px]underline-offset-4 text-main text-main-hover flex items-center  gap-2  font-medium transition-all hover:underline">
            {button} <IconArrowNarrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
