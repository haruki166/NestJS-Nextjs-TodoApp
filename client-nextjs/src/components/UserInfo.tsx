import { Loader } from "@mantine/core";
import useQueryUser from "@/hooks/useQueryUser";

const UserInfo = () => {
  //useQueryUser実行。戻り値のdataとstatusを分割代入。
  //data: APIから取得したデータが格納されるプロパティ
  //status: useQueryフックによって提供される,データの取得状態を示すプロパティ
  const { data: user, status } = useQueryUser();
  if (status === "loading") return <Loader />;

  return <div>{user?.email}</div>;
};

export default UserInfo;
