import { ApiProperty } from '@nestjs/swagger';

export class PaginationEntity {
  @ApiProperty({ default: 0 })
  total: number;
  @ApiProperty({ default: 1 })
  page: number;
}
