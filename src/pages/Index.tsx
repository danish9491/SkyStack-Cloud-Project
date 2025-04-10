
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardDrive } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      <div className="text-center max-w-3xl px-4">
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-md p-3">
            <HardDrive className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to SkyStack Cloud Vault</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Secure cloud storage for all your files with powerful sharing capabilities
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/")}>
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
