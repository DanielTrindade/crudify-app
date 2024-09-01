// ProductsPage.tsx (Server Component)
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductService from "@/services/productService";
import {ProductsClient} from './ProductClient';

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

export default async function ProductsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        redirect('/login');
    }

    const initialProducts = await getProducts(session.accessToken);

    return (
        <ProductsClient initialProducts={initialProducts} />
    );
}