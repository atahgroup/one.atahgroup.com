"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBarItem = (props: {
  label: string;
  href: string;
  onClick?: () => void;
}) => {
  const currentPath = usePathname();
  const isSelected = currentPath === props.href;

  const linkClassName = `w-full text-center py-2 px-6 cursor-pointer text-foreground transition duration-200 hover:underline hover:underline-offset-6 whitespace-nowrap${
    isSelected ? " underline underline-offset-6" : ""
  }`;

  return (
    <Link href={props.href} className={linkClassName} onClick={props.onClick}>
      {props.label}
    </Link>
  );
};
