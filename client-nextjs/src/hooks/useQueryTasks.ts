import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@prisma/client";

//タスクデータを非同期に取得し、キャッシュと状態管理を行うためのカスタムフックを提供するもの
const useQueryTasks = () => {
  const router = useRouter();
  //
  //非同期にタスクデータを取得するためのAPIを叩く
  const getTasks = async () => {
    const { data } = await axios.get<Task[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/todo`
    );
    return data;
  };
  //useQueryフックを使用して、データのキャッシュと状態管理を行う
  return useQuery<Task[], Error>({
    queryKey: ["tasks"], //queryKeyはクエリの一意のキーを指定
    queryFn: getTasks, //queryFnは非同期データの取得を実行する関数
    onError: (err: any) => {
      //、onErrorコールバック関数を使用して、APIリクエストがエラーとなった場合に特定の処理
      if (err.response.status === 401 || err.response.status === 403) {
        router.push("/");
      }
    },
  });
};

export default useQueryTasks;
