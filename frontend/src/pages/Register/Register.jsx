import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock } from "lucide-react";
import { useRegisterUserMutation } from "@/features/Api/authApi";
import ButtonLoader from "@/components/ButtonLoader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [registerUser, { data, isLoading, error, isError, isSuccess }] =
    useRegisterUserMutation();

  console.log(data, isLoading, error, isError, isSuccess);
  const handleSignup = async () => {
    const inputData = { name, email, password };
    await registerUser(inputData);
  };
  const goToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Signup Successful");
      navigate("/login");
    }

    if (isError) toast.error(data?.message || "Signup failed");
  }, [isError, isSuccess, data]);
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full cursor-pointer"
              disabled={isLoading}
              onClick={handleSignup}
            >
              {isLoading ? <ButtonLoader /> : "Create Account"}
            </Button>
          </div>

          {/* Sign In Link */}
          <div className="text-center  text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-blue-600 cursor-pointer hover:underline font-medium"
              onClick={goToLogin}
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
