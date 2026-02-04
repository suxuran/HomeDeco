import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CartItem, Product, CartContextType } from "@shared/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext"; // <--- 1. Import Auth

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth(); // <--- 2. Get User
  const { toast } = useToast();
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 3. Dynamic Storage Key: "cart-items-1" vs "cart-items-guest"
  const cartKey = user ? `cart-items-${user.id}` : "cart-items-guest";

  // 4. LOAD CART (Runs whenever the user changes)
  useEffect(() => {
    // Prevent saving while we are switching users
    setIsInitialized(false);

    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
        setItems([]);
      }
    } else {
      // Important: If this user has no saved cart, start empty!
      setItems([]); 
    }

    setIsInitialized(true);
  }, [cartKey]); // <--- Re-run this when User ID changes

  // 5. SAVE CART (Only runs if initialized)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(cartKey, JSON.stringify(items));
    }
  }, [items, cartKey, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        toast({
          title: "Cart updated",
          description: `${product.name} quantity updated to ${existingItem.quantity + quantity}`,
        });
        return prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        });
        return [...prevItems, { productId: product.id, product, quantity }];
      }
    });
  };

  // Updated signature to accept number or string to match Laravel IDs
  const removeFromCart = (productId: string | number) => {
    setItems((prevItems) => {
      // Ensure we compare IDs correctly (loose comparison for string/number safety)
      const item = prevItems.find((item) => item.productId == productId);
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.product.name} has been removed from your cart`,
        });
      }
      return prevItems.filter((item) => item.productId != productId);
    });
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId == productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    // We don't need to manually clear localStorage here; 
    // the useEffect[items] will automatically sync the empty array to the specific key.
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};