import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SetNewPasswordDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
