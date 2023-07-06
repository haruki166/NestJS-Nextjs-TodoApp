import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //ユーザー情報を更新するメソッド
  async updateUser(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    //更新されたユーザー情報がuserという変数に代入
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    //userオブジェクトからhashedPasswordプロパティを削除しています。
    //パスワードのハッシュ化された値をクライアントに返さないため
    delete user.hashedPassword;
    return user;
  }
}
