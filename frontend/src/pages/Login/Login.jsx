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
import { Mail, Lock } from "lucide-react";
import { useLoginUserMutation } from "@/features/Api/authApi";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "@/components/ButtonLoader";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, { data, isLoading, error, isError, isSuccess }] =
    useLoginUserMutation();

  const handleLogin = async () => {
    const inputData = { email, password };
    await loginUser(inputData);
  };
  const goToRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Login Successful");
      navigate("/");
    }

    if (isError) toast.error(data?.message || "Login failed");
  }, [isError, isSuccess, data]);
  return (
    <div className="min-h-screen  flex items-start  justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full cursor-pointer"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? <ButtonLoader /> : "Sign In"}
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              className="text-blue-600 hover:underline cursor-pointer font-medium"
              onClick={goToRegister}
            >
              Register
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
