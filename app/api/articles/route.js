import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { creationDate: "desc" },
    });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load articles." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { articleName, articleContent = "", createdBy } = body || {};

    if (!articleName) {
      return NextResponse.json(
        { success: false, error: "Article name is required." },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        articleName,
        articleContent,
        createdBy,
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create article." },
      { status: 500 }
    );
  }
}
