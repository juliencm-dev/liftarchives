"use client";

import { usePathname } from "next/navigation";

import { BookOpenText, CircleUserRound, Dumbbell, HouseIcon } from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer() {
  const pathname = usePathname();

  const navigationOptions = [
    { name: "Dashboard", icon: <HouseIcon />, href: "/dashboard" },
    { name: "Lifts", icon: <Dumbbell />, href: "/lifts" },
    { name: "Programs", icon: <BookOpenText />, href: "/programs" },
    { name: "Account", icon: <CircleUserRound />, href: "/account" },
  ];

  return (
    <footer className="fixed flex bg-neutral-800 bottom-0 py-3 w-full  items-center justify-around text-sm text-muted-foreground border-t border-muted">
      {navigationOptions.map(option => (
        <Link href={option.href} key={option.name} className={cn("flex flex-col gap-1 justify-center items-center hover:text-primary transition-all duration-200", currentActivePath(pathname, option.href))}>
          {option.icon}
          {option.name}
        </Link>
      ))}
    </footer>
  );
}

const currentActivePath = (pathname: string, href: string): string => {
  return pathname === href ? "text-violet-300 hover:text-violet-300" : "text-muted-foreground";
};
