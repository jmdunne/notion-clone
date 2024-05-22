// Importing specific functions from the "convex/values" module for defining argument types in mutations and queries.
import { v } from "convex/values";

// Importing the mutation and query functions from a generated server file to create database mutations and queries.
import { mutation, query } from "./_generated/server";
// Importing types for document and ID from a generated data model file to ensure type safety in our operations.
import { Doc, Id } from "./_generated/dataModel";

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db.query("documents").withIndex("by_user_parent", (q) =>
    q
    .eq("userId", userId)
    .eq("parentDocument", args.parentDocument)
    )
    .filter((q) =>
      q.eq(q.field("isArchived"), false)
    )
    .order("desc")
    .collect();

    return documents;
  },
});

// Defining a mutation called 'create' to insert a new document into the database.
export const create = mutation({
  // Specifying the arguments this mutation accepts: a title and an optional parent document ID.
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  // The handler function that performs the mutation operation.
  handler: async (ctx, args) => {
    // Getting the user identity from the context, which includes authentication information.
    const identity = await ctx.auth.getUserIdentity();

    // If no identity is found, the user is not authenticated, and an error is thrown.
    if (!identity) {
      throw new Error("Not autheticated");
    }

    // Extracting the user ID from the identity object.
    const userId = identity.subject;

    // Inserting a new document into the 'documents' collection with the provided arguments and additional fields.
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    // Returning the newly created document.
    return document;
  },
});
