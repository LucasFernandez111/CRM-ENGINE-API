import { format } from 'date-fns';

export class Formatter {
  public static formatDate(date: Date): string {
    return format(date, 'dd/MM/yyyy');
  }
}
