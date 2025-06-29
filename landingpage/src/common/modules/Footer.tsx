import React from "react";
import Container from "@/common/components/containers/Container";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconMail,
} from "@tabler/icons";
import Logo from "./Logo";
import { ButtonType } from "../components/buttons/NextButton";
import Link from "next/link";
import { scrollIfNoHash } from "../utils/LinkScrollHelper";

type LinkGroup = {
  title: string;
  links: ButtonType[];
};

type SocialMedia = {
  title: string;
  link: string;
};

export type FooterType = {
  description?: string;
  copyright?: string;
  linkGroups?: LinkGroup[];
  twitter?: SocialMedia;
  facebook?: SocialMedia;
  instagram?: SocialMedia;
  email?: string;
};

export default function Footer({
  copyright,
  description,
  linkGroups,
  email,
  twitter,
  facebook,
  instagram,
}: FooterType) {
  return (
    <footer className="relative border-t border-neutral-700/20 py-10 px-6">
      <Container>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-10 md:items-start lg:flex-nowrap">
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <Logo />
            <p className="my-4 font-medium leading-relaxed tracking-wide text-gray-400">
              {description}
            </p>
          </div>
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3 sm:gap-10 md:grid-cols-4">
              {linkGroups &&
                linkGroups.map((linkGroup, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 ">
                      {linkGroup.title}
                    </h3>
                    <ul className="mt-4 space-y-2 text-gray-400">
                      {linkGroup.links.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="inline-link"
                            scroll={scrollIfNoHash(link.href)}
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 ">
                  Contact
                </h3>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <a
                      href={"mailto:" + email}
                      className="inline-link flex gap-2"
                    >
                      <IconMail size={18} /> {email}
                    </a>
                  </li>

                  <li className="flex w-auto items-center justify-start gap-2 ">
                    <a
                      href={twitter?.link}
                      className="inline-link flex gap-2"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <IconBrandTwitter size={18} /> {twitter?.title}
                    </a>
                  </li>

                  <li className="flex w-auto items-center justify-start gap-2 ">
                    <a
                      href={facebook?.link}
                      className="inline-link flex gap-2"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <IconBrandFacebook size={18} /> {facebook?.title}
                    </a>
                  </li>

                  <li className="flex w-auto items-center justify-start gap-2 ">
                    <a
                      href={instagram?.link}
                      className="inline-link flex gap-2"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <IconBrandInstagram size={18} /> {instagram?.title}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-between text-sm leading-relaxed tracking-wide text-gray-400">
          <div>
            © {new Date().getFullYear()} {copyright}
          </div>
        </div>
      </Container>
    </footer>
  );
}
