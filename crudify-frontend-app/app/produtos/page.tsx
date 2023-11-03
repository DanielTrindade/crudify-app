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
  id: number;
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
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  const updateProduct = async (product: FormValues) => {
    try {
      const token = localStorage.getItem("accessToken");
      const axiosInstance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Crie um objeto `updatedProduct` com os campos atualizados
      const updatedProduct = {
        ...product,
        updatedAt: new Date(),
      };

      // Faça a requisição PATCH para atualizar o produto no servidor
      const response = await axiosInstance.patch(
        `/products/${selectedProduct?.id}`,
        updatedProduct
      );

      // Atualize o estado `products` com o produto atualizado
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === response.data.id ? response.data : p))
      );

      // Feche o modal de edição (se estiver aberto)
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Ocorreu um erro ao atualizar o produto:", error);
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

  const handleAddProduct = () => {
    setShowForm(true);
  };
  const handleCancel = () => {
    setShowForm(false);
    reset();
  };

  const confirmDeleteProduct = (productId: Product) => {
    setSelectedProduct(productId);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct({...product});
    setIsEditModalOpen(true);
  };

  const openViewModal = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const closeModals = () => {
    setIsDeleteModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-4">CRUD de Produtos</h1>
        {!showForm && (
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={handleAddProduct}
          >
            Adicionar Produto
          </button>
        )}
        {showForm && (
          <form
            onSubmit={handleSubmit(createProduct)}
            className="mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <div className="mb-2">
              <label
                htmlFor="name"
                className="block font-medium text-gray-700 dark:text-white"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-2 py-1 rounded-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            <div className="mb-2">
              <label
                htmlFor="description"
                className="block font-medium text-gray-700 dark:text-white"
              >
                Descrição
              </label>
              <input
                type="text"
                id="description"
                className="w-full px-2 py-1 rounded-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                {...register("description", {
                  required: {
                    value: true,
                    message: "Por favor, digite a descrição do produto.",
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex mb-2">
              <div className="w-1/2 mr-2">
                <label
                  htmlFor="price"
                  className="block font-medium text-gray-700 dark:text-white"
                >
                  Preço
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    className="w-full pl-8 pr-2 py-1 rounded-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    {...register("price", {
                      required: {
                        value: true,
                        message: "Por favor, digite o preço do produto.",
                      },
                    })}
                    step="any"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>
              <div className="w-1/2 ml-2">
                <label
                  htmlFor="quantity"
                  className="block font-medium text-gray-700 dark:text-white"
                >
                  Quantidade
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full px-2 py-1 rounded-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            </div>
            <div className="flex mt-2">
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 mr-2"
              >
                Adicionar
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        <h2 className="text-xl font-semibold mt-6 mb-2">Lista de Produtos</h2>
        <div className="flex flex-col">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <h2 className="text-lg font-medium mb-2">{product.name}</h2>
                  <p className="text-gray-700 dark:text-gray-200 mb-2">
                    Preço: R$ {product.price.toFixed(2)}
                  </p>
                  <div className="flex justify-end">
                    <button
                      className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 mr-2"
                      onClick={() => confirmDeleteProduct(product)}
                    >
                      Excluir
                    </button>
                    <button
                      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 mr-2"
                      onClick={() => openEditModal({...product})}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"
                      onClick={() => openViewModal(product)}
                    >
                      Ver
                    </button>
                  </div>

                  {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-medium mb-4">
                          Confirmar Exclusão
                        </h2>
                        <p>Deseja realmente excluir o produto?</p>
                        <div className="flex justify-end mt-4">
                          <button
                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 mr-2"
                            onClick={() => {
                              deleteProduct(product.id);
                              closeModals();
                            }}
                          >
                            Excluir
                          </button>
                          <button
                            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"
                            onClick={closeModals}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isEditModalOpen && selectedProduct && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 lg:p-10 xl:p-12">
                        <h2 className="text-lg font-medium mb-4">
                          Editar Produto
                        </h2>
                        <form
                          onSubmit={handleSubmit(updateProduct)}
                        >
                          <div className="mb-4">
                            <label htmlFor="name" className="block font-medium">
                              Nome
                            </label>
                            <input
                              {...register("name", {required: false})}
                              type="text"
                              id="name"
                              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              defaultValue={selectedProduct.name}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="description"
                              className="block font-medium"
                            >
                              Descrição
                            </label>
                            <textarea
                              {...register("description", {required: false})}
                              id="description"
                              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              defaultValue={selectedProduct.description}
                            ></textarea>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="price"
                              className="block font-medium"
                            >
                              Preço
                            </label>
                            <input
                              {...register("price", {required: false})}
                              type="number"
                              id="price"
                              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              defaultValue={selectedProduct.price}
                              // Adicione aqui o registro para atualizar o valor do campo
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="quantity"
                              className="block font-medium"
                            >
                              Quantidade
                            </label>
                            <input
                              {...register("quantity", {required: false})}
                              type="number"
                              id="quantity"
                              className="w-full border-gray-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              defaultValue={selectedProduct.quantity}
                              // Adicione aqui o registro para atualizar o valor do campo
                            />
                          </div>
                          <div className="flex justify-end mt-6">
                            <button
                              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 mr-2"
                              type="submit"
                            >
                              Atualizar
                            </button>
                            <button
                              className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"
                              type="button"
                              onClick={closeModals}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {isViewModalOpen && selectedProduct && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 lg:p-10 xl:p-12">
                        <h2 className="text-lg font-medium mb-4">
                          Detalhes do Produto
                        </h2>
                        <div>
                          <p>
                            <strong>Nome:</strong> {selectedProduct.name}
                          </p>
                          <p>
                            <strong>Descrição:</strong>{" "}
                            {selectedProduct.description}
                          </p>
                          <p>
                            <strong>Preço:</strong> R${" "}
                            {selectedProduct.price.toFixed(2)}
                          </p>
                          <p>
                            <strong>Quantidade:</strong>{" "}
                            {selectedProduct.quantity}
                          </p>
                        </div>
                        <div className="flex justify-end mt-6">
                          <button
                            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"
                            onClick={closeModals}
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
