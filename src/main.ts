import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const COOKIE_SECRET = process.env.COOKIE_SECRET as string;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use(cookieParser(COOKIE_SECRET));

  await app.listen(3000);
}
bootstrap();
