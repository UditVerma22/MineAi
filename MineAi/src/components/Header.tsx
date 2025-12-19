import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";



export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
  <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
</div>


          
          <span className="text-2xl font-bold whitespace-nowrap">MineAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/chat" className="text-sm font-medium hover:text-primary transition-colors">
            Chat
          </Link>
          <Link to="/knowledge-base" className="text-sm font-medium hover:text-primary transition-colors">
            Knowledge Base
          </Link>
          <Link to="/documents" className="text-sm font-medium hover:text-primary transition-colors">
            Documents
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
