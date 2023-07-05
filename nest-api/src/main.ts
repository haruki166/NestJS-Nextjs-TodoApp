import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //NestJSアプリケーションでリクエストが正しい形式であるかを確認をして未知のデータは無視している
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  //、NestJSアプリケーションでCORSを有効にするための設定
  app.enableCors({
    credentials: true, //リクエストが認証情報（Cookieやトークンなど）を含む場合に許可
    origin: ['http://localhost:3000'], //指定されたURL（ここではhttp://localhost:3000）からのリクエストを許可
  });

  //クライアントから送信されたリクエストのCookieを解析しパースされたCookieデータを利用できるようにする
  app.use(cookieParser());
  await app.listen(3005);
}
bootstrap();
