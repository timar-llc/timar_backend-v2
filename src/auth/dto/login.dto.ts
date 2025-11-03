import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string;
}
export class LoginWithPhoneDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
export class LoginWithEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string;
}

export class RefreshDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class JwtResponseDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
export class JwtRefreshDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
