"use client";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";

import Layout from "@/components/Layout";

const Dashboard: NextPage = () => {
  const router = useRouter();

  //ログアウトボタンを押した時の処理
  const logout = async () => {
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
    </Layout>
  );
};

export default Dashboard;
