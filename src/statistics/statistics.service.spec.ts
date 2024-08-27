import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from 'src/orders/orders.service';
import { StatisticsService } from './statistics.service';

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: OrdersService,
          useValue: {
            getOrders: jest.fn().mockResolvedValue([
              {
                id_token: '111',
                order: 1,
                name: 'Carlos Tevez',
                address: 'Villa Fiorito',
                phone: '1140573464',
                quantity: 1,
                price: 1200, // Precio unitario para "Pizza"
                description: 'Pizza',
              },
              {
                id_token: '111',
                order: 2,
                name: 'Lionel Messi',
                address: 'La Boca',
                phone: '1122334455',
                quantity: 2,
                price: 2500, // Precio unitario para "Burger"
                description: 'Burger',
              },
              {
                id_token: '111',
                order: 3,
                name: 'Diego Maradona',
                address: 'Caballito',
                phone: '1166778899',
                quantity: 3,
                price: 1200, // Precio unitario para "Pizza"
                description: 'Pizza',
              },
              {
                id_token: '111',
                order: 4,
                name: 'Gabriel Batistuta',
                address: 'Palermo',
                phone: '1133445566',
                quantity: 4,
                price: 7000, // Precio unitario para "Sushi"
                description: 'Sushi',
              },
              {
                id_token: '111',
                order: 5,
                name: 'Sergio Agüero',
                address: 'Recoleta',
                phone: '1199887766',
                quantity: 5,
                price: 2500, // Precio unitario para "Burger"
                description: 'Burger',
              },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get top selling order', async () => {
    const result = await service.getTopSellingOrder('111');
    expect(result).toEqual('PIZZA');
  });
});
