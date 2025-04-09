
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { HardDrive, Lock, Share2, BarChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if already authenticated
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-aigility-purple rounded-md p-1">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Aigility Cloud Vault</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Secure Cloud Storage for All Your Files
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Store, share, and access your files securely from anywhere. Your data, your control.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-md h-fit">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Secure Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    End-to-end encryption for your sensitive files
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-md h-fit">
                  <Share2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Easy Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Share with anyone, control access rights
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-md h-fit">
                  <HardDrive className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Ample Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    15GB free storage with affordable upgrades
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-md h-fit">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Usage Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Track storage and optimize your space
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 bg-muted/50 lg:p-16">
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default Auth;
