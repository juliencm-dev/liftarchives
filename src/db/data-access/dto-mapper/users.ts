import { User, UserInformation } from "@/db/schema";
import { UserDto, UserInformationDto } from "@/db/data-access/dto/users/types";

/**
 * Maps an array of UserWithRelations objects to an array of UserDto objects.
 * @param users - The array of UserWithRelations objects to be mapped.
 * @returns An array of UserDto objects.
 */
export async function toUserDtoMapper(users: User[]): Promise<UserDto[]> {
  return users.map((user) => {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt?.toDateString() ?? "",
    } as UserDto;
  });
}

export async function toUserInformationDtoMapper(
  userInformation: UserInformation
): Promise<UserInformationDto> {
  return {
    age: userInformation.age,
    weight: Number(userInformation.weight),
    liftsUnit: userInformation.liftsUnit,
  };
}
