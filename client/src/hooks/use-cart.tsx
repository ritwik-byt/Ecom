import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CartItemWithProduct } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Generate a session ID for guest users
  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  };

  const cartQuery = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart", { sessionId: getSessionId() }],
    queryFn: async () => {
      const response = await fetch(`/api/cart?sessionId=${getSessionId()}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
        sessionId: getSessionId(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/cart/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Product has been removed from your cart.",
      });
    },
  });

  const cartTotal = cartQuery.data?.reduce((total, item) => {
    return total + (parseFloat(item.product?.price || "0") * item.quantity);
  }, 0) || 0;

  const cartItemCount = cartQuery.data?.reduce((total, item) => total + item.quantity, 0) || 0;

  return {
    cartItems: cartQuery.data || [],
    cartTotal,
    cartItemCount,
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
}
