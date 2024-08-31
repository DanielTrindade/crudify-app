"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import ProductService, { type Product } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProductList({ initialProducts }: { initialProducts: Product[] | undefined }) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[] | undefined>(initialProducts);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = async (productId: number) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }
      const productService = new ProductService(session.accessToken);
      await productService.deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts?.filter((product) => product.id !== productId)
      );
      setError(null);
    } catch (error) {
      setError("Ocorreu um erro ao excluir o produto.");
      console.error("Erro ao excluir o produto:", error);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {(products?.length ?? 0) > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </>
  );
}