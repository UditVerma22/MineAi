import heroBg from "@/assets/hero-bg.jpg";
import { MessageSquare, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    // <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    
    <section 
  className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
  style={{
    backgroundImage: `url(${heroBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    
  }}
>
    {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/60" />


      {/* Decorative background shapes - positioned behind content */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 hidden md:block" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 hidden md:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-sm font-medium">
              <Zap className="w-4 h-4 text-primary" />
              Powered by Advanced AI
            </span>
          </div>
          
          <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight px-3 text-center">
            MineAI: Your Intelligent Guide to{" "}
            {/* <span className="text-gradient">Indian Mining Laws</span> */}
            <span className="text-primary">Indian Mining Laws</span>

          </h1>


          <p className="relative z-10 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Instant, accurate answers on mining regulations, DGMS standards, environmental compliance, and financial requirements — all backed by official legal sources.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/chat">
              <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-opacity rounded-full px-8 h-12 text-base shadow-lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto px-4">
            <div className="glass-effect rounded-2xl p-6 space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Legally Accurate</h3>
              <p className="text-sm text-muted-foreground">
                Answers cited from official acts, rules, and regulations
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Conversational AI</h3>
              <p className="text-sm text-muted-foreground">
                Natural language interface for complex regulatory queries
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Instant Responses</h3>
              <p className="text-sm text-muted-foreground">
                Get immediate answers with relevant source citations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};
