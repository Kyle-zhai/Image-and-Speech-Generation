import * as React from "react";
import NextLink from "next/link";

type Props = React.ComponentProps<typeof NextLink> & {
  underline?: boolean;
};

export function Link({ underline = true, className = "", ...rest }: Props) {
  return (
    <NextLink
      {...rest}
      className={`text-primary hover:underline ${underline ? "underline-offset-2" : ""} ${className}`}
    />
  );
}
