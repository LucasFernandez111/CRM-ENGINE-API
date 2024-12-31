import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Formatter } from 'src/helpers/formatter';
import { ItemDto } from 'src/modules/orders/dto';
import { Order } from 'src/schemas';
import { styles } from './document.config';
import { FormatterBillReport } from '../utils/formater-bill-report';
const logo: Content = {
  image: 'src/assets/okeycorp.png',
  width: 140,
  alignment: 'center',
};

export const billReport = (order: Order): TDocumentDefinitions => {
  const dateOrderFormatted = Formatter.formatDate(order.createdAt);

  return {
    content: [
      logo,
      //Datos del cliente
      infoCustomer(order.customer, order.customer.address),

      //Datos de la orden
      infoOrder(order.orderNumber, dateOrderFormatted),

      //Datos del pedido
      infoProducts(order.items),

      //Datos del pago
      infoPayment(order.paymentDetails.method, order.totalAmount.toString()),
      {
        margin: [0, 30],
        text: `Muchas gracias, esperamos que\ndisfruten de su comida.\nbon appetit ;D`,
        style: 'h3',
        alignment: 'center',
      },
    ],

    footer: {
      text: 'SISTEMA REALIZADO POR OKEYCORP.COM',
      alignment: 'center',
    },

    styles,
  };
};
const infoCustomer = ({ name, phone }, address: { city; street }): Content => ({
  stack: [`${name}`, `${address.city},${address.street}`, `${phone}`],
  style: 'h1',
  alignment: 'center',
});

const infoOrder = (orderNumber: number, date: string): Content => ({
  stack: [`Numero de PEDIDO #${orderNumber}`, `Fecha: ${date}`],
  style: 'h1',
  alignment: 'center',
});

const infoProducts = (products: ItemDto[]): Content => ({
  margin: [0, 40],
  table: {
    widths: ['*', '*', '*'],
    body: FormatterBillReport.formatterTableProducts(products),
  },
  layout: 'lightHorizontalLines',
});

const infoPayment = (methodPayment: string, totalAmount: string): Content => ({
  margin: [0, 40],
  columns: [
    {
      width: '50%',

      text: 'TOTAL',
      style: 'h1',
      alignment: 'left',
    },
    {
      width: '50%',

      stack: [
        { text: `$${totalAmount}`, style: 'h1' },
        { text: ` ${methodPayment}`, style: 'h1' },
      ],
      alignment: 'right',
    },
  ],
});
