"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

import { signIn } from "next-auth/react";
import { useToast } from "../ui/use-toast";

export function SignInForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSignIn = async (formData: FormData) => {
    setIsPending(true);
    try {
      signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Invalid email or password",
      });
      setIsPending(false);
    }
  };
  return (
    <form action={handleSignIn}>
      <Card className='mx-auto max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                name='email'
                type='email'
                placeholder='m@example.com'
                required
              />
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  href='/password-reset'
                  className='ml-auto inline-block text-sm underline'>
                  Forgot your password?
                </Link>
              </div>
              <Input
                name='password'
                type='password'
                required
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={isPending}>
              {isPending ? <PulseLoader size={4} /> : "Sign In"}
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{" "}
            <Link
              href='/signup'
              className='underline'>
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
