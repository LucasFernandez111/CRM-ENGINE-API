import { IsString, IsArray, MaxLength, MinLength } from 'class-validator';
export class UpdateSheetDto {
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  range: string;

  @IsArray()
  values: string[];
}
