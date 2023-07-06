import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //登録API　DBにEmailとPassを追加する
  @Post('signup')
  //Bodyデコレータでクライアントからのbodyのデータを受け取れる。今回はそれをdtoに受け取っている。
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto);
  }

  //ログインAPI ユーザーの認証を行い、JWTを生成してクライアントに返す
  @HttpCode(HttpStatus.OK) //このエンドポイントのレスポンスステータスコードをOK（200）に設定
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    //bodyから受け取ったメールアドレスとパスワードをloginメソッドに渡す。JWT返ってくる。
    const jwt = await this.authService.login(dto);

    //cookieメソッドを使用して、access_tokenという名前のクッキーを設定
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'ok',
    };
  }

  //ログアウトAPI Cookieを空にしてログアウトにする
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
