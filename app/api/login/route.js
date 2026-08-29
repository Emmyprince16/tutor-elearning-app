import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 400 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 400 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
        {
          error: `This account is registered as a ${user.role}. Please select "${user.role === "tutor" ? "Tutor" : "Student"}" and try again.`,
        },
        { status: 400 }
      );
    }
    
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Login successful", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}