// ============================================
// Apparence / Branding Type Definitions
// ============================================

// Footer link structure
export interface FooterLink {
  id: string;
  label: string;
  url: string;
  pageSlug: string;
}

// Complete apparence settings interface
export interface ApparenceSettings {
  // Logos
  navbar_logo_url: string;
  footer_logo_url: string;
  loading_logo_url: string;
  intro_logo_url: string;

  // Loading Screen
  loading_bg_color: string;
  loading_animation_type: string;
  loading_duration: number;
  loading_dots_enabled: boolean;
  loading_dots_color: string;

  // Introduction / Hero Section
  intro_tagline: string;
  intro_text_color: string;
  intro_gradient_enabled: boolean;
  intro_gradient_color: string;
  intro_gradient_intensity: number;
  intro_left_text: string;
  intro_right_text: string;
  intro_scroll_indicator_enabled: boolean;

  // Footer - Main
  footer_bg_color: string;
  footer_text_color: string;
  footer_tagline: string;
  footer_copyright: string;
  footer_padding_y: number;
  footer_border_color: string;
  footer_link_hover_color: string;
  footer_nav_links: FooterLink[];
  footer_legal_links: FooterLink[];

  // Footer - Social
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
  social_youtube: string;
  social_tiktok: string;
  social_icon_color: string;

  // Footer - Contact
  contact_email: string;
  contact_phone: string;
  contact_address: string;

  // Footer - Newsletter
  newsletter_enabled: boolean;
  newsletter_title: string;
  newsletter_description: string;
  newsletter_button_text: string;
  newsletter_button_color: string;
  newsletter_input_bg_color: string;
  newsletter_success_message: string;
}

// Subset for landing page (page.tsx)
export type LandingPageSettings = Pick<
  ApparenceSettings,
  | "loading_logo_url"
  | "loading_bg_color"
  | "loading_animation_type"
  | "loading_duration"
  | "loading_dots_enabled"
  | "loading_dots_color"
  | "intro_logo_url"
  | "intro_tagline"
  | "intro_text_color"
  | "intro_gradient_enabled"
  | "intro_gradient_color"
  | "intro_gradient_intensity"
  | "intro_left_text"
  | "intro_right_text"
  | "intro_scroll_indicator_enabled"
  | "social_facebook"
  | "social_instagram"
>;

// Subset for footer (Footer.tsx)
export type FooterSettings = Pick<
  ApparenceSettings,
  | "footer_logo_url"
  | "footer_bg_color"
  | "footer_text_color"
  | "footer_tagline"
  | "footer_copyright"
  | "footer_padding_y"
  | "footer_border_color"
  | "footer_link_hover_color"
  | "footer_nav_links"
  | "footer_legal_links"
  | "social_facebook"
  | "social_instagram"
  | "social_twitter"
  | "social_linkedin"
  | "social_youtube"
  | "social_tiktok"
  | "social_icon_color"
  | "contact_email"
  | "contact_phone"
  | "contact_address"
  | "newsletter_enabled"
  | "newsletter_title"
  | "newsletter_description"
  | "newsletter_button_text"
  | "newsletter_button_color"
  | "newsletter_input_bg_color"
  | "newsletter_success_message"
>;

// Default values
export const defaultApparenceSettings: ApparenceSettings = {
  // Logos
  navbar_logo_url: "/logo-ODB-bleu-grand.png",
  footer_logo_url: "/logo-ODB-blanc-grand.png",
  loading_logo_url: "/Logo-ODB.png",
  intro_logo_url: "/logo-ODB-blanc-grand.png",

  // Loading Screen
  loading_bg_color: "#ffffff",
  loading_animation_type: "pulse",
  loading_duration: 1.8,
  loading_dots_enabled: true,
  loading_dots_color: "#9ca3af",

  // Introduction / Hero Section
  intro_tagline: "Vos yeux notre priorité",
  intro_text_color: "#ffffff",
  intro_gradient_enabled: false,
  intro_gradient_color: "#3b82f6",
  intro_gradient_intensity: 100,
  intro_left_text: "SCROLL DOWN",
  intro_right_text: "SCROLL DOWN",
  intro_scroll_indicator_enabled: true,

  // Footer - Main
  footer_bg_color: "#171717",
  footer_text_color: "#ffffff",
  footer_tagline: "Vos yeux notre priorité",
  footer_copyright: "© 2025 Optique De Bourbon. Tous droits réservés.",
  footer_padding_y: 48,
  footer_border_color: "",
  footer_link_hover_color: "",
  footer_nav_links: [
    { id: "1", label: "Accueil", url: "/", pageSlug: "" },
    {
      id: "2",
      label: "Nos boutiques",
      url: "/nos-boutiques",
      pageSlug: "nos-boutiques",
    },
  ],
  footer_legal_links: [
    {
      id: "1",
      label: "Mentions légales",
      url: "/mentions-legales",
      pageSlug: "",
    },
  ],

  // Footer - Social
  social_facebook: "https://www.facebook.com/ODBreunion/",
  social_instagram: "https://www.instagram.com/odbreunion/",
  social_linkedin: "",
  social_twitter: "",
  social_youtube: "",
  social_tiktok: "",
  social_icon_color: "#ffffff",

  // Footer - Contact
  contact_email: "contact@optiquedebourbon.re",
  contact_phone: "0262 XX XX XX",
  contact_address: "",

  // Footer - Newsletter
  newsletter_enabled: true,
  newsletter_title: "Newsletter",
  newsletter_description: "Recevez nos actualités et offres exclusives",
  newsletter_button_text: "OK",
  newsletter_button_color: "#ffffff",
  newsletter_input_bg_color: "",
  newsletter_success_message: "Merci pour votre inscription !",
};

// Helper to parse settings from API response
export function parseSettingsFromAPI(
  data: Record<string, unknown>,
): ApparenceSettings {
  // Parse JSON strings for dynamic links
  let navLinks = defaultApparenceSettings.footer_nav_links;
  let legalLinks = defaultApparenceSettings.footer_legal_links;

  if (typeof data.footer_nav_links === "string") {
    try {
      navLinks = JSON.parse(data.footer_nav_links);
    } catch {
      /* keep default */
    }
  } else if (Array.isArray(data.footer_nav_links)) {
    navLinks = data.footer_nav_links as FooterLink[];
  }

  if (typeof data.footer_legal_links === "string") {
    try {
      legalLinks = JSON.parse(data.footer_legal_links);
    } catch {
      /* keep default */
    }
  } else if (Array.isArray(data.footer_legal_links)) {
    legalLinks = data.footer_legal_links as FooterLink[];
  }

  return {
    navbar_logo_url:
      (data.navbar_logo_url as string) ??
      defaultApparenceSettings.navbar_logo_url,
    footer_logo_url:
      (data.footer_logo_url as string) ??
      defaultApparenceSettings.footer_logo_url,
    loading_logo_url:
      (data.loading_logo_url as string) ??
      defaultApparenceSettings.loading_logo_url,
    intro_logo_url:
      (data.intro_logo_url as string) ??
      defaultApparenceSettings.intro_logo_url,

    loading_bg_color:
      (data.loading_bg_color as string) ??
      defaultApparenceSettings.loading_bg_color,
    loading_animation_type:
      (data.loading_animation_type as string) ??
      defaultApparenceSettings.loading_animation_type,
    loading_duration:
      (data.loading_duration as number) ??
      defaultApparenceSettings.loading_duration,
    loading_dots_enabled:
      (data.loading_dots_enabled as boolean) ??
      defaultApparenceSettings.loading_dots_enabled,
    loading_dots_color:
      (data.loading_dots_color as string) ??
      defaultApparenceSettings.loading_dots_color,

    intro_tagline:
      (data.intro_tagline as string) ?? defaultApparenceSettings.intro_tagline,
    intro_text_color:
      (data.intro_text_color as string) ??
      defaultApparenceSettings.intro_text_color,
    intro_gradient_enabled:
      (data.intro_gradient_enabled as boolean) ??
      defaultApparenceSettings.intro_gradient_enabled,
    intro_gradient_color:
      (data.intro_gradient_color as string) ??
      defaultApparenceSettings.intro_gradient_color,
    intro_gradient_intensity:
      (data.intro_gradient_intensity as number) ??
      defaultApparenceSettings.intro_gradient_intensity,
    intro_left_text:
      (data.intro_left_text as string) ??
      defaultApparenceSettings.intro_left_text,
    intro_right_text:
      (data.intro_right_text as string) ??
      defaultApparenceSettings.intro_right_text,
    intro_scroll_indicator_enabled:
      (data.intro_scroll_indicator_enabled as boolean) ??
      defaultApparenceSettings.intro_scroll_indicator_enabled,

    footer_bg_color:
      (data.footer_bg_color as string) ??
      defaultApparenceSettings.footer_bg_color,
    footer_text_color:
      (data.footer_text_color as string) ??
      defaultApparenceSettings.footer_text_color,
    footer_tagline:
      (data.footer_tagline as string) ??
      defaultApparenceSettings.footer_tagline,
    footer_copyright:
      (data.footer_copyright as string) ??
      defaultApparenceSettings.footer_copyright,
    footer_padding_y:
      (data.footer_padding_y as number) ??
      defaultApparenceSettings.footer_padding_y,
    footer_border_color:
      (data.footer_border_color as string) ??
      defaultApparenceSettings.footer_border_color,
    footer_link_hover_color:
      (data.footer_link_hover_color as string) ??
      defaultApparenceSettings.footer_link_hover_color,
    footer_nav_links: navLinks,
    footer_legal_links: legalLinks,

    social_facebook:
      (data.social_facebook as string) ??
      defaultApparenceSettings.social_facebook,
    social_instagram:
      (data.social_instagram as string) ??
      defaultApparenceSettings.social_instagram,
    social_linkedin:
      (data.social_linkedin as string) ??
      defaultApparenceSettings.social_linkedin,
    social_twitter:
      (data.social_twitter as string) ??
      defaultApparenceSettings.social_twitter,
    social_youtube:
      (data.social_youtube as string) ??
      defaultApparenceSettings.social_youtube,
    social_tiktok:
      (data.social_tiktok as string) ?? defaultApparenceSettings.social_tiktok,
    social_icon_color:
      (data.social_icon_color as string) ??
      defaultApparenceSettings.social_icon_color,

    contact_email:
      (data.contact_email as string) ?? defaultApparenceSettings.contact_email,
    contact_phone:
      (data.contact_phone as string) ?? defaultApparenceSettings.contact_phone,
    contact_address:
      (data.contact_address as string) ??
      defaultApparenceSettings.contact_address,

    newsletter_enabled:
      (data.newsletter_enabled as boolean) ??
      defaultApparenceSettings.newsletter_enabled,
    newsletter_title:
      (data.newsletter_title as string) ??
      defaultApparenceSettings.newsletter_title,
    newsletter_description:
      (data.newsletter_description as string) ??
      defaultApparenceSettings.newsletter_description,
    newsletter_button_text:
      (data.newsletter_button_text as string) ??
      defaultApparenceSettings.newsletter_button_text,
    newsletter_button_color:
      (data.newsletter_button_color as string) ??
      defaultApparenceSettings.newsletter_button_color,
    newsletter_input_bg_color:
      (data.newsletter_input_bg_color as string) ??
      defaultApparenceSettings.newsletter_input_bg_color,
    newsletter_success_message:
      (data.newsletter_success_message as string) ??
      defaultApparenceSettings.newsletter_success_message,
  };
}
