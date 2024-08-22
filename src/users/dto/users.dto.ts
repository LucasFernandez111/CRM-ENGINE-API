import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  id_token: string;
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
