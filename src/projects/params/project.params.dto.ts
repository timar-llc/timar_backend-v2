import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProjectParamsDto extends PaginateParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryUuid?: string;

  @IsString()
  userUuid?: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @ApiProperty({ enum: ['pending', 'approved', 'rejected'] })
  status?: 'pending' | 'approved' | 'rejected';

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  isDraft?: boolean;
}
