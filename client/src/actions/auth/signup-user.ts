'use server';

import bcrypt from 'bcryptjs';

import { createUser } from '@/db/data-access/users';
import { NewUserDto } from '@/db/data-access/dto/users/types';
import { ServerResponseMessage } from '@/lib/types';

export async function signUpUser(data: FormData): Promise<ServerResponseMessage> {
    const hashedPassword = await bcrypt.hash(data.get('password') as string, 10);

    const newUser: NewUserDto = {
        email: data.get('email') as string,
        password: hashedPassword,
        firstName: data.get('firstName') as string,
        lastName: data.get('lastName') as string,
    };

    try {
        await createUser(newUser);
    } catch (error: any) {
        return {
            message: error.message,
            status: 500,
        };
    }

    // Confirmation email logic goes here

    return {
        message: 'User created successfully',
        status: 200,
    };
}
