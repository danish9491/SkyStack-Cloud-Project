
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const getPreviewUrl = async () => {
      if (!file) return;
      
      try {
        setIsLoading(true);
        
        // For mock service, we'll use a mock URL
        // In real application with Supabase, we would use createSignedUrl
        if (file.type === 'file') {
          // Mock preview URLs based on file type
          if (file.fileType?.includes('image')) {
            setPreviewUrl('https://source.unsplash.com/random/800x600/?document');
          } else if (file.fileType?.includes('video')) {
            setPreviewUrl('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
          } else if (file.fileType?.includes('audio')) {
            setPreviewUrl('https://sample-videos.com/audio/mp3/crowd-cheering.mp3');
          } else if (file.fileType?.includes('pdf')) {
            setPreviewUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
          } else {
            // For text and other files
            setPreviewUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
          }
        } else {
          // If it's a folder, there's no preview
          setPreviewUrl(null);
        }
      } catch (error) {
        console.error('Error getting preview URL:', error);
        toast({
          variant: "destructive",
          title: "Preview error",
          description: "Failed to load file preview.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (file) {
      getPreviewUrl();
    }
    
    return () => {
      // Cleanup preview URL when component unmounts
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, toast]);
  
  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!previewUrl) {
      return (
        <div className="p-8 text-center h-96 flex items-center justify-center">
          <p className="text-muted-foreground">Preview not available</p>
        </div>
      );
    }
    
    if (file.fileType?.includes('image')) {
      return (
        <div className="flex justify-center p-4 max-h-[70vh] overflow-auto">
          <img 
            src={previewUrl} 
            alt={file.name} 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      );
    }
    
    if (file.fileType?.includes('video')) {
      return (
        <div className="flex justify-center p-4">
          <video 
            src={previewUrl} 
            controls 
            className="max-w-full max-h-[70vh]" 
          />
        </div>
      );
    }
    
    if (file.fileType?.includes('audio')) {
      return (
        <div className="flex justify-center p-4">
          <audio src={previewUrl} controls className="w-full" />
        </div>
      );
    }
    
    if (file.fileType?.includes('pdf')) {
      return (
        <div className="h-[70vh] p-4">
          <iframe 
            src={`${previewUrl}#view=FitH`} 
            title={file.name}
            className="w-full h-full"
          />
        </div>
      );
    }
    
    if (
      file.fileType?.includes('text') || 
      file.fileType?.includes('javascript') || 
      file.fileType?.includes('json') ||
      file.fileType?.includes('csv') ||
      file.fileType?.includes('html')
    ) {
      return (
        <div className="p-4">
          <div className="bg-muted p-4 rounded-md h-96 overflow-auto">
            <a 
              href={previewUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              Open text file in new tab
            </a>
          </div>
        </div>
      );
    }
    
    // For other file types
    return (
      <div className="p-8 text-center h-96 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
        <Button onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download to view
        </Button>
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
