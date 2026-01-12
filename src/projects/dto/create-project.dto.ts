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
import { ProjectMedia } from '../entities/projectMedia.entity';
import { ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @ValidateIf((o) => !o.isDraft)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ValidateIf((o) => !o.isDraft)
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf((o) => !o.isDraft)
  @IsNotEmpty()
  price?: number;

  @ValidateIf((o) => !o.isDraft)
  @IsString()
  @IsNotEmpty()
  categoryUuid?: string;

  @ValidateIf((o) => !o.isDraft)
  @IsNotEmpty()
  duration?: number;

  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  media?: any;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  isDraft: boolean;

  @ValidateIf((o) => !o.isDraft)
  @IsArray()
  @IsNotEmpty()
  technologies?: string[];
}
