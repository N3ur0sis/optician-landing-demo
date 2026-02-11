"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import type { BlockContentProps } from "../types";

// ============================================
// MAP BLOCK
// ============================================

interface MapBlockContent {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number;
  title?: string;
  embedUrl?: string;
  mapUrl?: string;
}

export function MapBlock({ content }: BlockContentProps<MapBlockContent>) {
  const address = content.address;
  const lat = content.lat;
  const lng = content.lng;
  const zoom = content.zoom || 14;
  const height = content.height || 400;
  const embedUrl = content.embedUrl;

  // If embedUrl is provided directly, use it
  if (embedUrl) {
    return (
      <div className="rounded-lg overflow-hidden" style={{ height }}>
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  // If we have coordinates, use them; otherwise try to use address
  const mapUrl =
    lat && lng
      ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=${zoom}`
      : address
        ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}`
        : null;

  if (!mapUrl) {
    return (
      <div
        className="bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucune adresse ou coordonnées</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

// ============================================
// SOCIAL BLOCK
// ============================================

interface SocialBlockContent {
  embedCode?: string;
  url?: string;
  platform?: string;
  title?: string;
}

export function SocialBlock({ content }: BlockContentProps<SocialBlockContent>) {
  const { isEditing } = usePageBuilder();
  const embedCode = content.embedCode;
  const url = content.url;
  const platform = content.platform;

  if (embedCode) {
    return (
      <div
        className="social-embed"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    );
  }

  if (url) {
    return (
      <div className="text-center p-8 bg-white/5 rounded-lg">
        <p className="opacity-70 mb-4">Contenu {platform || "social"}</p>
        {isEditing ? (
          <span className="inline-block px-4 py-2 bg-white text-black rounded opacity-70 cursor-not-allowed">
            Voir sur {platform || "le réseau"}
          </span>
        ) : (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-white text-black rounded hover:bg-white/90 transition-colors"
          >
            Voir sur {platform || "le réseau"}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-200 text-gray-500 text-center rounded-lg">
      Aucun contenu social configuré
    </div>
  );
}

// Export all embeds blocks
export const EmbedsBlocks = {
  map: MapBlock,
  social: SocialBlock,
};

export default EmbedsBlocks;
