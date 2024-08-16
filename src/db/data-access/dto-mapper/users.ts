import { UserWithRelations } from "@/db/schema";
import { UserDto } from "@/db/data-access/dto/users/types";

/**
 * Maps an array of UserWithRelations objects to an array of UserDto objects.
 * @param users - The array of UserWithRelations objects to be mapped.
 * @returns An array of UserDto objects.
 */
export async function toUserDtoMapper(users: UserWithRelations[]): Promise<UserDto[]> {
  return users.map(user => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      image: user.image,
    } as UserDto;
  });
}

