import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { CorsMiddleware } from './cors.middleware';

async function bootstrap() {
  let cors = require('cors');
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true, // Allow cookies to be sent with requests
  });

  //app.use(new CorsMiddleware());
  app.use(bodyParser.urlencoded({ limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));

  await app.listen(8000);
}
bootstrap();
