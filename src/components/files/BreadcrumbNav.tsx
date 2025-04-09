
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

type BreadcrumbItem = {
  id: string;
  name: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  onNavigate: (item: BreadcrumbItem | null) => void;
  isLoading?: boolean;
};

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, onNavigate, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-primary"
        onClick={(e) => {
          e.preventDefault();
          navigate("/dashboard");
          onNavigate(null);
        }}
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.length > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <Link
            to={`/folder/${item.id}`}
            className={`hover:text-primary ${
              index === items.length - 1 ? "font-medium" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/folder/${item.id}`);
              onNavigate(item);
            }}
          >
            {item.name}
          </Link>
          {index < items.length - 1 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbNav;
