import create from "zustand/react";
import { EditedTask } from "../types";

//カスタムフックの状態の型
type State = {
  editedTask: EditedTask; //EditedTask型
  updateEditedTask: (payload: EditedTask) => void; //アップデート関数
  resetEditedTask: () => void; //アップデート関数
};

//zustandという状態管理ライブラリを使用して状態を管理するためのカスタムフック
//
//create関数を使用してuseStoreというカスタムフックを作成
const useStore = create<State>((set) => ({
  //初期状態としてeditedTaskオブジェクトを定義
  editedTask: { id: 0, title: "", description: "" },
  //
  //新しいpayload（EditedTask型）を受け取ってeditedTaskを更新するためのアップデート関数
  updateEditedTask: (payload) =>
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
        description: payload.description,
      },
    }),
  //
  //editedTaskを初期値にリセットするためのアップデート関数
  resetEditedTask: () =>
    set({ editedTask: { id: 0, title: "", description: "" } }),
}));

export default useStore;
