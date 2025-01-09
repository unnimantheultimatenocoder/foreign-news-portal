import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
      if (error) {
        console.error("Session check error:", error);
        toast({
          title: "Session Error",
          description: "There was an error checking your session. Please try logging in again.",
          variant: "destructive",
        });
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        // Clear any stored session data
        localStorage.removeItem('supabase.auth.token');
      }
    });

    // Check for auth error in URL
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error_description');
    if (error) {
      if (error.includes('refresh_token_not_found')) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication Error",
          description: error,
          variant: "destructive",
        });
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">Welcome to News App</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'var(--primary)',
                  brandAccent: 'var(--primary)',
                  defaultButtonBackground: 'var(--primary)',
                  defaultButtonBackgroundHover: 'var(--primary-foreground)',
                  inputBackground: 'var(--background)',
                  inputText: 'var(--foreground)',
                  inputBorder: 'var(--border)',
                }
              }
            },
            style: {
              button: {
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
              input: {
                borderRadius: '0.5rem',
              },
              message: {
                color: 'rgb(239 68 68)',
                padding: '0.5rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
              }
            }
          }}
          theme="default"
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
};

export default AuthPage;