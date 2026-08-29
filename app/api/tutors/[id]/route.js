import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const tutor = await prisma.user.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        subject: true,
        option: true,
        rating: true,
        bio: true,
        role: true,
        isAvailable: true,
      },
    });

    if (!tutor || tutor.role !== "tutor") {
      return NextResponse.json({ error: "Tutor not found." }, { status: 404 });
    }

    return NextResponse.json({ tutor }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tutor." },
      { status: 500 }
    );
  }
}