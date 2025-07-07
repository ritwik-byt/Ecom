import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const { addToCart, isAddingToCart } = useCart();

  const productQuery = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!productId,
  });

  const relatedProductsQuery = useQuery<Product[]>({
    queryKey: ["/api/products", { category: productQuery.data?.categoryId }],
    queryFn: async () => {
      if (!productQuery.data?.categoryId) return [];
      const response = await fetch(`/api/products?category=${productQuery.data.categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch related products");
      const products = await response.json();
      return products.filter((p: Product) => p.id !== productId).slice(0, 4);
    },
    enabled: !!productQuery.data?.categoryId,
  });

  const handleAddToCart = () => {
    if (productQuery.data) {
      addToCart({ productId: productQuery.data.id });
    }
  };

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productQuery.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">{productQuery.data.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={productQuery.data.imageUrl}
              alt={productQuery.data.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productQuery.data.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  ${productQuery.data.price}
                </span>
                {productQuery.data.stock <= 5 && productQuery.data.stock > 0 && (
                  <Badge variant="destructive">Low Stock</Badge>
                )}
                {productQuery.data.stock === 0 && (
                  <Badge variant="secondary">Out of Stock</Badge>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {productQuery.data.description}
            </p>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Stock:</span> {productQuery.data.stock} available
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">SKU:</span> PROD-{productQuery.data.id.toString().padStart(3, '0')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={productQuery.data.stock === 0 || isAddingToCart}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {productQuery.data.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Wishlist
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </Button>
            </div>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Free shipping on orders over $50</li>
                  <li>✓ 30-day return policy</li>
                  <li>✓ 1-year manufacturer warranty</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProductsQuery.data && relatedProductsQuery.data.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsQuery.data.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-lg">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-primary font-bold">${product.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
