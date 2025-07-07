import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="destructive" className="absolute top-1 sm:top-2 left-1 sm:left-2 text-xs">
              Low Stock
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary" className="absolute top-1 sm:top-2 left-1 sm:left-2 text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
        <CardContent className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 hidden sm:block">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">${product.price}</span>
            <Button
              size="icon"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1 sm:mt-2">{product.stock} in stock</p>
        </CardContent>
      </Card>
    </Link>
  );
}
