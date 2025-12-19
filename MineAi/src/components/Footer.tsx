import { Link } from "react-router-dom";
import { Home, MessageSquare, HelpCircle, Mail, FileText, Shield, Leaf, Award } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Chat Assistant", href: "/chat", icon: MessageSquare },
    { name: "FAQs", href: "#", icon: HelpCircle },
    { name: "Contact", href: "#", icon: Mail },
  ];

  const resources = [
    { name: "Mining Regulations", href: "/knowledge-base", icon: FileText },
    { name: "Safety Guidelines", href: "#", icon: Shield },
    { name: "Environmental Compliance", href: "#", icon: Leaf },
    { name: "Licensing Information", href: "#", icon: Award },
  ];

  const legal = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Disclaimer", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ];

  const linkClasses = 
    "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 -mx-1";

  return (
    // <footer 
    //   aria-label="Site footer" 
    //   className="border-t border-border bg-card/50 backdrop-blur-sm"
    // >
      <footer
  aria-label="Site footer"
  className="border-t border-border bg-card/50 backdrop-blur-sm py-6"
>
{/* 
      <div className="container mx-auto px-6 md:px-12 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"> */}
        <div className="container mx-auto px-2 md:px-6 py-0">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">

          {/* Quick Links */}
          <nav aria-label="Quick links" className="text-center">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center justify-center gap-2">
              <Home className="w-4 h-4" aria-hidden="true" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("/") ? (
                    <Link to={link.href} className={linkClasses}>
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className={linkClasses}>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources" className="text-center">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" aria-hidden="true" />
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("/") ? (
                    <Link to={link.href} className={linkClasses}>
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className={linkClasses}>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal" className="text-center">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Legal
            </h3>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={linkClasses}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-border flex justify-center items-center">
          <p className="text-xs text-muted-foreground">
            © 2025 MineAi. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
