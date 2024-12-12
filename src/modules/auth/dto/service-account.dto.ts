import { IsNotEmpty, IsString } from 'class-validator';

export class ServiceAccountDTO {
  @IsNotEmpty()
  @IsString()
  private_key: string;

  @IsNotEmpty()
  @IsString()
  client_email: string;
}
