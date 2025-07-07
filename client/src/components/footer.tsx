import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">ShopFlow</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for quality products at unbeatable prices. 
              We're committed to providing exceptional shopping experiences.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => window.location.href = "/"}
                  className="hover:text-primary transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = "/?category=1"}
                  className="hover:text-primary transition-colors"
                >
                  Electronics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = "/?category=2"}
                  className="hover:text-primary transition-colors"
                >
                  Fashion
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = "/?category=3"}
                  className="hover:text-primary transition-colors"
                >
                  Home & Garden
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = "/?category=4"}
                  className="hover:text-primary transition-colors"
                >
                  Sports
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">123 Commerce St, City, State 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">support@shopflow.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-responsive py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; 2025 ShopFlow. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}