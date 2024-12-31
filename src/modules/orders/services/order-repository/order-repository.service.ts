import { Injectable } from '@nestjs/common';
import { Order } from 'src/schemas/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model, PipelineStage } from 'mongoose';
import { UpdateOrderDto, CreateOrderDto } from '../../dto';
import { OrderTop } from '../../interfaces/order-top.interface';

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private readonly ordersModel: Model<Order>) {}

  public async create(order: CreateOrderDto): Promise<Order> {
    return await this.ordersModel.create(order);
  }

  public async update(id: string, order: UpdateOrderDto): Promise<Order> {
    return await this.ordersModel.findByIdAndUpdate(id, order, { new: true }).exec();
  }

  public async delete(id: string): Promise<void> {
    await this.ordersModel.findByIdAndDelete(id).exec();
  }

  public async findById(id: string): Promise<Order> {
    return await this.ordersModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<Order[]> {
    return await this.ordersModel.find({ email }).exec();
  }

  public async findByDateRange(email: string, startDate, endDate): Promise<Order[]> {
    return await this.ordersModel.find({
      email,
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }

  public async findLastestOrder(email: string): Promise<Order> {
    return await this.ordersModel.findOne({ email }).sort({ createdAt: -1 }).exec();
  }

  public async getInfoTopOrder(email: string): Promise<Aggregate<OrderTop[] | []>> {
    const matchStage: PipelineStage.Match = { $match: { email } };

    //Agrupar por campos
    const groupStage: PipelineStage.Group = {
      $group: {
        _id: {
          category: '$items.category',
          subcategory: '$items.subcategory',
        },
        totalAmount: { $max: '$totalAmount' },
        count: { $sum: 1 }, //Contador de ordenes iguales,
      },
    };

    //Ordena en forma descendente
    const sortStage: PipelineStage.Sort = {
      $sort: { count: -1 },
    };

    //Limite de salida
    const limitStage: PipelineStage.Limit = {
      $limit: 1,
    };

    //Estructura la salida
    const projectStage: PipelineStage.Project = {
      $project: {
        _id: 0,
        category: { $arrayElemAt: ['$_id.category', 0] },
        subcategory: { $arrayElemAt: ['$_id.subcategory', 0] },
        totalAmount: 1,
        count: 1,
      },
    };
    return await this.ordersModel.aggregate([matchStage, groupStage, sortStage, limitStage, projectStage]);
  }

  public async getInfoTopOrderToday(email: string): Promise<Aggregate<OrderTop[] | []>> {
    const todayStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 0, 0, 0, 0),
    );
    const todayEnd = new Date(
      Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), todayStart.getUTCDate(), 23, 59, 59, 999),
    );

    const matchStage: PipelineStage.Match = {
      $match: { email, createdAt: { $gte: todayStart, $lte: todayEnd } },
    };

    //Agrupar por campos
    const groupStage: PipelineStage.Group = {
      $group: {
        _id: {
          category: '$items.category',
          subcategory: '$items.subcategory',
        },
        totalAmount: { $max: '$totalAmount' },
        count: { $sum: 1 }, //Contador de ordenes iguales,
      },
    };

    //Ordena en forma descendente
    const sortStage: PipelineStage.Sort = {
      $sort: { count: -1 },
    };

    //Limite de salida
    const limitStage: PipelineStage.Limit = {
      $limit: 1,
    };

    //Estructura la salida
    const projectStage: PipelineStage.Project = {
      $project: {
        _id: 0,
        category: { $arrayElemAt: ['$_id.category', 0] },
        subcategory: { $arrayElemAt: ['$_id.subcategory', 0] },
        totalAmount: 1,
        count: 1,
      },
    };
    return await this.ordersModel.aggregate([matchStage, groupStage, sortStage, limitStage, projectStage]);
  }
}
