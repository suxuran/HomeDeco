import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  User,
  MessageSquare,
  Star,
  Plus,
  Trash2,
  Edit,
  Heart,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface Order {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface Testimony {
  id: number;
  content: string;
  rating: number;
  is_approved: boolean; 
  created_at: string;
}

interface WishlistItem {
  id: number; 
  product_id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image_url: string;
    category: string;
    description: string;
  };
}

interface DashboardStats {
  orders_count: number;
  testimonies_count: number;
  wishlist_count: number;
}

const UserDashboard = () => {
  const { user } = useAuth(); 
  const { itemCount, addToCart } = useCart();
  const { toast } = useToast();
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [statsData, setStatsData] = useState<DashboardStats>({
    orders_count: 0,
    testimonies_count: 0,
    wishlist_count: 0
  });
  
  // Form States
  const [newTestimony, setNewTestimony] = useState({ content: "", rating: 5 });
  
  // Initialize Profile Form
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
        setProfileForm({
            name: user.name || "",
            email: user.email || "",
            phone: (user as any).phone || "",
            address: (user as any).address || "",
            city: (user as any).city || "",
            state: (user as any).state || "",
            zip: (user as any).zip || "",
        });
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel: Stats, Orders, Testimonies, Wishlist
      const [statsRes, ordersRes, testRes, wishRes] = await Promise.allSettled([
        fetch("/api/user/stats", { headers }),
        fetch("/api/user/orders", { headers }),
        fetch("/api/user/testimonies", { headers }),
        fetch("/api/user/wishlist", { headers })
      ]);

      // 1. Set Stats
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json();
        setStatsData(data);
      }

      // 2. Set Orders
      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const data = await ordersRes.value.json();
        setOrders(data.data || []);
      }

      // 3. Set Testimonies
      if (testRes.status === 'fulfilled' && testRes.value.ok) {
        const data = await testRes.value.json();
        setTestimonies(data.data || []);
      }

      // 4. Set Wishlist
      if (wishRes.status === 'fulfilled' && wishRes.value.ok) {
        const data = await wishRes.value.json();
        setWishlistItems(data.data || []);
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`
            },
            body: JSON.stringify(profileForm)
        });

        const data = await response.json();

        if (response.ok) {
            toast({ title: "Profile updated successfully!" });
            window.location.reload(); 
        } else {
            toast({ 
                title: "Update failed", 
                description: data.message || "Could not update profile.",
                variant: "destructive"
            });
        }
    } catch (error) {
        console.error(error);
        toast({ title: "Network error", variant: "destructive" });
    } finally {
        setIsUpdatingProfile(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const response = await fetch('/api/user/wishlist/toggle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
        // Update stats locally to reflect change immediately
        setStatsData(prev => ({ ...prev, wishlist_count: prev.wishlist_count - 1 }));
        toast({ title: "Removed from wishlist" });
      }
    } catch (error) { console.error(error); }
  };

  const handleMoveToCart = (item: WishlistItem) => {
    addToCart({
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        images: item.product.image_url ? [item.product.image_url] : ["/placeholder.jpg"],
        category: item.product.category,
        description: item.product.description,
        featured: false,
        inStock: true
    });
    toast({ title: "Moved to Cart" });
    handleRemoveFromWishlist(item.product.id);
  };

  const handleSubmitTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/testimonies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify(newTestimony),
      });

      if (response.ok) {
        toast({ title: "Testimony submitted for approval!" });
        setNewTestimony({ content: "", rating: 5 });
        fetchUserData(); // Refresh stats and list
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteTestimony = async (id: number) => {
    try {
      const response = await fetch(`/api/user/testimonies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("auth-token")}` },
      });
      if (response.ok) {
        toast({ title: "Testimony deleted" });
        fetchUserData(); // Refresh stats and list
      }
    } catch (error) { console.error(error); }
  };

  // --- Map Real Stats Data ---
  const stats = [
    {
      title: "Total Orders",
      value: statsData.orders_count, // From API
      icon: <Package className="h-6 w-6 text-primary" />,
    },
    {
      title: "Cart Items",
      value: itemCount, // From React Context (Client Side)
      icon: <ShoppingCart className="h-6 w-6 text-accent" />,
    },
    {
      title: "Testimonies",
      value: statsData.testimonies_count, // From API
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Wishlist",
      value: statsData.wishlist_count, // From API
      icon: <Heart className="h-6 w-6 text-red-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-charcoal">
                      {stat.value}
                    </p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
            <TabsTrigger value="testimonies">My Testimonies</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No orders yet</p>
                    <Button asChild><Link to="/products">Start Shopping</Link></Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                        </div>
                        <p className="text-lg font-semibold">${Number(order.total_price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
                <CardHeader><CardTitle>My Wishlist</CardTitle></CardHeader>
                <CardContent>
                    {wishlistItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Your wishlist is empty.</p>
                            <Button asChild className="mt-4"><Link to="/products">Browse Products</Link></Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4 relative group hover:shadow-lg transition-all">
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-red-500" onClick={() => handleRemoveFromWishlist(item.product.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="flex gap-4 items-center mb-4">
                                        <img src={item.product.image_url || "/placeholder.jpg"} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <h4 className="font-semibold">{item.product.name}</h4>
                                            <p className="text-sm text-muted-foreground">{item.product.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-lg">${item.product.price}</span>
                                        <Button size="sm" onClick={() => handleMoveToCart(item)}>
                                            <ShoppingCart className="h-3 w-3 mr-2" /> Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonies Tab */}
          <TabsContent value="testimonies" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Write a Testimony</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTestimony} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewTestimony((prev) => ({ ...prev, rating: star }))} className={`p-1 ${star <= newTestimony.rating ? "text-accent" : "text-gray-300"}`}>
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Experience</Label>
                    <Textarea id="content" value={newTestimony.content} onChange={(e) => setNewTestimony((prev) => ({ ...prev, content: e.target.value }))} placeholder="Share your experience..." required />
                  </div>
                  <Button type="submit"><Plus className="h-4 w-4 mr-2" /> Submit Testimony</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>My Testimonies</CardTitle></CardHeader>
              <CardContent>
                {testimonies.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No testimonies yet.</p>
                ) : (
                  <div className="space-y-4">
                    {testimonies.map((testimony) => (
                      <div key={testimony.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex">
                            {[...Array(testimony.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 text-accent fill-current" />))}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={testimony.is_approved ? "default" : "secondary"}>{testimony.is_approved ? "Approved" : "Pending"}</Badge>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteTestimony(testimony.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{testimony.content}</p>
                        <p className="text-sm text-muted-foreground">{new Date(testimony.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                value={profileForm.name} 
                                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email" 
                                value={profileForm.email} 
                                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                                id="phone" 
                                value={profileForm.phone} 
                                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input 
                                id="address" 
                                value={profileForm.address} 
                                onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                                placeholder="123 Main St"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input 
                                id="city" 
                                value={profileForm.city} 
                                onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input 
                                    id="state" 
                                    value={profileForm.state} 
                                    onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input 
                                    id="zip" 
                                    value={profileForm.zip} 
                                    onChange={(e) => setProfileForm({...profileForm, zip: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Profile
                        </>
                    )}
                    </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;