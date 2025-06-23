import { mutation } from "./_generated/server";
import { v } from "convex/values";
export const createUser = mutation({
  args: {
    userName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // if user alsrready exist
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    // if notm then insert new user entry
    if (user?.length == 0) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.userName,
        imageUrl: args.imageUrl,
      });

      return "Inserted New User....";
    }
    return "User Already Exits...";
  },
});
