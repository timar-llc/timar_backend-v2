import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
