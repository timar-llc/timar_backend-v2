import { OmitType } from '@nestjs/swagger';
import { ProjectParamsDto } from 'src/projects/params/project.params.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TaskParamsDto extends OmitType(ProjectParamsDto, [
  'status',
  'userUuid',
]) {
  @IsOptional()
  @IsString()
  @ApiProperty({ enum: ['easy', 'medium', 'hard'] })
  complexity?: 'easy' | 'medium' | 'hard';

  @IsOptional()
  @ApiProperty({ enum: ['easy', 'medium', 'hard'], isArray: true })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const arr = Array.isArray(value) ? value : String(value).split(/[,&]/);
    return arr.map((v) => String(v).trim()).filter(Boolean);
  })
  complexities?: ('easy' | 'medium' | 'hard')[];

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsString()
  lang: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  my?: boolean;

  @IsOptional()
  @ApiProperty({ type: [String] })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const arr = Array.isArray(value) ? value : String(value).split(/[,&]/);
    return arr.map((v) => String(v).trim()).filter(Boolean);
  })
  categorySlugs?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: [
      'createdAtAsc',
      'createdAtDesc',
      'priceAsc',
      'priceDesc',
      'respondesCountAsc',
      'respondesCountDesc',
    ],
  })
  orderBy?:
    | 'createdAtAsc'
    | 'createdAtDesc'
    | 'priceAsc'
    | 'priceDesc'
    | 'respondesCountAsc'
    | 'respondesCountDesc';
}
