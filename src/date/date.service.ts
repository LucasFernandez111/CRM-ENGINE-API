import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  public getAllDatesOfMonth(year: number, month: number): Date[] {
    const numDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Array.from({ length: numDays }, (_, i) => new Date(Date.UTC(year, month, i + 1)));
  }

  public getAllFirstDatesOfMonths(year: number): Date[] {
    return Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(year, i, 1)));
  }

  public getFirstDateOfMonth(year: number, month: number): Date {
    return new Date(Date.UTC(year, month, 1));
  }

  public getLastDateOfMonth(year: number, month: number): Date {
    return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  }

  public getAllLastDatesOfMonths(year: number): Date[] {
    return Array.from({ length: 12 }, (_, i) => {
      const lastDay = new Date(Date.UTC(year, i + 1, 0, 23, 59, 59, 999)); // Último momento del mes
      return lastDay;
    });
  }
}
