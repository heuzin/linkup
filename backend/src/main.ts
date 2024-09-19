import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookierParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }));
  app.use(cookierParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints).join(', ');
          return acc;
        }, {});

        throw new BadRequestException(formattedErrors);
      },
    }),
  );
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
