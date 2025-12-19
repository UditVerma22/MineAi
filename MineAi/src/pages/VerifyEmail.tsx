import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserEmail(session.user.email);

      // If already verified, redirect to chat
      const isVerified = session.user.email_confirmed_at || 
                         session.user.app_metadata?.provider === "google";
      
      if (isVerified) {
        navigate("/chat");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/auth");
          return;
        }

        // Check if user just verified their email
        const isVerified = session.user.email_confirmed_at || 
                           session.user.app_metadata?.provider === "google";
        
        if (isVerified) {
          toast({
            title: "Email verified!",
            description: "Welcome to MineAI.",
          });
          navigate("/chat");
        }
      }
    );

    checkVerification();

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail!,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
        },
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your inbox and spam folder.",
      });
      
      setCooldown(60); // 60 second cooldown
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="glass-effect rounded-3xl p-8 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a verification link to{" "}
                <span className="font-medium text-foreground">{userEmail}</span>.
                Please check your inbox and click the link to verify your account.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={loading || cooldown > 0}
                  variant="outline"
                  className="w-full rounded-xl h-11"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend in {cooldown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend verification email
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full rounded-xl h-11 text-muted-foreground"
                >
                  Sign out and use different email
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try resending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;