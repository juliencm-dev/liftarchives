"use client";

import { Button } from "@/components/ui/button";
import {
  DrawerTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
} from "@/components/ui/drawer";

import { SignUpForm } from "./signup-form";
import { useState } from "react";

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
        <DrawerHeader>
          <h2 className='text-xl font-bold'>Sign Up</h2>
          <DrawerDescription className='text-sm text-muted-foreground'>
            Enter your information to create an account
          </DrawerDescription>
        </DrawerHeader>
        <SignUpForm setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}
