"use client";

import { motion } from "framer-motion";
import {
  Store,
  Construction,
  Wrench,
  ShoppingBag,
  Package,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";

const upcomingFeatures = [
  {
    icon: HeadphonesIcon,
    title: "Gestion SAV",
    description: "Suivez et gérez les demandes de service après-vente de chaque boutique",
  },
  {
    icon: ShoppingBag,
    title: "Pages E-commerce",
    description: "Créez et gérez les boutiques en ligne pour chaque point de vente",
  },
  {
    icon: Package,
    title: "Gestion des stocks",
    description: "Visualisez et synchronisez les stocks entre vos différentes boutiques",
  },
  {
    icon: Wrench,
    title: "Suivi des réparations",
    description: "Gérez les réparations et l'atelier de chaque boutique",
  },
];

export default function StoresClient() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-100 mb-6"
        >
          <Construction className="w-10 h-10 text-stone-600" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          Boutiques
        </motion.h1>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4"
        >
          <Construction className="w-4 h-4" />
          En construction
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 max-w-xl mx-auto"
        >
          Cette section est en cours de développement. Elle permettra de gérer le SAV, 
          les pages e-commerce et les services de chaque boutique.
        </motion.p>
      </div>

      {/* Upcoming Features */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-stone-500" />
          Fonctionnalités à venir
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-stone-50 rounded-xl border border-stone-200 p-6 text-center"
      >
        <Store className="w-8 h-8 text-stone-400 mx-auto mb-3" />
        <p className="text-sm text-stone-600">
          En attendant, vous pouvez gérer les pages de vos boutiques depuis la section{" "}
          <a href="/admin/dashboard/pages" className="font-medium text-stone-900 underline underline-offset-2 hover:text-black">
            Pages
          </a>
        </p>
      </motion.div>
    </div>
  );
}
