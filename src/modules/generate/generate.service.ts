import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { Order } from 'src/schemas';
import { OrdersService } from '../orders/services/orders.service';

enum FontSizePDF {
  HEADER = 25,
  ITEMS = 20,
  FOOTER = 17,
}

@Injectable()
export class GeneratePDFService {
  constructor(private readonly orderService: OrdersService) {}

  public async getReportPDF(res: Response, id: string) {
    const order: Order = await this.orderService.getOrderById(id);
    return this.buildPDF(order, res);
  }

  private buildPDF(order: Order, res: Response): PDFKit.PDFDocument {
    const doc = new PDFDocument();

    doc.pipe(res);

    this.setHeaders(doc, order);

    this.setLine(doc);

    this.setItems(doc, order);

    this.setLine(doc);

    this.setFooter(doc, order);
    return doc;
  }

  private setItems(doc: PDFKit.PDFDocument, { items }: Order): void {
    items.forEach((item) =>
      this.setText(doc, FontSizePDF.ITEMS, `${item.quantity} X ${item.category}`, `$${item.price}`),
    );
  }

  private setText(doc: PDFKit.PDFDocument, size: number, text: string, nextText?: string): void {
    if (!nextText) {
      doc.fontSize(size).text(text, { align: 'center', lineGap: 5 });
    } else {
      doc
        .fontSize(size)
        .text(text, { align: 'left', lineGap: 5, continued: true })
        .text(nextText, { align: 'right', lineGap: 5 });
    }
  }

  private async setHeaders(doc: PDFKit.PDFDocument, { customer, orderNumber }: Order) {
    doc.moveDown(2);
    this.setHeaderText(doc, customer.name);
    this.setHeaderText(doc, customer.phone);
    this.setHeaderText(doc, customer.address.street);
    this.setHeaderText(doc, `Numero de PEDIDO  # ${orderNumber}`);
  }

  private setHeaderText(doc: PDFKit.PDFDocument, text: string) {
    doc.fontSize(FontSizePDF.HEADER).text(text, { align: 'center', lineGap: 10 });
  }

  private setFooter(doc: PDFKit.PDFDocument, { paymentDetails, totalAmount }: Order): void {
    doc.moveDown(1);
    this.setText(doc, FontSizePDF.ITEMS, `TOTAL $${totalAmount}`, `${paymentDetails.method}`);
    doc.moveDown(1);
    this.setText(doc, FontSizePDF.FOOTER, 'Muchas gracias, esperamos que disfruten de su comida. Bon appétit ;D');
    doc.moveDown(1);
    this.setText(doc, FontSizePDF.FOOTER, 'SISTEMA REALIZADO POR OKEYCORP.COM');
  }
  private setLine(doc: PDFKit.PDFDocument): void {
    doc.moveDown(1);
    doc
      .moveTo(20, doc.y + 10)
      .lineTo(400, doc.y + 10)
      .dash(5, { space: 10 })
      .lineTo(600, doc.y + 10)
      .dash(5, { space: 10 })
      .stroke();
    doc.moveDown(1);
  }
}
