import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { User, UserLift, users, usersLifts } from "@/db/schema";
import { NewUserDto, UserDto } from "@/db/data-access/dto/users/types";
import { auth } from "@/auth";
import { cache } from "react";
import { toUserDtoMapper } from "@/db/data-access/dto-mapper/users";
import { getBenchmarkLifts } from "./lifts";

export const getAuthenticatedUserId = cache(async (): Promise<string> => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  return user.id;
});

/**
 * Retrieves the current authenticated user.
 * @returns A Promise that resolves to a UserDto object representing the current user.
 * @throws An error if the user is not authenticated or if the user cannot be found.
 *
 * Return of this function is cached for 30 minutes.
 */
export const getCurrentUser = cache(async (): Promise<UserDto> => {
  const userId = await getAuthenticatedUserId();

  const foundUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!foundUser) {
    throw new Error("Could not find user with that id");
  }

  return (await toUserDtoMapper([foundUser]))[0];
});

/**
 *
 * Creates a new user.
 * @param user
 * @returns
 */

export const createUser = async (user: NewUserDto): Promise<User> => {
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, user.email),
  });

  if (existingUser) {
    throw new Error("User with that email already exists");
  }

  try {
    const createdUser: User[] = await db
      .insert(users)
      .values({
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .returning();

    if (!createdUser) {
      throw new Error("Could not create user");
    }

    const benchmarkLifts = await getBenchmarkLifts();

    benchmarkLifts.forEach(async lift => {
      await db.insert(usersLifts).values({
        userId: createdUser[0].id,
        liftId: lift.id,
        oneRepMax: null,
        oneRepMaxDate: null,
      } as UserLift);
    });

    return createdUser[0];
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
