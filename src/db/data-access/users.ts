import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import {
  UserDto,
} from "@/db/data-access/dto/users/types";
import { auth } from "@/auth";
import { cache } from "react";
import { toUserDtoMapper } from "@/db/data-access/dto-mapper/users";

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
    with: {
      availability: true,
      absences: true,
    },
  });

  if (!foundUser) {
    throw new Error("Could not find user with that id");
  }

  return (await toUserDtoMapper([foundUser]))[0];
});

export async function updateUserAvatar({ avatarKey }: { avatarKey: string }) {
  try {
    const userId = await getAuthenticatedUserId();
    await db
      .update(users)
      .set({
        image: avatarKey,
      })
      .where(eq(users.id, userId));
  } catch (error) {
    throw new Error("Failed to update user's avatar");
  }
}
