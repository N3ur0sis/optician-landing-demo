// Analyze existing page data structure vs expected types
// Run with: npx tsx prisma/analyze-data.ts

import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Expected BlockStyles properties from the new page builder
const EXPECTED_STYLE_KEYS = [
  // Section backgrounds
  "sectionBackgroundColor",
  "sectionBackgroundImage",
  "sectionOverlayColor",
  "sectionOverlayOpacity",
  // Content backgrounds
  "backgroundColor",
  "backgroundImage",
  // Text
  "textColor",
  "textAlign",
  // Typography
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  // Width system (new)
  "widthMode",
  "widthPreset",
  "widthValue",
  "widthUnit",
  // Width (legacy)
  "widthPercent",
  "containerWidth",
  // Height system (new)
  "heightMode",
  "heightPreset",
  "heightValue",
  "heightUnit",
  // Height (legacy)
  "height",
  "minHeight",
  "maxHeight",
  "fullHeight",
  // Alignment
  "alignment",
  "verticalAlign",
  "inline",
  // Padding/Margins
  "sectionPaddingTop",
  "sectionPaddingBottom",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  // Visual effects
  "borderRadius",
  "shadow",
  "animation",
  "animationDelay",
  "customClass",
];

interface BlockAnalysis {
  type: string;
  contentKeys: string[];
  stylesKeys: string[];
  settingsKeys: string[];
  unknownStyleKeys: string[];
  legacyStyleKeys: string[];
  sample: {
    content: unknown;
    styles: unknown;
    settings: unknown;
  };
}

async function analyzeBlocks() {
  console.log("🔍 Analyzing database block structures...\n");

  const pages = await prisma.page.findMany({
    include: {
      blocks: true,
    },
  });

  console.log(`Found ${pages.length} pages\n`);

  const blockAnalysisByType = new Map<string, BlockAnalysis>();
  let totalBlocks = 0;
  let blocksWithLegacyStyles = 0;
  let blocksWithUnknownStyles = 0;

  for (const page of pages) {
    for (const block of page.blocks) {
      totalBlocks++;
      const type = block.type;
      const content = block.content as Record<string, unknown>;
      const styles = (block.styles as Record<string, unknown>) || {};
      const settings = (block.settings as Record<string, unknown>) || {};

      const stylesKeys = Object.keys(styles);
      const unknownStyleKeys = stylesKeys.filter(
        (key) => !EXPECTED_STYLE_KEYS.includes(key)
      );
      const legacyStyleKeys = stylesKeys.filter((key) =>
        [
          "widthPercent",
          "containerWidth",
          "height",
          "minHeight",
          "fullHeight",
        ].includes(key)
      );

      if (unknownStyleKeys.length > 0) blocksWithUnknownStyles++;
      if (legacyStyleKeys.length > 0) blocksWithLegacyStyles++;

      if (!blockAnalysisByType.has(type)) {
        blockAnalysisByType.set(type, {
          type,
          contentKeys: Object.keys(content),
          stylesKeys,
          settingsKeys: Object.keys(settings),
          unknownStyleKeys,
          legacyStyleKeys,
          sample: { content, styles, settings },
        });
      } else {
        // Merge keys
        const existing = blockAnalysisByType.get(type)!;
        existing.contentKeys = [
          ...new Set([...existing.contentKeys, ...Object.keys(content)]),
        ];
        existing.stylesKeys = [
          ...new Set([...existing.stylesKeys, ...stylesKeys]),
        ];
        existing.settingsKeys = [
          ...new Set([...existing.settingsKeys, ...Object.keys(settings)]),
        ];
        existing.unknownStyleKeys = [
          ...new Set([...existing.unknownStyleKeys, ...unknownStyleKeys]),
        ];
        existing.legacyStyleKeys = [
          ...new Set([...existing.legacyStyleKeys, ...legacyStyleKeys]),
        ];
      }
    }
  }

  console.log("=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total blocks: ${totalBlocks}`);
  console.log(`Blocks with legacy styles: ${blocksWithLegacyStyles}`);
  console.log(`Blocks with unknown styles: ${blocksWithUnknownStyles}`);
  console.log(`Block types found: ${blockAnalysisByType.size}`);
  console.log("");

  console.log("=".repeat(60));
  console.log("BLOCK TYPES ANALYSIS");
  console.log("=".repeat(60));

  for (const [type, analysis] of blockAnalysisByType) {
    console.log(`\n📦 ${type}`);
    console.log(`   Content keys: ${analysis.contentKeys.join(", ") || "(none)"}`);
    console.log(`   Styles keys: ${analysis.stylesKeys.join(", ") || "(none)"}`);
    console.log(`   Settings keys: ${analysis.settingsKeys.join(", ") || "(none)"}`);

    if (analysis.unknownStyleKeys.length > 0) {
      console.log(`   ⚠️  Unknown styles: ${analysis.unknownStyleKeys.join(", ")}`);
    }
    if (analysis.legacyStyleKeys.length > 0) {
      console.log(`   🔄 Legacy styles: ${analysis.legacyStyleKeys.join(", ")}`);
    }
  }

  // Show sample data for problematic blocks
  const problematicBlocks = [...blockAnalysisByType.values()].filter(
    (a) => a.unknownStyleKeys.length > 0 || a.legacyStyleKeys.length > 0
  );

  if (problematicBlocks.length > 0) {
    console.log("\n" + "=".repeat(60));
    console.log("BLOCKS REQUIRING MIGRATION");
    console.log("=".repeat(60));

    for (const block of problematicBlocks) {
      console.log(`\n📦 ${block.type} - Sample data:`);
      console.log("   Styles:", JSON.stringify(block.sample.styles, null, 2));
    }
  }

  await prisma.$disconnect();
}

analyzeBlocks().catch(console.error);
