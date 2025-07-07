# ShopFlow E-commerce Application

## Overview

ShopFlow is a full-stack e-commerce application built with modern web technologies. It features a React frontend with TypeScript, an Express.js backend, and uses PostgreSQL with Drizzle ORM for data management. The application provides a complete shopping experience including product browsing, cart management, order processing, and admin functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: Users, products, categories, orders, order items, and cart items
- **Relationships**: Foreign key constraints for data integrity

## Key Components

### Core Entities
1. **Users**: Customer accounts with authentication
2. **Products**: Catalog items with categories, pricing, and inventory
3. **Categories**: Product classification system
4. **Orders**: Purchase transactions with status tracking
5. **Cart**: Session-based shopping cart functionality

### Frontend Components
- **Responsive Navigation**: Mobile-first navbar with search and cart
- **Product Catalog**: Grid layout with filtering and search
- **Shopping Cart**: Sidebar and dedicated page for cart management
- **Admin Dashboard**: Product and order management interface
- **Form Components**: Reusable form elements with validation

### Backend Services
- **Storage Layer**: Abstract storage interface for database operations
- **Route Handlers**: RESTful endpoints for all CRUD operations
- **Authentication**: Basic email/password authentication
- **Error Handling**: Centralized error middleware

## Data Flow

### User Journey
1. **Browse Products**: Users can view products, filter by category, and search
2. **Add to Cart**: Products are added to session-based cart
3. **Checkout Process**: Form-based checkout with shipping and payment info
4. **Order Management**: Orders are tracked through various status stages

### Admin Workflow
1. **Product Management**: Create, edit, and manage product catalog
2. **Order Processing**: View and update order statuses
3. **Inventory Tracking**: Monitor stock levels and availability

### Data Persistence
- **Database Operations**: All data persists to PostgreSQL via Drizzle ORM
- **Session Storage**: Cart data stored with session IDs for guest users
- **Type Safety**: End-to-end TypeScript ensures data consistency

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database schema management
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static files
2. **Backend Build**: ESBuild bundles server code for Node.js
3. **Database Setup**: Drizzle migrations prepare PostgreSQL schema

### Environment Configuration
- **Development**: Vite dev server with Express backend
- **Production**: Compiled static files served by Express
- **Database**: Environment variable for PostgreSQL connection string

### Replit Integration
- **Development Mode**: Automatic reloading and error overlay
- **Runtime Error Handling**: Replit-specific error modal integration
- **File System**: Proper alias resolution for imports

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. Enhanced mobile responsiveness for screens down to 420px width
- July 01, 2025. Added comprehensive admin dashboard with product and order management
- July 01, 2025. Implemented responsive grid layouts and mobile-first design principles
- July 01, 2025. Fixed navbar category navigation issues with direct URL navigation
- July 01, 2025. Added comprehensive footer component to all pages
- July 01, 2025. Completed full ecommerce website with all pages functional