import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { studentId, studentName, tutorId, tutorName, subject, date, time } = await request.json();

    if (!studentId || !studentName || !tutorId || !tutorName || !subject || !date || !time) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check the tutor's current availability before creating the booking
    const tutor = await prisma.user.findUnique({
      where: { id: parseInt(tutorId) },
    });

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found." }, { status: 404 });
    }

    if (!tutor.isAvailable) {
      return NextResponse.json(
        { error: "This tutor is currently unavailable for bookings." },
        { status: 403 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: parseInt(studentId),
        studentName,
        tutorId: parseInt(tutorId),
        tutorName,
        subject,
        date,
        time,
      },
    });

    return NextResponse.json(
      { message: "Session booked successfully", booking },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const tutorName = searchParams.get("tutorName");

    let bookings;

    if (studentId) {
      bookings = await prisma.booking.findMany({
        where: { studentId: parseInt(studentId) },
        orderBy: { date: "asc" },
      });
    } else if (tutorName) {
      bookings = await prisma.booking.findMany({
        where: { tutorName },
        orderBy: { date: "asc" },
      });
    } else {
      bookings = [];
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}