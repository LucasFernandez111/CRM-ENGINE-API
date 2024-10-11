import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { Order } from 'src/schemas';
import { OrderStatus, PaymentStatus } from '../orders/dto';
import { PDFInfo } from './interfaces/pdf.info.interface';

enum FontSizePDF {
  HEADER = 25,
  ITEMS = 15,
  FOOTER = 14,
}

@Injectable()
export class GeneratePDFService {
  constructor() {}

  public getReportPDF(res: Response) {
    const order: Order = {
      userId: '123213123',
      orderNumber: 1,
      totalAmount: 12500,
      customer: {
        name: 'Juan Alberto',
        phone: '11 2354-8879',
        address: {
          street: 'Calle Falsa 123, entre No me acuerdo y',
          city: 'Merlo',
          country: 'Argentina',
          postalCode: '33',
        },
      },
      items: [
        {
          category: 'Hamburguesa',
          subcategory: 'Napolitana simple (Sin lechuga)',
          quantity: 1,
          price: 8000,
        },
        {
          category: 'Empanadas',
          subcategory: 'Cheese burger',
          quantity: 3,
          price: 4500,
        },
      ],
      paymentDetails: {
        status: PaymentStatus.COMPLETADO,
        method: 'Efectivo',
      },
      orderStatus: OrderStatus.ENTREGADO,
      notes: 'Sin tomate',
    };
    return this.buildPDF(order, res);
  }

  private buildPDF(order: Order, res: Response) {
    const structureObject = this.generateStructureObject(order);
    const doc = new PDFDocument();

    doc.pipe(res);

    this.setHeaders(doc, structureObject);

    doc.fontSize(35).text('------------------------------------', { align: 'center' });

    this.setItems(doc, structureObject);
    return doc;
  }

  private setItems(doc: PDFKit.PDFDocument, { body }: PDFInfo): void {
    body.items.forEach((item) => 
      doc
        .fontSize(15)
        .text(`${item?.quantity ?? '-'} x ${item?.category ?? '-'} (${item?.subcategory ?? '-'})`, {
          align: 'left',
          lineGap: 5,
          continued: true,
        })
        .text(`$${item?.price ?? '-'}`, { align: 'right', lineGap: 5 })
        .moveDown(0.5);
    );
  }

  private setHeaders(doc: PDFKit.PDFDocument, { header }: PDFInfo): void {
    doc.fontSize(FontSizePDF.HEADER).text(header.client, { align: 'center', lineGap: 5 });
    doc.fontSize(FontSizePDF.HEADER).text(header.address, { align: 'center', lineGap: 5 });
    doc.fontSize(FontSizePDF.HEADER).text(header.phone, { align: 'center', lineGap: 5 });
    doc.moveDown(1);
    doc.fontSize(FontSizePDF.HEADER).text(`Numero de PEDIDO  #${orderNumber}`, { align: 'center', lineGap: 20 });
  }

  private setFooter(doc: PDFKit.PDFDocument, { paymentDetails, totalAmount }: Order): void {
    doc.fontSize(FontSizePDF.FOOTER).text(`TOTAL: $${totalAmount}  ${paymentDetails.method}`, 100).moveDown();
    doc
      .fontSize(FontSizePDF.FOOTER)
      .text('Muchas gracias, esperamos que disfruten de su comida. Bon appétit ;D', { align: 'center' })
      .moveDown(3);
    doc.fontSize(FontSizePDF.FOOTER).text('SISTEMA REALIZADO POR OKEYCORP.COM', { align: 'center' });
  }

  private generateStructureObject(order: Order): PDFInfo {
    const { items, paymentDetails, totalAmount, customer, orderNumber, orderStatus } = order;

    return {
      client: customer.name ,
      address: customer.address.street ,
      orderNumber: `NUMERO PEDIDO #${orderNumber?.toString() ?? ''}`  ,
      items: items.map((item) => ({
        category: item.category ,
        subcategory: item.subcategory ,
        quantity: item.quantity.toString(),
        price: item.price.toString() ,
        description: item?.description ?? '',
      })),
      totalPrice: totalAmount.toString() ?? '',
      methodPayment: paymentDetails?.method ?? '',
    };
  }
}
