'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signIn } from 'next-auth/react';
import { useToast } from '../ui/use-toast';

export function SignInForm({
    setOpen,
    setIsPending,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { toast } = useToast();

    const handleSignIn = async (formData: FormData) => {
        setIsPending(true);
        try {
            signIn('credentials', {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                callbackUrl: '/dashboard',
            });
            setOpen(false);
        } catch (error) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Invalid email or password',
            });
            setIsPending(false);
        }
    };
    return (
        <form className="container mx-auto mb-24 mt-6 w-[90%]" action={handleSignIn}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/password-reset" className="ml-auto inline-block text-sm underline">
                            Forgot your password?
                        </Link>
                    </div>
                    <Input name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full mt-6 rounded-xl">
                    Sign In
                </Button>
            </div>
        </form>
    );
}
