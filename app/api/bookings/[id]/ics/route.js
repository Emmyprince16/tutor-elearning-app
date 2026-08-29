import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

function formatICSDate(date, time) {
  // Combines date (YYYY-MM-DD) and time (HH:MM) into ICS UTC format: YYYYMMDDTHHMMSSZ
  const dt = new Date(`${date}T${time}:00`);
  return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const startUTC = formatICSDate(booking.date, booking.time);

    // Session end time: default to 1 hour after start
    const startDateObj = new Date(`${booking.date}T${booking.time}:00`);
    const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);
    const endUTC = endDateObj.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const nowUTC = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FPI E-Learning//Booking System//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:booking-${booking.id}@fpi-elearning`,
      `DTSTAMP:${nowUTC}`,
      `DTSTART:${startUTC}`,
      `DTEND:${endUTC}`,
      `SUMMARY:Tutoring Session - ${booking.subject}`,
      `DESCRIPTION:Session between ${booking.studentName} and ${booking.tutorName}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT1H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: Your tutoring session starts in 1 hour",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="session-${booking.id}.ics"`,
      },
    });
  } catch (error) {
    console.error("Error generating ICS file:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar file." },
      { status: 500 }
    );
  }
}