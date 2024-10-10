import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { Response } from 'express';
import { Order } from 'src/schemas';
import { OrderStatus, PaymentStatus } from '../orders/dto';

@Injectable()
export class GeneratePDFService {
  constructor() {}

  public getReportPDF(res: Response) {
    const order: Order = {
      userId: '123213123',
      orderNumber: 2,
      totalAmount: 4000,
      customer: {
        name: 'Lucas',
        phone: '1130773485',
        address: {
          street: 'Marmol 748',
          city: 'Merlo',
          country: 'Argentina',
          postalCode: '33',
        },
      },
      items: [
        {
          category: 'SANDWICH',
          subcategory: 'PROMO 3',
          quantity: 2,
          price: 4000,
        },
      ],
      paymentDetails: {
        status: PaymentStatus.COMPLETADO,
        method: 'EFECTIVO',
      },
      orderStatus: OrderStatus.ENTREGADO,
      notes: 'Por favor que sea sin tomate',
    };
    return this.buildPDF(order);
  }

  private buildPDF(order: Order) {
    const { customer, items, paymentDetails, orderNumber, totalAmount } = order;
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(`${customer.name}.pdf`));

    // NAME
    doc.fontSize(25).text(` ${customer.name}`, 100, 100);

    // ADRESS
    doc.fontSize(25).text(` ${customer.address}`, 100, 150);

    //PHONE
    doc.fontSize(25).text(` ${customer.phone}`, 100, 150);

    //ORDER NUMBER
    doc.fontSize(25).text(` NUMERO DE PEDIDO : ${orderNumber}`, 100, 150);

    doc.dash(5, { space: 10 }).stroke();

    // ITEMS
    items.forEach((item) => {
      doc.fontSize(25).text(` ${item.quantity} X  ${item.category}, ${item.description}`, 100, 150);
      doc.fontSize(25).text(`$${item.price}`, 100, 150);
    });

    doc.dash(5, { space: 10 }).stroke();

    doc.fontSize(25).text(` TOTAL : ${totalAmount} ${paymentDetails.method}`, 100, 100);

    doc.fontSize(20).text('Muchas gracias, esperamos que disfruten de su comida. bon appetit ;D', 100, 150);

    doc.fontSize(10).text('SISTEMA REALIZADO POR OKEYCORP.COM', 100, 150);

    return doc;
  }
}
