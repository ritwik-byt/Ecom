import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "./cart-sidebar";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItemCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">ShopFlow</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => window.location.href = "/"}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => window.location.href = "/?category=1"}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Electronics
              </button>
              <button 
                onClick={() => window.location.href = "/?category=2"}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Fashion
              </button>
              <button 
                onClick={() => window.location.href = "/?category=3"}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Home & Garden
              </button>
              <button 
                onClick={() => window.location.href = "/?category=4"}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Sports
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 pl-10 h-9"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </form>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
              <Link href="/orders">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="default">
                  Admin
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <div className="space-y-6 mt-6">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </form>
                  
                  <nav className="space-y-2">
                    <button 
                      onClick={() => window.location.href = "/"}
                      className="block py-2 text-gray-700 hover:text-primary transition-colors w-full text-left"
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => window.location.href = "/?category=1"}
                      className="block py-2 text-gray-700 hover:text-primary transition-colors w-full text-left"
                    >
                      Electronics
                    </button>
                    <button 
                      onClick={() => window.location.href = "/?category=2"}
                      className="block py-2 text-gray-700 hover:text-primary transition-colors w-full text-left"
                    >
                      Fashion
                    </button>
                    <button 
                      onClick={() => window.location.href = "/?category=3"}
                      className="block py-2 text-gray-700 hover:text-primary transition-colors w-full text-left"
                    >
                      Home & Garden
                    </button>
                    <button 
                      onClick={() => window.location.href = "/?category=4"}
                      className="block py-2 text-gray-700 hover:text-primary transition-colors w-full text-left"
                    >
                      Sports
                    </button>
                  </nav>
                  
                  <div className="flex flex-col space-y-4 pt-4">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setIsCartOpen(true)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart ({cartItemCount})
                    </Button>
                    <Link href="/orders">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Orders
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button className="w-full justify-start">
                        Admin
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
