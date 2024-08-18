import {
  BookOpenText,
  CircleUserRound,
  Dumbbell,
  HouseIcon,
} from "lucide-react";

import Link from "next/link";

export default function Footer() {
  const navigationOptions = [
    { name: "Dashboard", icon: <HouseIcon />, href: "/dashboard" },
    { name: "Lifts", icon: <Dumbbell />, href: "/lifts" },
    { name: "Programs", icon: <BookOpenText />, href: "/programs" },
    { name: "Account", icon: <CircleUserRound />, href: "/account" },
  ];

  return (
    <footer className='fixed bottom-0 py-3 w-full flex items-center justify-around px-2 text-sm text-muted-foreground border-t border-border'>
      {navigationOptions.map((option) => (
        <Link
          href={option.href}
          key={option.name}
          className='flex flex-col gap-1 justify-center items-center hover:text-primary transition-all duration-200'>
          {option.icon}
          {option.name}
        </Link>
      ))}
    </footer>
  );
}
