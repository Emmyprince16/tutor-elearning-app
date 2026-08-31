import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { senderId, senderName, receiverId, receiverName, content } = await request.json();

    if (!senderId || !senderName || !receiverId || !receiverName || !content?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: parseInt(senderId),
        senderName,
        receiverId: parseInt(receiverId),
        receiverName,
        content: content.trim(),
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const otherUserId = searchParams.get("otherUserId");

    if (!userId || !otherUserId) {
      return NextResponse.json({ error: "userId and otherUserId are required." }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId), receiverId: parseInt(otherUserId) },
          { senderId: parseInt(otherUserId), receiverId: parseInt(userId) },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}