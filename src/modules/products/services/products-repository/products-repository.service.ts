import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/products.schema';
import { Model, Types } from 'mongoose';
import { ProductCreateDTO } from '../../interfaces/product-create.dto';
import { IRepository } from 'src/common/interfaces/repository.interface';
import { ProductUpdateDTO } from '../../interfaces/product-update.dto';

@Injectable()
export class ProductsRepository implements IRepository<Product> {
  constructor(@InjectModel(Product.name) private readonly productsModel: Model<Product>) {}

  public async create(product: ProductCreateDTO): Promise<Product> {
    return await this.productsModel.create(product);
  }

  public async update(id: string, product: ProductUpdateDTO): Promise<Product> {
    return await this.productsModel.findByIdAndUpdate(id, product, { new: true }).exec();
  }

  public async delete(id: string): Promise<void> {
    await this.productsModel.findByIdAndDelete({ _id: new Types.ObjectId(id) }).exec();
  }

  public async findById(id: string): Promise<Product> {
    return await this.productsModel.findById({ _id: new Types.ObjectId(id) }).exec();
  }

  public async findAll(): Promise<Product[]> {
    return await this.productsModel.find().exec();
  }
  public async findAllBy(userId: string): Promise<Product[]> {
    return await this.productsModel.find({ userId }).exec();
  }
}
