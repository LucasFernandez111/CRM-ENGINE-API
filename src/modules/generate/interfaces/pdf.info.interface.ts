export interface PDFInfo {
  header: PDFInfoHeader;
  body: PDFInfoBody;
}

interface PDFInfoBody {
  items: PDFInfoItem[];
  totalPrice: string;
  methodPayment: string;
}
interface PDFInfoHeader {
  client: string;
  address: string;
  phone: string;
  orderNumber: string;
}

interface PDFInfoItem {
  category: string;
  subcategory: string;
  quantity: string;
  price: string;
  description: string;
}
