import { mutation } from "./_generated/server";
import { v } from "convex/values";
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addFileEntryToDb = mutation({
  args: {
    fileID: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFiles", {
      fileID: args.fileID,
      storageId: args.storageId,
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      createdBy: args.createdBy,
    });
    return "Inserted";
  },
});

export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});
