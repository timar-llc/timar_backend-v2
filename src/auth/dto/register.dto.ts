import {
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsStrongPassword()
  @MinLength(6)
  password: string;
}
