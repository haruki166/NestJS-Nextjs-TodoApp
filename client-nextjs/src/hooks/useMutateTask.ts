import { useRouter } from "next/navigation";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Task } from "@prisma/client";
import useStore from "../../store"; //状態管理
import { EditedTask } from "../../types"; //型定義


const useMutateTask = () => {
  //useQueryClientを使用してクエリのキャッシュの管理や操作を行うことができる
  const queryClient = useQueryClient();
  //Next.jsのルーターオブジェクトを取得
  const router = useRouter();
  //resetEditedTask関数をuseStoreカスタムフックから取得
  //resetEditedTask関数:フォームを空文字にする関数
  const reset = useStore((state) => state.resetEditedTask);

  //タスクの作成に関するミューテーション（データの変更操作）を定義
  const createTaskMutation = useMutation(
    ////taskという引数を受け取りaxiosを使用して
    //APIエンドポイントにPOSTリクエストを送信し新しいタスクを作成
    async (task: Omit<EditedTask, "id">) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task
      );
      return res.data;
    },
    {
      //ミューテーションが成功した場合に実行
      onSuccess: (res) => {
        //キャッシュから以前のタスクのデータ（previousTodos）を取得
        const previousTodos = queryClient.getQueryData<Task[]>(["tasks"]);
        //キャッシュ(previousTodos)が存在する場合は新しいタスクのデータ（res）を追加して更新
        if (previousTodos) {
          queryClient.setQueryData(["tasks"], [res, ...previousTodos]);
        }
        reset(); //formをリセットする
      },

      //ミューテーションがエラーとなった場合に実行
      onError: (err: any) => {
        reset(); //formをリセットする
        if (err.response.status === 401 || err.response.status === 403) {
          router.push("/"); //ユーザーをログインページにリダイレクト
        }
      },
    }
  );

  const updateTaskMutation = useMutation(
    //タスクを更新
    async (task: EditedTask) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task
      );
      return res.data;
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(["tasks"]);
        if (previousTodos) {
          queryClient.setQueryData(
            ["tasks"],
            //更新したTaskのIDのタスクを置き換えるための処理。
            //マップで繰り返して同じIDのタスクを探す。
            previousTodos.map((task) => (task.id === res.id ? res : task))
          );
        }
        reset();
      },
      onError: (err: any) => {
        reset();
        if (err.response.status === 401 || err.response.status === 403) {
          router.push("/");
        }
      },
    }
  );

  const deleteTaskMutation = useMutation(
    //idという引数を受け取りタスクを削除
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`);
    },
    {
      //variablesにさっき受け取ったidが入る
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(["tasks"]);
        if (previousTodos) {
          //削除されたタスクのIDに対応するタスクを除外して更新
          queryClient.setQueryData(
            ["tasks"],
            previousTodos.filter((task) => task.id !== variables)
          );
        }
        reset();
      },
      onError: (err: any) => {
        reset();
        if (err.response.status === 401 || err.response.status === 403) {
          router.push("/");
        }
      },
    }
  );
  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};

export default useMutateTask;

////try-catch文を使用することで、エラーが発生した場合に適切な処理を実行することができます。
//ただし、useMutationを使用すると、react-queryライブラリが提供する便利な機能
//（オプティミスティックアップデートや自動再フェッチなど）を活用することができます
//
////onSuccessコールバック関数やonErrorコールバック関数内で、
//第二引数のvariablesにはミューテーションの引数が渡されます