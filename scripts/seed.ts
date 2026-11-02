import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seed() {
  const { connectDB } = await import("../lib/mongodb");
  const { default: User } = await import("../models/User");
  const bcrypt = await import("bcryptjs");

  await connectDB();
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({ email: "admin@test.com", password: hashedPassword, role: "admin" });
  console.log("Seeded admin user");
  process.exit();
}

seed();