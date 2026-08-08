"use client";

import * as React from "react";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FilterX,
  Layers,
  MessageSquare,
  MousePointerClick,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type NavButtonProps = React.ComponentProps<typeof Button> & {
  label?: string;
};

function PowerBiButton({
  label,
  icon,
  className,
  children,
  ...props
}: NavButtonProps & { icon?: React.ReactNode }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-8 border-border bg-card font-normal shadow-sm hover:bg-muted",
        className,
      )}
      {...props}
    >
      {icon}
      {label ?? children}
    </Button>
  );
}

export function NavButton({ label = "Navigate", className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label}
      icon={<MousePointerClick className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function BlankButton({ label = "Button", className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label}
      icon={<Square className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function BackButton({ label = "Back", className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label}
      icon={<ArrowLeft className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function BookmarkButton({ label = "Save view", className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label}
      icon={<Bookmark className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function DrillThroughButton({ label = "See details", className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label}
      icon={<Layers className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function PageNavigationButton({ label = "Go to page", className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label}
      icon={<ChevronRight className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function WebUrlButton({
  label = "Open link",
  href = "https://example.com",
  className,
  ...props
}: Omit<NavButtonProps, "onClick"> & { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border bg-card px-3 text-sm font-normal shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

export function QAButton({ label = "Ask a question", className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label}
      icon={<MessageSquare className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function ApplyAllSlicersButton({ label = "Apply all", className, ...props }: NavButtonProps) {
  return (
    <Button variant="default" size="sm" className={cn("h-8 shadow-sm", className)} {...props}>
      <FilterX className="h-3.5 w-3.5 rotate-180" />
      {label}
    </Button>
  );
}

export function ClearAllSlicersButton({ label = "Clear all", className, ...props }: NavButtonProps) {
  return (
    <Button variant="secondary" size="sm" className={cn("h-8", className)} {...props}>
      <FilterX className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

const defaultPages = [
  { id: "overview", label: "Overview" },
  { id: "sales", label: "Sales" },
  { id: "operations", label: "Operations" },
  { id: "details", label: "Details" },
];

export function PageNavigator({
  pages = defaultPages,
  activePage = "overview",
  className,
}: {
  pages?: { id: string; label: string }[];
  activePage?: string;
  className?: string;
}) {
  const activeIndex = pages.findIndex((p) => p.id === activePage);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-center justify-between gap-2 p-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={cn(
                "truncate rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                page.id === activePage
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {page.label}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
          {activeIndex + 1} / {pages.length}
        </Badge>
      </CardContent>
    </Card>
  );
}

const defaultBookmarks = [
  { id: "1", name: "Executive summary", page: "Overview" },
  { id: "2", name: "West region drilldown", page: "Sales" },
  { id: "3", name: "Margin analysis", page: "Operations" },
];

export function BookmarkNavigator({
  bookmarks = defaultBookmarks,
  className,
}: {
  bookmarks?: { id: string; name: string; page: string }[];
  className?: string;
}) {
  const [query, setQuery] = React.useState("");
  const filtered = bookmarks.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">Bookmarks</div>
          <BookmarkButton label="Add" />
        </div>
        <Input
          placeholder="Search bookmarks…"
          aria-label="Search bookmarks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 text-xs"
        />
        <div className="max-h-48 space-y-1 overflow-auto">
          {filtered.map((bookmark) => (
            <button
              key={bookmark.id}
              type="button"
              className="flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-2 text-left text-sm transition-colors hover:border-border hover:bg-muted/60"
            >
              <Bookmark className="h-3.5 w-3.5 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{bookmark.name}</div>
                <div className="text-xs text-muted-foreground">{bookmark.page}</div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
