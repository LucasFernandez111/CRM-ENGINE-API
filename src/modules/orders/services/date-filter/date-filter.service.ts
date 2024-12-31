import { Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class DateFilterService {
  constructor() {}

  public getMonths(date: Date): Date[] {
    const year = date.getFullYear(); // Obtiene el año de la fecha proporcionada
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }

  public getFirstDateOfDay(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }

  public getLastDateOfDay(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
  }
  public getFirstDateOfMonth(date: Date) {
    return moment().tz('America/Argentina/Buenos_Aires').month(date.getMonth()).startOf('month');
  }
  public getLastDateOfMonth(date: Date) {
    return moment(date).tz('America/Argentina/Buenos_Aires').endOf('month').utc();
  }

  public getFirstDateOfWeek(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1));
  }
  public getLastDateOfWeek(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7, 23, 59, 59, 999));
  }

  public getFirstDateOfYear(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), 0, 1));
  }
  public getLastDateOfYear(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), 11, 31, 23, 59, 59, 999));
  }

  public setStartOfDateUTC(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
  }

  public setEndOfDateUTC(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59));
  }

  public toString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
