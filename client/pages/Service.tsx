import { Palette, Home, Ruler, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Service = () => {
  const services = [
    {
      icon: <Palette className="h-12 w-12 text-primary" />,
      title: "Interior Design",
      description:
        "Complete interior design services from concept to completion.",
      features: [
        "Custom design plans",
        "3D visualizations",
        "Material selection",
        "Project management",
      ],
    },
    {
      icon: <Home className="h-12 w-12 text-primary" />,
      title: "Space Planning",
      description: "Optimize your space for functionality and style.",
      features: [
        "Layout optimization",
        "Traffic flow analysis",
        "Furniture placement",
        "Storage solutions",
      ],
    },
    {
      icon: <Ruler className="h-12 w-12 text-primary" />,
      title: "Custom Furniture",
      description: "Bespoke furniture designed specifically for your space.",
      features: [
        "Custom design",
        "Quality craftsmanship",
        "Perfect fit guarantee",
        "Premium materials",
      ],
    },
    {
      icon: <Lightbulb className="h-12 w-12 text-primary" />,
      title: "Lighting Design",
      description:
        "Create the perfect ambiance with professional lighting design.",
      features: [
        "Lighting plans",
        "Fixture selection",
        "Mood lighting",
        "Energy efficiency",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-sage/20 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-6">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From initial consultation to final installation, we provide
            comprehensive interior design services tailored to your unique needs
            and style.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {service.icon}
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Start Your Project?</h2>
          <p className="text-xl opacity-90">
            Let's discuss your vision and create something beautiful together.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Schedule Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Service;
