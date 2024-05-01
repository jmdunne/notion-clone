"use client";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

// Define the TypeScript interface for the props that the Item component will accept
interface ItemProps {
  id?: Id<"documents">; // Optional id for the item, specifically for documents
  documentIcon?: string; // Optional icon for the document
  active?: boolean; // Boolean to determine if the item is active
  expanded?: boolean; // Boolean to determine if the item is expanded
  isSearch?: boolean; // Boolean to determine if the item is a search item
  level?: number; // Level of nesting or indentation for the item
  onExpand?: () => void; // Optional function to handle expansion of the item
  onClick: () => void; // Function to handle click events on the item
  label: string; // Display label for the item
  icon: LucideIcon; // Icon component to be displayed next to the label
}

// Define the Item functional component with destructured props
export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  documentIcon,
}: ItemProps) => {
  // Determine which Chevron icon to use based on the expanded state
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  // Return the JSX for the component
  return (
    <div
      onClick={onClick} // Set the onClick handler for the item
      role="button" // Accessibility role
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }} // Dynamic padding based on level
      className={cn(
        // Use the cn function to conditionally apply classes
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-forground font-medium cursor-pointer",
        active && "bg-primary/5 text-primary" // Apply classes if the item is active
      )}
    >
      {!!id && (
        // Conditionally render the Chevron icon if an id is provided
        <div
          onClick={() => {}} // Empty onClick handler for the icon
          role="button" // Accessibility role
          className="h-full rounded-small hover:bg-neutral-300"
        >
          <ChevronIcon className="w-4 h-4 shrink-0 text-muted-forground/50" />
        </div>
      )}
      {documentIcon ? (
        // Conditionally render the document icon if provided
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        // Otherwise, render the provided icon
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-forground" />
      )}
      <span className="truncate">{label}</span> {/* Render the label */}
      {isSearch && (
        // Conditionally render a keyboard shortcut hint if isSearch is true
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </div>
  );
};
