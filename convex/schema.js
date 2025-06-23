import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  }),
  pdfFiles: defineTable({
    fileID: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    createdBy: v.string(),
  }),
  articles: defineTable({
    articleID: v.string(),
    articleContent: v.string(),
    articleName: v.string(),
    creationDate: v.number(),
    createdBy: v.string(),
  }),
});
