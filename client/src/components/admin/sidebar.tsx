import { BarChart3, Package, ShoppingCart, Users, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full lg:w-64 bg-white shadow-sm">
      <nav className="mt-4 lg:mt-8">
        <div className="px-2 sm:px-4 space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start text-sm lg:text-base py-2 lg:py-3 ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="mr-2 lg:mr-3 h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
