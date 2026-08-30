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
    });

    // Only include "pending" ones here if they were caused by a reschedule
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
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 });
    }

    await prisma.booking.updateMany({
      where: {
        studentId: parseInt(studentId, 10),
        notified: false,
      },
      data: { notified: true },
    });

    return NextResponse.json({ message: "Notifications marked as read" }, { status: 200 });
  } catch (error) {
    console.error("Error marking notifications read:", error);
    return NextResponse.json(
      { error: "Failed to update notifications." },
      { status: 500 }
    );
  }
}