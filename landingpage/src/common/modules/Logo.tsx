import React from "react";
import Link from "next/link";
import NextImage from "../components/images/NextImage";
import LogoImage from "@/assets/images/paylogo.svg";

export default function Logo() {
  return (
    <Link href={"/"}>
      <div className="flex items-center">
        <NextImage
          src={LogoImage}
          alt="AURAS Pay"
          height={40}
          className="inline-block max-w-[120px] sm:max-w-none"
        />
      </div>
    </Link>
  );
}
