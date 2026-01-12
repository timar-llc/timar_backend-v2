import { Module } from '@nestjs/common';
import { HeleketService } from './heleket.service';
@Module({
  providers: [HeleketService],
  exports: [HeleketService],
})
export class HeleketModule {}
