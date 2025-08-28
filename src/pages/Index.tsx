import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { useVisitorTracking } from "@/hooks/useAPI";

const Index = () => {
  const { trackVisitor } = useVisitorTracking();

  useEffect(() => {

    trackVisitor();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
