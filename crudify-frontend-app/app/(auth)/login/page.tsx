"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login", 
        data
      );
      if (response.status === 201 && response?.data?.accessToken !== "") {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        router.push("/produtos");
      } else {
        setErrorMessage("Credenciais inválidas. Por favor, tente novamente.");
      }
    } catch (error) {
      setErrorMessage(
        "Ocorreu um erro durante o login. Por favor, tente novamente."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-md shadow-md">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">CrudifyApp</h1>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("email", {
                required: {
                  value: true,
                  message: "Por favor, digite seu email.",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 mt-1">Por favor, insira seu email.</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("password", {
                required: {
                  value: true,
                  message: "Por favor, digite sua senha.",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 mt-1">Por favor, insira sua senha.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4">
          Não tem uma conta?{" "}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Cadastre-se
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
