import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadAvatarDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The avatar file',
    type: 'string',
    format: 'binary',
  })
  avatar: any;
}
