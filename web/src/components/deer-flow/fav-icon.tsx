import * as React from "react";
import Image from "next/image";

export function FavIcon({
  size = 16,
  className = "",
}: { size?: number; className?: string }) {
  return (
    <Image
      src="/favicon.ico"
      alt="DeerFlow favicon"
      width={size}
      height={size}
      className={className}
    />
  );
}
