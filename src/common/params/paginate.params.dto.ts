import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginateParamsDto {
  @ApiProperty({ default: 10 })
  @IsOptional()
  take: number = 10;
  @ApiProperty({ default: 0 })
  @IsOptional()
  skip: number = 0;
}
