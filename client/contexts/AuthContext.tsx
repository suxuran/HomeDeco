import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<AuthResponse>;
  register: (userData: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. CHECK FOR LOGOUT SIGNAL FROM BACKEND
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "logout") {
      console.log("Logout signal received. Clearing session.");
      localStorage.removeItem("auth-token");
      setUser(null);
      
      // Clean the URL so we don't loop logout logic on refresh
      window.history.replaceState({}, document.title, "/");
      setLoading(false);
      return; 
    }

    // 2. STANDARD TOKEN VALIDATION
    const token = localStorage.getItem("auth-token");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token invalid/expired
        localStorage.removeItem("auth-token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      localStorage.removeItem("auth-token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("auth-token", data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }

      return { success: false, message: data.message || "Login failed." };
    } catch (error) {
      return { success: false, message: "Network error." };
    }
  };

  const register = async (userData: any): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("auth-token", data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }

      return { success: false, message: data.message || "Registration failed." };
    } catch (error) {
      return { success: false, message: "Network error." };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (token) {
        await fetch("/api/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("auth-token");
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        register, 
        logout, 
        loading, 
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};