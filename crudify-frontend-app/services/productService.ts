import axios, { type AxiosInstance, type AxiosResponse } from "axios";

export type Product = {
	userId: number;
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
	createdAt: string;
};

export type ProductInput = Omit<Product, "id">;

class ProductService {
  private api: AxiosInstance;

  constructor(accessToken: string) {
    // Use o nome do serviço Docker como hostname quando estiver rodando em um container
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://backend:3000";
    console.log("API Base URL:", baseURL);
    
    this.api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 5000, // 5 seconds timeout
    });
  }

  async fetchProducts(): Promise<Product[]> {
    try {
      console.log("Fetching products...");
      console.log("Request config:", JSON.stringify(this.api.defaults, null, 2));
      
      const response: AxiosResponse<Product[]> = await this.api.get("/products");
      
      console.log("Products fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error config:", JSON.stringify(error.config, null, 2));
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
      }
      throw error; // Re-throw the error to be handled by the caller
    }
  }

	async createProduct(productData: ProductInput): Promise<Product> {
		try {
			const response: AxiosResponse<Product> = await this.api.post(
				"/products",
				productData,
			);
			return response.data;
		} catch (error) {
			console.error("Error creating product:", error);
			throw new Error("Failed to create product");
		}
	}

	async deleteProduct(productId: number): Promise<void> {
		try {
			await this.api.delete(`/products/${productId}`);
		} catch (error) {
			console.error("Error deleting product:", error);
			throw new Error("Failed to delete product");
		}
	}
}

export default ProductService;
