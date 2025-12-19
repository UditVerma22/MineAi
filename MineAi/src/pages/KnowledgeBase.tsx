import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BookOpen, Scale, Leaf, Calculator, Users, Shield } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    icon: Scale,
    title: "Primary Mining Legislation",
    items: [
      "Mines Act, 1952 (Complete with amendments)",
      "MMDR Act, 1957 (with 2015, 2020, 2021 amendments)",
      "Coal Mines (Special Provisions) Act, 2015",
      "Mines and Minerals Amendment Act, 2023",
    ],
  },
  {
    icon: BookOpen,
    title: "Mineral Concession Rules",
    items: [
      "Mineral Concession Rules, 1960 & 2016",
      "Mineral (Auction) Rules, 2015",
      "Mineral (Evidence of Mineral Contents) Rules, 2015",
      "Mineral Concession Rules for Non-Atomic Minerals, 2016",
    ],
  },
  {
    icon: Shield,
    title: "Safety & DGMS Regulations",
    items: [
      "Mines Rules, 1955 (Complete)",
      "Metalliferous Mines Regulations, 1961",
      "Coal Mines Regulations, 2017",
      "DGMS Circulars (2015-2024)",
      "Mine Closure Rules and Procedures",
    ],
  },
  {
    icon: Leaf,
    title: "Environmental Regulations",
    items: [
      "Environment Protection Act, 1986 (Mining provisions)",
      "Forest Conservation Act, 1980",
      "EIA Notification, 2006 & 2020",
      "Mine Closure Plan Guidelines",
      "Reclamation & Rehabilitation Norms",
    ],
  },
  {
    icon: Calculator,
    title: "Financial & Accounting",
    items: [
      "Royalty rates for all minerals",
      "DMF & NMET contribution rates",
      "Ind AS 106 - Mineral Resources Accounting",
      "Cost Accounting Standards for Mining",
      "GST on mining activities",
    ],
  },
  {
    icon: Users,
    title: "Labor & Welfare",
    items: [
      "Mines Creche Rules, 1966",
      "Mines Vocational Training Rules, 1966",
      "Payment of Wages Act (Mining sector)",
      "Coal Mines Provident Fund Act, 1948",
      "Workmen's Compensation Act provisions",
    ],
  },
];

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl font-bold">
                MineAI Knowledge Base
              </h1>
              <p className="text-muted-foreground">
                Comprehensive coverage of Indian mining laws and regulations
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-4 animate-scale-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search regulations, acts, rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl h-12"
                />
              </div>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="grid gap-6">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, idx) => {
                    const Icon = category.icon;
                    return (
                      <div
                        key={idx}
                        className="glass-effect rounded-2xl p-6 space-y-4 animate-slide-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h2 className="text-xl font-semibold">{category.title}</h2>
                        </div>
                        <ul className="space-y-2 pl-4">
                          {category.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="font-semibold mb-2">Need Specific Information?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI assistant can provide detailed explanations and citations for any mining regulation.
              </p>
              <Button className="gradient-primary text-white hover:opacity-90 rounded-xl">
                Ask MineAI
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBase;
