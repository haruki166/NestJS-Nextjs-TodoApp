import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

//デコレータ：デコレータは、クラスやメソッド、プロパティなどに対して注釈や機能を追加するために使用

//認証情報のデータ構造を表す
export class AuthDto {
  @IsEmail() //emailプロパティが有効なメールアドレス形式であることを検証
  @IsNotEmpty() //空でないことを検証
  email: string;

  @IsString() //passwordプロパティが文字列であることを検証
  @IsNotEmpty() //空でないことを検証
  @MinLength(5) //文字列の最小長が5文字以上であることを検証
  password: string;
}
