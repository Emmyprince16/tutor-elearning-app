import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const option = searchParams.get("option");
    const level = searchParams.get("level");
    const studyMode = searchParams.get("studyMode");

    const students = await prisma.user.findMany({
      where: {
        role: "student",
        ...(option && { option }),
        ...(level && { level }),
        ...(studyMode && { studyMode }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        matricNumber: true,
        level: true,
        studyMode: true,
        option: true,
      },
      orderBy: { lastName: "asc" },
    });

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students." },
      { status: 500 }
    );
  }
}