import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsTotalSalesService } from './statistics-total-sales.service';
import { OrdersService as mockOrdersService, OrdersService } from '../../orders/orders.service';
import { ErrorManager } from '../../config/error.manager';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from 'src/schemas/orders.schema';

describe('StatisticsTotalSalesService', () => {
  let service: StatisticsTotalSalesService;
  let mockOrdersService: Partial<mockOrdersService> = {
    getAllPrices: jest.fn(),
    getOrders: jest.fn(),
    getOrdersByDateRange: jest.fn(),
  };

  let errorManagerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsTotalSalesService,
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    service = module.get<StatisticsTotalSalesService>(StatisticsTotalSalesService);

    // Espiar el método createSignatureError de ErrorManager
    errorManagerSpy = jest.spyOn(ErrorManager, 'createSignatureError').mockImplementation((message) => {
      const [name] = message.split('::');
      const status = HttpStatus[name as keyof typeof HttpStatus] || HttpStatus.INTERNAL_SERVER_ERROR;
      return new HttpException(message, status);
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  /**
   * Tests [getTotalSales]
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return total sales', async () => {
    const userId = '123';
    (mockOrdersService.getOrders as jest.Mock).mockResolvedValue([
      { userId: '1', totalAmount: 100 },
      { userId: '2', totalAmount: 150 },
      { userId: '3', totalAmount: 200 },
    ] as Order[]);

    const totalSales: number = await service.getTotalSales(userId);
    expect(totalSales).toBe(450);
  });

  /**
   * Tests [getTotalSalesByDay]
   */

  it('should call getOrdersByDateRange with correct start and end of today in UTC', async () => {
    const userId = 'testUserId';

    const now = new Date();
    const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endOfTodayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
    );

    const mockOrders = [
      { id: '1', amount: 100 },
      { id: '2', amount: 150 },
    ];
    (mockOrdersService.getOrdersByDateRange as jest.Mock).mockResolvedValue(mockOrders);

    const result = await service.getTotalSalesByDay(userId);

    expect(mockOrdersService.getOrdersByDateRange).toHaveBeenCalledWith(userId, startOfTodayUTC, endOfTodayUTC);

    expect(result).toEqual(mockOrders);
  });
});
