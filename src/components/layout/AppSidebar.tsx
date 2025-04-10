
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStorageStats } from "@/services/fileService";

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: storageData } = useQuery({
    queryKey: ['storage-stats'],
    queryFn: getStorageStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Calculate storage usage
  const storageUsed = storageData?.usedStorage || 0;
  const storageTotal = storageData?.totalStorage || 15 * 1024 * 1024 * 1024; // 15 GB
  const storagePercentage = (storageUsed / storageTotal) * 100;
  
  // Format storage size
  const formatStorage = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };
  
  const handleUploadClick = () => {
    document.getElementById('file-upload')?.click();
    navigate("/dashboard");
  };
  
  const handleNewFolderClick = () => {
    // Navigate to dashboard and open the new folder modal from there
    navigate("/dashboard");
    // Wait for the navigation to complete
    setTimeout(() => {
      // Find the New button and trigger a click
      const newButton = document.querySelector('button:has(.lucide-plus-circle)');
      if (newButton) {
        (newButton as HTMLButtonElement).click();
        // Find the New Folder option and click it
        setTimeout(() => {
          const newFolderOption = document.querySelector('[role="menuitem"]:has(.lucide-folder-plus)');
          if (newFolderOption) {
            (newFolderOption as HTMLElement).click();
          }
        }, 100);
      }
    }, 100);
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-aigility-purple rounded-md p-1">
            <HardDrive className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">SkyStack Vault</h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <div className="px-2 mb-6 flex flex-col gap-2">
          <Button className="w-full justify-start gap-2" onClick={handleUploadClick}>
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleNewFolderClick}>
            <PlusCircle className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Storage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === '/dashboard' || location.pathname.includes('/folder/')}
                >
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <HardDrive className="h-4 w-4" />
                    <span>My Drive</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === '/recent'}
                >
                  <Link to="/recent" className="flex items-center gap-3">
                    <Clock className="h-4 w-4" />
                    <span>Recent</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === '/starred'}
                >
                  <Link to="/starred" className="flex items-center gap-3">
                    <Star className="h-4 w-4" />
                    <span>Starred</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === '/shared'}
                >
                  <Link to="/shared" className="flex items-center gap-3">
                    <Share2 className="h-4 w-4" />
                    <span>Shared</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === '/trash'}
                >
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
            <span className="font-medium">{formatStorage(storageUsed)} of {formatStorage(storageTotal)}</span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
