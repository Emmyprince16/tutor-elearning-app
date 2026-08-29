import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const lecturers = [
  { name: "Ojuawo, O. O", subject: "Computer Science (HOD)", rating: 4.9, option: "SWD" },
  { name: "Arowolo, P. O", subject: "Python Programming", rating: 4.8, option: "General" },
  { name: "Oduntan, E. O", subject: "Natural Language Processing", rating: 4.9, option: "AI" },
  { name: "Ayodele, E.", subject: "Machine Learning & AI", rating: 4.8, option: "AI" },
  { name: "Bada, O.", subject: "Neural Language & Bioinformatics", rating: 4.7, option: "SWD" },
  { name: "Alawode, A. J", subject: "Database Management Systems", rating: 4.6, option: "General" },
  { name: "Oloruntoba, S. A", subject: "Computer Networks", rating: 4.6, option: "NCC" },
  { name: "Akinode, J. L", subject: "Web Development", rating: 4.7, option: "SWD" },
  { name: "Hammed, M.", subject: "Data Structures & Algorithms", rating: 4.5, option: "General" },
  { name: "Buoye, P. A", subject: "Cybersecurity Fundamentals", rating: 4.6, option: "Cybersecurity" },
  { name: "Adegboye, O. J", subject: "Cloud Computing", rating: 4.5, option: "NCC" },
  { name: "Ogunseye, J. O", subject: "Operating Systems", rating: 4.6, option: "General" },
];

async function main() {
  const hashedPassword = await bcrypt.hash("FPI2026!", 10);

  for (const lecturer of lecturers) {
    const emailSlug = lecturer.name
      .toLowerCase()
      .replace(/[.,()]/g, "")
      .replace(/\s+/g, ".");
    const email = `${emailSlug}@federalpolyilaro.edu.ng`;

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        firstName: lecturer.name.split(",")[0].trim(),
        middleName: "N/A",
        lastName: lecturer.name.split(",")[1]?.trim() || "",
        email,
        password: hashedPassword,
        role: "tutor",
        subject: lecturer.subject,
        option: lecturer.option,
        rating: lecturer.rating,
      },
    });
  }

  console.log("Tutors seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });