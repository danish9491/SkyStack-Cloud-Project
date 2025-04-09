
import React from "react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  HardDrive,
  Clock,
  Star,
  Trash2,
  Share2,
  Upload,
  PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const AppSidebar = () => {
  // Mock storage data - would come from Supabase in a real app
  const storageUsed = 2.5; // GB
  const storageTotal = 15; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-aigility-purple rounded-md p-1">
            <HardDrive className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Aigility Vault</h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <div className="px-2 mb-6 flex flex-col gap-2">
          <Button className="w-full justify-start gap-2" onClick={() => {}}>
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {}}>
            <PlusCircle className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Storage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center gap-3">
                    <HardDrive className="h-4 w-4" />
                    <span>My Drive</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/recent" className="flex items-center gap-3">
                    <Clock className="h-4 w-4" />
                    <span>Recent</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/starred" className="flex items-center gap-3">
                    <Star className="h-4 w-4" />
                    <span>Starred</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/shared" className="flex items-center gap-3">
                    <Share2 className="h-4 w-4" />
                    <span>Shared</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/trash" className="flex items-center gap-3">
                    <Trash2 className="h-4 w-4" />
                    <span>Trash</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-medium">{storageUsed} GB of {storageTotal} GB</span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
