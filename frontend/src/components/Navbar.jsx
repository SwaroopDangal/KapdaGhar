import React, { useEffect, useState } from "react";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  Package,
  LogOut,
  List,
  ShieldUser,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  useLoadUserQuery,
  useLogoutUserMutation,
} from "@/features/Api/authApi";
import { userLoggedOut } from "@/features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { authApi } from "@/features/Api/authApi";
import { useItemCountQuery } from "@/features/Api/cartApi";
import { useGetSearchAndFilterQuery } from "@/features/Api/productApi";

export default function KapdaGharNavbar() {
  const { data: userData, error } = useLoadUserQuery();
  const [role, setRole] = useState(userData?.userRole);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: countData, isLoading } = useItemCountQuery();
  const cartCount = countData?.totalQuantity;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    if (!role) return;
    await logoutUser().unwrap();
    dispatch(userLoggedOut());
    dispatch(authApi.util.resetApiState());
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    if (userData?.userRole) {
      setRole(userData.userRole);
    }
  }, [userData]);

  useEffect(() => {
    if (error?.data?.message === "User not authenticated") {
      setRole("");
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged Out Successfully");
      navigate("/login");
    }
  }, [isSuccess, data]);
  useEffect(() => {
    if (searchQuery) {
      navigate(`/collection/?query=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery]);

  return (
    <nav className="bg-white  shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate("/")}
            >
              Kapda Ghar
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-64 focus:w-80 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(searchTerm);
                    setSearchTerm("");
                  }
                }}
              />
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => {
                    if (role === "") navigate("/login");
                  }}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              {role !== "" && (
                <DropdownMenuContent
                  className="bg-slate-50/95 backdrop-blur-sm w-48 border-slate-200 shadow-xl"
                  align="end"
                >
                  {role === "admin" ? (
                    <DropdownMenuItem
                      className={"cursor-pointer"}
                      onClick={() => navigate("/admin")}
                    >
                      <ShieldUser className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className={"cursor-pointer"}
                      onClick={() => navigate("/my-orders")}
                    >
                      <List className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={logoutHandler}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-600">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (role === "") navigate("/login");
                  }}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              {role !== "" && (
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-50/95 backdrop-blur-sm w-48 border-slate-200 shadow-xl"
                >
                  {role === "admin" ? (
                    <DropdownMenuItem
                      className={"cursor-pointer"}
                      onClick={() => navigate("/admin")}
                    >
                      <ShieldUser className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className={"cursor-pointer"}
                      onClick={() => navigate("/my-orders")}
                    >
                      <List className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={logoutHandler}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>

            {/* Mobile Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-600">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Sheet */}
            <Sheet className="">
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-white sm:w-[400px]"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Kapda Ghar
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block py-3 px-4 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(searchTerm);
                    setSearchTerm("");
                  }
                }}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
