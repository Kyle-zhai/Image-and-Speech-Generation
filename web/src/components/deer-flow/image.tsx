"use client";

import * as React from "react";
import NextImage from "next/image";

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;

  children?: React.ReactNode;
};

export default function DFImage({
  src,
  alt = "image",
  width = 512,
  height = 512,
  className = "",
  children,
}: Props) {
  if (!src) return null;

  return (
    <span className={`inline-block ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        className="rounded-md max-w-full h-auto"
      />
      {children}
    </span>
  );
}
