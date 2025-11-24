import React from "react";
import { clsx } from "clsx";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-auto rounded-lg border border-border-subtle">
      <table className={clsx("w-full text-sm text-left", className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={clsx("bg-surface text-xs uppercase text-text-muted font-semibold border-b border-border-subtle", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tbody className={clsx("divide-y divide-border-subtle bg-bg", className)}>{children}</tbody>;
}

export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={clsx("hover:bg-surface transition-colors", className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={clsx("px-6 py-3", className)}>{children}</th>;
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("px-6 py-4 whitespace-nowrap text-text-main", className)}>{children}</td>;
}




