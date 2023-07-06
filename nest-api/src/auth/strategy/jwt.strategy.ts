import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

//Nest.jsのPassportモジュールを使用してJWT認証のためのカスタムの認証ストラテジー（JwtStrategy）を定義
//
@Injectable() //他のモジュールに注入できるように。
////JWT認証を処理するための基本的な機能をPassportStrategyから提供
//'jwt'はストラテジーの名前を識別するためのパラメータ
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  //JwtStrategyクラスのコンストラクタ
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    //親クラスのコンストラクタを呼び出し.
    super({
      //jwtFromRequestは、JWTトークンをリクエストから取得するためのオプション
      jwtFromRequest: ExtractJwt.fromExtractors([
        //jwtFromRequestの抽出器として関数を指定
        (req) => {
          let jwt = null;
          //reqとreq.cookiesがあるかチェック
          if (req && req.cookies) {
            //あればjwtにぶち込む
            jwt = req.cookies['access_token'];
          }
          //jwtを返す
          return jwt;
        },
      ]),
      ignoreExpiration: false, //トークンの有効期限の無視
      secretOrKey: config.get('JWT_SECRET'), //WTの署名に使用するシークレットキー
    });
  }

  //JWTトークンの検証が成功した場合に呼び出されるvalidateメソッド。
  //認証されたユーザーの情報を検証しそのユーザーのデータを返す役割。
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hashedPassword;
    return user;
  }
  //payloadは、JWTトークンのデコード結果であるトークンのペイロード
  //{ sub: number; email: string }はpayloadの型定義
}
