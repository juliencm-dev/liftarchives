'use client';

import { useEffect, useState } from 'react';
import { signUpUser } from '@/actions/auth/signup-user';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '../ui/use-toast';
import { ServerResponseMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export function SignUpForm({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [isValid, setIsValid] = useState<Boolean>(false);
    const [passwordIsConfirmed, setPasswordIsConfirmed] = useState<Boolean>(false);

    const [passwordInputType, setPasswordInputType] = useState<string>('password');

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const { toast } = useToast();

    const handleSignUp = async (formData: FormData) => {
        signUpUser(formData).then((response: ServerResponseMessage) => {
            if (response.status !== 500) {
                toast({
                    title: 'Success',
                    description: response.message,
                });
                setOpen(false);
            } else {
                toast({
                    title: 'Error',
                    variant: 'destructive',
                    description: response.message,
                });
            }
        });
    };

    const handleIsValid = () => {
        if (firstName && lastName && email && passwordIsConfirmed && password !== '') {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    useEffect(() => {
        handleIsValid();
    }, [firstName, lastName, email, passwordIsConfirmed]);

    useEffect(() => {
        if (password === confirmPassword) {
            setPasswordIsConfirmed(true);
        } else {
            setPasswordIsConfirmed(false);
        }
    }, [password, confirmPassword]);

    const handlePasswordInputType = () => {
        if (passwordInputType === 'password') {
            setPasswordInputType('text');
        } else {
            setPasswordInputType('password');
        }
    };

    return (
        <form className="container mx-auto mb-24 mt-6 w-[90%]" action={handleSignUp}>
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                            name="firstName"
                            value={firstName}
                            placeholder="Max"
                            onChange={(e) => setFirstName(e.target.value as string)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input
                            name="lastName"
                            value={lastName}
                            placeholder="Robinson"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="m@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={passwordInputType}
                        />
                        <Eye
                            className={
                                (cn(passwordInputType === 'password' ? '' : 'hidden'),
                                'absolute right-3 top-2 cursor-pointer')
                            }
                            onClick={handlePasswordInputType}
                        />
                        <EyeOff
                            className={cn(
                                passwordInputType === 'text' ? '' : 'hidden',
                                'absolute right-3 top-2 cursor-pointer'
                            )}
                            onClick={handlePasswordInputType}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label className={cn(passwordIsConfirmed ? '' : 'text-red-500')} htmlFor="password">
                        Password (confirmation)
                    </Label>
                    <div className="relative">
                        <Input
                            value={confirmPassword}
                            className={cn(passwordIsConfirmed ? '' : 'border-red-500')}
                            type={passwordInputType}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Eye
                            className={
                                (cn(passwordInputType === 'password' ? '' : 'hidden'),
                                'absolute right-3 top-2 cursor-pointer')
                            }
                            onClick={handlePasswordInputType}
                        />
                        <EyeOff
                            className={cn(
                                passwordInputType === 'text' ? '' : 'hidden',
                                'absolute right-3 top-2 cursor-pointer'
                            )}
                            onClick={handlePasswordInputType}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full rounded-xl mt-6" disabled={!isValid}>
                    Create an account
                </Button>
            </div>
        </form>
    );
}
