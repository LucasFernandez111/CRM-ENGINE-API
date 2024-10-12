import { Module, forwardRef } from '@nestjs/common';
import { GeneratePDFService } from './generate.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [GeneratePDFService],
  exports: [GeneratePDFService],
})
export class GenerateModule {}
