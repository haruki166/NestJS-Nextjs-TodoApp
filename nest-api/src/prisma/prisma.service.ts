import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  //ConfigServiceというサービスを依存性注入
  constructor(private readonly config: ConfigService) {
    //PrismaClient のコンストラクターを呼び出し
    super({
      //データソース（datasources）の設定を指定
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
