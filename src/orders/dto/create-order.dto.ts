import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEnum(['active', 'pending', 'completed', 'cancelled'])
  @IsNotEmpty()
  status: 'active' | 'pending' | 'completed' | 'cancelled';

  @IsString()
  @IsOptional()
  respondUuid?: string;

  @IsString()
  @IsNotEmpty()
  clientUuid: string;

  @IsString()
  @IsNotEmpty()
  freelancerUuid: string;

  @IsString()
  @IsOptional()
  taskUuid?: string;
}
