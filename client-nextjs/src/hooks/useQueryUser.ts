import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";


//ユーザー情報を非同期に取得し、キャッシュと状態管理を行うためのカスタムフックを提供するカスタムフック
const useQueryUser = () => {
  const router = useRouter();

  ////非同期にユーザー情報を取得するためのAPIを叩く
  //Omit<User, "hashedPassword">の型で指定された形式で返される
  const getUser = async () => {
    const { data } = await axios.get<Omit<User, "hashedPassword">>(
      `${process.env.NEXT_PUBLIC_API_URL}/user`
    );
    return data;
  };
  //
  //useQueryフックはreact-queryライブラリを使用してデータのキャッシュと状態管理を行います
  return useQuery<Omit<User, "hashedPassword">, Error>({
    queryKey: ["user"], //クエリの一意のキーを指定
    queryFn: getUser, //非同期データの取得を実行する関数を指定
    onError: (err: any) => {
      //APIリクエストがエラーとなった場合に特定の処理
      if (err.response.status === 401 || err.response.status === 403) {
        router.push("/");
      }
    },
  });
};

////データのキャッシュとはアプリケーションが取得したデータを一時的に保存すること。
//メモリやストレージの領域を使用します

export default useQueryUser;
