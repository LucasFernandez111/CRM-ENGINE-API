import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleKeyServiceAccountDTO {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  project_id: string;

  @IsNotEmpty()
  @IsString()
  private_key_id: string;

  @IsNotEmpty()
  @IsString()
  private_key: string;

  @IsNotEmpty()
  @IsString()
  client_email: string;

  @IsNotEmpty()
  @IsString()
  client_id: number;

  @IsNotEmpty()
  @IsString()
  auth_uri: string;

  @IsNotEmpty()
  @IsString()
  token_uri: string;

  @IsNotEmpty()
  @IsString()
  auth_provider_x509_cert_url: string;

  @IsNotEmpty()
  @IsString()
  client_x509_cert_url: string;

  @IsNotEmpty()
  @IsString()
  universe_domain: string;
}
