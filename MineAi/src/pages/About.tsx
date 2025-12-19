import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, BookOpen, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold">
                About MineAI
              </h1>
              <p className="text-xl text-muted-foreground">
                Your trusted AI assistant for navigating India's complex mining regulations
              </p>
            </div>

            <div className="glass-effect rounded-3xl p-8 md:p-12 space-y-6 animate-slide-up">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                MineAI is designed to democratize access to Indian mining law information. We understand that navigating the complex landscape of mining regulations, DGMS standards, environmental compliance, and financial requirements can be overwhelming. Our AI-powered platform makes this knowledge accessible to everyone—from mining professionals and legal consultants to students and researchers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-effect rounded-2xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Accurate & Reliable</h3>
                <p className="text-muted-foreground text-sm">
                  Every response is grounded in official mining acts, rules, DGMS circulars, and environmental regulations. We cite exact sections and provisions to ensure accuracy.
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Comprehensive Coverage</h3>
                <p className="text-muted-foreground text-sm">
                  From the Mines Act 1952 to the latest MMDR amendments, environmental clearances, royalty calculations, and state-specific rules—we cover it all.
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Built for Everyone</h3>
                <p className="text-muted-foreground text-sm">
                  Whether you're a mine manager, compliance officer, legal advisor, or student, MineAI speaks your language and adapts to your level of expertise.
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Instant Insights</h3>
                <p className="text-muted-foreground text-sm">
                  No more hours of document searching. Get precise answers in seconds, with direct links to source materials for deeper study.
                </p>
              </div>
            </div>

            <div className="glass-effect rounded-3xl p-8 md:p-12 space-y-6 animate-slide-up">
              <h2 className="text-2xl font-bold">What We Cover</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Mines Act, 1952 & MMDR Act amendments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Mineral Concession Rules & Auction procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>DGMS safety regulations & circulars</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Environmental clearances & compliance</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Royalty, DMF, NMET calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Mining accounting standards (Ind AS 106)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>State-specific mining policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Labor laws & worker welfare regulations</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
