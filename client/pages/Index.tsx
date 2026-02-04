import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Award,
  Users,
  ShoppingBag,
  Palette,
  Home,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define shape of API data
interface Testimony {
  id: number;
  content: string;
  rating: number;
  user: {
    name: string;
  };
}

const Index = () => {
  const [testimonials, setTestimonials] = useState<Testimony[]>([]);

  // Fetch real testimonies on load
  useEffect(() => {
    fetch("/api/testimonies")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.data || []);
      })
      .catch((err) => console.error("Failed to load reviews", err));
  }, []);

  const features = [
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "Custom Design",
      description:
        "Personalized interior design solutions tailored to your unique style and needs.",
    },
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: "Complete Solutions",
      description:
        "From concept to completion, we handle every aspect of your home transformation.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Premium Quality",
      description:
        "Only the finest materials and craftsmanship in every project we undertake.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Expert Team",
      description:
        "Professional designers and craftspeople with years of experience.",
    },
  ];

  const stats = [
    { number: "1000+", label: "Happy Clients" },
    { number: "50+", label: "Design Awards" },
    { number: "15+", label: "Years Experience" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  // Helper to generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="space-y-4">
                <Badge className="inline-flex items-center gap-2 px-4 py-2">
                  <Sparkles className="h-4 w-4" />
                  Transform Your Space
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
                  Create Your
                  <span className="text-primary block">Dream Home</span>
                  Today
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Discover exceptional interior design solutions that blend
                  functionality with stunning aesthetics. From modern minimalism
                  to classic elegance, we bring your vision to life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group" asChild>
                  <Link to="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-charcoal">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-in">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8">
                <div className="w-full h-full bg-sage/30 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Home className="h-24 w-24 text-primary mx-auto" />
                    <p className="text-lg font-medium text-charcoal">
                      Beautiful Spaces Await
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-sage/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
              Why Choose Home-Deco?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We combine creativity, expertise, and attention to detail to
              deliver exceptional interior design solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="space-y-4 p-0">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-charcoal">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it
            </p>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-lg">
                <p className="text-muted-foreground">No approved reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                    <CardContent className="space-y-4 p-0">
                    <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                            key={i}
                            className="h-5 w-5 text-accent fill-current"
                        />
                        ))}
                    </div>
                    <p className="text-muted-foreground italic">
                        "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                            {getInitials(testimonial.user.name)}
                        </span>
                        </div>
                        <div>
                        <div className="font-semibold text-charcoal">
                            {testimonial.user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Verified Customer
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of satisfied customers who have created their dream
            homes with Home-Deco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Get Free Consultation
                <CheckCircle className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;