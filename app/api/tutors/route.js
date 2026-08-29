import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tutors = await prisma.user.findMany({
      where: { role: "tutor" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        subject: true,
        option: true,
        rating: true,
        bio: true,
      },
    });

    return NextResponse.json({ tutors }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tutors." },
      { status: 500 }
    );
  }
}