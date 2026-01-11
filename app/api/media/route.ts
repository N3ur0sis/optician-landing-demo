import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/media - List all media files with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || ''; // image, video, document
    const sortBy = searchParams.get('sortBy') || 'uploadedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type === 'image') {
      where.mimeType = { startsWith: 'image/' };
    } else if (type === 'video') {
      where.mimeType = { startsWith: 'video/' };
    } else if (type === 'document') {
      where.mimeType = { 
        notIn: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm'] 
      };
    }

    // Get total count
    const total = await prisma.media.count({ where });

    // Get media items
    const media = await prisma.media.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// POST /api/media - Upload new media file(s)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const maxSize = 50 * 1024 * 1024; // 50MB

    const uploadedMedia = [];

    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type not allowed: ${file.type}` },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum size is 50MB` },
          { status: 400 }
        );
      }

      // Generate storage path: /uploads/YYYY/MM/
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', String(year), month);

      // Create directory if it doesn't exist
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const filename = `${baseName}-${uniqueSuffix}${ext}`;

      // Write file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      // Get image dimensions if applicable
      let width: number | null = null;
      let height: number | null = null;

      if (file.type.startsWith('image/')) {
        try {
          // Try to get dimensions from the image
          // For production, you'd use sharp or similar
          // For now, we'll leave dimensions null and update later if needed
        } catch (e) {
          // Dimensions extraction failed, continue without them
        }
      }

      // Create database record
      const storagePath = `/uploads/${year}/${month}/${filename}`;
      const media = await prisma.media.create({
        data: {
          filename: file.name,
          path: storagePath,
          url: storagePath, // Same as path for local storage
          mimeType: file.type,
          size: file.size,
          width,
          height,
        },
      });

      uploadedMedia.push(media);
    }

    return NextResponse.json({
      success: true,
      media: uploadedMedia,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}
