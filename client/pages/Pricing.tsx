import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Define the shape of the data coming from Laravel
interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[]; // Laravel sends this as an array of strings
  is_popular: boolean;
}

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/pricing-plans");
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        }
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-sage/20 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-6">
            Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect package for your project. All packages include
            our commitment to quality and personalized service.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                <Card
                    key={plan.id}
                    className={`relative flex flex-col ${plan.is_popular ? "ring-2 ring-primary shadow-lg scale-105 z-10" : ""}`}
                >
                    {plan.is_popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        Most Popular
                    </Badge>
                    )}
                    <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="space-y-2">
                        <div className="text-4xl font-bold text-primary">
                        {plan.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                        {plan.period}
                        </div>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                        {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                        </li>
                        ))}
                    </ul>
                    <Button
                        className="w-full mt-auto"
                        variant={plan.is_popular ? "default" : "outline"}
                        asChild
                    >
                        <Link to="/contact">Get Started</Link>
                    </Button>
                    </CardContent>
                </Card>
                ))}
            </div>
          )}
          
          {/* Fallback if no plans found */}
          {!loading && plans.length === 0 && (
             <p className="text-center text-gray-500">No pricing plans available at the moment.</p>
          )}

        </div>
      </section>

      {/* FAQ Section (Static content remains) */}
      <section className="py-20 bg-sage/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-charcoal mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                What's included in the consultation?
              </h3>
              <p className="text-muted-foreground">
                Our consultation includes a thorough assessment of your space,
                discussion of your style preferences, and actionable design
                recommendations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                How long does a typical project take?
              </h3>
              <p className="text-muted-foreground">
                Project timelines vary depending on scope. A single room
                typically takes 4-8 weeks, while whole home projects can take
                3-6 months.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Do you work within specific budgets?
              </h3>
              <p className="text-muted-foreground">
                Absolutely! We work with various budgets and will help you
                prioritize elements to achieve the best results within your
                range.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;