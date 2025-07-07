import { 
  users, products, categories, orders, orderItems, cartItems,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type CartItem, type InsertCartItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order operations
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Cart operations
  getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId?: number, sessionId?: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private cartItems: Map<number, CartItem>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCategoryId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentCartItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentCartItemId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed categories
    const electronicsCategory: Category = { id: this.currentCategoryId++, name: "Electronics", description: "Latest tech & gadgets" };
    const fashionCategory: Category = { id: this.currentCategoryId++, name: "Fashion", description: "Trendy apparel" };
    const homeCategory: Category = { id: this.currentCategoryId++, name: "Home", description: "Decor & furniture" };
    const sportsCategory: Category = { id: this.currentCategoryId++, name: "Sports", description: "Fitness & outdoor" };

    this.categories.set(electronicsCategory.id, electronicsCategory);
    this.categories.set(fashionCategory.id, fashionCategory);
    this.categories.set(homeCategory.id, homeCategory);
    this.categories.set(sportsCategory.id, sportsCategory);

    // Seed products
    const products: Product[] = [
      {
        id: this.currentProductId++,
        name: "Wireless Headphones",
        description: "Premium noise-canceling wireless headphones with superior sound quality",
        price: "129.99",
        categoryId: electronicsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stock: 24,
        isActive: true,
      },
      {
        id: this.currentProductId++,
        name: "Smart Phone Pro",
        description: "Latest generation smartphone with advanced features and 5G connectivity",
        price: "699.99",
        categoryId: electronicsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stock: 12,
        isActive: true,
      },
      {
        id: this.currentProductId++,
        name: "Designer Watch",
        description: "Luxury timepiece with premium leather strap and Swiss movement",
        price: "299.99",
        categoryId: fashionCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stock: 8,
        isActive: true,
      },
      {
        id: this.currentProductId++,
        name: "Professional Laptop",
        description: "High-performance laptop for professionals with 16GB RAM and 512GB SSD",
        price: "1299.99",
        categoryId: electronicsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stock: 6,
        isActive: true,
      },
    ];

    products.forEach(product => this.products.set(product.id, product));

    // Seed admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123",
      email: "admin@shopflow.com",
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
    };
    this.users.set(adminUser.id, adminUser);

    // Seed regular user
    const regularUser: User = {
      id: this.currentUserId++,
      username: "john_doe",
      password: "password123",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      isAdmin: false,
    };
    this.users.set(regularUser.id, regularUser);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      id, 
      name: insertCategory.name, 
      description: insertCategory.description ?? null 
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId && p.isActive);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(p => 
      p.isActive && (
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      )
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      id,
      name: insertProduct.name,
      description: insertProduct.description,
      price: insertProduct.price,
      categoryId: insertProduct.categoryId ?? null,
      imageUrl: insertProduct.imageUrl,
      stock: insertProduct.stock ?? 0,
      isActive: insertProduct.isActive ?? true
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = this.products.get(id);
    if (!product) return false;
    
    // Soft delete by setting isActive to false
    const updatedProduct = { ...product, isActive: false };
    this.products.set(id, updatedProduct);
    return true;
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      id,
      userId: insertOrder.userId,
      status: insertOrder.status ?? "pending",
      total: insertOrder.total,
      shippingAddress: insertOrder.shippingAddress,
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Cart operations
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => 
      (userId && item.userId === userId) || (sessionId && item.sessionId === sessionId)
    );
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(item =>
      item.productId === insertCartItem.productId &&
      ((insertCartItem.userId && item.userId === insertCartItem.userId) ||
       (insertCartItem.sessionId && item.sessionId === insertCartItem.sessionId))
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + insertCartItem.quantity };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      // Create new cart item
      const id = this.currentCartItemId++;
      const cartItem: CartItem = { 
        id,
        userId: insertCartItem.userId ?? null,
        sessionId: insertCartItem.sessionId ?? null,
        productId: insertCartItem.productId,
        quantity: insertCartItem.quantity
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.entries()).filter(([_, item]) =>
      (userId && item.userId === userId) || (sessionId && item.sessionId === sessionId)
    );

    itemsToDelete.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }
}

export const storage = new MemStorage();
