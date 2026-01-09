import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, userName, imageUrl } = body || {};

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        ...(userName !== undefined ? { userName } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      },
      create: { email, userName, imageUrl },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save user." },
      { status: 500 }
    );
  }
}
