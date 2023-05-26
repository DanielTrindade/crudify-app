"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { get } from "http";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

const Signup = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormValues) => {
    try {
      const { confirmPassword, ...rest } = data;
      data = rest;
      const response = await axios.post("http://localhost:3000/users", data);
      if (response.status === 201 && response?.data !== "") {
        router.push("/login");
      } else {
        setErrorMessage(
          "Ocorreu um erro ao criar a conta. Por favor, tente novamente."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Ocorreu um erro ao criar a conta. Por favor, tente novamente."
      );
    }
    console.log(data);
  };

  const handleConfirmPassword = (value: string | undefined): string | undefined => {
    if (value !== getValues("password")) {
      return "As senhas não coincidem.";
    }
    return undefined;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Cadastro</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("name", {
                required: {
                  value: true,
                  message: "Por favor, digite seu nome.",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
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
                  message: "Por favor, digite seu e-mail.",
                },
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Por favor, digite um e-mail válido.",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email.message}</p>
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
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres.",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block font-medium">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Por favor, digite sua senha.",
                },
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres.",
                },
                validate: {
                  value: handleConfirmPassword,
                },
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
