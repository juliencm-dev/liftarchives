import { User } from "@/db/schema";
import { UserDto } from "@/db/data-access/dto/users/types";

/**
 * Maps an array of UserWithRelations objects to an array of UserDto objects.
 * @param users - The array of UserWithRelations objects to be mapped.
 * @returns An array of UserDto objects.
 */
export async function toUserDtoMapper(users: User[]): Promise<UserDto[]> {
  return users.map(user => {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    } as UserDto;
  });
}
