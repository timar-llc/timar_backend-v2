import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class HeleketPaymentRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Amount in rubles' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Currency' })
  currency: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Order ID' })
  orderId: string;
}

export class HeleketPaymentResponseDto {
  state: number;
  result: HeleketPaymentResponseResult;
}

export class HeleketPaymentResponseResult {
  uuid: string;
  order_id: string;
  amount: string;
  payer_currency: string;
  currency: string;
  comments: any;
  merchant_amount: string;
  network: string;
  address: string;
  from: any;
  txid: any;
  payment_status: string;
  url: string;
  expired_at: number;
  status: string;
  is_final: boolean;
  created_at: string;
  updated_at: string;
  commission: string;
  address_qr_code: string;
}
