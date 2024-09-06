export interface MonthDates {
  month: number;
  firstDate: Date;
  lastDate: Date;
}

export interface MonthlySalesWithOrders {
  totalSalesForMonth: number;
  monthDates: MonthDates;
}
