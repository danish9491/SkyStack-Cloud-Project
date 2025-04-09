
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StorageStatsProps = {
  usedStorage: number;
  totalStorage: number;
  breakdown: {
    label: string;
    size: number;
    color: string;
  }[];
  loading?: boolean;
  className?: string;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

const StorageStats: React.FC<StorageStatsProps> = ({
  usedStorage,
  totalStorage,
  breakdown,
  loading = false,
  className
}) => {
  const storagePercentage = (usedStorage / totalStorage) * 100;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium">Storage</h3>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {loading ? "Calculating..." : formatBytes(usedStorage)}
              </span>
              <span className="font-medium">
                {formatBytes(totalStorage)}
              </span>
            </div>
            <Progress value={loading ? 0 : storagePercentage} className="h-2" />
          </div>
          
          {!loading && breakdown.length > 0 && (
            <div className="space-y-2">
              {breakdown.map((item) => 
                item.size > 0 ? (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatBytes(item.size)}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {loading ? "Loading storage stats..." : storagePercentage < 90 ? "Storage healthy" : "Storage almost full"}
      </CardFooter>
    </Card>
  );
};

export default StorageStats;
