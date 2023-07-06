import { Body, Controller, Get, Req, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

//JWTトークンベースの認証を実装し、セキュリティを強化することができる。
//AuthGuardはリクエストが有効なJWTトークンを持っているかどうかを検証し認証が成功した場合にリクエストを処理
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    return req.user;
  }
  //Omit<User, 'hashedPassword'>:User型からhashedPasswordプロパティを取り除いた新しい型を生成

  //ニックネームを更新するAPI
  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return this.userService.updateUser(req.user.id, dto);
  }
}
