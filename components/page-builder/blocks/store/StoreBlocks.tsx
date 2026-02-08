"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Star, Clock, Calendar, ExternalLink } from "lucide-react";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import type { BlockContentProps } from "../types";

// ============================================
// STORE LIST BLOCK
// ============================================

interface Store {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating: number;
  reviews: number;
}

interface StoreListBlockContent {
  title?: string;
  subtitle?: string;
  columns?: number;
  showRating?: boolean;
  showPhone?: boolean;
}

export function StoreListBlock({ content }: BlockContentProps<StoreListBlockContent>) {
  const { isEditing } = usePageBuilder();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const title = content.title;
  const subtitle = content.subtitle;
  const columns = content.columns || 3;
  const showRating = content.showRating !== false;
  const showPhone = content.showPhone !== false;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/stores");
        if (response.ok) {
          const data = await response.json();
          setStores(data.stores || []);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStores();
  }, []);

  const columnClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {title && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-lg opacity-70">{subtitle}</p>}
          </div>
        )}
        <div className={`grid ${columnClasses[columns] || columnClasses[3]} gap-6`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-4/3 bg-white/10" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-lg opacity-70">{subtitle}</p>}
        </div>
      )}
      <div className={`grid ${columnClasses[columns] || columnClasses[3]} gap-6`}>
        {stores.map((store) => (
          isEditing ? (
            <div
              key={store.id}
              className="group bg-white/5 rounded-2xl overflow-hidden opacity-70 cursor-not-allowed"
            >
              {/* Store Image */}
              <div className="aspect-4/3 bg-linear-to-br from-amber-900/20 to-neutral-900/40 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-amber-500/50" />
                </div>
              </div>

              {/* Store Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {store.name}
                </h3>

                <div className="space-y-2 text-sm opacity-70">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{store.address}</span>
                  </div>

                  {showPhone && store.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                </div>

                {showRating && store.rating > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold">{store.rating}</span>
                    </div>
                    <span className="text-sm opacity-50">({store.reviews} avis)</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              key={store.id}
              href={`/magasins/${store.id}`}
              className="group bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Store Image */}
              <div className="aspect-4/3 bg-linear-to-br from-amber-900/20 to-neutral-900/40 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-amber-500/50" />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Store Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  {store.name}
                </h3>

                <div className="space-y-2 text-sm opacity-70">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{store.address}</span>
                  </div>

                  {showPhone && store.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                </div>

                {showRating && store.rating > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold">{store.rating}</span>
                    </div>
                    <span className="text-sm opacity-50">({store.reviews} avis)</span>
                  </div>
                )}
              </div>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}

// ============================================
// STORE HERO BLOCK
// ============================================

interface StoreHeroBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  buttons?: Array<{
    label: string;
    href: string;
    variant?: string;
    openInNewTab?: boolean;
  }>;
}

export function StoreHeroBlock({ content }: BlockContentProps<StoreHeroBlockContent>) {
  const { isEditing } = usePageBuilder();
  const title = content.title;
  const subtitle = content.subtitle;
  const description = content.description;
  const backgroundImage = content.backgroundImage;
  const buttons = content.buttons || [];

  return (
    <motion.section
      className="relative h-96 bg-linear-to-r from-neutral-900 to-neutral-800 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 25px 25px, white 2%, transparent 0%)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MapPin className="w-6 h-6 text-amber-400" />
            <span className="text-lg opacity-90">Votre magasin</span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-field="title"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="text-xl opacity-90 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              data-field="subtitle"
            >
              {subtitle}
            </motion.p>
          )}
          {description && (
            <motion.p
              className="text-lg opacity-80 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-field="description"
            >
              {description}
            </motion.p>
          )}
          {buttons.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {buttons.map((btn, idx) => (
                isEditing ? (
                  <span
                    key={idx}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 opacity-70 cursor-not-allowed ${
                      btn.variant === "secondary"
                        ? "bg-white/10 backdrop-blur-sm text-white border border-white/30"
                        : "bg-amber-500 text-black"
                    }`}
                    data-item-index={idx}
                    data-child-type="button"
                  >
                    {btn.label}
                  </span>
                ) : (
                  <Link
                    key={idx}
                    href={btn.href || "#"}
                    target={btn.openInNewTab ? "_blank" : undefined}
                    rel={btn.openInNewTab ? "noopener noreferrer" : undefined}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      btn.variant === "secondary"
                        ? "bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30"
                        : "bg-amber-500 hover:bg-amber-600 text-black"
                    }`}
                    data-item-index={idx}
                    data-child-type="button"
                  >
                    {btn.label}
                  </Link>
                )
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

// ============================================
// STORE CONTACT BLOCK
// ============================================

interface StoreContactBlockContent {
  title?: string;
  address?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  hours?: Record<string, string>;
}

export function StoreContactBlock({ content }: BlockContentProps<StoreContactBlockContent>) {
  const title = content.title || "Informations de contact";
  const address = content.address;
  const phone = content.phone;
  const phone2 = content.phone2;
  const email = content.email;
  const hours = content.hours || {};

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center" data-field="title">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h2>
      <div className="h-px w-16 bg-linear-to-r from-amber-300 to-amber-100 mb-6"></div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {address && (
            <div className="flex items-start gap-3 group">
              <MapPin className="w-5 h-5 text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h3 className="font-semibold text-neutral-900">Adresse</h3>
                <p className="text-neutral-600 whitespace-pre-line" data-field="address">{address}</p>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex items-start gap-3 group">
              <Phone className="w-5 h-5 text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h3 className="font-semibold text-neutral-900">Téléphone</h3>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-amber-700 hover:text-amber-900 transition-colors duration-300 block"
                  data-field="phone"
                >
                  {phone}
                </a>
                {phone2 && (
                  <a
                    href={`tel:${phone2.replace(/\s/g, "")}`}
                    className="text-amber-700 hover:text-amber-900 transition-colors duration-300 block"
                    data-field="phone2"
                  >
                    {phone2}
                  </a>
                )}
              </div>
            </div>
          )}
          {email && (
            <div className="flex items-start gap-3 group">
              <Mail className="w-5 h-5 text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h3 className="font-semibold text-neutral-900">Email</h3>
                <a
                  href={`mailto:${email}`}
                  className="text-amber-700 hover:text-amber-900 transition-colors duration-300"
                  data-field="email"
                >
                  {email}
                </a>
              </div>
            </div>
          )}
        </div>
        {Object.keys(hours).length > 0 && (
          <div>
            <div className="flex items-start gap-3 group">
              <Clock className="w-5 h-5 text-amber-500 mt-1 opacity-80" />
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 mb-3">Horaires d'ouverture</h3>
                <div className="space-y-2">
                  {Object.entries(hours).map(([day, hoursValue]) => (
                    <div key={day} className="flex justify-between border-b border-neutral-100 pb-1">
                      <span className="text-neutral-600">{day}</span>
                      <span className="font-medium text-neutral-800">{hoursValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// STORE SERVICES BLOCK
// ============================================

interface StoreServicesBlockContent {
  title?: string;
  subtitle?: string;
  services?: string[];
}

export function StoreServicesBlock({ content }: BlockContentProps<StoreServicesBlockContent>) {
  const title = content.title || "Nos services";
  const subtitle = content.subtitle;
  const services = content.services || [];

  if (services.length === 0) return null;

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-2 text-neutral-900 flex items-center" data-field="title">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h2>
      {subtitle && <p className="text-neutral-600 mb-4" data-field="subtitle">{subtitle}</p>}
      <div className="h-px w-16 bg-linear-to-r from-amber-300 to-amber-100 mb-6"></div>
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={service}
            className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg hover:bg-amber-50 transition-colors duration-300 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            whileHover={{ x: 5 }}
            data-item-index={index}
            data-child-type="service"
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <span className="font-medium text-neutral-800 group-hover:text-amber-700 transition-colors duration-300">
              {service}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// STORE CTA BLOCK
// ============================================

interface StoreCtaBlockContent {
  title?: string;
  rdvUrl?: string;
  rdvLabel?: string;
  phone?: string;
  phoneLabel?: string;
}

export function StoreCtaBlock({ content }: BlockContentProps<StoreCtaBlockContent>) {
  const title = content.title || "Prendre rendez-vous";
  const rdvUrl = content.rdvUrl;
  const rdvLabel = content.rdvLabel || "JE PRENDS RDV EN LIGNE";
  const phone = content.phone;
  const phoneLabel = content.phoneLabel || "APPELER LE MAGASIN";

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center" data-field="title">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h3>
      <div className="space-y-4">
        {rdvUrl && (
          <motion.a
            href={rdvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-neutral-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-500 flex items-center justify-center gap-2 shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
            whileTap={{ y: 0 }}
          >
            <Calendar className="w-5 h-5" />
            <span data-field="rdvLabel">{rdvLabel}</span>
          </motion.a>
        )}
        {phone && (
          <motion.a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="w-full border-2 border-neutral-800 text-neutral-900 py-4 px-6 rounded-lg font-semibold hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Phone className="w-5 h-5" />
            <span data-field="phoneLabel">{phoneLabel}</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// STORE REVIEWS BLOCK
// ============================================

interface StoreReviewsBlockContent {
  title?: string;
  rating?: number;
  reviewCount?: number;
  source?: string;
}

export function StoreReviewsBlock({ content }: BlockContentProps<StoreReviewsBlockContent>) {
  const title = content.title || "Avis clients";
  const rating = content.rating || 0;
  const reviewCount = content.reviewCount || 0;
  const source = content.source;

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center" data-field="title">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h3>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-neutral-300"}`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-neutral-900">{rating}/5</span>
        </div>
        <p className="text-neutral-600 mb-4">Sur {reviewCount} avis vérifiés</p>
        {source && (
          <motion.button
            className="text-amber-700 hover:text-amber-900 font-medium border-b-2 border-transparent hover:border-amber-300 transition-all duration-300"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {source}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// STORE MAP BLOCK
// ============================================

interface StoreMapBlockContent {
  title?: string;
  address?: string;
  mapUrl?: string;
  embedUrl?: string;
}

export function StoreMapBlock({ content }: BlockContentProps<StoreMapBlockContent>) {
  const title = content.title || "Localisation";
  const address = content.address;
  const mapUrl = content.mapUrl;
  const embedUrl = content.embedUrl;

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center" data-field="title">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h3>
      {embedUrl ? (
        <div className="aspect-square rounded-lg overflow-hidden">
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
      ) : (
        <motion.div
          className="aspect-square bg-linear-to-br from-neutral-100 to-neutral-200 rounded-lg flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <MapPin className="w-16 h-16 text-amber-500/50 mb-4" />
          <p className="text-neutral-600 text-center px-4 mb-4" data-field="address">{address}</p>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors"
            >
              Voir sur Google Maps
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================
// STORE LAYOUT BLOCK
// ============================================

interface StoreContactInfo {
  title?: string;
  address?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  hours?: Record<string, string>;
}

interface StoreServices {
  title?: string;
  subtitle?: string;
  items?: string[];
}

interface StoreSpecialty {
  title: string;
  icon?: string;
  description?: string;
}

interface StoreSpecialties {
  title?: string;
  items?: StoreSpecialty[];
}

interface StoreCta {
  title?: string;
  rdvUrl?: string;
  rdvLabel?: string;
  phone?: string;
  phoneLabel?: string;
}

interface StoreReviews {
  title?: string;
  rating?: number;
  reviewCount?: number;
  source?: string;
}

interface StoreMap {
  title?: string;
  address?: string;
  mapUrl?: string;
}

interface StoreGallery {
  title?: string;
  images?: string[];
}

interface StoreLayoutBlockContent {
  contact?: StoreContactInfo;
  services?: StoreServices;
  specialties?: StoreSpecialties;
  cta?: StoreCta;
  reviews?: StoreReviews;
  map?: StoreMap;
  gallery?: StoreGallery;
}

export function StoreLayoutBlock({ content }: BlockContentProps<StoreLayoutBlockContent>) {
  const contact = content.contact;
  const services = content.services;
  const specialties = content.specialties;
  const cta = content.cta;
  const reviews = content.reviews;
  const map = content.map;
  const gallery = content.gallery;

  return (
    <div className="bg-linear-to-b from-neutral-50 to-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-column layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            {contact && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
                  {String(contact.title || "Informations de contact")}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {Boolean(contact.address) && (
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                          <MapPin className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">Adresse</h3>
                          <p className="text-neutral-600 whitespace-pre-line">{String(contact.address)}</p>
                        </div>
                      </div>
                    )}
                    {Boolean(contact.phone) && (
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Phone className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">Téléphone</h3>
                          <a
                            href={`tel:${String(contact.phone).replace(/\s/g, "")}`}
                            className="text-amber-700 hover:text-amber-900 transition-colors block font-medium"
                          >
                            {String(contact.phone)}
                          </a>
                          {Boolean(contact.phone2) && (
                            <a
                              href={`tel:${String(contact.phone2).replace(/\s/g, "")}`}
                              className="text-amber-700 hover:text-amber-900 transition-colors block"
                            >
                              {String(contact.phone2)}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    {Boolean(contact.email) && (
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                          <a
                            href={`mailto:${String(contact.email)}`}
                            className="text-amber-700 hover:text-amber-900 transition-colors font-medium"
                          >
                            {String(contact.email)}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  {contact.hours && Object.keys(contact.hours).length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 mb-3">Horaires d'ouverture</h3>
                        <div className="space-y-2">
                          {Object.entries(contact.hours).map(([day, hoursValue]) => (
                            <div key={day} className="flex justify-between py-1.5 border-b border-neutral-100 last:border-0">
                              <span className="text-neutral-600">{day}</span>
                              <span className="font-medium text-neutral-900">{String(hoursValue)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Services */}
            {services && services.items && services.items.length > 0 && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-neutral-900 flex items-center">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
                  {String(services.title || "Nos services")}
                </h2>
                {Boolean(services.subtitle) && (
                  <p className="text-neutral-600 mb-6 ml-6">{String(services.subtitle)}</p>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.items.map((service, idx) => (
                    <motion.div
                      key={service}
                      className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl hover:bg-amber-50 transition-all duration-300 group cursor-default"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                      <span className="font-medium text-neutral-800 group-hover:text-amber-800 transition-colors">
                        {service}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Specialties */}
            {specialties && specialties.items && specialties.items.length > 0 && (
              <motion.div
                className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-6 lg:p-8 border border-amber-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
                  {String(specialties.title || "Nos spécialités")}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {specialties.items.map((spec, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
                        <Star className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-neutral-900 mb-1">{spec.title}</h3>
                      {spec.description && (
                        <p className="text-sm text-neutral-600">{spec.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="space-y-6">
            {/* CTA - Prendre RDV */}
            {cta && (
              <motion.div
                className="bg-neutral-900 rounded-2xl p-6 lg:p-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Calendar className="w-5 h-5 text-amber-400 mr-2" />
                  {String(cta.title || "Prendre rendez-vous")}
                </h3>
                <div className="space-y-4">
                  {Boolean(cta.rdvUrl) && (
                    <motion.a
                      href={String(cta.rdvUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>{String(cta.rdvLabel || "Réserver en ligne")}</span>
                    </motion.a>
                  )}
                  {Boolean(cta.phone) && (
                    <motion.a
                      href={`tel:${String(cta.phone).replace(/\s/g, "")}`}
                      className="w-full border-2 border-white/30 hover:border-white/60 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Phone className="w-5 h-5" />
                      <span>{String(cta.phoneLabel || "Appeler")}</span>
                    </motion.a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {reviews && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h3 className="text-lg font-bold mb-4 text-neutral-900 flex items-center">
                  <Star className="w-5 h-5 text-amber-500 mr-2" />
                  {String(reviews.title || "Avis clients")}
                </h3>
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(Number(reviews.rating) || 0) ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                      />
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 mb-1">
                    {Number(reviews.rating) || 0}
                    <span className="text-lg text-neutral-400">/5</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {Number(reviews.reviewCount) || 0} avis vérifiés
                  </p>
                  {Boolean(reviews.source) && (
                    <button className="mt-4 text-amber-700 hover:text-amber-900 font-medium text-sm underline-offset-4 hover:underline transition-all">
                      {String(reviews.source)}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Map */}
            {map && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="p-6 pb-4">
                  <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                    <MapPin className="w-5 h-5 text-amber-500 mr-2" />
                    {String(map.title || "Localisation")}
                  </h3>
                </div>
                <div className="aspect-4/3 bg-linear-to-br from-neutral-100 to-neutral-200 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <MapPin className="w-12 h-12 text-amber-500/60 mb-3" />
                    <p className="text-neutral-600 text-center text-sm mb-4 whitespace-pre-line">
                      {String(map.address || "")}
                    </p>
                    {Boolean(map.mapUrl) && (
                      <a
                        href={String(map.mapUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Voir sur Maps
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Gallery - Full Width */}
        {gallery && gallery.images && gallery.images.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
              {String(gallery.title || "Découvrez notre magasin")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.images.map((img, idx) => (
                <motion.div
                  key={idx}
                  className="aspect-4/3 rounded-xl overflow-hidden relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={img}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Export all store blocks
export const StoreBlocks = {
  storeList: StoreListBlock,
  storeHero: StoreHeroBlock,
  storeContact: StoreContactBlock,
  storeServices: StoreServicesBlock,
  storeCta: StoreCtaBlock,
  storeReviews: StoreReviewsBlock,
  storeMap: StoreMapBlock,
  storeLayout: StoreLayoutBlock,
};

export default StoreBlocks;
