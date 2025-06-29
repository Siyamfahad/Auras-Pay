import NavigationMenu from "@/common/modules/NavigationMenu";
import NavigationContent from "@/content/Navigation.Content";
import React from "react";
import Footer from "@/common/modules/Footer";
import FooterContent from "@/content/Footer.Content";

/**
 * AppLayout Component
 * @param {React.ReactNode} children
 * @returns {JSX.Element} JSX.Element
 * @description This is the main layout for the application.
 */

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <>
      {/* Navigation Menu with Logo */}
      <NavigationMenu {...NavigationContent} />

      {children}

      {/* Footer Section */}
      <Footer {...FooterContent} />
    </>
  );
}
