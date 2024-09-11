import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { OrdersService } from './orders.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from 'src/schemas/orders.schema';
describe('OrdersService', () => {
  let service: OrdersService;
  let model: Model<Order>;

  const mockOrderModel = {
    findOneAndDelete: jest.fn().mockResolvedValue({
      /* mock data */
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: getModelToken(Order.name), useValue: mockOrderModel }],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
