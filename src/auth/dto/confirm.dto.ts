import {
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmWithNumberDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  code: string;
}
export class ConfirmWithEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code: string;
}

export class ConfirmDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsNotEmpty()
  code: string;
}

export enum ConfirmCodeTypeEnum {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset-password',
}

export class ConfirmCodeType {
  @IsEnum(ConfirmCodeTypeEnum)
  @ApiProperty({
    enum: ConfirmCodeTypeEnum,
    description: 'The type of code to confirm',
  })
  type: ConfirmCodeTypeEnum;
}
