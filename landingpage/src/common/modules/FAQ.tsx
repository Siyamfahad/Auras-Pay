import InnerContainer from "@/common/components/containers/InnerContainer";
import H2 from "@/common/components/typography/H2";
import React from "react";
import FAQItem from "./FAQItem";

type QuestionAnswer = {
  question: string;
  answer: string;
};

export type FAQType = {
  kicker?: string;
  title?: string;
  description?: string;
  faqs?: QuestionAnswer[];
};

export default function FAQ({ kicker, title, description, faqs }: FAQType) {
  return (
    <div>
      <InnerContainer>
        <span className="text-main my-3 flex items-center justify-center font-medium uppercase tracking-wider">
          {kicker}
        </span>
        <div className="text-center">
          <H2>{title}</H2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
            {description}
          </p>
        </div>

        <div className="mx-auto mt-16 flex max-w-lg flex-col gap-4">
          {faqs && faqs.map((faq, index) => <FAQItem key={index} {...faq} />)}
        </div>
      </InnerContainer>
    </div>
  );
}
