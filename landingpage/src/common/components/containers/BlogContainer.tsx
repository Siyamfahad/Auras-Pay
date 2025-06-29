import BlogGridItems from "@/common/modules/BlogGridItems";
import { BlogSectionContent } from "@/content/BlogSection.Content";
import React from "react";
import BlogContentContainer from "./BlogContentContainer";
import Section from "./Section";

type Props = {
  children?: React.ReactNode;
};

export default function BlogContainer({ children }: Props) {
  return (
    <>
      <Section>
        <BlogContentContainer>{children}</BlogContentContainer>
      </Section>
      <Section background="lighter">
        <BlogGridItems
          {...BlogSectionContent}
          columns={3}
          type={"small"}
          maxItems={3}
        />
      </Section>
    </>
  );
}
