import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';
import { retry } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  //新規作成メソッド
  async signUp(dto: AuthDto): Promise<Msg> {
    //パスワードをハッシュ化
    const hashed = await bcrypt.hash(dto.password, 12);
    try {
      //userテーブルにメールアドレスとハッシュかしたパスワードをinsertする
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
        },
      });
      return {
        message: 'ok',
      };
    } catch (error) {
      //キャッチされたエラーがPrismaのクライアントエラーであるかどうかをチェック
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already taken');
        }
      }

      //Prismaのエラーでない場合はそのままエラーをスローする
      throw error;
    }
  }

  //ログインメソッド
  async login(dto: AuthDto): Promise<Jwt> {
    //入力されたメールアドレスをDBから探しあればuserに入れる
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //メールが見つからない場合エラー
    if (!user) throw new ForbiddenException('Email or Password incorrect');

    //入力されたパスワードとデータベースに保存されているハッシュ化されたパスワードを比較
    const isValid = await bcrypt.compare(dto.password, user.hashedPassword);
    //パスワードが一致しなかった場合エラー
    if (!isValid) throw new ForbiddenException('Email or Password incorrect');

    //メール、パスワードともに問題なければJWTを生成
    return this.generateJwt(user.id, user.email);
  }

  //JWTを生成するメソッド
  async generateJwt(userId: number, email: string): Promise<Jwt> {
    //JWTのペイロード（トークンに含まれる情報）を表します
    const payload = {
      sub: userId, //userIdをsubに設定することで、生成されるトークンが特定のユーザーに関連付けられていることを示します
      email,
    };

    //JWTのシークレットキーを取得
    const secret = this.config.get('JWT_SECRET');

    //ペイロードとオプション（expiresInとsecret）を指定してトークンを生成
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret: secret,
    });
    //生成したトークンを返す
    return {
      accessToken: token,
    };
  }
}
