import React from "react";
import InnerContainer from "../components/containers/InnerContainer";
import BlogCard, { BlogCardType } from "../components/cards/BlogCard";
import classNames from "classnames";

export type BlogSectionType = {
  items: BlogCardType[];
  columns?: 2 | 3;
  type?: "small" | "large";
  maxItems?: number;
};

export default function BlogGridItems({
  items,
  columns = 2,
  type = "large",
  maxItems = 6,
}: BlogSectionType) {
  const columnsClass = columns == 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <InnerContainer>
      <div
        className={classNames(
          "grid grid-cols-1 items-start gap-20 sm:grid-cols-2",
          columnsClass
        )}
      >
        {items.map((item, index) => {
          if (index < maxItems) {
            return <BlogCard key={index} {...item} type={type} />;
          }
        })}
      </div>
    </InnerContainer>
  );
}
