import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const tutorId = searchParams.get("tutorId");

    if (!studentId || !tutorId) {
      return NextResponse.json({ canReview: false }, { status: 200 });
    }

    const hadSession = await prisma.booking.findFirst({
      where: {
        studentId: parseInt(studentId, 10),
        tutorId: parseInt(tutorId, 10),
        status: "confirmed",
      },
    });

    if (!hadSession) {
      return NextResponse.json({ canReview: false }, { status: 200 });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        studentId_tutorId: {
          studentId: parseInt(studentId, 10),
          tutorId: parseInt(tutorId, 10),
        },
      },
    });

    return NextResponse.json({ canReview: !existingReview }, { status: 200 });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return NextResponse.json({ canReview: false }, { status: 500 });
  }
}