import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import BreadcrumbNav from "@/components/files/BreadcrumbNav";
import FileGrid, { FileItem } from "@/components/files/FileGrid";
import FileActions from "@/components/files/FileActions";
import StorageStats from "@/components/files/StorageStats";
import ShareModal from "@/components/files/ShareModal";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Mock data for the demo
const generateMockFiles = (): FileItem[] => {
  return [
    {
      id: "folder-1",
      name: "Work Documents",
      type: "folder",
      createdAt: "2025-03-15T10:30:00Z",
      updatedAt: "2025-04-01T14:22:00Z",
    },
    {
      id: "folder-2",
      name: "Personal",
      type: "folder",
      createdAt: "2025-02-10T09:15:00Z",
      updatedAt: "2025-03-28T16:45:00Z",
    },
    {
      id: "file-1",
      name: "Project Proposal.pdf",
      type: "file",
      fileType: "application/pdf",
      size: 2.5 * 1024 * 1024, // 2.5 MB
      createdAt: "2025-04-02T11:20:00Z",
      updatedAt: "2025-04-02T11:20:00Z",
      starred: true,
    },
    {
      id: "file-2",
      name: "Team Photo.jpg",
      type: "file",
      fileType: "image/jpeg",
      size: 4.2 * 1024 * 1024, // 4.2 MB
      createdAt: "2025-03-20T15:10:00Z",
      updatedAt: "2025-03-20T15:10:00Z",
    },
    {
      id: "file-3",
      name: "Quarterly Report.docx",
      type: "file",
      fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 1.8 * 1024 * 1024, // 1.8 MB
      createdAt: "2025-04-05T09:45:00Z",
      updatedAt: "2025-04-07T10:30:00Z",
    },
    {
      id: "file-4",
      name: "Presentation.pptx",
      type: "file",
      fileType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      size: 6.7 * 1024 * 1024, // 6.7 MB
      createdAt: "2025-04-01T13:25:00Z",
      updatedAt: "2025-04-03T16:15:00Z",
      shared: true,
    },
    {
      id: "file-5",
      name: "Budget.xlsx",
      type: "file",
      fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 1.2 * 1024 * 1024, // 1.2 MB
      createdAt: "2025-03-25T10:10:00Z",
      updatedAt: "2025-04-04T11:50:00Z",
    },
    {
      id: "file-6",
      name: "Project Demo.mp4",
      type: "file",
      fileType: "video/mp4",
      size: 28.5 * 1024 * 1024, // 28.5 MB
      createdAt: "2025-03-30T14:20:00Z",
      updatedAt: "2025-03-30T14:20:00Z",
    },
  ];
};

// Storage breakdown data for stats
const storageBreakdown = [
  { label: "Documents", size: 120 * 1024 * 1024, color: "#8B5CF6" },
  { label: "Images", size: 450 * 1024 * 1024, color: "#3B82F6" },
  { label: "Videos", size: 1.2 * 1024 * 1024 * 1024, color: "#10B981" },
  { label: "Other", size: 230 * 1024 * 1024, color: "#F59E0B" },
];

type BreadcrumbItem = {
  id: string;
  name: string;
};

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(generateMockFiles());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const { toast } = useToast();
  
  // Total storage stats
  const totalStorage = 15 * 1024 * 1024 * 1024; // 15 GB
  const usedStorage = storageBreakdown.reduce((total, item) => total + item.size, 0);
  
  const handleUploadClick = () => {
    toast({
      title: "Upload feature",
      description: "This would open a file picker or drag-and-drop area in the real app.",
    });
  };
  
  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setFiles([newFolder, ...files]);
    
    toast({
      title: "Folder created",
      description: `"${name}" folder has been created.`,
    });
  };
  
  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      // Navigate into the folder - in a real app, this would load the folder contents
      setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name }]);
      
      // For demo, we'll just show fewer files when navigating deeper
      const mockSubfolderFiles = generateMockFiles().slice(0, 4);
      setFiles(mockSubfolderFiles);
    }
  };
  
  const handleBreadcrumbNavigate = (item: BreadcrumbItem | null) => {
    if (item === null) {
      // Navigate to root
      setBreadcrumbs([]);
      setFiles(generateMockFiles());
    } else {
      // Navigate to specific breadcrumb
      const index = breadcrumbs.findIndex(crumb => crumb.id === item.id);
      if (index >= 0) {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        // In a real app, load the appropriate folder content
        // For demo, we'll just show fewer files when navigating deeper
        const mockSubfolderFiles = generateMockFiles().slice(0, 4 + index);
        setFiles(mockSubfolderFiles);
      }
    }
  };
  
  const handleStarClick = (file: FileItem, starred: boolean) => {
    setFiles(files.map(f => 
      f.id === file.id ? { ...f, starred } : f
    ));
    
    toast({
      title: starred ? "Added to starred" : "Removed from starred",
      description: `"${file.name}" has been ${starred ? "added to" : "removed from"} starred items.`,
    });
  };
  
  const handleShareClick = (file: FileItem) => {
    setShareFile(file);
  };
  
  const handleDownloadClick = (file: FileItem) => {
    toast({
      title: "Download started",
      description: `Downloading "${file.name}"...`,
    });
  };
  
  const handleDeleteClick = (file: FileItem) => {
    setFiles(files.filter(f => f.id !== file.id));
    
    toast({
      title: "Moved to trash",
      description: `"${file.name}" has been moved to trash.`,
    });
  };
  
  return (
    <AppLayout>
      <div className="space-y-4">
        <BreadcrumbNav items={breadcrumbs} onNavigate={handleBreadcrumbNavigate} />
        
        <FileActions
          onUploadClick={handleUploadClick}
          onCreateFolder={handleCreateFolder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {files.length > 0 ? (
              <FileGrid
                files={files}
                onItemClick={handleItemClick}
                onShareClick={handleShareClick}
                onDeleteClick={handleDeleteClick}
                onStarClick={handleStarClick}
                onDownloadClick={handleDownloadClick}
                viewMode={viewMode}
              />
            ) : (
              <div className="bg-muted/30 border border-dashed rounded-lg p-12 flex flex-col items-center justify-center">
                <h3 className="text-xl font-medium mb-2">This folder is empty</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Upload files or create folders to start organizing your content
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleUploadClick}>Upload Files</Button>
                  <Button variant="outline" onClick={() => handleCreateFolder("New Folder")}>
                    Create Folder
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <StorageStats
              usedStorage={usedStorage}
              totalStorage={totalStorage}
              breakdown={storageBreakdown}
              className="sticky top-6"
            />
          </div>
        </div>
      </div>
      
      <ShareModal file={shareFile} onClose={() => setShareFile(null)} />
    </AppLayout>
  );
};

export default Dashboard;
