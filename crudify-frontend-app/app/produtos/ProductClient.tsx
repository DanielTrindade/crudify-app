'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {ProductForm} from './ProductForm';
import {ProductList} from './ProductList';
import LoadingSpinner from '@/components/ui/loading';
//lembrar de centralizar a interface para o tipo de produto desse modo 
//não tá legal ainda
interface Product {
    userId: number;
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
	createdAt: string;
}
  
interface ProductsClientProps {
initialProducts: Product[]; 
}
  

export function ProductsClient({ initialProducts }: ProductsClientProps) {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>(initialProducts || []);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // Atualize o estado com os produtos iniciais quando eles chegarem
        if (initialProducts?.length > 0) {
            setProducts(initialProducts);
        }
    }, [initialProducts]);

    // Log para debug
    console.log('Products state:', products);
    console.log('Initial products prop:', initialProducts);

    if (status === "loading") {
        return <LoadingSpinner />;
    }

    if (status === "unauthenticated") {
        window.location.href = '/login';
        return null;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">CRUD de Produtos</h1>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Adicionar Novo Produto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductForm onProductAdded={(newProduct) => {
                            setProducts(prev => [...prev, newProduct]);
                        }} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Produtos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <LoadingSpinner />
                        ) : products && products.length > 0 ? (
                            <ProductList products={products} onProductUpdated={(updatedProduct) => {
                                setProducts(prev => prev.map(p => 
                                    p.id === updatedProduct.id ? updatedProduct : p
                                ));
                            }} 
                            onProductDeleted={(deletedId) => {
                                setProducts(prev => prev.filter(p => p.id !== deletedId));
                            }} />
                        ) : (
                            <div>Nenhum produto encontrado. Adicione um novo produto!</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}