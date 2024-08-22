export type UserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type NewUserDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UserInformationDto = {
  birthYear: number;
  weight: number;
  liftsUnit: string;
  gender: string;
  division: string;
};
