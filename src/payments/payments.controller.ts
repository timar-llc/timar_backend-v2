import { Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { TopUpDto } from './dto/top-up.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('top-up')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiOkResponse({ description: 'Payment URL', type: String })
  async topUp(
    @Body() dto: TopUpDto,
    @CurrentUser() user: User,
  ): Promise<string> {
    return await this.paymentsService.topUpBalance(user.uuid, dto);
  }
}
