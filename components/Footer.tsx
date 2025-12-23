'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <Image
                src="/logo-ODB-blanc-grand.png"
                alt="Optique de Bourbon"
                width={200}
                height={100}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-white/60 mb-4">
              Vos yeux notre priorité
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/ODBreunion/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/odbreunion/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/notre-histoire" className="text-white/60 hover:text-white transition-colors">
                  Qui sommes nous ?
                </Link>
              </li>
              <li>
                <Link href="/nos-boutiques" className="text-white/60 hover:text-white transition-colors">
                  Nos boutiques
                </Link>
              </li>
              <li>
                <Link href="/prendre-rendez-vous" className="text-white/60 hover:text-white transition-colors">
                  Prendre rendez-vous
                </Link>
              </li>
              <li>
                <Link href="/nos-actualités" className="text-white/60 hover:text-white transition-colors">
                  Zinfos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="tel:0692501865" className="hover:text-white transition-colors">
                  0692 50 18 65
                </a>
              </li>
              <li>
                <a href="tel:0693399995" className="hover:text-white transition-colors">
                  0693 39 99 95
                </a>
              </li>
              <li>
                <a href="mailto:communication@opticdev.re" className="hover:text-white transition-colors">
                  communication@opticdev.re
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter (placeholder for future implementation) */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-4">Newsletter</h3>
            <p className="text-sm text-white/60 mb-4">
              Recevez nos actualités et offres exclusives
            </p>
            {/* Newsletter form to be implemented */}
            <div className="text-xs text-white/40">
              À venir
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © 2025 Optique De Bourbon. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
