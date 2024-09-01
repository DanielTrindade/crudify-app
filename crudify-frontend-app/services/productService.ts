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
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://backend:3000"; 
    this.api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
  }

  async fetchProducts(): Promise<Product[]> {
    try { 
      const response: AxiosResponse<Product[]> = await this.api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
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
