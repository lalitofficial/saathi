// convex/functions/article.js
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateArticle = mutation({
  args: {
    articleId: v.id("articles"), // ✅ document _id to update
    articleName: v.optional(v.string()),
    articleContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.articleId, {
      // only update fields if they're provided
      ...(args.articleName && { articleName: args.articleName }),
      ...(args.articleContent && { articleContent: args.articleContent }),
    });
  },
});

export const getArticleByID = query({
  args: {
    id: v.id("articles"), // ✅ Convex's built-in ID type
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id); // ✅ get by _id
  },
});
export const getArticles = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("articles")
      .order("desc") // optional: latest articles first
      .collect(); // fetch all results as an array
  },
});
export const createArticle = mutation({
  args: {
    articleID: v.string(),
    articleContent: v.string(),
    articleName: v.string(),
    creationDate: v.number(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("articles", {
      articleID: args.articleID,
      articleContent: args.articleContent,
      articleName: args.articleName,
      creationDate: args.creationDate,
      createdBy: args.createdBy,
    });
  },
});
