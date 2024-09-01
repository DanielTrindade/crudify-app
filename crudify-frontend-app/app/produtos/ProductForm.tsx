"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProductService from "@/services/productService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const productSchema = z.object({
  userId: z.number(),
  name: z.string().min(1, "O nome do produto é obrigatório."),
  description: z.string().min(1, "A descrição do produto é obrigatória."),
  price: z.string().refine(
    (value) => !Number.isNaN(Number.parseFloat(value)) && Number.parseFloat(value) > 0,
    {
      message: "O preço deve ser um número positivo.",
    }
  ),
  quantity: z.string().refine(
    (value) => !Number.isNaN(Number.parseInt(value)) && Number.parseInt(value) > 0,
    {
      message: "A quantidade deve ser um número inteiro positivo.",
    }
  ),
  createdAt: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: "",
    },
  });

  const createProduct = async (data: ProductFormValues) => {
    console.log('createProduct:', data);
    try {
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const userId = session.userId ? Number.parseInt(session.userId, 10) : null;
      
      if (userId === null) {
        throw new Error("User ID is missing");
      }

      const productService = new ProductService(session.accessToken);
      await productService.createProduct({
        ...data,
        price: Number.parseFloat(data.price),
        quantity: Number.parseInt(data.quantity, 10),
        userId: userId,
        createdAt: new Date().toISOString(),
      });
      form.reset();
      setError(null);
    } catch (error) {
      setError("Ocorreu um erro ao criar o produto.");
      console.error("Erro ao criar o produto:", error);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createProduct)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                <Input
                    type="text"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                <Input
                    type="text"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Adicionar Produto</Button>
        </form>
      </Form>
    </>
  );
}