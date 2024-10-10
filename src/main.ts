import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: true,
    forbidUnknownValues: false,
    forbidNonWhitelisted: false,
    stopAtFirstError: true,
    transform: true,
    whitelist: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker')
    .setDescription('Blockchain Price Tracker')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
