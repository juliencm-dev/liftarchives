"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./signin-form";
import { useState } from "react";

export default function SignInButton() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className='w-full rounded-xl'>Sign In</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <h2 className='text-xl font-bold'>Sign In</h2>
          <DrawerDescription className='text-sm text-muted-foreground'>
            Enter your email and password to sign in.
          </DrawerDescription>
        </DrawerHeader>
        <SignInForm setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}
