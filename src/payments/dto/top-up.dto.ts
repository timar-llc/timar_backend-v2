import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TopUpDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Amount in rubles' })
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Amount with commission' })
  amountWithCommission: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Payment method' })
  paymentMethod: 'card' | 'crypto' | 'sbp';
}
