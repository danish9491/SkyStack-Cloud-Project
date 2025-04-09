
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Settings as SettingsIcon, Bell, Moon, Monitor, AlertTriangle } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    loginAlerts: true,
    storageAlerts: true,
    autoSync: true,
  });

  const handleToggleSetting = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleSaveSettings = () => {
    setLoading(true);
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully."
      });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="container max-w-3xl py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>Configure your application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode" className="text-base">Appearance</Label>
                <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">System</span>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggleSetting('darkMode')}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSync" className="text-base">Auto-sync files</Label>
                <p className="text-sm text-muted-foreground">Automatically sync your files across devices</p>
              </div>
              <Switch
                id="autoSync"
                checked={settings.autoSync}
                onCheckedChange={() => handleToggleSetting('autoSync')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-base">Email notifications</Label>
                <p className="text-sm text-muted-foreground">Receive emails about account activity</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggleSetting('emailNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="storageAlerts" className="text-base">Storage alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when you're running low on storage</p>
              </div>
              <Switch
                id="storageAlerts"
                checked={settings.storageAlerts}
                onCheckedChange={() => handleToggleSetting('storageAlerts')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Security Alerts</span>
            </CardTitle>
            <CardDescription>Control your security notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="loginAlerts" className="text-base">Login alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified of new logins to your account</p>
              </div>
              <Switch
                id="loginAlerts"
                checked={settings.loginAlerts}
                onCheckedChange={() => handleToggleSetting('loginAlerts')}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
