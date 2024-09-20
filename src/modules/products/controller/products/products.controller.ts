import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ProductsService } from '../../services/products.service';
import { ProductCreateDTO } from '../../interfaces/product-create.dto';
import { Product } from 'src/schemas/products.schema';
import { Request } from 'express';
import { ProductUpdateDTO } from '../../interfaces/product-update.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() product: ProductCreateDTO, @Req() req: Request): Promise<Product> {
    const userId = req.cookies['id_token'];

    return this.productsService.createProduct(userId, product);
  }
  @Get()
  async findAllProducts(@Req() req: Request): Promise<Product[]> {
    const userId = req.cookies['id_token'];
    return await this.productsService.findAllProducts(userId);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() product: ProductUpdateDTO): Promise<Product> {
    return await this.productsService.updateProduct(id, product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
