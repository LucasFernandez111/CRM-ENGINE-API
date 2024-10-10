import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GeneratePDFService } from './generate.service';

@Module({
  controllers: [GenerateController],
  providers: [GeneratePDFService],
  exports: [GeneratePDFService],
})
export class GenerateModule {}
