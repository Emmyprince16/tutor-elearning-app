import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { id, bio, subject, option } = await request.json();

    const updatedTutor = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { bio, subject, option },
    });

    const { password: _, ...tutorWithoutPassword } = updatedTutor;

    return NextResponse.json(
      { message: "Profile updated successfully", tutor: tutorWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}