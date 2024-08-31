import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import ProductService from "@/services/productService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
async function getProducts(accessToken: string) {
	const productService = new ProductService(accessToken);
	try {
		return await productService.fetchProducts();
	} catch (error) {
		console.error("Error fetching products:", error);
		return null;
	}
}

export default async function ProductsPage() {
	const session = useSession();

	if (!session || !session.data?.accessToken) {
		return <div>Por favor, faça login para visualizar esta página.</div>;
	}

	const initialProducts = await getProducts(session.data?.accessToken);
	if (initialProducts === null) {
		return <div>Erro ao carregar produtos.pq sim pq</div>;
	}

	return (
		<div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">CRUD de Produtos</h1>

				<Suspense fallback={<div>Carregando formulário...</div>}>
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>Adicionar Novo Produto</CardTitle>
						</CardHeader>
						<CardContent>
							<ProductForm />
						</CardContent>
					</Card>
				</Suspense>

				<Suspense fallback={<div>Carregando produtos...</div>}>
					<Card>
						<CardHeader>
							<CardTitle>Lista de Produtos</CardTitle>
						</CardHeader>
						<CardContent>
							<ProductList initialProducts={initialProducts} />
						</CardContent>
					</Card>
				</Suspense>
			</div>
		</div>
	);
}
