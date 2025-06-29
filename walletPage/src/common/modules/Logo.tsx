import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/assets/images/logo.jpeg";

export default function Logo() {
  return (
    <Link href={"/"}>
      <div className="flex items-center">
        <Image
          src={LogoImage}
          alt="AURAS Wallet Logo"
          width={200}
          height={66}
          className="h-auto w-auto max-h-16"
          priority
        />
      </div>
    </Link>
  );
}
