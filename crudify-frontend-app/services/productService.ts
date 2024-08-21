import axios, { AxiosInstance, AxiosResponse } from 'axios';

export type Product = {
  userId: number;
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: string;
};

export type ProductInput = Omit<Product, 'id'>;

class ProductService {
  private api: AxiosInstance;

  constructor(accessToken: string) {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchProducts(): Promise<Product[]> {
    console.log('api =================>', this.api);
    console.log('process.env.NEXT_PUBLIC_API_URL =================>', process.env.NEXT_PUBLIC_API_URL);
    try {
      const response: AxiosResponse<Product[]> = await this.api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async createProduct(productData: ProductInput): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await this.api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    try {
      await this.api.delete(`/products/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }
}

export default ProductService;