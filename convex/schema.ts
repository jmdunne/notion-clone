// Importing functions to define the schema and tables from the Convex server package.
import { defineSchema, defineTable } from "convex/server";
// Importing the value types from the Convex values module to define field types in our schema.
import { v } from "convex/values";

// Exporting the default schema definition for the application.
export default defineSchema({
  // Defining a new table named 'documents' within the schema.
  documents: defineTable({
    // Defining a 'title' field as a string.
    title: v.string(),
    // Defining a 'userId' field as a string to associate documents with users.
    userId: v.string(),
    // Defining an 'isArchived' field as a boolean to mark documents as archived or active.
    isArchived: v.boolean(),
    // Defining an optional 'parentDocument' field as a document ID reference, allowing hierarchical document structures.
    parentDocument: v.optional(v.id("documents")),
    // Defining an optional 'content' field as a string to store the document's content.
    content: v.optional(v.string()),
    // Defining an optional 'coverImage' field as a string to store a URL to the document's cover image.
    coverImage: v.optional(v.string()),
    // Defining an optional 'icon' field as a string to store a URL to the document's icon.
    icon: v.optional(v.string()),
    // Defining an 'isPublished' field as a boolean to mark documents as published or unpublished.
    isPublished: v.boolean(),
  })
    // Creating an index named 'by_user' to efficiently query documents by the 'userId' field.
    .index("by_user", ["userId"])
    // Creating an index named 'by_user_parent' to efficiently query documents by both 'userId' and 'parentDocument' fields.
    .index("by_user_parent", ["userId", "parentDocument"]),
});
