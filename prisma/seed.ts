// TODO: Implement database seed script
// This will populate the database with default categories:
// - Housing
// - Food & Dining
// - Transportation
// - Utilities
// - Entertainment
// - Healthcare
// - Shopping
// - Personal Care
// - Education
// - Savings
// - Other

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // TODO: Add seed logic here
  console.log("Seeding database...");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
