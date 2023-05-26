"use client";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type FormValues = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: number;
  createdAt: Date;
};

const Products = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetchProducts();
  }, []);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("accessToken");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();

    if (token && tokenExpiration) {
      if (currentTime > Number(tokenExpiration)) {
        // Token expirado, redirecionar para a página de login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        router.push("/login");
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const axiosInstance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar os produtos:", error);
    }
  };

  const createProduct = async (data: FormValues) => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const axiosInstance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      data.price = Number(data.price);
      data.quantity = Number(data.quantity);
      data.userId = Number(userId);
      data.createdAt = new Date();
      const response = await axiosInstance.post("/products", data);
      setProducts((prevProducts) => [...prevProducts, response.data]);
      reset();
    } catch (error) {
      console.error("Ocorreu um erro ao criar o produto:", error);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const axiosInstance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await axiosInstance.delete(`/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Ocorreu um erro ao excluir o produto:", error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-4">CRUD de Produtos</h1>
        <form onSubmit={handleSubmit(createProduct)}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("name", {
                required: {
                  value: true,
                  message: "Por favor, digite o nome do produto.",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("description", {
                required: {
                  value: true,
                  message: "Por favor, digite a descrição do produto.",
                },
              })}
            />
            {errors.description && (
              <p className="text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block font-medium">
              Preço
            </label>
            <input
              type="number"
              id="price"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("price", {
                required: {
                  value: true,
                  message: "Por favor, digite o preço do produto.",
                },
              })}
              step="any"
            />
            {errors.price && (
              <p className="text-red-500 mt-1">{errors.price.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block font-medium">
              Quantidade
            </label>
            <input
              type="number"
              id="quantity"
              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("quantity", {
                required: {
                  value: true,
                  message: "Por favor, digite a quantidade do produto.",
                },
              })}
            />
            {errors.quantity && (
              <p className="text-red-500 mt-1">{errors.quantity.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Adicionar Produto
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-2">Lista de Produtos</h2>
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="py-2">Nome</th>
                  <th className="py-2">Descrição</th>
                  <th className="py-2">Preço</th>
                  <th className="py-2">Quantidade</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">{product.description}</td>
                    <td className="py-2">R$ {product.price.toFixed(2)}</td>
                    <td className="py-2">{product.quantity}</td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
