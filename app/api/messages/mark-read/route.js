import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const { userId, otherUserId } = await request.json();

    if (!userId || !otherUserId) {
      return NextResponse.json({ error: "userId and otherUserId are required." }, { status: 400 });
    }

    await prisma.message.updateMany({
      where: {
        senderId: parseInt(otherUserId, 10),
        receiverId: parseInt(userId, 10),
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ message: "Marked as read" }, { status: 200 });
  } catch (error) {
    console.error("Error marking messages read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages read." },
      { status: 500 }
    );
  }
}