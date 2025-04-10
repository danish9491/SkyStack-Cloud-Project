
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ShareModalProps = {
  file: FileItem | null;
  onClose: () => void;
  onShare?: (email: string, accessLevel: string, expiresIn: string) => void;
};

const ShareModal: React.FC<ShareModalProps> = ({ file, onClose, onShare }) => {
  const [isPublic, setIsPublic] = useState(true);
  const [expiresIn, setExpiresIn] = useState("never");
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Generate a fake share link for demo purposes
  const shareLink = file ? `https://skystack.cloud/s/${file.id.substring(0, 8)}` : "";
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    });
  };
  
  const handleShare = async () => {
    if (!file || !onShare) return;
    
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address to share with.",
      });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onShare(email, accessLevel, expiresIn);
    } finally {
      setIsSubmitting(false);
    }
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
          <div>
            <Label htmlFor="email">Share with</Label>
            <Input
              id="email"
              placeholder="Enter email address"
              className="mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="access-level">Access level</Label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View only</SelectItem>
                <SelectItem value="edit">View and edit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never expires</SelectItem>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleShare} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
