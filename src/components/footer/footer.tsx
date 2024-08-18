import {
  BookOpenText,
  CircleEllipsis,
  Dumbbell,
  HouseIcon,
} from "lucide-react";

export default function Footer() {
  const navigationOptions = [
    { name: "Dashboard", icon: <HouseIcon /> },
    { name: "Lifts", icon: <Dumbbell /> },
    { name: "Programs", icon: <BookOpenText /> },
    { name: "More", icon: <CircleEllipsis /> },
  ];

  return (
    <footer className='fixed bottom-0 py-3 w-full flex items-center justify-around px-2 text-sm text-muted-foreground border-t border-border'>
      {navigationOptions.map((option) => (
        <div
          key={option.name}
          className='flex flex-col gap-1 justify-center items-center'>
          {option.icon}
          {option.name}
        </div>
      ))}
    </footer>
  );
}
