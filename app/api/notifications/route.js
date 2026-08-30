import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ notifications: [] }, { status: 200 });
    }

    const notifications = await prisma.booking.findMany({
      where: {
        studentId: parseInt(studentId, 10),
        notified: false,
        status: { in: ["confirmed", "cancelled", "pending"] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const filtered = notifications.filter(
      (b) => b.status !== "pending" || b.rescheduled
    );

    return NextResponse.json({ notifications: filtered }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { bookingId, studentId } = await request.json();

    if (!bookingId || !studentId) {
      return NextResponse.json(
        { error: "bookingId and studentId are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId, 10) },
    });

    if (!booking || booking.studentId !== parseInt(studentId, 10)) {
      return NextResponse.json(
        { error: "Notification not found or not yours" },
        { status: 404 }
      );
    }

    await prisma.booking.update({
      where: { id: parseInt(bookingId, 10) },
      data: { notified: true },
    });

    return NextResponse.json({ message: "Notification marked as read" }, { status: 200 });
  } catch (error) {
    console.error("Error marking notification read:", error);
    return NextResponse.json(
      { error: "Failed to update notification." },
      { status: 500 }
    );
  }
}