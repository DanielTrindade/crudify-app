import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { useContainer } from 'class-validator';

async function bootstrap() {
  // Load environment variables
  config();

  const app = await NestFactory.create(AppModule);

  // Set up dependency injection for custom validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Global interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Crudify')
    .setDescription('The Crudify API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Enable CORS
  app.enableCors();

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();