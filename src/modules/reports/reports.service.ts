import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from '../printer/printer.service';
import { billReport } from './documents/bill.reports';
import { Order } from 'src/schemas';
@Injectable()
export class ReportsService {
  constructor(private readonly printer: PrinterService) {}
  public async getBillReport(order: Order): Promise<PDFKit.PDFDocument> {
    const docDefinition: TDocumentDefinitions = billReport(order);

    return this.printer.createPdf(docDefinition);
  }
}
