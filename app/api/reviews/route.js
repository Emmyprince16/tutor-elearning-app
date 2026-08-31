import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { studentId, studentName, tutorId, rating, comment } = await request.json();

    if (!studentId || !studentName || !tutorId || !rating) {
      return NextResponse.json(
        { error: "studentId, studentName, tutorId, and rating are required." },
        { status: 400 }
      );
    }

    const ratingNum = parseInt(rating, 10);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    // Confirm the student actually had a confirmed session with this tutor
    const hadSession = await prisma.booking.findFirst({
      where: {
        studentId: parseInt(studentId),
        tutorId: parseInt(tutorId),
        status: "confirmed",
      },
    });

    if (!hadSession) {
      return NextResponse.json(
        { error: "You can only review tutors you've had a confirmed session with." },
        { status: 403 }
      );
    }

    const review = await prisma.review.create({
      data: {
        studentId: parseInt(studentId),
        studentName,
        tutorId: parseInt(tutorId),
        rating: ratingNum,
        comment: comment?.trim() || null,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "You've already reviewed this tutor." },
        { status: 409 }
      );
    }
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorId = searchParams.get("tutorId");

    if (!tutorId) {
      return NextResponse.json({ reviews: [], averageRating: null }, { status: 200 });
    }

    const reviews = await prisma.review.findMany({
      where: { tutorId: parseInt(tutorId, 10) },
      orderBy: { createdAt: "desc" },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    return NextResponse.json({ reviews, averageRating }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}