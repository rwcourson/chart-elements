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
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export type NavigationActionHandler = React.MouseEventHandler<HTMLButtonElement>;

export type NavigationButtonProps = React.ComponentProps<typeof Button> & {
  /** Visible button text. Falls back to children when omitted. */
  label?: React.ReactNode;
  /** Semantic action callback; `onClick` remains supported for compatibility. */
  onAction?: NavigationActionHandler;
};

export type NavButtonProps = NavigationButtonProps;
export type BlankButtonProps = NavigationButtonProps;
export type BackButtonProps = NavigationButtonProps;
export type BookmarkButtonProps = NavigationButtonProps;
export type DrillThroughButtonProps = NavigationButtonProps;
export type PageNavigationButtonProps = NavigationButtonProps;
export type QAButtonProps = NavigationButtonProps;
export type ApplyAllSlicersButtonProps = NavigationButtonProps;
export type ClearAllSlicersButtonProps = NavigationButtonProps;

type PowerBiButtonProps = NavigationButtonProps & {
  icon?: React.ReactNode;
};

function PowerBiButton({
  label,
  icon,
  className,
  children,
  onAction,
  onClick,
  type,
  ...props
}: PowerBiButtonProps) {
  const handleClick = onAction || onClick
    ? (event: React.MouseEvent<HTMLButtonElement>) => {
        onAction?.(event);
        if (!event.defaultPrevented) onClick?.(event);
      }
    : undefined;

  return (
    <Button
      type={type ?? "button"}
      variant="outline"
      size="sm"
      className={cn(
        "border-border bg-card font-normal shadow-sm hover:bg-muted",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {icon}
      {label ?? children}
    </Button>
  );
}

export function NavButton({ label, children, className, ...props }: NavButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Navigate"}
      icon={<MousePointerClick aria-hidden="true" className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function BlankButton({ label, children, className, ...props }: BlankButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Button"}
      icon={<Square aria-hidden="true" className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function BackButton({ label, children, className, ...props }: BackButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Back"}
      icon={<ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function BookmarkButton({ label, children, className, ...props }: BookmarkButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Save view"}
      icon={<Bookmark aria-hidden="true" className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function DrillThroughButton({ label, children, className, ...props }: DrillThroughButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "See details"}
      icon={<Layers aria-hidden="true" className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function PageNavigationButton({ label, children, className, ...props }: PageNavigationButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Go to page"}
      icon={<ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export type WebUrlButtonProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  label?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function WebUrlButton({
  label,
  href = "https://example.com",
  className,
  children,
  onNavigate,
  onClick,
  target = "_blank",
  rel,
  ...props
}: WebUrlButtonProps) {
  const handleClick = onNavigate || onClick
    ? (event: React.MouseEvent<HTMLAnchorElement>) => {
        onNavigate?.(event);
        if (!event.defaultPrevented) onClick?.(event);
      }
    : undefined;

  return (
    <a
      href={href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] border border-border bg-card px-3 text-[13px] font-normal shadow-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
      {label ?? children ?? "Open link"}
    </a>
  );
}

export function QAButton({ label, children, className, ...props }: QAButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Ask a question"}
      icon={<MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />}
      className={className}
      {...props}
    />
  );
}

export function ApplyAllSlicersButton({ label, children, className, ...props }: ApplyAllSlicersButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Apply all"}
      icon={<FilterX aria-hidden="true" className="h-3.5 w-3.5 rotate-180" />}
      className={cn("border-transparent bg-accent font-semibold text-accent-foreground hover:bg-[var(--accent-hover)]", className)}
      {...props}
    />
  );
}

export function ClearAllSlicersButton({ label, children, className, ...props }: ClearAllSlicersButtonProps) {
  return (
    <PowerBiButton
      label={label ?? children ?? "Clear all"}
      icon={<FilterX aria-hidden="true" className="h-3.5 w-3.5" />}
      className={cn("border-transparent bg-[var(--accent-soft)] text-foreground hover:bg-[var(--sidebar-active)]", className)}
      {...props}
    />
  );
}

export interface PageNavigatorItem {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface PageNavigatorProps {
  pages?: readonly PageNavigatorItem[];
  /** Controlled active page ID. Pass null to render no active page. */
  activeId?: string | null;
  /** Initial page ID for uncontrolled use. */
  defaultActiveId?: string;
  onActiveChange?: (activeId: string, page: PageNavigatorItem) => void;
  className?: string;
  ariaLabel?: string;
  /** @deprecated Use activeId. */
  activePage?: string;
}

const defaultPages: readonly PageNavigatorItem[] = [
  { id: "overview", label: "Overview" },
  { id: "sales", label: "Sales" },
  { id: "operations", label: "Operations" },
  { id: "details", label: "Details" },
];

export function PageNavigator({
  pages = defaultPages,
  activeId,
  defaultActiveId,
  onActiveChange,
  activePage,
  className,
  ariaLabel = "Report pages",
}: PageNavigatorProps) {
  const isControlled = activeId !== undefined || activePage !== undefined;
  const [internalActiveId, setInternalActiveId] = React.useState<string | null>(
    () => defaultActiveId ?? pages.find((page) => !page.disabled)?.id ?? null,
  );
  const candidateId = activeId !== undefined ? activeId : activePage ?? internalActiveId;
  const activeItem = candidateId
    ? pages.find((page) => page.id === candidateId && !page.disabled)
    : undefined;
  const resolvedActiveItem = activeItem ?? (!isControlled
    ? pages.find((page) => !page.disabled)
    : undefined);
  const resolvedActiveId = resolvedActiveItem?.id ?? null;
  const activeIndex = resolvedActiveId
    ? pages.findIndex((page) => page.id === resolvedActiveId)
    : -1;
  const enabledPages = pages.filter((page) => !page.disabled);
  const enabledIndex = resolvedActiveId
    ? enabledPages.findIndex((page) => page.id === resolvedActiveId)
    : -1;
  const previousPage = enabledIndex > 0 ? enabledPages[enabledIndex - 1] : undefined;
  const nextPage = enabledIndex >= 0 && enabledIndex < enabledPages.length - 1
    ? enabledPages[enabledIndex + 1]
    : undefined;

  const activate = (page: PageNavigatorItem | undefined) => {
    if (!page || page.disabled || page.id === resolvedActiveId) return;
    if (!isControlled) setInternalActiveId(page.id);
    onActiveChange?.(page.id, page);
  };

  return (
    <Card className={cn("min-w-0 overflow-hidden", className)}>
      <CardContent className="flex min-w-0 items-center gap-1.5 p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          aria-label="Previous page"
          disabled={!previousPage}
          onClick={() => activate(previousPage)}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </Button>
        <nav aria-label={ariaLabel} className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-max items-center justify-center gap-1">
            {pages.map((page) => {
              const isActive = page.id === resolvedActiveId;
              return (
                <button
                  key={page.id}
                  type="button"
                  disabled={page.disabled}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "min-h-11 shrink-0 rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-45",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => activate(page)}
                >
                  {page.label}
                </button>
              );
            })}
          </div>
        </nav>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          aria-label="Next page"
          disabled={!nextPage}
          onClick={() => activate(nextPage)}
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Button>
        <Badge
          variant="outline"
          className="hidden shrink-0 sm:inline-flex"
          aria-label={activeIndex >= 0 ? `Page ${activeIndex + 1} of ${pages.length}` : `No active page of ${pages.length}`}
        >
          {activeIndex >= 0 ? activeIndex + 1 : 0} / {pages.length}
        </Badge>
      </CardContent>
    </Card>
  );
}

export interface BookmarkNavigatorItem {
  id: string;
  name: string;
  page: string;
  disabled?: boolean;
}

export interface BookmarkNavigatorProps {
  /** Supplying bookmarks controls the collection; omit for a self-managing demo. */
  bookmarks?: readonly BookmarkNavigatorItem[];
  activeId?: string | null;
  defaultActiveId?: string;
  onActiveChange?: (activeId: string | null, bookmark?: BookmarkNavigatorItem) => void;
  onSelect?: (bookmark: BookmarkNavigatorItem) => void;
  onAdd?: (bookmark: BookmarkNavigatorItem) => void;
  onDelete?: (bookmark: BookmarkNavigatorItem) => void;
  createBookmark?: () => BookmarkNavigatorItem;
  className?: string;
  title?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

const defaultBookmarks: readonly BookmarkNavigatorItem[] = [
  { id: "1", name: "Executive summary", page: "Overview" },
  { id: "2", name: "West region drilldown", page: "Sales" },
  { id: "3", name: "Margin analysis", page: "Operations" },
];

export function BookmarkNavigator({
  bookmarks,
  activeId,
  defaultActiveId,
  onActiveChange,
  onSelect,
  onAdd,
  onDelete,
  createBookmark,
  className,
  title = "Bookmarks",
  searchPlaceholder = "Search bookmarks…",
  emptyMessage = "No bookmarks match your search.",
}: BookmarkNavigatorProps) {
  const titleId = React.useId();
  const isCollectionControlled = bookmarks !== undefined;
  const [internalBookmarks, setInternalBookmarks] = React.useState<BookmarkNavigatorItem[]>(
    () => [...defaultBookmarks],
  );
  const items = bookmarks ?? internalBookmarks;
  const isActiveControlled = activeId !== undefined;
  const [internalActiveId, setInternalActiveId] = React.useState<string | null>(
    () => defaultActiveId ?? items.find((bookmark) => !bookmark.disabled)?.id ?? null,
  );
  const candidateId = isActiveControlled ? activeId : internalActiveId;
  const activeBookmark = candidateId
    ? items.find((bookmark) => bookmark.id === candidateId && !bookmark.disabled)
    : undefined;
  const resolvedActiveBookmark = activeBookmark ?? (!isActiveControlled
    ? items.find((bookmark) => !bookmark.disabled)
    : undefined);
  const resolvedActiveId = resolvedActiveBookmark?.id ?? null;
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = items.filter((bookmark) =>
    `${bookmark.name} ${bookmark.page}`.toLocaleLowerCase().includes(normalizedQuery),
  );
  const nextBookmarkNumber = React.useRef(defaultBookmarks.length + 1);

  const selectBookmark = (bookmark: BookmarkNavigatorItem) => {
    if (bookmark.disabled) return;
    if (bookmark.id !== resolvedActiveId) {
      if (!isActiveControlled) setInternalActiveId(bookmark.id);
      onActiveChange?.(bookmark.id, bookmark);
    }
    onSelect?.(bookmark);
  };

  const addBookmark = () => {
    let bookmark = createBookmark?.();
    if (!bookmark) {
      let id: string;
      do {
        id = `bookmark-${nextBookmarkNumber.current}`;
        nextBookmarkNumber.current += 1;
      } while (items.some((item) => item.id === id));
      bookmark = {
        id,
        name: `Bookmark ${nextBookmarkNumber.current - 1}`,
        page: resolvedActiveBookmark?.page ?? "Current page",
      };
    }

    if (!isCollectionControlled) setInternalBookmarks((current) => [...current, bookmark]);
    if (!isActiveControlled && !isCollectionControlled) {
      setInternalActiveId(bookmark.id);
      onActiveChange?.(bookmark.id, bookmark);
    }
    setQuery("");
    onAdd?.(bookmark);
  };

  const deleteBookmark = (bookmark: BookmarkNavigatorItem) => {
    if (!isCollectionControlled) {
      const remaining = internalBookmarks.filter((item) => item.id !== bookmark.id);
      setInternalBookmarks(remaining);
      if (!isActiveControlled && bookmark.id === resolvedActiveId) {
        const nextActive = remaining.find((item) => !item.disabled);
        setInternalActiveId(nextActive?.id ?? null);
        onActiveChange?.(nextActive?.id ?? null, nextActive);
      }
    }
    onDelete?.(bookmark);
  };

  return (
    <Card className={cn("min-w-0 overflow-hidden", className)} role="region" aria-labelledby={titleId}>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <div id={titleId} className="text-sm font-semibold">{title}</div>
          <BookmarkButton label="Add" aria-label="Add bookmark" onAction={addBookmark} />
        </div>
        <Input
          type="search"
          placeholder={searchPlaceholder}
          aria-label="Search bookmarks"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-9 text-xs"
        />
        <ul className="max-h-48 space-y-1 overflow-auto" aria-label="Saved bookmarks">
          {filtered.map((bookmark) => {
            const isActive = bookmark.id === resolvedActiveId;
            return (
              <li
                key={bookmark.id}
                className={cn(
                  "group flex min-w-0 items-center rounded-[var(--radius)] border transition-colors",
                  isActive
                    ? "border-accent/40 bg-[var(--accent-soft)]"
                    : "border-transparent hover:border-border hover:bg-muted/60",
                )}
              >
                <button
                  type="button"
                  disabled={bookmark.disabled}
                  aria-pressed={isActive}
                  className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-l-lg px-2 py-2 text-left text-sm focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={() => selectBookmark(bookmark)}
                >
                  <Bookmark aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{bookmark.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{bookmark.page}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
                {onDelete || !isCollectionControlled ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mr-1 h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${bookmark.name}`}
                    onClick={() => deleteBookmark(bookmark)}
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="px-2 py-5 text-center text-xs text-muted-foreground" role="status">
              {emptyMessage}
            </li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}
