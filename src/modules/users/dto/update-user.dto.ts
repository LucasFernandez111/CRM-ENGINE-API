import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  sheetId?: string;
}
