import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

export async function POST(request) {
  try {
    const { tutorId, tutorName } = await request.json();

    if (!tutorId || !tutorName) {
      return NextResponse.json({ error: "Tutor info is required." }, { status: 400 });
    }

    let code;
    let attempts = 0;

    // Ensure the code is unique, retry a few times on collision (rare with 6 digits)
    while (attempts < 5) {
      code = generateCode();
      const existing = await prisma.quickSession.findUnique({ where: { code } });
      if (!existing) break;
      attempts++;
    }

    const session = await prisma.quickSession.create({
      data: {
        tutorId: parseInt(tutorId),
        tutorName,
        code,
        roomId: randomUUID(),
      },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("Error creating quick session:", error);
    return NextResponse.json(
      { error: "Failed to generate session code." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code is required." }, { status: 400 });
    }

    const session = await prisma.quickSession.findUnique({
      where: { code },
    });

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 404 });
    }

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    console.error("Error looking up quick session:", error);
    return NextResponse.json(
      { error: "Failed to look up session." },
      { status: 500 }
    );
  }
}