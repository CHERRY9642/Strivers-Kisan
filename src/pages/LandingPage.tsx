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
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-primary/20 animate-float">
          <Leaf size={80} className="animate-spin-slow" />
        </div>
        <div className="absolute top-20 right-20 text-accent/30 animate-bounce-gentle">
          <Sun size={60} className="animate-pulse-soft" />
        </div>
        <div className="absolute bottom-20 left-20 text-primary/25 animate-pulse-soft">
          <CloudRain size={70} className="animate-wiggle" />
        </div>
        <div className="absolute bottom-10 right-10 text-accent/15 animate-wiggle">
          <Sprout size={90} className="animate-float" />
        </div>
        
        {/* Animated Farm Images */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <img src="/src/assets/farm-background.jpg" alt="" className="w-32 h-32 object-cover rounded-full animate-spin-slow" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-15 animate-bounce-gentle" style={{ animationDelay: '3s' }}>
          <img src="/src/assets/farmer-avatar.png" alt="" className="w-24 h-24 object-cover rounded-full animate-pulse-soft" />
        </div>
        
        {/* Additional floating elements for more dynamic feel */}
        <div className="absolute top-1/3 left-1/4 text-primary/10 animate-float" style={{ animationDelay: '1s' }}>
          <Leaf size={50} className="animate-spin-slow" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-accent/20 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
          <Sun size={40} />
        </div>
        <div className="absolute top-1/2 right-1/3 text-primary/15 animate-pulse-soft" style={{ animationDelay: '0.5s' }}>
          <Sprout size={60} className="animate-wiggle" />
        </div>
        <div className="absolute bottom-1/2 left-1/3 text-accent/10 animate-wiggle" style={{ animationDelay: '1.5s' }}>
          <CloudRain size={45} className="animate-float" />
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
          <h1 className="text-hero font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-text transform hover:scale-105 transition-transform duration-300">
            Welcome to Project Kisan
          </h1>
          <p className="text-section-title text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering farmers with cutting-edge technology, real-time insights, and comprehensive tools 
            for modern agriculture. Join thousands of farmers who are revolutionizing their farming practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 shadow-glow transform hover:scale-105 transition-all duration-700 animate-bounce-gentle">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/30 hover:border-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-700">
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
              className="p-6 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-110 hover:shadow-glow hover:bg-primary/5 animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: feature.delay }}
            >
              <div className="flex items-center mb-4 group-hover:animate-bounce-gentle">
                <div className="transform group-hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-card-title font-semibold ml-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
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
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6 shadow-glow transform hover:scale-105 transition-all duration-700 animate-pulse-soft">
            <Link to="/signup">Start Your Journey</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-12 border-t border-border/50 bg-background/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <Sprout className="text-primary h-6 w-6 animate-wiggle" />
                <span className="text-lg font-semibold text-foreground">Project Kisan</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering farmers with technology for a sustainable future.
              </p>
            </div>

            {/* Links Section */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">About</Link>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Use</Link>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm mb-2">Follow us:</p>
              <div className="flex justify-center md:justify-end gap-4 mb-4">
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm transform hover:scale-110">LinkedIn</Link>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm transform hover:scale-110">Facebook</Link>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm transform hover:scale-110">Instagram</Link>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm transform hover:scale-110">Discord</Link>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center pt-8 border-t border-border/30">
            <p className="text-muted-foreground text-xs mb-2">
              © 2025 Project Kisan. All Rights Reserved.
            </p>
            <p className="text-muted-foreground text-xs">
              Powered by React, Tailwind CSS, and Modern Web Technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;