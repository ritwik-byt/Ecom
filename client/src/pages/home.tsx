import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product, Category } from "@/lib/types";

export default function Home() {
  const [location] = useLocation();
  
  // Parse URL parameters directly from location
  const urlParams = new URLSearchParams(location.includes('?') ? location.split('?')[1] : '');
  const category = urlParams.get('category');
  const search = urlParams.get('search');

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const productsQuery = useQuery<Product[]>({
    queryKey: ["/api/products", { category, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      {!category && !search && (
        <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}></div>
          <div className="relative container-responsive py-12 sm:py-16 md:py-24">
            <div className="text-center">
              <h2 className="hero-text-responsive font-bold mb-4 sm:mb-6">Discover Amazing Products</h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 px-4">Shop the latest trends with free shipping worldwide</p>
              <Button size="lg" variant="secondary" className="text-gray-900">
                Shop Now
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {!category && !search && (
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container-responsive">
            <h3 className="heading-responsive font-bold text-center mb-6 sm:mb-8 md:mb-12">Shop by Category</h3>
            {categoriesQuery.isLoading ? (
              <div className="grid grid-responsive-categories gap-3 sm:gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-24 sm:h-32 md:h-40" />
                    <CardContent className="p-3 sm:p-4">
                      <Skeleton className="h-4 sm:h-5 w-3/4 mb-2" />
                      <Skeleton className="h-3 sm:h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-responsive-categories gap-3 sm:gap-4 md:gap-6">
                {categoriesQuery.data?.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => window.location.href = `/?category=${cat.id}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <img
                      src={getCategoryImage(cat.name)}
                      alt={cat.name}
                      className="w-full h-24 sm:h-32 md:h-40 object-cover rounded-t-xl"
                    />
                    <div className="p-3 sm:p-4 text-center">
                      <h4 className="font-semibold text-sm sm:text-base md:text-lg">{cat.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">{cat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className={`py-8 sm:py-12 md:py-16 ${!category && !search ? 'bg-white' : ''}`}>
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 md:mb-12 gap-4">
            <div>
              <h3 className="heading-responsive font-bold">
                {search ? `Search Results for "${search}"` : 
                 category ? `${getCategoryName(categoriesQuery.data, category)} Products` : 
                 'Featured Products'}
              </h3>
              {search && (
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Found {productsQuery.data?.length || 0} products
                </p>
              )}
            </div>
            {!category && !search && (
              <Link href="/products" className="text-primary hover:text-blue-600 font-medium">
                View All →
              </Link>
            )}
          </div>

          {productsQuery.isLoading ? (
            <div className="grid grid-responsive-products gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-36 sm:h-48" />
                  <CardContent className="p-3 sm:p-4">
                    <Skeleton className="h-4 sm:h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3 sm:h-4 w-full mb-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
                      <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : productsQuery.data?.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">No products found</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/'}>
                Browse All Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-responsive-products gap-3 sm:gap-4 md:gap-6">
              {productsQuery.data?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function getCategoryImage(categoryName: string): string {
  const images: Record<string, string> = {
    Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    Fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    Home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  };
  return images[categoryName] || images.Electronics;
}

function getCategoryName(categories: Category[] | undefined, categoryId: string): string {
  const category = categories?.find(cat => cat.id === parseInt(categoryId));
  return category?.name || 'Category';
}
