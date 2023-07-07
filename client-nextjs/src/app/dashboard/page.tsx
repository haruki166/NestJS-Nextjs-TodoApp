"use client";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";

import Layout from "@/components/Layout";
import UserInfo from "@/components/UserInfo";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  //ログアウトボタンを押した時の処理
  const logout = async () => {
    //キャッシュからキーが"user"であるクエリを削除
    queryClient.removeQueries(["user"]);
    //ログアウトAPIを叩く
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
    //ルートのページに遷移する
    router.push("/");
  };

  return (
    <Layout title="Task Board">
      <LogoutIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={logout}
      />
      <UserInfo />
    </Layout>
  );
};

export default Dashboard;
