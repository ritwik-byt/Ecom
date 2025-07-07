import { useState } from "react";
import { Link } from "wouter";
import { Minus, Plus, X, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { cartItems, cartTotal, updateCart, removeFromCart } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart({ id, quantity: newQuantity });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container-responsive py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8 gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="self-start">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="heading-responsive font-bold">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some products to get started!</p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Link href={`/product/${item.product?.id}`}>
                          <img
                            src={item.product?.imageUrl}
                            alt={item.product?.name}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product?.id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                            {item.product?.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.product?.description}
                        </p>
                        <p className="text-primary font-bold text-lg mt-2">
                          ${item.product?.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-2 text-center min-w-[3rem]">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>
                  
                  <Link href="/checkout">
                    <Button className="w-full mt-6" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <div className="text-center text-sm text-gray-600 mt-4">
                    <p>Free shipping on orders over $50</p>
                    <p>30-day return policy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
