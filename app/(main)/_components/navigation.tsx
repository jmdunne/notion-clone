"use client"; // Use client-side rendering for this component

import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings } from "lucide-react"; // Import icons from lucide-react
import { usePathname } from "next/navigation"; // Import hook to get the current pathname
import { ElementRef, useEffect, useRef, useState } from "react"; // Import React hooks and types
import { useMediaQuery } from "usehooks-ts"; // Import hook to listen for media query changes
import { useMutation } from "convex/react";

import { cn } from "@/lib/utils"; // Import a utility function for class name concatenation
import { api } from "@/convex/_generated/api";

import { UserItem } from "./user-item";
import { Item } from "./item";
import { toast } from "sonner";
import { GearIcon } from "@radix-ui/react-icons";
import { DocumentList } from "./document-list";

export const Navigation = () => {
  // Define and export the Navigation component
  const pathname = usePathname(); // Get the current pathname
  const isMobile = useMediaQuery("(max-width: 768px)"); // Check if the viewport width is less than 768px

  // Creates a mutation function that can be called to create new documents.
  // This function is generated based on the mutation definition in `api.documents.create`.
  // When invoked, it will send a request to create a new document in the database.
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false); // Create a ref to track if the user is resizing the sidebar
  const sidebarRef = useRef<ElementRef<"aside">>(null); // Create a ref for the sidebar element
  const navbarRef = useRef<ElementRef<"div">>(null); // Create a ref for the navbar element
  const [isResetting, setIsResetting] = useState(false); // State to track if the sidebar/nav are resetting
  const [isCollapsed, setIsCollapsed] = useState(isMobile); // State to track if the sidebar is collapsed

  useEffect(() => {
    // Effect to collapse or reset the sidebar on mobile changes
    if (isMobile) {
      collapse(); // Collapse the sidebar if on mobile
    } else {
      resetWidth(); // Reset the sidebar width if not on mobile
    }
  }, [isMobile]); // Depend on the isMobile state

  useEffect(() => {
    // Effect to collapse the sidebar on pathname or mobile changes
    if (isMobile) {
      collapse(); // Collapse the sidebar if on mobile
    }
  }, [pathname, isMobile]); // Depend on the pathname and isMobile state

  const handleMouseDown = (
    // Function to handle mouse down event on the resize bar
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent default event behavior
    event.stopPropagation(); // Stop the event from propagating

    isResizingRef.current = true; // Set resizing to true
    document.addEventListener("mousemove", handleMouseMove); // Add mousemove event listener to document
    document.addEventListener("mouseup", handleMouseUp); // Add mouseup event listener to document
  };

  const handleMouseMove = (event: MouseEvent) => {
    // Function to handle mouse move event during resize
    if (!isResizingRef.current) return; // Return if not resizing
    let newWidth = event.clientX; // Get the new width based on mouse position

    if (newWidth < 240) newWidth = 240; // Set minimum width to 240px
    if (newWidth > 480) newWidth = 480; // Set maximum width to 480px

    if (sidebarRef.current && navbarRef.current) {
      // Check if refs are set
      sidebarRef.current.style.width = `${newWidth}px`; // Update sidebar width
      navbarRef.current.style.setProperty("left", `${newWidth}px`); // Update navbar left position
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)` // Update navbar width
      );
    }
  };

  const handleMouseUp = () => {
    // Function to handle mouse up event after resize
    isResizingRef.current = false; // Set resizing to false
    document.removeEventListener("mousemove", handleMouseMove); // Remove mousemove event listener from document
    document.removeEventListener("mouseup", handleMouseUp); // Remove mouseup event listener from document
  };

  const resetWidth = () => {
    // Function to reset the sidebar and navbar width
    if (sidebarRef.current && navbarRef.current) {
      // Check if refs are set
      setIsCollapsed(false); // Set sidebar to not collapsed
      setIsResetting(true); // Set resetting state to true

      sidebarRef.current.style.width = isMobile ? "100%" : "240px"; // Set sidebar width based on mobile state
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)" // Set navbar width based on mobile state
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px"); // Set navbar left position based on mobile state
      setTimeout(() => setIsResetting(false), 300); // Reset the resetting state after 300ms
    }
  };

  const collapse = () => {
    // Function to collapse the sidebar
    if (sidebarRef.current && navbarRef.current) {
      // Check if refs are set
      setIsCollapsed(true); // Set sidebar to collapsed
      setIsResetting(true); // Set resetting state to true

      sidebarRef.current.style.width = "0"; // Set sidebar width to 0
      navbarRef.current.style.setProperty("width", "100%"); // Set navbar width to 100%
      navbarRef.current.style.setProperty("left", "0"); // Set navbar left position to 0
      setTimeout(() => setIsResetting(false), 300); // Reset the resetting state after 300ms
    }
  };

  // This function `handleCreate` is responsible for creating a new note with a default title "Untitled".
  // It also handles the UI feedback by showing toast notifications based on the status of the note creation process.
  const handleCreate = () => {
    // Create a new note with the title "Untitled" and store the returned promise
    const promise = create({ title: "Untitled" });

    // Display a toast notification based on the promise status
    toast.promise(promise, {
      loading: "Creating a new note...", // Message shown while the promise is pending
      success: "Note created successfully", // Message shown if the promise is fulfilled
      error: "Failed to create note", // Message shown if the promise is rejected
    });
  };

  return (
    // Return the JSX for the component
    <>
      <aside // Sidebar element
        ref={sidebarRef} // Attach the sidebar ref
        className={cn(
          // Use the cn utility for class names
          "group/sidebar h-screen bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300", // Add transition classes if resetting
          isMobile && "w-0" // Set width to 0 if on mobile
        )}
      >
        <div // Collapse button
          onClick={collapse} // Collapse the sidebar on click
          role="button" // Set the role to button for accessibility
          className={cn(
            // Use the cn utility for class names
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100" // Set opacity to 100 if on mobile
          )}
        >
          <ChevronsLeft className="h-6 w-6" /> {/* Collapse icon */}
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={() => {}}/> {/* Renders an Item component for search functionality with a Search icon */}
          <Item label="Settings" icon={Settings} onClick={() => {}}/> {/* Renders an Item component for accessing settings with a Settings icon */}
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} /> {/* Renders an Item component for creating a new page with a PlusCircle icon */}
        </div>
        <div className="mt-4">
          <DocumentList />
        </div>
        <div // Resize bar
          onMouseDown={handleMouseDown} // Start resizing on mouse down
          onClick={resetWidth} // Reset width on click
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" // Use the cn utility for class names
        />
      </aside>
      <div // Navbar element
        ref={navbarRef} // Attach the navbar ref
        className={cn(
          // Use the cn utility for class names
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]", // Default navbar position and width
          isResetting && "transition-all ease-in-out duration-300", // Add transition classes if resetting
          isMobile && "left-0 w-full" // Adjust position and width if on mobile
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {" "}
          {/* Navbar content */}
          {isCollapsed && ( // Show menu icon if sidebar is collapsed
            <MenuIcon
              onClick={resetWidth} // Reset width on click
              role="button" // Set the role to button for accessibility
              className="h-6 w-6 text-muted-foreground" // Menu icon styles
            />
          )}
        </nav>
      </div>
    </>
  );
};
