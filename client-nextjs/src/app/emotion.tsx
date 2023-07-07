"use client";
import { CacheProvider } from "@emotion/react";
import { useEmotionCache, MantineProvider } from "@mantine/core";
import { useServerInsertedHTML } from "next/navigation";

import { useEffect } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";


//ReactQueryのQueryClientインスタンスを作成する際にデフォルトオプションを設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, //サーバーからのデータフェッチが失敗した場合、リトライせずにエラーステータスが保持されます
      refetchOnWindowFocus: false, //ウィンドウがフォーカスされたときに自動的にクエリを再フェッチしないよう設定します
    },
  },
});

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  //
  //Axios使う全てのリクエストに対してクッキーが自動的に送信されるようになる
  axios.defaults.withCredentials = true;

  ////マウント時にCSRFトークンをaxiosのheaderに付与できるように
  //CSRFトークンを取得してそれをaxiosのデフォルトで設定している
  useEffect(() => {
    const getCsrToken = async () => {
      //CSRFトークンを取得するAPIを叩く。取得したのを分割代入でdataにぶち込む
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`
      );
      //それ以降にAPI叩く時にheaderに取得したcsrfTokenを付与した状態でAPIを叩けるようにする
      axios.defaults.headers.common["csrf-token"] = data.csrfToken;
    };
    getCsrToken();
  }, []);

  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          {children}
        </MantineProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </CacheProvider>
  );
}
