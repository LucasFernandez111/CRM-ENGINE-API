import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { styles } from './document.config';
import { OrderTop } from 'src/modules/orders/interfaces/order-top.interface';

enum Months {
  ENERO = 'ENERO',
  FEBRERO = 'FEBRERO',
  MARZO = 'MARZO',
  ABRIL = 'ABRIL',
  MAYO = 'MAYO',
  JUNIO = 'JUNIO',
  JULIO = 'JULIO',
  AGOSTO = 'AGOSTO',
  SEPTIEMBRE = 'SEPTIEMBRE',
  OCTUBRE = 'OCTUBRE',
  NOVIEMBRE = 'NOVIEMBRE',
  DICIEMBRE = 'DICIEMBRE',
}

const logo: Content = {
  image: 'src/assets/okeycorp.png',
  width: 140,
  alignment: 'center',
};

const getMonthName = (monthNumber: number): string => Object.values(Months)[monthNumber - 1];

export const salesReport = (salesData: any, topOrder: OrderTop): TDocumentDefinitions => {
  const { current, periodSales } = salesData.sales;

  return {
    header: {
      text: ['Reporte de ventas ', new Date().toLocaleString()],
      alignment: 'right',
      margin: [5, 5],
    },
    content: [
      logo,

      actuallySalesSummary(current),

      monthlySales(periodSales.salesMonth),

      // Pedidos Destacados
      topOrders(topOrder),
    ],
    footer: {
      text: 'SISTEMA REALIZADO POR OKEYCORP.COM',
      alignment: 'center',
    },
    styles,
  };
};

const structureMonthsData = (monthData: any[]) =>
  monthData.reduce(
    (acc, item) => {
      const monthName = getMonthName(item.month);

      acc.push([monthName, item.dateMonth, `$${item.total}`]);
      return acc;
    },
    [['Mes', 'Fecha', 'Total ($)']],
  );
// Función para el resumen general de ventas

const actuallySalesSummary = (data: any): Content => ({
  stack: [
    { text: 'VENTAS ACTUALES', style: 'h2', alignment: 'left' },
    {
      table: {
        widths: ['*', '*', '*'],
        body: [
          ['DIA', 'SEMANA', 'MES'],
          [`$${data.day}`, `$${data.week}`, `$${data.month}`],
        ],
      },
      layout: 'lightHorizontalLines',
    },
  ],
});
// Función para las ventas mensuales
const monthlySales = (salesMonths: any[]): Content => {
  const structuredData = structureMonthsData(salesMonths);

  return {
    margin: [0, 20],
    stack: [
      {
        text: 'VENTAS POR MES (2024)',
        style: 'h2',
        alignment: 'left',
      },
      {
        table: {
          widths: ['*', '*', '*'],
          body: structuredData,
        },
        layout: 'lightHorizontalLines',
      },
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              {},
              {},
              {
                text: `Total: $${salesMonths.reduce((acc, item) => acc + item.total, 0)}`,
                color: 'white',
                fontSize: 12,
                bold: true,
                fillColor: 'black',
              },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ],
  };
};

// Función para los pedidos destacados
const topOrders = (topOrder: OrderTop): Content => ({
  margin: [0, 20],
  stack: [
    {
      text: 'PEDIDO DESTACADO',
      style: 'h2',
      alignment: 'left',
    },

    {
      table: {
        widths: ['*', '*', '*'],
        body: [
          ['CATEGORIA', 'SUBCATEGORIA', 'CANTIDAD DE PEDIDOS'],
          [topOrder.category, topOrder.subcategory, `${topOrder.count}`],
        ],
      },
      layout: 'lightHorizontalLines',
    },
  ],
});
