import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ conversations: [] }, { status: 200 });
    }

    const id = parseInt(userId, 10);

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: id }, { receiverId: id }],
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by the "other person" in each message, keeping only the most recent one per person
    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherId = msg.senderId === id ? msg.receiverId : msg.senderId;
      const otherName = msg.senderId === id ? msg.receiverName : msg.senderName;

      if (!conversationsMap.has(otherId)) {
        conversationsMap.set(otherId, {
          otherId,
          otherName,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unread: msg.receiverId === id && !msg.read,
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations." },
      { status: 500 }
    );
  }
}