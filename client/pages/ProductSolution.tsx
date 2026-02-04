import { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, Star, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Interface matching your DB response
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image_url: string; // Mapped from Laravel
  description: string;
  stock: number;
}

const ProductSolution = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // New State for API Data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // UPDATED: Categories must match exactly what is in your Database/Seeder
  const categories = ["All", "Furniture", "Lighting", "Decor", "Storage"];

  // FETCH DATA FROM API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        
        // Only append category if it's not "All"
        if (selectedCategory && selectedCategory !== "All") {
            params.append("category", selectedCategory);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
            const data = await response.json();
            // Laravel pagination puts the array inside .data
            setProducts(data.data || []); 
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to prevent too many API calls while typing
    const timer = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      images: [product.image_url || "/placeholder.jpg"],
      category: product.category,
      description: product.description,
      featured: false,
      inStock: product.stock > 0,
    });
  };

  // Helper to determine stock status
  const isInStock = (product: Product) => product.stock > 0;

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image_url || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 5 && product.stock > 0 && (
          <Badge className="absolute top-3 left-3 bg-orange-500">Low Stock</Badge>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedProduct(product)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-accent fill-current" />
              ))}
            </div>
          </div>
          <h3 className="font-semibold text-lg leading-tight">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <Badge variant={isInStock(product) ? "default" : "secondary"}>
              {isInStock(product) ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => handleAddToCart(product)}
          disabled={!isInStock(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-sage/20 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-charcoal">
              Product Solutions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our curated collection of home decor products designed to
              transform any space into something extraordinary.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-charcoal">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <p className="text-muted-foreground">
              {products.length} products found
            </p>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={selectedProduct.image_url || "/placeholder.jpg"}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-accent fill-current"
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      (4.8)
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ${parseFloat(selectedProduct.price).toFixed(2)}
                  </div>
                  <Badge
                    variant={isInStock(selectedProduct) ? "default" : "secondary"}
                  >
                    {isInStock(selectedProduct) ? "In Stock" : "Out of Stock"}
                  </Badge>
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={!isInStock(selectedProduct)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductSolution;