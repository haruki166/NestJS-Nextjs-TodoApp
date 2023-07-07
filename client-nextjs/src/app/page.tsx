"use client";
import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as Yup from "yup";
import { IconDatabase } from "@tabler/icons";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import {
  Anchor,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Alert,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import Layout from "@/components/Layout";
import { AuthForm } from "../../types/index";

const schema = Yup.object().shape({
  email: Yup.string().email("Invaid email").required("No email provided"),
  password: Yup.string()
    .required("No password provided")
    .min(5, "Password should be min 5 chars"),
});

export default function Home() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSunbit = async () => {
    //isRegisterがtrueなら登録のAPIを叩いてその後ログインAPIを叩く
    //falseならそのままログインAPIを叩く。
    try {
      //新規登録の場合の処理。
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          //ここがdtoとしてNestJSのRestAPIに渡される。
          email: form.values.email,
          password: form.values.password,
        });
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      });
      form.reset(); //formの値を初期値にする。
      router.push("/dashboard"); //dashboardページに遷移する。
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout title="Auth">
      <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
      {/* errorに値が入っている時だけMantainUIのAlertコンポーネントを表示させる */}
      {error && (
        <Alert
          my="md"
          variant="filled"
          icon={<ExclamationCircleIcon />}
          title="Authorization Error"
          color="red"
          radius="md"
        >
          {error}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSunbit)}>
        <TextInput
          mt="md"
          id="email"
          label="Email*"
          placeholder="example@gmail.com"
          //したの記述でformのemailに入力した値が自動的に入る！
          {...form.getInputProps("email")}
        />
        <PasswordInput
          mt="md"
          id="password"
          label="Password*"
          placeholder="password"
          description="Must be min 5 char"
          //したの記述でformのpasswordに入力した値が自動的に入る！
          {...form.getInputProps("password")}
        />
        <Group mt="xl" position="apart">
          <Anchor
            component="button"
            type="button"
            size="xs"
            className="text-gray-300"
            onClick={() => {
              setIsRegister(!isRegister);
              console.log(isRegister);
              setError("");
            }}
          >
            {isRegister
              ? "Have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            leftIcon={<IconDatabase size={14} />}
            color="cyan"
            type="submit"
          >
            {isRegister ? "Register" : "Login"}
          </Button>
        </Group>
      </form>
    </Layout>
  );
}
