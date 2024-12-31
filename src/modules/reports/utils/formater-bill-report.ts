import { ItemDto } from 'src/modules/orders/dto';

export class FormatterBillReport {
  public static formatterTableProducts(products: ItemDto[]): any[] {
    return products.reduce((acc, item) => {
      acc.push([
        {
          text: `${item.quantity} X `,
          style: 'h2',
          alignment: 'left',
        },
        {
          text: `${item.category} - ${item.subcategory}`,
          style: 'h2',

          alignment: 'center',
        },

        {
          text: `$${item.price}`,
          style: 'h2',

          alignment: 'right',
        },
      ]);
      return acc;
    }, []);
  }
}
