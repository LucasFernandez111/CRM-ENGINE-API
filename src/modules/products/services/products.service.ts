import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products-repository/products-repository.service';
import { ProductCreateDTO } from '../interfaces/product-create.dto';
import { Product } from 'src/schemas/products.schema';
import { ProductUpdateDTO } from '../interfaces/product-update.dto';
import ErrorManager from 'src/config/error.manager';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  public async createProduct(userId: string, product: ProductCreateDTO): Promise<Product> {
    try {
      return await this.productsRepository.create({ ...product, userId });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateProduct(id: string, product: ProductUpdateDTO): Promise<Product> {
    try {
      return await this.productsRepository.update(id, product);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
  public async deleteProduct(id: string): Promise<void> {
    try {
      return await this.productsRepository.delete(id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAllProducts(userId: string): Promise<Product[]> {
    try {
      const products = await this.productsRepository.findAllBy(userId);
      if (!products || !products.length) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Products not found',
        });
      }
      return products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
