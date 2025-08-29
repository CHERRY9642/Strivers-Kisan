import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Sprout, 
  TrendingUp, 
  Shield, 
  MessageCircle, 
  MapPin, 
  Settings,
  Users,
  Leaf,
  Sun,
  CloudRain
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-rural-gradient overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-leaf/20 animate-float">
          <Leaf size={80} />
        </div>
        <div className="absolute top-20 right-20 text-sun/30 animate-bounce-gentle">
          <Sun size={60} />
        </div>
        <div className="absolute bottom-20 left-20 text-sky/25 animate-pulse-soft">
          <CloudRain size={70} />
        </div>
        <div className="absolute bottom-10 right-10 text-leaf/15 animate-wiggle">
          <Sprout size={90} />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 animate-fade-in-up">
            <Sprout className="text-primary h-8 w-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Project Kisan
            </span>
          </div>
          <div className="flex space-x-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild variant="outline" className="border-primary/30 hover:border-primary">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-hero font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-text">
            Welcome to Project Kisan
          </h1>
          <p className="text-section-title text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering farmers with cutting-edge technology, real-time insights, and comprehensive tools 
            for modern agriculture. Join thousands of farmers who are revolutionizing their farming practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 shadow-glow transform hover:scale-105 transition-transform">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/30 hover:border-primary transform hover:scale-105 transition-transform">
              <Link to="/login">Login to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <Sprout className="h-8 w-8 text-primary" />,
              title: "Crop Monitoring",
              description: "Real-time monitoring of crop health, growth patterns, and yield predictions using AI technology.",
              delay: "0.4s"
            },
            {
              icon: <Shield className="h-8 w-8 text-accent" />,
              title: "Disease Detection",
              description: "Early detection and prevention of plant diseases with advanced image recognition.",
              delay: "0.5s"
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-primary" />,
              title: "Market Trends",
              description: "Stay updated with latest market prices, trends, and optimal selling strategies.",
              delay: "0.6s"
            },
            {
              icon: <MessageCircle className="h-8 w-8 text-accent" />,
              title: "AI Assistant",
              description: "24/7 agricultural expert guidance powered by artificial intelligence.",
              delay: "0.7s"
            },
            {
              icon: <MapPin className="h-8 w-8 text-primary" />,
              title: "Cold Storage",
              description: "Find and register for nearby cold storage facilities to preserve your harvest.",
              delay: "0.8s"
            },
            {
              icon: <Users className="h-8 w-8 text-accent" />,
              title: "Government Schemes",
              description: "Access and apply for government agricultural schemes and subsidies.",
              delay: "0.9s"
            }
          ].map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow animate-fade-in-up group"
              style={{ animationDelay: feature.delay }}
            >
              <div className="flex items-center mb-4 group-hover:animate-bounce-gentle">
                {feature.icon}
                <h3 className="text-card-title font-semibold ml-3">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-border/50 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <h2 className="text-section-title font-bold text-center mb-8 text-foreground">
            Trusted by Farmers Nationwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-bounce-gentle">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Farmers</div>
            </div>
            <div className="animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-accent mb-2">5M+</div>
              <div className="text-muted-foreground">Acres Monitored</div>
            </div>
            <div className="animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <h2 className="text-section-title font-bold mb-4 text-foreground">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join the agricultural revolution today. Get access to all our premium features 
            and start optimizing your farm operations with cutting-edge technology.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6 shadow-glow transform hover:scale-105 transition-all duration-300">
            <Link to="/signup">Start Your Journey</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 border-t border-border/50 bg-background/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sprout className="text-primary h-6 w-6" />
            <span className="text-lg font-semibold text-foreground">Project Kisan</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Empowering farmers with technology for a sustainable future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;