import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../schemas/orders.schema';
import { ErrorManager } from '../../config/error.manager';
import { OrderRepository } from '../services/order-repository/order-repository.service';
import { PaymentStatus } from '../dto/payment.dto';
import { OrderStatus } from '../dto/create-order.dto';

describe('OrderRepository', () => {
  let repository: OrderRepository;
  let model: Model<Order>;
  const randomOrder: Order = {
    userId: 'user123',
    orderNumber: Math.floor(Math.random() * 10000),
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+123456789',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA',
      },
    },
    items: [
      {
        name: 'Laptop',
        description: 'A high-performance laptop',
        quantity: 1,
        price: 1500,
      },
      {
        name: 'Mouse',
        description: 'Wireless ergonomic mouse',
        quantity: 2,
        price: 50,
      },
    ],
    paymentDetails: {
      method: 'EFECTIVO',
      transactionId: `ARG${Math.floor(Math.random() * 100000)}`,
      status: PaymentStatus.PENDIENTE,
    },
    totalAmount: 1600,
    status: OrderStatus.ENVIADO,
    notes: 'Entregar en horario de la tarde',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderModel = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
      ],
    }).compile();

    repository = module.get<OrderRepository>(OrderRepository);
    model = module.get<Model<Order>>(getModelToken(Order.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una orden exitosamente', async () => {
      mockOrderModel.create.mockResolvedValue(randomOrder);

      const result = await repository.create(randomOrder);

      expect(mockOrderModel.create).toHaveBeenCalledWith(randomOrder);
      expect(result).toEqual(randomOrder);
    });

    it('debería lanzar una excepción si ocurre un error', async () => {
      mockOrderModel.create.mockRejectedValue(new Error('Error al crear la orden'));

      await expect(repository.create(randomOrder)).rejects.toThrow(ErrorManager);
      expect(mockOrderModel.create).toHaveBeenCalledWith(randomOrder);
    });
  });
});
