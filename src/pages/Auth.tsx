import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type AuthView = "sign_in" | "sign_up" | "forgotten_password" | "magic_link";

const AuthPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("sign_in"); // Default view is sign_in

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the '#'
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      localStorage.setItem('supabase_token', accessToken);
      navigate('/');
    }

    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    // Check for auth error in URL
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[20px] shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#E63946]">
          Welcome to Edushorts
        </h1>
        <div className="space-y-4">
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
            view={view} // Pass the view state to the Auth component
            magicLink={false}
          />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
          <Button
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: 'https://ekneusrruxypjyhgvivwh.supabase.co/auth/v1/callback',
                },
              });
              if (error) {
                toast({
                  title: "Google Sign-In Error",
                  description: error.message,
                  variant: "destructive",
                });
              }
            }}
            className="flex gap-2 w-full bg-[#E63946] text-white justify-center items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
