import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

interface RequireEmailVerificationProps {
  children: React.ReactNode;
}

export const RequireEmailVerification = ({ children }: RequireEmailVerificationProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      
      // Check if email is verified (email_confirmed_at is set)
      // Google OAuth users are automatically verified
      const isVerified = session.user.email_confirmed_at || 
                         session.user.app_metadata?.provider === "google";
      
      if (!isVerified) {
        navigate("/verify-email");
        return;
      }
      
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
          return;
        }
        
        setUser(session.user);
        
        const isVerified = session.user.email_confirmed_at || 
                           session.user.app_metadata?.provider === "google";
        
        if (!isVerified) {
          navigate("/verify-email");
          return;
        }
        
        setLoading(false);
      }
    );

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};