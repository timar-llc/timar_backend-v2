import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Category } from 'src/common/entities/category.entity';
import { ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @ValidateIf((o) => !o.isDraft)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value === '' ? undefined : value))
  title?: string;

  @ValidateIf((o) => !o.isDraft)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value === '' ? undefined : value))
  description?: string;

  @ValidateIf((o) => !o.isDraft)
  @IsNotEmpty()
  @Transform(({ value }) => (value === '' ? undefined : value))
  price?: number;

  @ValidateIf((o) => !o.isDraft)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value === '' ? undefined : value))
  categoryUuid?: string;

  @ValidateIf((o) => !o.isDraft)
  @IsNotEmpty()
  @Transform(({ value }) => (value === '' ? undefined : value))
  duration?: number;

  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files?: any;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  @Transform(({ value }) => value === 'true')
  isDraft: boolean;
}
