import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Define default budget categories
  const categories = [
    { name: "Housing", icon: "🏠", color: "#3B82F6", isDefault: true },
    { name: "Food & Dining", icon: "🍔", color: "#EF4444", isDefault: true },
    { name: "Transportation", icon: "🚗", color: "#F59E0B", isDefault: true },
    { name: "Utilities", icon: "💡", color: "#8B5CF6", isDefault: true },
    { name: "Entertainment", icon: "🎬", color: "#EC4899", isDefault: true },
    { name: "Healthcare", icon: "🏥", color: "#10B981", isDefault: true },
    { name: "Shopping", icon: "🛍️", color: "#F97316", isDefault: true },
    { name: "Personal Care", icon: "💅", color: "#06B6D4", isDefault: true },
    { name: "Education", icon: "📚", color: "#6366F1", isDefault: true },
    { name: "Savings", icon: "💰", color: "#22C55E", isDefault: true },
    { name: "Other", icon: "📦", color: "#6B7280", isDefault: true },
  ];

  // Check if categories already exist
  const existingCount = await prisma.category.count();

  if (existingCount > 0) {
    console.log(
      `  ℹ️  Database already has ${existingCount} categories. Skipping seed.`
    );
    return;
  }

  // Seed categories
  const result = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log(`\n🎉 Successfully seeded ${result.count} categories!`);

  // Display seeded categories
  categories.forEach((cat) => {
    console.log(`  ✅ ${cat.icon} ${cat.name}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
