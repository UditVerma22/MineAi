import { Header } from "@/components/Header";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background pt-16">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-2xl font-semibold">Page Not Found</p>
          <p className="text-muted-foreground">The page you're looking for doesn't exist on MineAI</p>
          <a href="/" className="inline-block mt-4 px-6 py-3 gradient-primary text-white rounded-full hover:opacity-90 transition-opacity">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
