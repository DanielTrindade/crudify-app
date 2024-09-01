import ProductService from "@/services/productService";
import { useSession } from "next-auth/react";

async function getProducts(accessToken: string | undefined) {
    if (!accessToken) return [];
    const productService = new ProductService(accessToken);
    try {
        const products = await productService.fetchProducts();
        return products || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function useProduct() {
    const session = useSession();
    const products = await getProducts(session.data?.accessToken);
    const loading = session.status === "loading";
    return {
        products,
        loading,
        session
    }
}