
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";
import type { FileItem } from "./FileGrid";

type FilePreviewModalProps = {
  file: FileItem;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
};

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onDownload,
  onShare,
}) => {
  const renderPreview = () => {
    // In a real application, we would have the file URL from Supabase storage
    // For this demo, we'll just render placeholders based on file type
    
    if (!file.fileType) return <div className="p-8 text-center">Preview not available</div>;
    
    if (file.fileType.includes("image")) {
      return (
        <div className="flex justify-center p-4">
          <div className="bg-gray-200 w-full aspect-video flex items-center justify-center">
            <span className="text-gray-500">Image Preview</span>
          </div>
        </div>
      );
    }
    
    if (file.fileType.includes("video")) {
      return (
        <div className="flex justify-center p-4">
          <div className="bg-gray-200 w-full aspect-video flex items-center justify-center">
            <span className="text-gray-500">Video Player</span>
          </div>
        </div>
      );
    }
    
    if (file.fileType.includes("pdf") || file.fileType.includes("text") || file.fileType.includes("doc")) {
      return (
        <div className="p-4">
          <div className="bg-gray-200 h-96 p-4 overflow-auto">
            <p className="text-gray-500">Document preview would appear here</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-8 text-center text-muted-foreground">
        Preview not available for this file type
      </div>
    );
  };
  
  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{file.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="min-h-[50vh]">
          {renderPreview()}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {file.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB · ` : ""}
            Last modified {new Date(file.updatedAt).toLocaleDateString()}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;
