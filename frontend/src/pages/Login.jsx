import { Link, useNavigate } from "react-router-dom";
import { Video, LogIn } from "lucide-react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

export default function LoginPage() {
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // If you add email/password auth later, handle it here
    console.log("Email login not implemented yet.");
  };

  const handleGoogleLogin = async () => {
    await login(); // Calls Google sign-in from useAuthStore
    navigate("/"); // Redirect after login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Video className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">VideoShare</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/browse">
              <Button variant="ghost">Browse Videos</Button>
            </Link>
            <Link to="/upload">
              <Button>Upload Video</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-grow flex items-center justify-center px-4">
        <Card className="max-w-md w-full shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <LogIn className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Login to Your Account</h2>
              <p className="text-gray-600 text-sm mt-2">
                Welcome back! Please login below.
              </p>
            </div>

            {/* Email/Password form (optional for future) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full bg-white text-gray-700 border hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="h-5 w-5"
              />
              {isLoggingIn ? "Signing in..." : "Continue with Google"}
            </Button>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
