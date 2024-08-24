"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./signin-form";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

export default function SignInButton() {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className='w-full rounded-xl'
          disabled={isPending}>
          {isPending ? <PulseLoader size={4} /> : "Sign In"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sign In</DrawerTitle>
          <DrawerDescription className='mt-2'>
            Enter your email and password to sign in.
          </DrawerDescription>
        </DrawerHeader>
        <SignInForm
          setOpen={setOpen}
          setIsPending={setIsPending}
        />
      </DrawerContent>
    </Drawer>
  );
}
