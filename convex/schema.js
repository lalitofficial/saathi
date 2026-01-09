import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  }).index("by_email", ["email"]),
  pdfFiles: defineTable({
    fileID: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    createdBy: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_fileID", ["fileID"]),
  articles: defineTable({
    articleID: v.string(),
    articleContent: v.string(),
    articleName: v.string(),
    creationDate: v.number(),
    createdBy: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_articleID", ["articleID"]),
});
