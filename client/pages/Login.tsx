import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });

        // LOGIC UPDATE: Handle Admin vs User Redirection
        // Check if the user is the Admin (via role from DB or specific email)
        if (
          result.user?.role === "admin" ||
          email === "admin@homedeco.test" || 
          result.user?.email === "admin@homedeco.test"
        ) {
          // IMPORTANT: Admin Panel is outside React. 
          // We must use window.location.href to force a full browser reload
          // so Laravel serves the Blade/Filament files.
          window.location.href = "/admin"; 
          return;
        } 
        
        // 2. Regular User Redirection (Stay inside React)
        // If we came from a specific protected page, go back there.
        // Otherwise, go to the User Dashboard.
        if (from !== "/") {
            navigate(from, { replace: true });
        } else {
            navigate("/user/dashboard");
        }

      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@homedeco.test");
      setPassword("password");
    } else {
      setEmail("user@homedeco.test");
      setPassword("password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage/20 to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center">
            <Home className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-2xl text-charcoal">Home-Deco</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-charcoal">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Quick Login Buttons for Demo */}
        <div className="bg-accent/10 p-4 rounded-lg space-y-3">
          <p className="text-sm font-medium text-charcoal text-center">
            Quick Demo Login:
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickLogin("admin")}
              className="flex-1"
            >
              Admin Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickLogin("user")}
              className="flex-1"
            >
              User Demo
            </Button>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;