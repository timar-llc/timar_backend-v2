import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  chatUuid: string;

  @IsString()
  @IsNotEmpty()
  senderUuid: string;

  @IsString()
  @IsNotEmpty()
  type: 'text' | 'audio' | 'offer';

  @IsObject()
  @IsOptional()
  metadata?: {
    price?: number;
    duration?: number;
  };

  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  attachments?: any;
}
