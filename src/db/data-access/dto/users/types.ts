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
  age: number;
  weight: number;
  liftsUnit: string;
};
