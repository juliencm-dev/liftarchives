"use client";

import { Button } from "@/components/ui/button";
import {
  DrawerTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";

import { SignUpForm } from "./signup-form";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function SignUpButton() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className='bg-violet-300 hover:bg-violet-400 w-full rounded-xl'>
          Create Account
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <ScrollArea className='overflow-y-auto'>
          <DrawerHeader>
            <DrawerTitle>Sign Up</DrawerTitle>
            <DrawerDescription className='mt-2'>
              Enter your information to create an account
            </DrawerDescription>
          </DrawerHeader>
          <SignUpForm setOpen={setOpen} />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
