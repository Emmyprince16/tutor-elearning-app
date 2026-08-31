import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request) {
  try {
    const { studentId, studentName, tutorId, tutorName, subject, date, time } = await request.json();

    if (!studentId || !studentName || !tutorId || !tutorName || !subject || !date || !time) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

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

    // Prevent double-booking: block if the tutor already has a CONFIRMED session at this exact date+time
    const conflict = await prisma.booking.findFirst({
      where: {
        tutorId: parseInt(tutorId),
        date,
        time,
        status: "confirmed",
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "This tutor already has a confirmed session at that date and time. Please choose another slot." },
        { status: 409 }
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
        roomId: randomUUID(),
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