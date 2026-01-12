import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { YookassaService } from './yookassa.service';
import { YookassaPaymentCallbackDto } from './dto/yookassa.dto';

@Controller('yookassa')
export class YookassaController {
  constructor(private readonly yookassaService: YookassaService) {}

  @Post('payments-callback')
  @UsePipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )
  async paymentsCallback(@Body() data: YookassaPaymentCallbackDto) {
    return await this.yookassaService.paymentsCallback(data);
  }
}
