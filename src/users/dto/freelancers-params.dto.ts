import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
import { Transform } from 'class-transformer';

export class FreelancersParamsDto extends PaginateParamsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({ required: false })
  minRating?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({ required: false })
  maxRating?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  specialization?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const arr = Array.isArray(value) ? value : String(value).split(/[,&]/);
    return arr.map((v) => String(v).trim()).filter(Boolean);
  })
  skills?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value;
  })
  @IsEnum(
    [
      'ratingDesc',
      'ratingAsc',
      'createdAtDesc',
      'createdAtAsc',
      'priceAsc',
      'priceDesc',
    ],
    {
      message:
        'orderBy must be one of the following values: ratingDesc, ratingAsc, createdAtDesc, createdAtAsc, priceAsc, priceDesc',
    },
  )
  @ApiProperty({
    enum: [
      'ratingDesc',
      'ratingAsc',
      'createdAtDesc',
      'createdAtAsc',
      'priceAsc',
      'priceDesc',
    ],
    required: false,
  })
  orderBy?:
    | 'ratingDesc'
    | 'ratingAsc'
    | 'createdAtDesc'
    | 'createdAtAsc'
    | 'priceAsc'
    | 'priceDesc';
}
