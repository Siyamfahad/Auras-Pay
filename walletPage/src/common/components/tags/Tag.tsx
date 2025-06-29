import React from "react";

export type TagType = {
  icon?: React.ReactNode;
  label?: string;
};

export default function Tag({ icon, label }: TagType) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-md border border-neutral-700/30 bg-neutral-800/50 py-1 px-3  ">
      {icon} {label}
    </div>
  );
}
