'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import { useApparence } from '@/lib/apparence-context';
import { FooterSettings, defaultApparenceSettings } from '@/types/apparence';

const Footer = () => {
  const { settings: apparenceSettings } = useApparence();

  // Extract footer settings from context
  const settings: FooterSettings = {
    footer_logo_url: apparenceSettings.footer_logo_url,
    footer_bg_color: apparenceSettings.footer_bg_color,
    footer_text_color: apparenceSettings.footer_text_color,
    footer_tagline: apparenceSettings.footer_tagline,
    footer_copyright: apparenceSettings.footer_copyright,
    footer_padding_y: apparenceSettings.footer_padding_y,
    footer_border_color: apparenceSettings.footer_border_color,
    footer_link_hover_color: apparenceSettings.footer_link_hover_color,
    footer_nav_links: apparenceSettings.footer_nav_links,
    footer_legal_links: apparenceSettings.footer_legal_links,
    social_facebook: apparenceSettings.social_facebook,
    social_instagram: apparenceSettings.social_instagram,
    social_twitter: apparenceSettings.social_twitter,
    social_linkedin: apparenceSettings.social_linkedin,
    social_youtube: apparenceSettings.social_youtube,
    social_tiktok: apparenceSettings.social_tiktok,
    social_icon_color: apparenceSettings.social_icon_color,
    contact_email: apparenceSettings.contact_email,
    contact_phone: apparenceSettings.contact_phone,
    contact_address: apparenceSettings.contact_address,
    newsletter_enabled: apparenceSettings.newsletter_enabled,
    newsletter_title: apparenceSettings.newsletter_title,
    newsletter_description: apparenceSettings.newsletter_description,
    newsletter_button_text: apparenceSettings.newsletter_button_text,
    newsletter_button_color: apparenceSettings.newsletter_button_color,
    newsletter_input_bg_color: apparenceSettings.newsletter_input_bg_color,
    newsletter_success_message: apparenceSettings.newsletter_success_message,
  };

  // Calculate text opacity colors based on footer_text_color
  const textColorWithOpacity = (opacity: number) => {
    // Convert hex to rgba
    const hex = settings.footer_text_color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <footer 
      className="border-t"
      style={{ 
        backgroundColor: settings.footer_bg_color,
        color: settings.footer_text_color,
        borderColor: settings.footer_border_color || textColorWithOpacity(0.1),
        paddingTop: settings.footer_padding_y,
        paddingBottom: settings.footer_padding_y
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="mb-4 lg:mb-6 flex justify-center sm:justify-start">
              {settings.footer_logo_url && (
                <Image
                  src={settings.footer_logo_url}
                  alt="Logo"
                  width={200}
                  height={100}
                  className="h-10 lg:h-12 w-auto object-contain"
                />
              )}
            </div>
            <p className="text-sm mb-4" style={{ color: textColorWithOpacity(0.6) }}>
              {settings.footer_tagline}
            </p>
            <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ borderColor: textColorWithOpacity(0.2), color: settings.social_icon_color }}
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ borderColor: textColorWithOpacity(0.2), color: settings.social_icon_color }}
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ borderColor: textColorWithOpacity(0.2), color: settings.social_icon_color }}
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
              )}
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ borderColor: textColorWithOpacity(0.2), color: settings.social_icon_color }}
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
              )}
              {settings.social_youtube && (
                <a
                  href={settings.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ borderColor: textColorWithOpacity(0.2), color: settings.social_icon_color }}
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              )}
              {settings.social_tiktok && (
                <a
                  href={settings.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ borderColor: textColorWithOpacity(0.2), color: settings.social_icon_color }}
                  aria-label="TikTok"
                >
                  <FaTiktok />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center sm:text-left">
            <h3 
              className="text-sm font-bold tracking-wider uppercase mb-3 lg:mb-4"
              style={{ color: settings.footer_text_color }}
            >
              Navigation
            </h3>
            <ul className="space-y-2 text-sm flex flex-col items-center sm:items-start">
              {settings.footer_nav_links.map((link) => (
                <li key={link.id}>
                  <Link 
                    href={link.url}
                    className="footer-link transition-colors"
                    style={{ 
                      color: textColorWithOpacity(0.6),
                      '--hover-color': settings.footer_link_hover_color || settings.footer_text_color 
                    } as React.CSSProperties}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 
              className="text-sm font-bold tracking-wider uppercase mb-3 lg:mb-4"
              style={{ color: settings.footer_text_color }}
            >
              Contact
            </h3>
            <ul className="space-y-2 text-sm flex flex-col items-center sm:items-start" style={{ color: textColorWithOpacity(0.6) }}>
              {settings.contact_phone && (
                <li>
                  <a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`} className="transition-colors hover:opacity-100">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="transition-colors hover:opacity-100">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_address && (
                <li>
                  <span>{settings.contact_address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          {settings.newsletter_enabled && (
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <h3 
                className="text-sm font-bold tracking-wider uppercase mb-3 lg:mb-4"
                style={{ color: settings.footer_text_color }}
              >
                {settings.newsletter_title}
              </h3>
              <p className="text-sm mb-4" style={{ color: textColorWithOpacity(0.6) }}>
                {settings.newsletter_description}
              </p>
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
                  style={{ 
                    backgroundColor: settings.newsletter_input_bg_color || textColorWithOpacity(0.1),
                    borderColor: textColorWithOpacity(0.2),
                    color: settings.footer_text_color
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: settings.newsletter_button_color || settings.footer_text_color,
                    color: settings.footer_bg_color
                  }}
                >
                  {settings.newsletter_button_text}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-6 lg:pt-8 border-t flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
          style={{ borderColor: settings.footer_border_color || textColorWithOpacity(0.1) }}
        >
          <p className="text-sm text-center sm:text-left" style={{ color: textColorWithOpacity(0.5) }}>
            {settings.footer_copyright}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm" style={{ color: textColorWithOpacity(0.5) }}>
            {settings.footer_legal_links.map((link) => (
              <Link 
                key={link.id}
                href={link.url} 
                className="footer-link transition-colors whitespace-nowrap"
                style={{ '--hover-color': settings.footer_link_hover_color || settings.footer_text_color } as React.CSSProperties}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
