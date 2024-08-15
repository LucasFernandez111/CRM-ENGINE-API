import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const COOKIE_SECRET = process.env.COOKIE_SECRET as string;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  await app.listen(3000);
}
bootstrap();
