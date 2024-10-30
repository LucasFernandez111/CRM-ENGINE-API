import { Injectable } from '@nestjs/common';
import { Order } from 'src/schemas/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model, PipelineStage } from 'mongoose';
import { IOrderRepository } from '../../interfaces/order-repository.interface';
import { UpdateOrderDto, CreateOrderDto } from '../../dto';
import { count } from 'console';
import { OrderTop } from '../../interfaces/order-top.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
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

  public async findAllByUserId(userId: string): Promise<Order[]> {
    return await this.ordersModel.find({ userId }).exec();
  }

  public async findAll(): Promise<Order[]> {
    return await this.ordersModel.find().exec();
  }

  public async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Order[]> {
    return await this.ordersModel.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }

  public async findLastestOrder(userId: string): Promise<Order> {
    return await this.ordersModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
  }

  public async getInfoTopOrder(userID: string): Promise<Aggregate<OrderTop[] | []>> {
    const matchStage: PipelineStage.Match = { $match: { userId: userID } };

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
        category: '$_id.category',
        subcategory: '$_id.subcategory',
        totalAmount: 1,
        count: 1,
      },
    };
    return await this.ordersModel.aggregate([matchStage, groupStage, sortStage, limitStage, projectStage]);
  }

  public async getInfoTopOrderToday(userID: string): Promise<Aggregate<OrderTop[] | []>> {
    const todayStart = new Date();
    const todayEnd = new Date();

    todayStart.setHours(0, 0, 0, 0); //Inicio del dia
    todayEnd.setHours(23, 59, 0, 0); //Fin del dia

    const matchStage: PipelineStage.Match = {
      $match: { userId: userID, createdAt: { $gte: todayStart, $lte: todayEnd } },
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
        category: '$_id.category',
        subcategory: '$_id.subcategory',
        totalAmount: 1,
        count: 1,
      },
    };
    return await this.ordersModel.aggregate([matchStage, groupStage, sortStage, limitStage, projectStage]);
  }
}
