const mongoose = require("mongoose");
const connectDb = require("../db");
const { seedDemoData } = require("./demoData");

async function seed() {
  await connectDb();
  await seedDemoData({ reset: true });

  console.log("Seed completed.");
  console.log("Demo accounts:");
  console.log("employee@example.com / password123");
  console.log("manager@example.com / password123");
  console.log("admin@example.com / password123");
  console.log("decision@example.com / password123");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
