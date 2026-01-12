export class YookassaPaymentResponseDto {
  id: string;
  status: string;
  amount: {
    value: number;
    currency: string;
  };
  created_at: string;
  description: string;
  metadata: {
    transactionUuid: string;
  };
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  test: boolean;
  recipent: {
    account_id: string;
    gateway_id: string;
  };
}

import {
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class YookassaPaymentMetadataDto {
  @IsString()
  transactionUuid: string;
}

class YookassaPaymentObjectDto {
  @ValidateNested()
  @Type(() => YookassaPaymentMetadataDto)
  metadata: YookassaPaymentMetadataDto;

  @IsOptional()
  @IsObject()
  payment_method?: any;

  @IsOptional()
  id?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  amount?: any;

  @IsOptional()
  income_amount?: any;

  @IsOptional()
  description?: string;

  @IsOptional()
  recipient?: any;

  @IsOptional()
  captured_at?: string;

  @IsOptional()
  created_at?: string;

  @IsOptional()
  test?: boolean;

  @IsOptional()
  refunded_amount?: any;

  @IsOptional()
  paid?: boolean;

  @IsOptional()
  refundable?: boolean;
}

export class YookassaPaymentCallbackDto {
  @IsString()
  type: string;

  @IsEnum([
    'payment.succeeded',
    'payment.canceled',
    'payment.waiting_for_capture',
  ])
  event:
    | 'payment.succeeded'
    | 'payment.canceled'
    | 'payment.waiting_for_capture';

  @ValidateNested()
  @Type(() => YookassaPaymentObjectDto)
  object: YookassaPaymentObjectDto;
}

export class YookassaPaymentRequestDto {
  amount: number;
  transactionUuid: string;
  paymentMethod: 'card' | 'crypto' | 'sbp';
}
