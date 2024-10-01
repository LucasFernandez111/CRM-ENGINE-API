import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/schemas';

type PartialUser = Omit<User, 'address' | 'company' | 'phone' | 'sheetId' | 'phone' | 'refresh_token'>;
export class CreateUserDto implements PartialUser {
  @IsNotEmpty()
  @IsString()
  id_token: string;
  // @IsNotEmpty()
  // refresh_token: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  picture: string;
}
