import { Module } from '@nestjs/common';
import { ProductsController } from './controller/products/products.controller';
import { ProductsService } from './services/products.service';
import { Product, ProductsSchema } from 'src/schemas/products.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsRepository } from './services/products-repository/products-repository.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductsSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}