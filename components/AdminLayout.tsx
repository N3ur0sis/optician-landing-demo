"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Grid3x3,
  Settings,
  LogOut,
  User,
  FileText,
  Navigation,
  Image as ImageIcon,
  BarChart3,
  Users,
  Palette,
  Store,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { hasPermission, DashboardFeature, parsePermissions } from "@/types/permissions";

interface AdminLayoutProps {
  children: React.ReactNode;
  session: Session;
}

export default function AdminLayout({ children, session }: AdminLayoutProps) {
  const isAdmin = session.user?.role === "ADMIN";
  const userPermissions = parsePermissions(session.user?.permissions);

  // Helper function to check if user has access to a feature
  const canAccess = (feature: DashboardFeature): boolean => {
    return hasPermission(session.user?.role as "ADMIN" | "WEBMASTER", userPermissions, feature);
  };

  // Build links based on permissions
  const allLinks = [
    {
      label: "Tableau de Bord",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="text-black h-5 w-5 shrink-0" />,
      alwaysShow: true, // Dashboard is always visible
    },
    {
      label: "Pages",
      href: "/admin/dashboard/pages",
      icon: <FileText className="text-black h-5 w-5 shrink-0" />,
      feature: "pages" as DashboardFeature,
    },
    {
      label: "Gestionnaire de Grille",
      href: "/admin/dashboard/grid",
      icon: <Grid3x3 className="text-black h-5 w-5 shrink-0" />,
      feature: "grid" as DashboardFeature,
    },
    {
      label: "Navigation",
      href: "/admin/dashboard/navigation",
      icon: <Navigation className="text-black h-5 w-5 shrink-0" />,
      feature: "navigation" as DashboardFeature,
    },
    {
      label: "Médiathèque",
      href: "/admin/dashboard/media",
      icon: <ImageIcon className="text-black h-5 w-5 shrink-0" />,
      feature: "media" as DashboardFeature,
    },
    {
      label: "Analytics",
      href: "/admin/dashboard/analytics",
      icon: <BarChart3 className="text-black h-5 w-5 shrink-0" />,
      feature: "analytics" as DashboardFeature,
    },
    {
      label: "Utilisateurs",
      href: "/admin/dashboard/users",
      icon: <Users className="text-black h-5 w-5 shrink-0" />,
      adminOnly: true,
    },
    {
      label: "Boutiques",
      href: "/admin/dashboard/stores",
      icon: <Store className="text-black h-5 w-5 shrink-0" />,
      adminOnly: true,
    },
    {
      label: "Apparence",
      href: "/admin/dashboard/apparence",
      icon: <Palette className="text-black h-5 w-5 shrink-0" />,
      feature: "apparence" as DashboardFeature,
    },
    {
      label: "Paramètres",
      href: "/admin/dashboard/settings",
      icon: <Settings className="text-black h-5 w-5 shrink-0" />,
      adminOnly: true, // Only admins can access settings
    },
  ];

  // Filter links based on user role and permissions
  const links = allLinks.filter((link) => {
    if (link.alwaysShow) return true;
    if (link.adminOnly) return isAdmin;
    if (link.feature) return canAccess(link.feature);
    return true;
  });

  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-50 w-full flex-1 overflow-hidden",
        "h-screen",
      )}
      style={{ colorScheme: "light" }}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <SidebarLink
              link={{
                label: session.user?.name || "Admin",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-4 w-4 text-black" />
                  </div>
                ),
              }}
            />
            <button
              onClick={handleSignOut}
              className="flex items-center justify-start gap-2 group/sidebar py-2 w-full text-left hover:bg-gray-100 rounded-md px-2 transition-colors"
            >
              <LogOut className="text-black h-5 w-5 shrink-0" />
              <motion.span
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : "0px",
                }}
                className="text-black text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-nowrap overflow-hidden !p-0 !m-0"
              >
                Déconnexion
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black whitespace-pre"
      >
        ODB Admin
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-gray-900 py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gray-900 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
    </Link>
  );
};
