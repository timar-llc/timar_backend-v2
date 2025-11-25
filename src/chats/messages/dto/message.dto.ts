import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class MessageDto {
  @IsOptional()
  @IsString()
  messageUuid?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto: MessageDto) => !dto.senderUuid)
  @IsNotEmpty()
  chatUuid?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto: MessageDto) => !dto.chatUuid)
  @IsNotEmpty()
  senderUuid?: string;

  @IsOptional()
  @IsString()
  userUuid?: string;

  @IsOptional()
  @IsString()
  type?: 'text' | 'audio' | 'offer';

  @IsObject()
  @IsOptional()
  metadata?: {
    price?: number;
    duration?: number;
  };

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  duration?: number;

  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  attachments?: any;
}
