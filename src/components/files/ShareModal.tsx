
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, Link, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { FileItem } from "./FileGrid";

type ShareModalProps = {
  file: FileItem | null;
  onClose: () => void;
};

const ShareModal: React.FC<ShareModalProps> = ({ file, onClose }) => {
  const [isPublic, setIsPublic] = useState(true);
  const [expiresIn, setExpiresIn] = useState("never");
  const { toast } = useToast();
  
  // Generate a fake share link for demo purposes
  const shareLink = file ? `https://aigility.cloud/s/${file.id.substring(0, 8)}` : "";
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    });
  };
  
  if (!file) return null;
  
  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share "{file.name}"</DialogTitle>
          <DialogDescription>
            Create a link to share this {file.type} with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public link</Label>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can {isPublic ? "view and download" : "view only"}
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <div className="absolute left-2 top-2.5 text-muted-foreground">
                <Link className="h-4 w-4" />
              </div>
              <Input
                value={shareLink}
                readOnly
                className="pl-8 pr-20"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute right-1 top-1 h-7"
                onClick={handleCopyLink}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Link expiration</Label>
            <div className="flex items-center mt-1.5 space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="bg-background text-sm border-0 focus:ring-0"
              >
                <option value="never">Never expires</option>
                <option value="1d">1 day</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Create link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
