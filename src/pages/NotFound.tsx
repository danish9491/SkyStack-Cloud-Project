
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If we're on a route that should exist, try redirecting to home
  useEffect(() => {
    // List of valid route patterns
    const validRoutePatterns = [
      /^\/dashboard/,
      /^\/recent/,
      /^\/starred/,
      /^\/shared/,
      /^\/trash/,
      /^\/profile/,
      /^\/settings/,
      /^\/security/,
      /^\/folder\/[^/]+$/,
    ];

    // Check if the current path matches any valid patterns
    const isValidRoute = validRoutePatterns.some(pattern => 
      pattern.test(location.pathname)
    );

    if (isValidRoute) {
      // If this is potentially a valid route that failed due to a reload
      // Wait a moment and try redirecting to home
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-muted p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-medium mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
          {location.pathname.match(/^\/(dashboard|recent|starred|shared|trash|profile|settings|security|folder)/) && 
            " This might be due to a page refresh. Redirecting you to home page shortly..."}
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
