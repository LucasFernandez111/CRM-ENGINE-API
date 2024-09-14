import { DateService } from './date.service';

describe('DateService', () => {
  let dateService: DateService;

  beforeEach(() => {
    dateService = new DateService();
  });

  it('should be defined', () => {
    expect(dateService).toBeDefined();
  });

  describe('getAllDatesOfMonth', () => {
    it('should return all dates of the specified month', () => {
      const year = 2024;
      const month = 8; // September (0-indexed)
      const numDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const expectedDates = Array.from({ length: numDays }, (_, i) => new Date(Date.UTC(year, month, i + 1)));

      const result = dateService.getAllDatesOfMonth(year, month);
      expect(result).toEqual(expectedDates);
    });
  });

  describe('getAllFirstDatesOfMonths', () => {
    it('should return the first date of each month of the specified year', () => {
      const year = 2024;
      const expectedDates = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(year, i, 1)));

      const result = dateService.getAllFirstDatesOfMonths(year);
      expect(result).toEqual(expectedDates);
    });
  });

  describe('getFirstDateOfMonth', () => {
    it('should return the first date of the specified month', () => {
      const year = 2024;
      const month = 8; // September (0-indexed)
      const expectedDate = new Date(Date.UTC(year, month, 1));

      const result = dateService.getFirstDateOfMonth(year, month);
      expect(result).toEqual(expectedDate);
    });
  });

  describe('getLastDateOfMonth', () => {
    it('should return the last moment of the specified month', () => {
      const year = 2024;
      const month = 8; // September (0-indexed)
      const expectedDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

      const result = dateService.getLastDateOfMonth(year, month);
      expect(result).toEqual(expectedDate);
    });
  });

  describe('getAllLastDatesOfMonths', () => {
    it('should return the last moment of each month of the specified year', () => {
      const year = 2024;
      const expectedDates = Array.from({ length: 12 }, (_, i) => {
        return new Date(Date.UTC(year, i + 1, 0, 23, 59, 59, 999)); // Último momento del mes
      });

      const result = dateService.getAllLastDatesOfMonths(year);
      expect(result).toEqual(expectedDates);
    });
  });
});
