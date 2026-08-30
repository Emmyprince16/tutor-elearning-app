import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled"];

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }

    const body = await request.json();
    const { status, tutorId } = body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!tutorId || booking.tutorId !== parseInt(tutorId, 10)) {
      return NextResponse.json(
        { error: "Not authorized to update this booking" },
        { status: 403 }
      );
    }

    const updateData = { status };

    // Generate a session code the first time a booking is confirmed
    if (status === "confirmed" && !booking.sessionCode) {
      updateData.sessionCode = generateCode();
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}