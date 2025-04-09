
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  File,
  Folder,
  MoreVertical,
  Download,
  Share2,
  Star,
  Trash2,
  FileText,
  Image,
  FileVideo,
  Music,
  Package,
} from "lucide-react";
import FilePreviewModal from "./FilePreviewModal";

export type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  fileType?: string;
  size?: number;
  createdAt: string;
  updatedAt: string;
  starred?: boolean;
  shared?: boolean;
};

type FileGridProps = {
  files: FileItem[];
  onItemClick: (file: FileItem) => void;
  onShareClick: (file: FileItem) => void;
  onDeleteClick: (file: FileItem) => void;
  onStarClick: (file: FileItem, starred: boolean) => void;
  onDownloadClick: (file: FileItem) => void;
  viewMode?: "grid" | "list";
};

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <File className="h-6 w-6" />;
  
  if (fileType.includes("image")) return <Image className="h-6 w-6" />;
  if (fileType.includes("video")) return <FileVideo className="h-6 w-6" />;
  if (fileType.includes("audio")) return <Music className="h-6 w-6" />;
  if (fileType.includes("text") || fileType.includes("pdf") || fileType.includes("doc")) 
    return <FileText className="h-6 w-6" />;
  
  return <Package className="h-6 w-6" />;
};

const FileGrid: React.FC<FileGridProps> = ({
  files,
  onItemClick,
  onShareClick,
  onDeleteClick,
  onStarClick,
  onDownloadClick,
  viewMode = "grid",
}) => {
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const handleItemClick = (file: FileItem) => {
    if (file.type === "file") {
      setPreviewFile(file);
    } else {
      onItemClick(file);
    }
  };

  return (
    <>
      <div className={viewMode === "grid" ? "file-grid" : "file-list"}>
        {files.map((file) => (
          <Card
            key={file.id}
            className={`cursor-pointer group hover:border-primary transition-all ${
              viewMode === "list" 
                ? "flex items-center p-2" 
                : ""
            }`}
          >
            <CardContent
              className={`p-3 ${
                viewMode === "list" 
                  ? "flex items-center justify-between w-full" 
                  : "flex flex-col items-center"
              }`}
              onClick={() => handleItemClick(file)}
            >
              {viewMode === "grid" && (
                <div className="h-24 w-full flex items-center justify-center bg-muted/50 rounded-md mb-3">
                  {file.type === "folder" ? (
                    <Folder className="h-12 w-12 text-aigility-blue" />
                  ) : (
                    getFileIcon(file.fileType)
                  )}
                </div>
              )}
              
              <div className={`${viewMode === "list" ? "flex items-center gap-3 flex-1" : "w-full"}`}>
                {viewMode === "list" && (
                  <div className="p-2 rounded-md bg-muted/50">
                    {file.type === "folder" ? (
                      <Folder className="h-5 w-5 text-aigility-blue" />
                    ) : (
                      getFileIcon(file.fileType)
                    )}
                  </div>
                )}
                
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${viewMode === "grid" ? "truncate" : ""}`}>{file.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {file.type === "file" && (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onDownloadClick(file);
                          }}>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onShareClick(file);
                        }}>
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onStarClick(file, !file.starred);
                        }}>
                          <Star className={`h-4 w-4 mr-2 ${file.starred ? "fill-yellow-400" : ""}`} /> 
                          {file.starred ? "Unstar" : "Star"}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          className="text-red-500 focus:text-red-500" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(file);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Move to trash
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {viewMode === "list" && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>Modified {new Date(file.updatedAt).toLocaleDateString()}</span>
                      {file.type === "file" && file.size && (
                        <span className="ml-3">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {viewMode === "grid" && (
                <div className="w-full flex items-center justify-between text-xs mt-1 text-muted-foreground">
                  <span>
                    {file.type === "file" && file.size
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : ""}
                  </span>
                  <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={() => onDownloadClick(previewFile)}
          onShare={() => onShareClick(previewFile)}
        />
      )}
    </>
  );
};

export default FileGrid;
