
import React from "react";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  id: string;
  name: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  onNavigate: (item: BreadcrumbItem | null) => void;
};

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, onNavigate }) => {
  return (
    <div className="flex items-center space-x-1 text-sm">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center hover:text-primary"
      >
        <Home className="h-4 w-4" />
      </button>
      {items.length > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <button
            onClick={() => onNavigate(item)}
            className={`hover:text-primary ${
              index === items.length - 1 ? "font-medium" : ""
            }`}
          >
            {item.name}
          </button>
          {index < items.length - 1 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbNav;
