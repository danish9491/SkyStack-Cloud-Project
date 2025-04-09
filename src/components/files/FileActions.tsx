
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  PlusCircle,
  LayoutGrid,
  List,
  ChevronDown,
  FolderPlus,
  Undo2,
} from "lucide-react";

type FileActionsProps = {
  onUploadClick: (files: FileList | null) => void;
  onCreateFolder: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  showRestoreAll?: boolean;
  onRestoreAll?: () => void;
};

const FileActions: React.FC<FileActionsProps> = ({
  onUploadClick,
  onCreateFolder,
  viewMode,
  onViewModeChange,
  showRestoreAll = false,
  onRestoreAll,
}) => {
  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
      <div className="flex gap-2">
        <Button className="gap-2" onClick={handleUploadButtonClick}>
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onCreateFolder}>
              <FolderPlus className="h-4 w-4 mr-2" /> New Folder
            </DropdownMenuItem>
            {/* Can add more items here, like "New Document" etc. */}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {showRestoreAll && onRestoreAll && (
          <Button variant="outline" onClick={onRestoreAll} className="gap-2">
            <Undo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Restore All</span>
          </Button>
        )}
      </div>
      
      <div className="flex gap-1 p-0.5 bg-muted rounded-md">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onViewModeChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Hidden file input for file uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => onUploadClick(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default FileActions;
