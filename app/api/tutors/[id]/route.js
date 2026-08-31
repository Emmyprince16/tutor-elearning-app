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

    const reviews = await prisma.review.findMany({
      where: { tutorId: tutor.id },
      orderBy: { createdAt: "desc" },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : tutor.rating;

    return NextResponse.json(
      { tutor: { ...tutor, rating: averageRating, reviewCount: reviews.length }, reviews },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tutor." },
      { status: 500 }
    );
  }
}