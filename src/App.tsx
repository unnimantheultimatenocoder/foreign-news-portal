import { useEffect } from "react";
import Routes from "./Routes";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as CapacitorApp } from "@capacitor/app";
import { Network } from "@capacitor/network";
import { useToast } from "@/hooks/use-toast";
import { mobileService } from "@/services/mobile";

// Configure React Query with mobile-optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      gcTime: 1000 * 60 * 60, // 1 hour
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  }
});

function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Handle network status changes
    Network.addListener("networkStatusChange", (status) => {
      if (!status.connected) {
        toast({
          title: "You're offline",
          description: "Some features may be limited",
          variant: "warning",
          duration: 3000
        });
      } else {
        toast({
          title: "Back online",
          description: "All features are now available",
          variant: "success",
          duration: 3000
        });
        // Revalidate cached data
        queryClient.refetchQueries();
      }
    });

    // Handle app state changes
    CapacitorApp.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        // App came to foreground
        queryClient.refetchQueries();
      }
    });

    // Handle deep links
    CapacitorApp.addListener("appUrlOpen", (data) => {
      // Handle the deep link URL
      const slug = data.url.split("app://").pop();
      if (slug) {
        window.location.href = `/${slug}`;
      }
    });

    // Register service worker for offline support
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("SW registered:", registration);
          })
          .catch((error) => {
            console.log("SW registration failed:", error);
          });
      });
    }

    // Set viewport meta for mobile
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    return () => {
      // Cleanup listeners
      Network.removeAllListeners();
      CapacitorApp.removeAllListeners();
    };
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <main className="min-h-screen bg-background">
          <Routes />
        </main>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;