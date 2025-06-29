import InnerContainer from "@/common/components/containers/InnerContainer";
import H2 from "@/common/components/typography/H2";
import React from "react";
import UserReviewGradientBackground from "@/assets/images/UserReviews.Gradient.svg";
import GradientBackgroundImage from "@/common/components/backgrounds/GradientBackgroundImage";
import Container from "@/common/components/containers/Container";
import UserReviewCard, {
  UserReviewType,
} from "@/common/components/cards/UserReviewCard";
import NextButton, { ButtonType } from "@/common/components/buttons/NextButton";

export type UserReviewSectionType = {
  kicker?: string;
  title?: string;
  buttons?: ButtonType[];
  userReviews?: UserReviewType[];
};

export default function UserReviews({
  kicker,
  title,
  buttons,
  userReviews,
}: UserReviewSectionType) {
  return (
    <>
      <GradientBackgroundImage src={UserReviewGradientBackground} />
      <InnerContainer className="text-center">
        <span className="text-main my-3 flex items-center justify-center font-medium uppercase tracking-wider">
          {kicker}
        </span>
        <H2>{title}</H2>
        <div className="mt-10 mb-20 flex flex-wrap justify-center gap-6">
          {buttons &&
            buttons.map((button, index) => (
              <NextButton {...button} key={index} />
            ))}
        </div>
      </InnerContainer>
      <Container>
        <div className="my-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {userReviews &&
            userReviews.map((userReview, index) => (
              <UserReviewCard {...userReview} key={index} />
            ))}
        </div>
      </Container>
    </>
  );
}
