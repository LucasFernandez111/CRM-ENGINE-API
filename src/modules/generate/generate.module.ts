import { Module } from '@nestjs/common';
import { GeneratePDFService } from './generate.service';

@Module({
  providers: [GeneratePDFService],
  exports: [GeneratePDFService],
})
export class GenerateModule {}
