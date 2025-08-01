import React from "react";
import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Heart,
  ShoppingBag,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 py-16 px-6 md:px-20">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Store Info */}
            <div className="space-y-6 lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    KapdaPasal
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Your trusted destination for trendy fashion. Bringing you the
                  latest styles for men, women, and kids with quality and
                  affordability.
                </p>
                <div className="flex items-center space-x-2 text-pink-300">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">
                    Made with love in Nepal
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-white relative">
                Quick Links
                <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Shop All", href: "#" },
                  { name: "New Arrivals", href: "#" },
                  { name: "Best Sellers", href: "#" },
                  { name: "Sale Items", href: "#" },
                  { name: "About Us", href: "#" },
                  { name: "Size Guide", href: "#" },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-pink-400 transition-all duration-300 text-sm flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-white relative">
                Customer Care
                <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Contact Us", href: "#" },
                  { name: "Shipping Info", href: "#" },
                  { name: "Returns", href: "#" },
                  { name: "FAQ", href: "#" },
                  { name: "Track Order", href: "#" },
                  { name: "Support", href: "#" },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-purple-400 transition-all duration-300 text-sm flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-bold text-xl text-white relative">
                  Get in Touch
                  <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                </h4>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-pink-500/20 group-hover:bg-pink-500/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm">support@kapdapasal.com</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">+977-9876543210</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-blue-500/20 group-hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h5 className="font-semibold text-white">Follow Us</h5>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, color: "hover:bg-blue-600", href: "#" },
                    { icon: Instagram, color: "hover:bg-pink-600", href: "#" },
                    { icon: Twitter, color: "hover:bg-blue-400", href: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${social.color}`}
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h5 className="font-semibold text-white">Stay Updated</h5>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-colors duration-300"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} KapdaPasal. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a
                href="#"
                className="hover:text-pink-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <a
                href="#"
                className="hover:text-pink-400 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <a
                href="#"
                className="hover:text-pink-400 transition-colors duration-300"
              >
                Cookies
              </a>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Secured by</span>
              <div className="flex space-x-1">
                <div className="w-6 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-20 left-10 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-30"></div>
      </div>
    </footer>
  );
};

export default Footer;
