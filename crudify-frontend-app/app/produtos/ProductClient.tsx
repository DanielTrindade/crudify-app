// ProductsClient.tsx (Client Component)
'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {ProductForm} from './ProductForm';
import {ProductList} from './ProductList';
import LoadingSpinner from '@/components/ui/loading';

interface ProductsClientProps {
    initialProducts: any[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.accessToken) {
            setLoading(true);
            setLoading(false);
        }
    }, [status, session]);

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
                        <ProductForm />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Produtos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <LoadingSpinner />
                        ) : products.length > 0 ? (
                            <ProductList initialProducts={products} />
                        ) : (
                            <div>Nenhum produto encontrado. Adicione um novo produto!</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}