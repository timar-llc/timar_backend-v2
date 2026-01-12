import { Controller, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Get } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findAll(
    @CurrentUser() user: User,
    @Query() query: PaginateParamsDto,
  ): Promise<Transaction[]> {
    return await this.transactionsService.findAll(user.uuid, query.skip, query.take);
  }
}
