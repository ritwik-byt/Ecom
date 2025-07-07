import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  UserCircle,
  LogOut,
  Edit,
  Eye,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin/sidebar";
import ProductForm from "@/components/admin/product-form";
import OrderDetails from "@/components/admin/order-details";
import type { Product, User, OrderWithDetails } from "@/lib/types";

type AdminSection = "dashboard" | "products" | "orders" | "customers";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | undefined>();

  const productsQuery = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const ordersQuery = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/orders"],
  });

  const usersQuery = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Calculate stats
  const totalProducts = productsQuery.data?.length || 0;
  const totalOrders = ordersQuery.data?.length || 0;
  const totalRevenue = ordersQuery.data?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
  const totalCustomers = usersQuery.data?.filter(user => !user.isAdmin).length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">ShopFlow Admin</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <Button variant="ghost" className="flex items-center space-x-2 px-2 sm:px-3">
                  <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:block text-sm">Admin User</span>
                </Button>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Store</span>
                  <span className="sm:hidden">Store</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="lg:hidden">
          <AdminSidebar activeSection={activeSection} onSectionChange={(section) => setActiveSection(section as AdminSection)} />
        </div>
        <div className="hidden lg:block">
          <AdminSidebar activeSection={activeSection} onSectionChange={(section) => setActiveSection(section as AdminSection)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "dashboard" && (
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Orders</p>
                        <p className="text-2xl font-bold text-success">{totalOrders}</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-success" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Products</p>
                        <p className="text-2xl font-bold text-warning">{totalProducts}</p>
                      </div>
                      <Package className="h-8 w-8 text-warning" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Customers</p>
                        <p className="text-2xl font-bold text-purple-600">{totalCustomers}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Order ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersQuery.data?.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">#{order.id}</td>
                            <td className="py-3 px-4">{order.user?.firstName} {order.user?.lastName}</td>
                            <td className="py-3 px-4">${order.total}</td>
                            <td className="py-3 px-4">
                              <Badge className={`${getStatusColor(order.status)} capitalize`}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "products" && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
                <h2 className="heading-responsive font-bold">Products Management</h2>
                <Button onClick={() => setIsProductFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>

              <Card>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-4 px-6">Product</th>
                          <th className="text-left py-4 px-6">Category</th>
                          <th className="text-left py-4 px-6">Price</th>
                          <th className="text-left py-4 px-6">Stock</th>
                          <th className="text-left py-4 px-6">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsQuery.data?.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-gray-600 text-sm">ID: {product.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">Category {product.categoryId}</td>
                            <td className="py-4 px-6">${product.price}</td>
                            <td className="py-4 px-6">{product.stock}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Badge className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {product.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setIsProductFormOpen(true);
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "orders" && (
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-8">Orders Management</h2>
              
              <Card>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-4 px-6">Order ID</th>
                          <th className="text-left py-4 px-6">Customer</th>
                          <th className="text-left py-4 px-6">Products</th>
                          <th className="text-left py-4 px-6">Amount</th>
                          <th className="text-left py-4 px-6">Status</th>
                          <th className="text-left py-4 px-6">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersQuery.data?.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-6 font-medium">#{order.id}</td>
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                                <p className="text-gray-600 text-sm">{order.user?.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {order.items.map(item => item.product?.name).join(", ")}
                            </td>
                            <td className="py-4 px-6 font-medium">${order.total}</td>
                            <td className="py-4 px-6">
                              <Badge className={`${getStatusColor(order.status)} capitalize`}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "customers" && (
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-8">Customers Management</h2>
              
              <Card>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-4 px-6">Customer</th>
                          <th className="text-left py-4 px-6">Email</th>
                          <th className="text-left py-4 px-6">Orders</th>
                          <th className="text-left py-4 px-6">Total Spent</th>
                          <th className="text-left py-4 px-6">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersQuery.data?.filter(user => !user.isAdmin).map((user) => {
                          const userOrders = ordersQuery.data?.filter(order => order.userId === user.id) || [];
                          const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
                          
                          return (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                                    {user.firstName[0]}{user.lastName[0]}
                                  </div>
                                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                                </div>
                              </td>
                              <td className="py-4 px-6">{user.email}</td>
                              <td className="py-4 px-6">{userOrders.length}</td>
                              <td className="py-4 px-6">${totalSpent.toFixed(2)}</td>
                              <td className="py-4 px-6">
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setSelectedProduct(undefined);
        }}
        product={selectedProduct}
      />

      {/* Order Details Modal */}
      <OrderDetails
        isOpen={isOrderDetailsOpen}
        onClose={() => {
          setIsOrderDetailsOpen(false);
          setSelectedOrder(undefined);
        }}
        order={selectedOrder || null}
      />
    </div>
  );
}
