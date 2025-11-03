import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateRespondDto {
  @IsString()
  @IsNotEmpty()
  coverLetter: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  taskUuid: string;
}
