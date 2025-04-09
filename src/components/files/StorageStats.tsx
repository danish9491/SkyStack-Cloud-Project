
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StorageBreakdownItem = {
  label: string;
  size: number;
  color: string;
};

type StorageStatsProps = {
  usedStorage: number; // in bytes
  totalStorage: number; // in bytes
  breakdown: StorageBreakdownItem[];
  className?: string;
};

const formatStorageSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const StorageStats: React.FC<StorageStatsProps> = ({
  usedStorage,
  totalStorage,
  breakdown,
  className,
}) => {
  const usagePercentage = (usedStorage / totalStorage) * 100;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Storage Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {formatStorageSize(usedStorage)} of {formatStorageSize(totalStorage)} used
              </span>
              <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Storage breakdown</h4>
            {breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-medium">{formatStorageSize(item.size)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageStats;
