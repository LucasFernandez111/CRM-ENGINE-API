import { ItemDto } from 'src/modules/orders/dto';

export class FormatterBillReport {
  public static formatterTableProducts(products: ItemDto[]): any[] {
    return products.reduce((acc, item) => {
      acc.push([
        {
          text: `${item.quantity} X `,
          alignment: 'left',
        },
        {
          text: `${item.category} - ${item.subcategory}`,
          alignment: 'center',
        },
        { text: item.description ? item.description : 'Sin descripcion', alignment: 'center' },

        {
          text: `$${item.price}`,
          alignment: 'right',
        },
      ]);
      return acc;
    }, []);
  }
}
