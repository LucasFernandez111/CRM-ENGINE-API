import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  sheet?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
