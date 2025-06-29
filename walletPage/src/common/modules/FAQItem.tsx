import { IconCircleMinus } from "@tabler/icons";
import React, { useState } from "react";

type FAQItemType = {
  question: string;
  answer: string;
};

export default function FAQItem({ question, answer }: FAQItemType) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:bg-neutral-900/80">
      <div
        className="flex cursor-pointer items-center justify-between gap-10 px-6 py-4 text-base leading-relaxed tracking-wide text-gray-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-sm sm:text-base">
          {question}
        </div>
        <IconCircleMinus className="shrink-0 text-neutral-600" />
      </div>
      {isOpen && (
        <div className="border-t border-neutral-800/80 bg-black/40 px-6 py-4 text-xs leading-relaxed tracking-wide text-gray-400 sm:text-sm">
          {answer}
        </div>
      )}
    </div>
  );
}
