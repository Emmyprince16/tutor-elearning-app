import { prisma } from "../../lib/prisma";
import { resend } from "../../lib/resend";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return a generic success message, even if the email doesn't exist —
    // this prevents someone from using this form to check which emails are registered.
    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    const resetToken = randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const resetLink = `${origin}/reset-password/${resetToken}`;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your FPI E-Learning password",
        html: `
          <p>Hi ${user.firstName},</p>
          <p>Click the link below to reset your password. This link expires in 1 hour.</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending reset email:", emailError);
      // Don't reveal the email failure to the client — same generic message either way
    }

    return NextResponse.json(
      { message: "If that email exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}