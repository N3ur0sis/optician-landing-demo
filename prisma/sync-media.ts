/**
 * Script to sync existing uploaded files with the database
 * Run with: npx tsx prisma/sync-media.ts
 */

import prisma from '../lib/prisma';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Simple mime type lookup based on extension
function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Supported file extensions
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.pdf', '.doc', '.docx'];

function scanDirectory(dirPath: string, basePath: string = ''): { path: string; fullPath: string }[] {
  const files: { path: string; fullPath: string }[] = [];
  
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        files.push(...scanDirectory(fullPath, relativePath));
      } else if (entry.isFile()) {
        // Check if it's a supported file type
        const ext = entry.name.substring(entry.name.lastIndexOf('.')).toLowerCase();
        if (supportedExtensions.includes(ext) && entry.name !== '.gitkeep') {
          files.push({ path: relativePath, fullPath });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return files;
}

async function syncMedia() {
  console.log('🔍 Scanning uploads directory...\n');
  
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  const files = scanDirectory(uploadsDir);
  
  if (files.length === 0) {
    console.log('📭 No files found in uploads directory.');
    return;
  }
  
  console.log(`📁 Found ${files.length} file(s) in uploads directory.\n`);
  
  // Get existing media records
  const existingMedia = await prisma.media.findMany({
    select: { path: true },
  });
  const existingPaths = new Set(existingMedia.map(m => m.path));
  
  let created = 0;
  let skipped = 0;
  
  for (const file of files) {
    const storagePath = `/uploads/${file.path}`;
    
    // Skip if already exists in database
    if (existingPaths.has(storagePath)) {
      console.log(`⏭️  Skipping (already exists): ${file.path}`);
      skipped++;
      continue;
    }
    
    // Get file stats
    const stats = statSync(file.fullPath);
    const mimeType = getMimeType(file.fullPath);
    
    // Extract filename from path
    const filename = file.path.split('/').pop() || file.path;
    
    try {
      await prisma.media.create({
        data: {
          filename,
          path: storagePath,
          url: storagePath,
          mimeType,
          size: stats.size,
        },
      });
      
      console.log(`✅ Created: ${file.path}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating record for ${file.path}:`, error);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   - Created: ${created}`);
  console.log(`   - Skipped: ${skipped}`);
  console.log(`   - Total files: ${files.length}`);
}

async function main() {
  console.log('🔄 Starting media sync...\n');
  
  try {
    await syncMedia();
    console.log('\n✅ Media sync completed!');
  } catch (error) {
    console.error('Error during sync:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
