import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load article." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { articleName, articleContent } = body || {};

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(articleName !== undefined ? { articleName } : {}),
        ...(articleContent !== undefined ? { articleContent } : {}),
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update article." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const article = await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete article." },
      { status: 500 }
    );
  }
}
