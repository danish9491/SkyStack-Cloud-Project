
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import BreadcrumbNav from "@/components/files/BreadcrumbNav";
import FileGrid, { FileItem } from "@/components/files/FileGrid";
import FileActions from "@/components/files/FileActions";
import StorageStats from "@/components/files/StorageStats";
import ShareModal from "@/components/files/ShareModal";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  fetchAllItems,
  createFolder,
  starItem,
  trashItem,
  restoreItem,
  deleteItemPermanently,
  shareFile,
  uploadFile,
  downloadFile,
  getBreadcrumbPath,
  getStorageStats
} from "@/services/fileService";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Dashboard: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [searchResults, setSearchResults] = useState<FileItem[] | null>(null);
  
  // Determine current view based on route
  const currentView = (): 'all' | 'starred' | 'shared' | 'trash' | 'recent' => {
    const path = location.pathname;
    if (path.includes('/starred')) return 'starred';
    if (path.includes('/shared')) return 'shared';
    if (path.includes('/trash')) return 'trash';
    if (path.includes('/recent')) return 'recent';
    return 'all';
  };
  
  const view = currentView();
  
  // Fetch items (files and folders)
  const { 
    data: items = [],
    isLoading: itemsLoading,
    isError: itemsError, 
    refetch: refetchItems
  } = useQuery({
    queryKey: ['items', folderId, view],
    queryFn: () => fetchAllItems(folderId || null, view),
    enabled: !!user
  });
  
  // Fetch breadcrumbs
  const { 
    data: breadcrumbs = [],
    isLoading: breadcrumbsLoading
  } = useQuery({
    queryKey: ['breadcrumbs', folderId],
    queryFn: () => getBreadcrumbPath(folderId || null),
    enabled: !!folderId && !!user
  });
  
  // Fetch storage stats
  const { 
    data: storageData,
    isLoading: storageLoading 
  } = useQuery({
    queryKey: ['storage-stats'],
    queryFn: getStorageStats,
    enabled: !!user
  });
  
  // Handle file upload
  const handleUploadClick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    try {
      const uploadPromises = Array.from(files).map(file => uploadFile(file, folderId || null));
      await Promise.all(uploadPromises);
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully.`,
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
      });
    }
  };
  
  // Handle folder creation
  const handleCreateFolder = async (name: string) => {
    try {
      await createFolder(name, folderId || null);
      
      toast({
        title: "Folder created",
        description: `"${name}" folder has been created.`,
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (error) {
      console.error("Create folder error:", error);
      toast({
        variant: "destructive",
        title: "Failed to create folder",
        description: "An error occurred while creating the folder.",
      });
    }
  };
  
  // Handle item click (navigate into folders)
  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      // Reset search results when navigating
      setSearchResults(null);
    }
  };
  
  // Handle breadcrumb navigation
  const handleBreadcrumbNavigate = (item: { id: string; name: string } | null) => {
    // Reset search results when navigating
    setSearchResults(null);
  };
  
  // Handle star/unstar
  const handleStarClick = async (file: FileItem, starred: boolean) => {
    try {
      await starItem(file, starred);
      
      toast({
        title: starred ? "Added to starred" : "Removed from starred",
        description: `"${file.name}" has been ${starred ? "added to" : "removed from"} starred items.`,
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (error) {
      console.error("Star error:", error);
      toast({
        variant: "destructive",
        title: "Action failed",
        description: `Failed to ${starred ? "star" : "unstar"} the item.`,
      });
    }
  };
  
  // Handle share
  const handleShareClick = (file: FileItem) => {
    setShareFile(file);
  };
  
  // Handle download
  const handleDownloadClick = async (file: FileItem) => {
    try {
      toast({
        title: "Download started",
        description: `Downloading "${file.name}"...`,
      });
      
      const { url, fileName } = await downloadFile(file.id);
      
      // Create a temporary anchor element and simulate click
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download complete",
        description: `"${file.name}" has been downloaded.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download the file. Please try again.",
      });
    }
  };
  
  // Handle delete/trash
  const handleDeleteClick = async (file: FileItem) => {
    try {
      if (view === 'trash') {
        // Permanent delete from trash
        await deleteItemPermanently(file);
        toast({
          title: "Deleted permanently",
          description: `"${file.name}" has been permanently deleted.`,
        });
      } else {
        // Move to trash
        await trashItem(file);
        toast({
          title: "Moved to trash",
          description: `"${file.name}" has been moved to trash.`,
        });
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete the item. Please try again.",
      });
    }
  };
  
  // Handle restore from trash
  const handleRestoreClick = async (file: FileItem) => {
    try {
      await restoreItem(file);
      
      toast({
        title: "Item restored",
        description: `"${file.name}" has been restored.`,
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (error) {
      console.error("Restore error:", error);
      toast({
        variant: "destructive",
        title: "Restore failed",
        description: "Failed to restore the item. Please try again.",
      });
    }
  };
  
  // Handle search results
  const handleSearch = (results: { files: FileItem[], folders: FileItem[] }) => {
    setSearchResults([...results.folders, ...results.files]);
  };
  
  // Display items - either search results or regular items
  const displayItems = searchResults || items;
  
  return (
    <AppLayout onSearch={handleSearch}>
      <div className="space-y-4">
        {!searchResults && (
          <BreadcrumbNav 
            items={breadcrumbs} 
            onNavigate={handleBreadcrumbNavigate}
            isLoading={breadcrumbsLoading} 
          />
        )}
        
        {searchResults && (
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Search Results ({searchResults.length})</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSearchResults(null)}
            >
              Clear Search
            </Button>
          </div>
        )}
        
        <FileActions
          onUploadClick={handleUploadClick}
          onCreateFolder={handleCreateFolder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showRestoreAll={view === 'trash' && displayItems.length > 0}
          onRestoreAll={async () => {
            try {
              await Promise.all(displayItems.map(item => restoreItem(item)));
              toast({
                title: "Items restored",
                description: "All items have been restored from trash.",
              });
              refetchItems();
            } catch (error) {
              console.error("Restore all error:", error);
              toast({
                variant: "destructive",
                title: "Restore failed",
                description: "Failed to restore items. Please try again.",
              });
            }
          }}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {itemsError ? (
              <div className="bg-muted/30 border border-dashed rounded-lg p-12 flex flex-col items-center justify-center">
                <h3 className="text-xl font-medium mb-2">Error loading files</h3>
                <p className="text-muted-foreground text-center mb-4">
                  There was a problem loading your files. Please try again.
                </p>
                <Button onClick={() => refetchItems()}>Retry</Button>
              </div>
            ) : itemsLoading ? (
              <div className="bg-muted/30 border border-dashed rounded-lg p-12 flex flex-col items-center justify-center">
                <h3 className="text-xl font-medium mb-2">Loading files...</h3>
              </div>
            ) : displayItems.length > 0 ? (
              <FileGrid
                files={displayItems}
                onItemClick={handleItemClick}
                onShareClick={handleShareClick}
                onDeleteClick={handleDeleteClick}
                onStarClick={handleStarClick}
                onDownloadClick={handleDownloadClick}
                onRestoreClick={handleRestoreClick}
                viewMode={viewMode}
                isTrashView={view === 'trash'}
              />
            ) : (
              <div className="bg-muted/30 border border-dashed rounded-lg p-12 flex flex-col items-center justify-center">
                <h3 className="text-xl font-medium mb-2">
                  {searchResults
                    ? "No search results found"
                    : view === 'trash'
                    ? "Trash is empty"
                    : view === 'starred'
                    ? "No starred items"
                    : view === 'shared'
                    ? "No shared items"
                    : view === 'recent'
                    ? "No recent items"
                    : "This folder is empty"}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchResults
                    ? "Try a different search term"
                    : view === 'trash' || view === 'starred' || view === 'shared' || view === 'recent'
                    ? ""
                    : "Upload files or create folders to start organizing your content"}
                </p>
                {!searchResults && view === 'all' && (
                  <div className="flex gap-3">
                    <Button onClick={() => document.getElementById('file-upload')?.click()}>Upload Files</Button>
                    <Button variant="outline" onClick={() => handleCreateFolder("New Folder")}>
                      Create Folder
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <StorageStats
              usedStorage={storageData?.usedStorage || 0}
              totalStorage={storageData?.totalStorage || 15 * 1024 * 1024 * 1024}
              breakdown={storageData?.breakdown || []}
              isLoading={storageLoading}
              className="sticky top-6"
            />
          </div>
        </div>
      </div>
      
      {shareFile && (
        <ShareModal 
          file={shareFile} 
          onClose={() => setShareFile(null)}
          onShare={async (email, accessLevel, expiresIn) => {
            try {
              const expiryDate = expiresIn === 'never' 
                ? null 
                : new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000);
                
              await shareFile(shareFile.id, email, accessLevel as 'view' | 'edit', expiryDate);
              
              toast({
                title: "File shared",
                description: `"${shareFile.name}" has been shared with ${email}.`,
              });
              
              setShareFile(null);
              queryClient.invalidateQueries({ queryKey: ['items'] });
            } catch (error) {
              console.error("Share error:", error);
              toast({
                variant: "destructive",
                title: "Share failed",
                description: "Failed to share the file. Please try again.",
              });
            }
          }}
        />
      )}
      
      {/* Hidden file input for uploads */}
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={(e) => handleUploadClick(e.target.files)}
        className="hidden"
      />
    </AppLayout>
  );
};

export default Dashboard;
