import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      role,
      matricNumber,
      level,
      studyMode,
      option,
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword,
        role,
        ...(role === "student" && {
          matricNumber,
          level,
          studyMode: studyMode || null,
          option,
        }),
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: newUser.id },
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