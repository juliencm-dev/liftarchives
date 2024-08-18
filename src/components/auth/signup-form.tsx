"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signUpUser } from "@/actions/auth/signup-user";

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
import { useToast } from "../ui/use-toast";
import { ServerResponseMessage } from "@/lib/types";

export function SignUpForm() {
  const [isValid, setIsValid] = useState<Boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { toast } = useToast();

  const handleSignUp = async (formData: FormData) => {
    signUpUser(formData).then((response: ServerResponseMessage) => {
      if (response.status !== 500) {
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message,
        });
      }
    });
  };

  const handleIsValid = () => {
    if (firstName && lastName && email && password === confirmPassword) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    handleIsValid();
  }, [firstName, lastName, email, password, confirmPassword]);

  return (
    <Card className='max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={handleSignUp}
          className='grid gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='first-name'>First name</Label>
              <Input
                name='firstName'
                value={firstName}
                placeholder='Max'
                onChange={(e) => setFirstName(e.target.value as string)}
                required
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='last-name'>Last name</Label>
              <Input
                name='lastName'
                value={lastName}
                placeholder='Robinson'
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              name='email'
              value={email}
              placeholder='m@example.com'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='password'>Password (confirmation)</Label>
            <Input
              value={confirmPassword}
              type='password'
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button
            type='submit'
            className='w-full'
            disabled={!isValid}>
            Create an account
          </Button>
        </form>
        <div className='mt-4 text-center text-sm'>
          Already have an account?{" "}
          <Link
            href='/'
            className='underline'>
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
