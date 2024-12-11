import { Module } from '@nestjs/common';
import { GoogleApiSheetService } from './google-api-sheet.service';

@Module({ providers: [GoogleApiSheetService], exports: [GoogleApiSheetService] })
export class GoogleApiSheetModule {}
