import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders:
      'Content-Type, Access-Control-Allow-Headers, Authorization',
  });
  // app.use(cookieSession({
  //   keys: ['asdfc']
  // }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    }),
  );


  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = 3030;
  await app.listen(PORT);
  console.log(`Server is runing ${PORT}`);
}
bootstrap();