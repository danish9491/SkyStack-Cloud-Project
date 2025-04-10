
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardDrive, Lock, Share2, BarChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background relative">
      <div className="text-center max-w-3xl px-4">
        <div className="flex justify-center mb-6">
          <div className="bg-aigility-purple rounded-md p-3">
            <HardDrive className="h-10 w-10 text-white" />
          </div>
        </div>
  
        <h1 className="text-4xl font-bold mb-4">Welcome to SkyStack</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Secure cloud storage for all your files with powerful sharing capabilities
        </p>
  
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Sign In / Sign Up
          </Button>
        </div>
      </div>
  
      {/* 👇 Creator credit at the bottom */}
      <div className="absolute bottom-6 text-center text-muted-foreground text-sm">
        Created by <span className="font-semibold text-primary">Arnab Rai</span> & <span className="font-semibold text-primary">Mohammad Danish Ansari</span>
      </div>
    </div>
  );
  
};

export default Landing;
