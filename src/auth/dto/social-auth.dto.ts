import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SocialAuthDto {
  @IsOptional()
  firstName?: string;
  @IsNotEmpty()
  id: string;
  @IsOptional()
  username?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  avatar?: string;
}

enum SocialProviderEnum {
  TELEGRAM = 'telegram',
  GOOGLE = 'google',
  GITHUB = 'github',
}
export class SocialProvider {
  @IsEnum(SocialProviderEnum)
  @ApiProperty({
    enum: SocialProviderEnum,
    description: 'The provider of the social auth',
  })
  provider: SocialProviderEnum;
}
