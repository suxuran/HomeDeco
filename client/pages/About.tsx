import { useState, useEffect } from "react";
import { Award, Users, Target, Heart, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Icon mapping to convert DB strings to Components
const ICON_MAP: Record<string, any> = {
  Award: <Award className="h-8 w-8 text-primary" />,
  Users: <Users className="h-8 w-8 text-primary" />,
  Target: <Target className="h-8 w-8 text-primary" />,
  Heart: <Heart className="h-8 w-8 text-primary" />,
};

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface ContentBlock {
  title: string;
  subtitle: string;
  section_title: string;
  body: string;
  image_url: string | null;
  meta: {
    values: ValueItem[];
  };
}

const About = () => {
  const [content, setContent] = useState<ContentBlock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content/about_page");
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (error) {
        console.error("Failed to load content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback if DB is empty
  if (!content) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-sage/20 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-charcoal">{content.section_title}</h2>
              
              {/* Split body by newlines to render paragraphs correctly */}
              {content.body ? (
                content.body.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="text-lg text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))
              ) : null}
            </div>
            
            {/* Image Container - Maintains Aspect Ratio even if no image */}
            <div className="aspect-square bg-sage/20 rounded-2xl overflow-hidden shadow-sm relative">
                {content.image_url ? (
                    <img 
                        src={content.image_url} 
                        alt="Our Story" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    // Optional: Placeholder content if no image is uploaded yet
                     <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                        Image Placeholder
                     </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-sage/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.meta?.values?.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="space-y-4 p-0">
                  <div className="flex justify-center">
                    {/* Render Icon from Map, Fallback to Award if missing */}
                    {ICON_MAP[value.icon] || <Award className="h-8 w-8 text-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;