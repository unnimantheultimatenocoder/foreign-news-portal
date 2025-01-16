import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    // Check for auth error in URL
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error_description');
    if (error) {
      // Handle rate limit error specifically
      if (error.includes('rate_limit')) {
        toast({
          title: "Please Wait",
          description: "For security purposes, please wait a minute before trying again.",
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
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FFE6E6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[20px] shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#E63946]">Welcome Back</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#E63946',
                  brandAccent: '#E63946',
                  defaultButtonBackground: '#E63946',
                  defaultButtonText: '#ffffff',
                  inputBackground: 'white',
                  inputBorder: '#E5E7EB',
                  inputBorderHover: '#E63946',
                  inputBorderFocus: '#E63946',
                },
                borderWidths: {
                  buttonBorderWidth: '0px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '8px',
                  buttonBorderRadius: '8px',
                  inputBorderRadius: '8px',
                },
              }
            },
            style: {
              message: {
                color: '#E63946'
              },
              anchor: {
                color: '#E63946',
                textDecoration: 'none',
              },
              button: {
                height: '45px',
                fontSize: '16px',
                fontWeight: '500',
              },
              input: {
                fontSize: '16px',
                padding: '12px',
              },
              label: {
                color: '#374151',
                fontSize: '16px',
                marginBottom: '6px',
              }
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
          showLinks={true}
          view="sign_in"
          magicLink={false}
        />
      </div>
    </div>
  );
};

export default AuthPage;
