import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { studentId, tutorName, subject, date, time } = await request.json();

    if (!studentId || !tutorName || !subject || !date || !time) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: parseInt(studentId),
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