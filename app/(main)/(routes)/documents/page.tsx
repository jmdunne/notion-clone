"use client"; // Directive to run this module only on the client side.

import Image from "next/image"; // Importing the Image component from Next.js for optimized images.
import { useUser } from "@clerk/clerk-react"; // Importing useUser hook from Clerk for user authentication.
import { PlusCircle } from "lucide-react"; // Importing PlusCircle icon from Lucide React for UI enhancement.

import { Button } from "@/components/ui/button"; // Importing a custom Button component for UI consistency.
import { useMutation } from "convex/react"; // Importing useMutation hook from Convex to perform mutations.
import { api } from "@/convex/_generated/api"; // Importing the generated API object to interact with Convex backend.
import { toast } from "sonner"; // Importing toast from Sonner for notification purposes.

const DocumentsPage = () => {
  const { user } = useUser(); // Using the useUser hook to access the current user's information.
  const create = useMutation(api.documents.create); // Initializing a mutation function for document creation.

  const onCreate = () => {
    const promise = create({
      title: "Untitled", // Creating a document with the title "Untitled".
    });

    toast.promise(promise, { // Displaying a toast notification based on the promise status.
      loading: "Creating a new note...", // Message shown while the promise is pending.
      success: "New note created!", // Message shown if the promise is fulfilled.
      error: "Failed to create a new note", // Message shown if the promise is rejected.
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4"> {/* Styling the container div. */}
      <Image
        src="/empty.png" // Source of the light mode image.
        height="300" // Height of the image.
        width="300" // Width of the image.
        alt="Empty" // Alt text for the image.
        className="dark:hidden" // CSS class to hide this image in dark mode.
      />
      <Image
        src="/empty-dark.png" // Source of the dark mode image.
        height="300" // Height of the image.
        width="300" // Width of the image.
        alt="Empty" // Alt text for the image.
        className="hidden dark:block" // CSS class to show this image only in dark mode.
      />
      <h2 className="text-lg font-medium"> {/* Styling the welcome message. */}
        Welcome to {user?.firstName}&apos;s Jotion {/* Displaying the user's first name in the welcome message. */}
      </h2>
      <Button onClick={onCreate}> {/* Button to trigger the onCreate function. */}
        <PlusCircle className="h-4 w-4 mr-2" /> {/* PlusCircle icon for visual cue. */}
        Create a note {/* Button text. */}
      </Button>
    </div>
  );
};

export default DocumentsPage; // Exporting the DocumentsPage component.
