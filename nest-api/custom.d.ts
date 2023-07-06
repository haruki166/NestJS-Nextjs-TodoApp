import { User } from '@prisma/client';

//
////TypeScriptのモジュール拡張（Module Augmentation）を使用して、
////ExpressのRequestオブジェクトに新しいプロパティuserを追加する役割。
//
//express-serve-static-coreモジュールの型定義を拡張することを示す
declare module 'express-serve-static-core' {
  //モジュール内のRequest型のインターフェースを拡張しています
  interface Request {
    //Requestインターフェースにuserプロパティを追加
    user?: Omit<User, 'hashedPassword'>; //User型からhashedPasswordプロパティを除外した型
  }
}

////ExpressのRequestオブジェクトにuserプロパティを追加し、
//その値の型をUser型からhashedPasswordプロパティを除外した型として指定しています
