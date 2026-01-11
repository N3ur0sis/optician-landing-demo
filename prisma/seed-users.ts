/**
 * Seed initial admin and webmaster users
 * Run: npx tsx prisma/seed-users.ts
 */

import bcrypt from "bcryptjs"

async function seedUsers() {
  // Dynamic imports for proper module resolution
  const { PrismaClient } = await import("./generated/prisma/client")
  const { PrismaPg } = await import("@prisma/adapter-pg")
  
  const adapter = new PrismaPg({ 
    connectionString: process.env.DATABASE_URL 
  })
  const prisma = new PrismaClient({ adapter })

  console.log("🔐 Seeding users...")

  // Admin user (full access)
  const adminPassword = await bcrypt.hash("Admin@ODB2024!", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@optiquedebourbon.re" },
    update: {
      password: adminPassword,
      name: "Administrateur ODB",
      role: "ADMIN",
    },
    create: {
      email: "admin@optiquedebourbon.re",
      password: adminPassword,
      name: "Administrateur ODB",
      role: "ADMIN",
    },
  })
  console.log(`  ✅ Admin créé: ${admin.email}`)

  // Webmaster user (content management only)
  const webmasterPassword = await bcrypt.hash("Webmaster@ODB2024!", 12)
  const webmaster = await prisma.user.upsert({
    where: { email: "webmaster@optiquedebourbon.re" },
    update: {
      password: webmasterPassword,
      name: "Webmaster ODB",
      role: "WEBMASTER",
    },
    create: {
      email: "webmaster@optiquedebourbon.re",
      password: webmasterPassword,
      name: "Webmaster ODB",
      role: "WEBMASTER",
    },
  })
  console.log(`  ✅ Webmaster créé: ${webmaster.email}`)

  // Seed default settings
  console.log("\n⚙️ Seeding default settings...")
  
  const defaultSettings = [
    { key: "site_name", value: "Optique de Bourbon" },
    { key: "site_description", value: "Opticien de luxe à La Réunion depuis 1988" },
    { key: "contact_email", value: "contact@optiquedebourbon.re" },
    { key: "contact_phone", value: "0262 XX XX XX" },
    { key: "contact_address", value: "Saint-Denis, La Réunion" },
    { key: "social_facebook", value: "https://facebook.com/optiquedebourbon" },
    { key: "social_instagram", value: "https://instagram.com/optiquedebourbon" },
    { key: "seo_title_suffix", value: " | Optique de Bourbon" },
    { key: "seo_default_description", value: "Découvrez les collections de lunettes de luxe chez Optique de Bourbon, votre opticien de référence à La Réunion depuis 1988." },
    { key: "seo_keywords", value: "opticien, lunettes, luxe, La Réunion, Saint-Denis, optique, créateurs" },
    { key: "analytics_enabled", value: true },
    { key: "maintenance_mode", value: false },
  ]

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    })
  }
  console.log(`  ✅ ${defaultSettings.length} paramètres configurés`)

  await prisma.$disconnect()

  console.log("\n" + "=".repeat(50))
  console.log("✨ Seed terminé avec succès!")
  console.log("=".repeat(50))
  console.log("\n📋 Comptes créés:")
  console.log("  Admin:")
  console.log("    Email: admin@optiquedebourbon.re")
  console.log("    Mot de passe: Admin@ODB2024!")
  console.log("  Webmaster:")
  console.log("    Email: webmaster@optiquedebourbon.re")
  console.log("    Mot de passe: Webmaster@ODB2024!")
  console.log("\n⚠️  IMPORTANT: Changez ces mots de passe en production!\n")
}

seedUsers()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e)
    process.exit(1)
  })
