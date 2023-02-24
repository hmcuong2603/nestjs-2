import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    }),
  );

  const PORT = 3030;
  await app.listen(PORT);
  console.log(`Server is runing ${PORT}`);
}
bootstrap();