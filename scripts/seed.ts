import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seed() {
  const { connectDB } = await import("../lib/mongodb");
  const { default: User } = await import("../models/User");
  const bcrypt = await import("bcryptjs");

  await connectDB();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const analystPassword = await bcrypt.hash("analyst123", 10);

  await User.create([
    { email: "analyst@test.com", password: analystPassword, role: "analyst" },
  ]);

  console.log("Seeded analyst user");
  process.exit();
}

seed();