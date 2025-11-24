import React from "react";
import { Card } from "./card";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card padding="md" className={clsx("flex flex-col justify-between h-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-muted">{title}</span>
        {icon && <div className="text-text-muted opacity-70">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-text-main">{value}</div>
        {trend && (
          <div className={clsx(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            trend.direction === "up" && "bg-success/10 text-success",
            trend.direction === "down" && "bg-error/10 text-error",
            trend.direction === "neutral" && "bg-surface text-text-muted"
          )}>
            {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "•"}
            <span className="ml-1">{Math.abs(trend.value)}% {trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  );
}




