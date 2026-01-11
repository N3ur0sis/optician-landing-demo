'use client';

import { useState, useEffect, type JSX } from 'react';
import { motion, AnimatePresence, type Variants, type TargetAndTransition } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Check, Star, Download, MapPin, Mail, Phone, User, Send, Clock, Calendar, ExternalLink } from 'lucide-react';
import { PageBlock, BlockStyles } from '@/types/page-builder';

interface BlockRendererProps {
  block: PageBlock;
}

// Convert style settings to CSS classes/styles
function getBlockStyles(styles: BlockStyles): { className: string; style: React.CSSProperties } {
  const classNames: string[] = [];
  const inlineStyles: React.CSSProperties = {};

  // Inline display for side-by-side blocks
  if (styles.inline) {
    inlineStyles.display = 'inline-block';
    inlineStyles.verticalAlign = 'top';
  }

  // Width percent - precise horizontal control
  if (styles.widthPercent && styles.widthPercent > 0 && styles.widthPercent <= 100) {
    inlineStyles.width = `${styles.widthPercent}%`;
  }

  // Block Alignment (affects the entire block, not just text)
  if (styles.alignment) {
    if (styles.alignment === 'center') {
      if (!styles.inline) {
        classNames.push('mx-auto');
      }
      classNames.push('text-center');
      classNames.push('flex flex-col items-center');
    } else if (styles.alignment === 'right') {
      if (!styles.inline) {
        classNames.push('ml-auto');
      }
      classNames.push('text-right');
      classNames.push('flex flex-col items-end');
    } else {
      if (!styles.inline) {
        classNames.push('mr-auto');
      }
      classNames.push('text-left');
      classNames.push('flex flex-col items-start');
    }
  } else if (!styles.inline) {
    classNames.push('mx-auto'); // Default centering for container
  }

  // Height
  if (styles.height && styles.height !== 'auto') {
    const heightMap: Record<string, string> = {
      small: '200px',
      medium: '350px',
      large: '500px',
      xlarge: '700px',
      screen: '100vh',
    };
    inlineStyles.minHeight = heightMap[styles.height];
  }

  // Container width (only if no specific width percent is set)
  if (!styles.widthPercent && styles.containerWidth) {
    const widthMap: Record<string, string> = {
      NARROW: 'max-w-2xl',
      MEDIUM: 'max-w-4xl',
      WIDE: 'max-w-6xl',
      FULL: 'max-w-7xl',
      EDGE: 'max-w-none',
    };
    classNames.push('px-6', widthMap[styles.containerWidth] || 'max-w-6xl');
  }

  // Spacing
  const spacingMap: Record<string, string> = {
    none: '0',
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  };

  if (styles.paddingTop && styles.paddingTop !== 'none') {
    inlineStyles.paddingTop = spacingMap[styles.paddingTop];
  }
  if (styles.paddingBottom && styles.paddingBottom !== 'none') {
    inlineStyles.paddingBottom = spacingMap[styles.paddingBottom];
  }
  if (styles.marginTop && styles.marginTop !== 'none') {
    inlineStyles.marginTop = spacingMap[styles.marginTop];
  }
  if (styles.marginBottom && styles.marginBottom !== 'none') {
    inlineStyles.marginBottom = spacingMap[styles.marginBottom];
  }

  // Colors
  if (styles.backgroundColor) {
    inlineStyles.backgroundColor = styles.backgroundColor;
  }
  if (styles.textColor) {
    inlineStyles.color = styles.textColor;
  }
  if (styles.backgroundImage) {
    inlineStyles.backgroundImage = `url(${styles.backgroundImage})`;
    inlineStyles.backgroundSize = 'cover';
    inlineStyles.backgroundPosition = 'center';
  }

  // Border radius
  const radiusMap: Record<string, string> = {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  };
  if (styles.borderRadius && styles.borderRadius !== 'none') {
    inlineStyles.borderRadius = radiusMap[styles.borderRadius];
  }

  // Shadow
  const shadowMap: Record<string, string> = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  if (styles.shadow && styles.shadow !== 'none') {
    classNames.push(shadowMap[styles.shadow] || '');
  }

  // Custom class
  if (styles.customClass) {
    classNames.push(styles.customClass);
  }

  return {
    className: classNames.join(' '),
    style: inlineStyles,
  };
}

// Animation variants
const animationVariants: Record<string, { initial: TargetAndTransition; animate: TargetAndTransition }> = {
  'fade-in': {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  'slide-right': {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
};

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (!block.visible) return null;

  const styles = block.styles as BlockStyles;
  const { className, style } = getBlockStyles(styles);
  const animation = styles.animation && styles.animation !== 'none' ? animationVariants[styles.animation] : null;

  const content = renderBlockContent(block);

  if (animation) {
    return (
      <motion.div
        initial={animation.initial}
        whileInView={animation.animate}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: (styles.animationDelay || 0) / 1000 }}
        className={className}
        style={style}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={className} style={style}>
      {content}
    </div>
  );
}

function renderBlockContent(block: PageBlock) {
  const content = block.content as Record<string, unknown>;

  switch (block.type) {
    case 'HERO':
      return <HeroBlock content={content} />;
    case 'TEXT':
      return <TextBlock content={content} />;
    case 'HEADING':
      return <HeadingBlock content={content} />;
    case 'PARAGRAPH':
      return <ParagraphBlock content={content} />;
    case 'IMAGE':
      return <ImageBlock content={content} />;
    case 'BUTTON':
      return <ButtonBlock content={content} />;
    case 'QUOTE':
      return <QuoteBlock content={content} />;
    case 'SPACER':
      return <SpacerBlock content={content} />;
    case 'DIVIDER':
      return <DividerBlock content={content} />;
    case 'STATS':
      return <StatsBlock content={content} />;
    case 'CARDS':
      return <CardsBlock content={content} />;
    case 'VIDEO':
      return <VideoBlock content={content} />;
    case 'IFRAME':
      return <IframeBlock content={content} />;
    case 'FEATURES':
      return <FeaturesBlock content={content} />;
    case 'LIST':
      return <ListBlock content={content} />;
    case 'GALLERY':
      return <GalleryBlock content={content} />;
    case 'FILE':
      return <FileBlock content={content} />;
    case 'COLUMNS':
      return <ColumnsBlock content={content} />;
    case 'GRID':
      return <GridBlock content={content} />;
    case 'CONTAINER':
      return <ContainerBlock content={content} />;
    case 'LINK_BLOCK':
      return <LinkBlockComponent content={content} />;
    case 'ACCORDION':
      return <AccordionBlock content={content} />;
    case 'TABS':
      return <TabsBlock content={content} />;
    case 'TABLE':
      return <TableBlock content={content} />;
    case 'TIMELINE':
      return <TimelineBlock content={content} />;
    case 'MAP':
      return <MapBlock content={content} />;
    case 'SOCIAL':
      return <SocialBlock content={content} />;
    case 'TEAM':
      return <TeamBlock content={content} />;
    case 'TESTIMONIALS':
      return <TestimonialsBlock content={content} />;
    case 'PRICING':
      return <PricingBlock content={content} />;
    case 'FAQ':
      return <FAQBlock content={content} />;
    case 'CONTACT_FORM':
      return <ContactFormBlock content={content} />;
    case 'NEWSLETTER':
      return <NewsletterBlock content={content} />;
    case 'STORE_LIST':
      return <StoreListBlock content={content} />;
    case 'STORE_HERO':
      return <StoreHeroBlock content={content} />;
    case 'STORE_CONTACT':
      return <StoreContactBlock content={content} />;
    case 'STORE_SERVICES':
      return <StoreServicesBlock content={content} />;
    case 'STORE_CTA':
      return <StoreCtaBlock content={content} />;
    case 'STORE_REVIEWS':
      return <StoreReviewsBlock content={content} />;
    case 'STORE_MAP':
      return <StoreMapBlock content={content} />;
    case 'STORE_LAYOUT':
      return <StoreLayoutBlock content={content} />;
    // Primitive Blocks
    case 'INFO_BOX':
      return <InfoBoxBlock content={content} />;
    case 'HOURS_TABLE':
      return <HoursTableBlock content={content} />;
    case 'SERVICES_LIST':
      return <ServicesListBlock content={content} />;
    case 'CTA_CARD':
      return <CtaCardBlock content={content} />;
    case 'REVIEW_BADGE':
      return <ReviewBadgeBlock content={content} />;
    case 'LOCATION_CARD':
      return <LocationCardBlock content={content} />;
    case 'ICON_FEATURE':
      return <IconFeatureBlock content={content} />;
    default:
      return (
        <div className="p-4 bg-gray-100 text-gray-500 text-center">
          Block type "{block.type}" not implemented
        </div>
      );
  }
}

// Hero Block
function HeroBlock({ content }: { content: Record<string, unknown> }) {
  const heightMap: Record<string, string> = {
    small: 'min-h-[300px]',
    medium: 'min-h-[500px]',
    large: 'min-h-[700px]',
    full: 'min-h-screen',
  };

  const alignMap: Record<string, string> = {
    LEFT: 'items-start text-left',
    CENTER: 'items-center text-center',
    RIGHT: 'items-end text-right',
  };

  return (
    <section
      className={`relative flex flex-col justify-center ${heightMap[(content.height as string) || 'large']}`}
      style={{
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      {Boolean(content.backgroundImage) && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: (content.overlayColor as string) || '#000000',
            opacity: ((content.overlayOpacity as number) || 50) / 100,
          }}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 px-6 py-20 max-w-4xl mx-auto w-full flex flex-col ${alignMap[(content.alignment as string) || 'CENTER']}`}>
        {Boolean(content.subtitle) && (
          <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-70">
            {content.subtitle as string}
          </p>
        )}
        {Boolean(content.title) && (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            {content.title as string}
          </h1>
        )}
        {Boolean(content.description) && (
          <p className="text-lg md:text-xl opacity-80 max-w-2xl">
            {content.description as string}
          </p>
        )}
        {Array.isArray(content.buttons) && content.buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-8">
            {(content.buttons as Array<{ text: string; url: string; variant?: string }>).map((button, index) => (
              <Link
                key={index}
                href={button.url || '#'}
                className={`px-6 py-3 font-medium transition-all ${
                  button.variant === 'secondary'
                    ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Text Block (Rich HTML)
function TextBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: (content.html as string) || '' }}
    />
  );
}

// Heading Block
function HeadingBlock({ content }: { content: Record<string, unknown> }) {
  const level = (content.level as string) || 'h2';
  const text = (content.text as string) || '';
  const subtitle = content.subtitle as string;

  const sizeMap: Record<string, string> = {
    h1: 'text-5xl md:text-6xl lg:text-7xl',
    h2: 'text-4xl md:text-5xl',
    h3: 'text-3xl md:text-4xl',
    h4: 'text-2xl md:text-3xl',
    h5: 'text-xl md:text-2xl',
    h6: 'text-lg md:text-xl',
  };

  const Tag = level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <div>
      <Tag className={`font-bold tracking-tight ${sizeMap[level]}`}>{text as string}</Tag>
      {subtitle && <p className="mt-2 text-lg opacity-70">{subtitle}</p>}
    </div>
  );
}

// Paragraph Block
function ParagraphBlock({ content }: { content: Record<string, unknown> }) {
  return <p className="text-lg leading-relaxed">{(content.text as string) || ''}</p>;
}

// Image Block
function ImageBlock({ content }: { content: Record<string, unknown> }) {
  const src = (content.src as string) || '';
  const alt = (content.alt as string) || '';
  const caption = content.caption as string;
  const link = content.link as string;

  if (!src) {
    return (
      <div className="bg-gray-200 aspect-video flex items-center justify-center text-gray-400">
        No image source
      </div>
    );
  }

  const imageElement = (
    <figure>
      <div className="relative overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto"
          style={{ objectFit: (content.objectFit as React.CSSProperties['objectFit']) || 'cover' }}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center opacity-70">{caption}</figcaption>
      )}
    </figure>
  );

  if (link) {
    return (
      <Link href={link} className="block hover:opacity-90 transition-opacity">
        {imageElement}
      </Link>
    );
  }

  return imageElement;
}

// Button Block
function ButtonBlock({ content }: { content: Record<string, unknown> }) {
  const text = (content.text as string) || 'Button';
  const url = (content.url as string) || '#';
  const variant = (content.variant as string) || 'primary';
  const size = (content.size as string) || 'md';
  const fullWidth = content.fullWidth as boolean;
  const newTab = content.newTab as boolean;

  const variantStyles: Record<string, string> = {
    primary: 'bg-white text-black hover:bg-white/90',
    secondary: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm',
    outline: 'border-2 border-current hover:bg-white/10',
    ghost: 'hover:bg-white/10',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <Link
      href={url}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center justify-center font-medium transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      {text}
    </Link>
  );
}

// Quote Block
function QuoteBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <blockquote className="border-l-4 border-white/30 pl-6 py-4">
      <p className="text-xl md:text-2xl italic leading-relaxed mb-4">
        "{(content.text as string) || ''}"
      </p>
      {(Boolean(content.author) || Boolean(content.role)) && (
        <footer className="text-sm opacity-70">
          {Boolean(content.author) && <cite className="not-italic font-medium">{content.author as string}</cite>}
          {Boolean(content.role) && <span className="ml-2">— {content.role as string}</span>}
        </footer>
      )}
    </blockquote>
  );
}

// Spacer Block
function SpacerBlock({ content }: { content: Record<string, unknown> }) {
  const heightMap: Record<string, string> = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
    '2xl': 'h-24',
  };

  return <div className={heightMap[(content.height as string) || 'md']} />;
}

// Divider Block
function DividerBlock({ content }: { content: Record<string, unknown> }) {
  const style = (content.style as string) || 'solid';
  const width = (content.width as string) || 'full';
  const color = (content.color as string) || 'rgba(255,255,255,0.2)';

  const widthMap: Record<string, string> = {
    short: 'w-16',
    medium: 'w-1/3',
    full: 'w-full',
  };

  if (style === 'gradient') {
    return (
      <div className={`${widthMap[width]} h-px mx-auto`} style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />
    );
  }

  return (
    <hr
      className={`${widthMap[width]} mx-auto border-0 h-px`}
      style={{
        borderTopWidth: '1px',
        borderTopStyle: style as React.CSSProperties['borderTopStyle'],
        borderTopColor: color,
      }}
    />
  );
}

// Stats Block
function StatsBlock({ content }: { content: Record<string, unknown> }) {
  const stats = (content.stats as Array<{ value: string; label: string; prefix?: string; suffix?: string }>) || [];
  const columns = (content.columns as number) || 4;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-8`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl md:text-5xl font-bold mb-2">
            {stat.prefix}{stat.value}{stat.suffix}
          </div>
          <div className="text-sm opacity-70 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Cards Block
function CardsBlock({ content }: { content: Record<string, unknown> }) {
  const cards = (content.cards as Array<{ title: string; description?: string; image?: string; link?: string; tags?: string[] }>) || [];
  const columns = (content.columns as number) || 3;
  const variant = (content.variant as string) || 'default';

  const variantStyles: Record<string, string> = {
    default: 'bg-white/5 hover:bg-white/10',
    bordered: 'border border-white/10 hover:border-white/30',
    elevated: 'bg-white/5 shadow-lg hover:shadow-xl',
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {cards.map((card, index) => {
        const CardWrapper = card.link ? Link : 'div';
        return (
          <CardWrapper
            key={index}
            href={card.link || '#'}
            className={`block overflow-hidden transition-all ${variantStyles[variant]} group`}
          >
            {card.image && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              {card.description && (
                <p className="opacity-70 line-clamp-3">{card.description}</p>
              )}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-white/10 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
}

// Video Block
function VideoBlock({ content }: { content: Record<string, unknown> }) {
  const type = (content.type as string) || 'youtube';
  const url = (content.url as string) || '';

  if (!url) {
    return (
      <div className="bg-gray-200 aspect-video flex items-center justify-center text-gray-400">
        No video URL
      </div>
    );
  }

  // Extract video ID for embeds
  if (type === 'youtube') {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (videoId) {
      return (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}${content.autoplay ? '?autoplay=1' : ''}${content.muted ? '&mute=1' : ''}${content.loop ? '&loop=1' : ''}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  if (type === 'vimeo') {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) {
      return (
        <div className="aspect-video">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}${content.autoplay ? '?autoplay=1' : ''}${content.muted ? '&muted=1' : ''}${content.loop ? '&loop=1' : ''}`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  // File video
  return (
    <video
      src={url}
      className="w-full"
      controls={content.controls as boolean}
      autoPlay={content.autoplay as boolean}
      muted={content.muted as boolean}
      loop={content.loop as boolean}
      poster={content.poster as string}
    />
  );
}

// Iframe Block
function IframeBlock({ content }: { content: Record<string, unknown> }) {
  const url = (content.url as string) || '';
  const height = (content.height as number) || 400;
  const title = (content.title as string) || 'Embedded content';

  if (!url) {
    return (
      <div className="bg-gray-200 flex items-center justify-center text-gray-400" style={{ height }}>
        No URL provided
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      className="w-full border-0"
      style={{ height }}
      allowFullScreen={content.allowFullscreen as boolean}
    />
  );
}

// Features Block
function FeaturesBlock({ content }: { content: Record<string, unknown> }) {
  const features = (content.features as Array<{ icon?: string; title: string; description: string; link?: string }>) || [];
  const columns = (content.columns as number) || 3;
  const layout = (content.layout as string) || 'cards';

  if (layout === 'list') {
    return (
      <div className="space-y-6">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-4">
            {feature.icon && (
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{feature.icon}</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
              <p className="opacity-70">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
      {features.map((feature, index) => (
        <div key={index} className="p-6 bg-white/5 rounded-lg">
          {feature.icon && (
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{feature.icon}</span>
            </div>
          )}
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="opacity-70">{feature.description}</p>
          {feature.link && (
            <Link href={feature.link} className="inline-block mt-4 text-sm font-medium hover:underline">
              En savoir plus →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

// List Block
function ListBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as string[]) || [];
  const style = (content.style as string) || 'bullet';

  const getIcon = (index: number) => {
    switch (style) {
      case 'number':
        return <span className="font-medium">{index + 1}.</span>;
      case 'check':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'arrow':
        return <span className="text-current">→</span>;
      default:
        return <span className="w-2 h-2 bg-current rounded-full" />;
    }
  };

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-1">{getIcon(index)}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Gallery Block
function GalleryBlock({ content }: { content: Record<string, unknown> }) {
  const images = (content.images as Array<{ src: string; alt: string; caption?: string }>) || [];
  const columns = (content.columns as number) || 3;
  const gap = (content.gap as string) || 'medium';
  const lightbox = content.lightbox as boolean;

  const gapMap: Record<string, string> = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  };

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-${columns} ${gapMap[gap]}`}>
        {images.map((image, index) => (
          <figure
            key={index}
            className={`relative overflow-hidden aspect-square ${lightbox ? 'cursor-pointer' : ''}`}
            onClick={() => lightbox && setSelectedImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {image.caption && (
              <figcaption className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            {selectedImage > 0 && (
              <button
                className="absolute left-4 text-white text-4xl hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage - 1);
                }}
              >
                ‹
              </button>
            )}
            {selectedImage < images.length - 1 && (
              <button
                className="absolute right-4 text-white text-4xl hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage + 1);
                }}
              >
                ›
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// File Block
function FileBlock({ content }: { content: Record<string, unknown> }) {
  const name = (content.name as string) || 'File';
  const url = (content.url as string) || '';
  const size = content.size as string;
  const fileType = content.type as string;
  const description = content.description as string;

  const getFileIcon = () => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('video')) return '🎬';
    if (fileType?.includes('audio')) return '🎵';
    if (fileType?.includes('zip') || fileType?.includes('archive')) return '📦';
    return '📎';
  };

  return (
    <a
      href={url}
      download
      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors group"
    >
      <div className="text-3xl">{getFileIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate group-hover:text-blue-400 transition-colors">{name}</div>
        {description && <p className="text-sm opacity-70 truncate">{description}</p>}
        {(size || fileType) && (
          <p className="text-xs opacity-50 mt-1">
            {fileType && <span className="uppercase">{fileType.split('/').pop()}</span>}
            {size && fileType && ' • '}
            {size}
          </p>
        )}
      </div>
      <Download className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

// Columns Block
function ColumnsBlock({ content }: { content: Record<string, unknown> }) {
  const rawColumns = content.columns;
  // Handle case where columns might be a number instead of an array
  const columns = Array.isArray(rawColumns) 
    ? (rawColumns as Array<{ width?: number; content?: string }>)
    : [];
  const gap = (content.gap as string) || 'medium';
  const stackOnMobile = content.stackOnMobile !== false;

  const gapMap: Record<string, string> = {
    none: 'gap-0',
    small: 'gap-4',
    medium: 'gap-8',
    large: 'gap-12',
  };

  // Don't render if no columns
  if (columns.length === 0) {
    return null;
  }

  return (
    <div className={`${stackOnMobile ? 'flex flex-col md:flex-row' : 'flex'} ${gapMap[gap]}`}>
      {columns.map((column, index) => (
        <div
          key={index}
          className="flex-1"
          style={column.width ? { flex: `0 0 ${column.width}%` } : undefined}
        >
          {column.content && (
            <div dangerouslySetInnerHTML={{ __html: column.content }} />
          )}
        </div>
      ))}
    </div>
  );
}

// Grid Block
function GridBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as Array<{ title: string; description?: string; image?: string; link?: string; badge?: string }>) || [];
  const columns = (content.columns as number) || 3;
  const gap = (content.gap as string) || 'medium';

  const gapMap: Record<string, string> = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gapMap[gap]}`}>
      {items.map((item, index) => {
        const Wrapper = item.link ? Link : 'div';
        return (
          <Wrapper
            key={index}
            href={item.link || '#'}
            className="relative overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            {item.badge && (
              <span className="absolute top-3 right-3 px-2 py-1 bg-white text-black text-xs font-medium rounded z-10">
                {item.badge}
              </span>
            )}
            {item.image && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              {item.description && (
                <p className="text-sm opacity-70 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}

// Container Block
function ContainerBlock({ content }: { content: Record<string, unknown> }) {
  const innerContent = content.content as string;
  
  return (
    <div className="p-6">
      {innerContent && <div dangerouslySetInnerHTML={{ __html: innerContent }} />}
    </div>
  );
}

// Link Block
function LinkBlockComponent({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || '';
  const description = content.description as string;
  const url = (content.url as string) || '#';
  const image = content.image as string;
  const newTab = content.newTab as boolean;

  return (
    <Link
      href={url}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group"
    >
      {image && (
        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium group-hover:text-blue-400 transition-colors">{title}</h3>
        {description && <p className="text-sm opacity-70 mt-1 line-clamp-2">{description}</p>}
        <p className="text-xs opacity-50 mt-2 truncate">{url}</p>
      </div>
      <span className="text-xl opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
    </Link>
  );
}

// Accordion Block
function AccordionBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as Array<{ title: string; content: string; defaultOpen?: boolean }>) || [];
  const allowMultiple = content.allowMultiple as boolean;

  const [openItems, setOpenItems] = useState<Set<number>>(() => {
    const defaultOpen = new Set<number>();
    items.forEach((item, index) => {
      if (item.defaultOpen) defaultOpen.add(index);
    });
    return defaultOpen;
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) newSet.clear();
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="divide-y divide-white/10">
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between py-4 text-left hover:opacity-80 transition-opacity"
          >
            <span className="font-medium">{item.title}</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${openItems.has(index) ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {openItems.has(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="pb-4 opacity-70"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// Tabs Block
function TabsBlock({ content }: { content: Record<string, unknown> }) {
  const tabs = (content.tabs as Array<{ label: string; content: string; icon?: string }>) || [];
  const variant = (content.variant as string) || 'line';
  const [activeTab, setActiveTab] = useState(0);

  const tabStyles: Record<string, { container: string; tab: string; activeTab: string }> = {
    line: {
      container: 'border-b border-white/10',
      tab: 'py-3 px-4 border-b-2 border-transparent hover:border-white/30 transition-colors',
      activeTab: 'border-b-2 border-white',
    },
    pill: {
      container: 'bg-white/5 p-1 rounded-lg',
      tab: 'py-2 px-4 rounded-md hover:bg-white/10 transition-colors',
      activeTab: 'bg-white text-black',
    },
    enclosed: {
      container: 'border-b border-white/10',
      tab: 'py-2 px-4 border border-transparent border-b-0 rounded-t-lg hover:bg-white/5 transition-colors',
      activeTab: 'bg-white/10 border-white/10',
    },
  };

  const styles = tabStyles[variant] || tabStyles.line;

  return (
    <div>
      <div className={`flex gap-2 ${styles.container}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`${styles.tab} ${activeTab === index ? styles.activeTab : ''} flex items-center gap-2`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6">
        {tabs[activeTab] && (
          <div dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
        )}
      </div>
    </div>
  );
}

// Table Block
function TableBlock({ content }: { content: Record<string, unknown> }) {
  const headers = (content.headers as string[]) || [];
  const rows = (content.rows as string[][]) || [];
  const striped = content.striped as boolean;
  const bordered = content.bordered as boolean;
  const hoverable = content.hoverable as boolean;

  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${bordered ? 'border border-white/10' : ''}`}>
        {headers.length > 0 && (
          <thead>
            <tr className="bg-white/5">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left font-semibold ${bordered ? 'border border-white/10' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 1 ? 'bg-white/5' : ''}
                ${hoverable ? 'hover:bg-white/10 transition-colors' : ''}
              `}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-3 ${bordered ? 'border border-white/10' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Timeline Block
function TimelineBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as Array<{ date: string; title: string; description?: string; image?: string }>) || [];
  const layout = (content.layout as string) || 'vertical';

  if (layout === 'alternating') {
    return (
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />
        
        <div className="space-y-12">
          {items.map((item, index) => (
            <div
              key={index}
              className={`relative flex items-center gap-8 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <span className="text-sm opacity-50">{item.date}</span>
                <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm opacity-70 mt-2">{item.description}</p>
                )}
              </div>
              
              {/* Center dot */}
              <div className="w-4 h-4 bg-white rounded-full flex-shrink-0 z-10" />
              
              <div className="flex-1">
                {item.image && (
                  <img src={item.image} alt={item.title} className="rounded-lg max-w-xs" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pl-8 border-l border-white/20">
      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Dot */}
            <div className="absolute -left-[2.15rem] w-3 h-3 bg-white rounded-full" />
            
            <span className="text-sm opacity-50">{item.date}</span>
            <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
            {item.description && (
              <p className="text-sm opacity-70 mt-2">{item.description}</p>
            )}
            {item.image && (
              <img src={item.image} alt={item.title} className="mt-4 rounded-lg max-w-sm" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Map Block
function MapBlock({ content }: { content: Record<string, unknown> }) {
  const address = content.address as string;
  const lat = content.lat as number;
  const lng = content.lng as number;
  const zoom = (content.zoom as number) || 14;
  const height = (content.height as number) || 400;

  // If we have coordinates, use them; otherwise try to use address
  const mapUrl = lat && lng
    ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=${zoom}`
    : address
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}`
    : null;

  if (!mapUrl) {
    return (
      <div
        className="bg-gray-200 flex items-center justify-center text-gray-500"
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

// Social Block
function SocialBlock({ content }: { content: Record<string, unknown> }) {
  const embedCode = content.embedCode as string;
  const url = content.url as string;
  const platform = content.platform as string;

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
        <p className="opacity-70 mb-4">Contenu {platform || 'social'}</p>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-white text-black rounded hover:bg-white/90 transition-colors"
        >
          Voir sur {platform || 'le réseau'}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-200 text-gray-500 text-center rounded-lg">
      Aucun contenu social configuré
    </div>
  );
}

// Team Block
function TeamBlock({ content }: { content: Record<string, unknown> }) {
  const members = (content.members as Array<{
    name: string;
    role: string;
    image?: string;
    bio?: string;
    social?: { instagram?: string; linkedin?: string; email?: string };
  }>) || [];
  const columns = (content.columns as number) || 3;
  const variant = (content.variant as string) || 'card';

  if (variant === 'minimal') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-6`}>
        {members.map((member, index) => (
          <div key={index} className="text-center">
            {member.image && (
              <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
            )}
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm opacity-70">{member.role}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {members.map((member, index) => (
        <div key={index} className="bg-white/5 rounded-lg overflow-hidden group">
          {member.image && (
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-sm opacity-70 mb-3">{member.role}</p>
            {member.bio && <p className="text-sm opacity-70 mb-4">{member.bio}</p>}
            {member.social && (
              <div className="flex gap-3">
                {member.social.email && (
                  <a href={`mailto:${member.social.email}`} className="opacity-50 hover:opacity-100">
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100">
                    <User className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Testimonials Block
function TestimonialsBlock({ content }: { content: Record<string, unknown> }) {
  const testimonials = (content.testimonials as Array<{
    text: string;
    author: string;
    role?: string;
    company?: string;
    image?: string;
    rating?: number;
  }>) || [];
  const layout = (content.layout as string) || 'grid';
  const columns = (content.columns as number) || 2;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {testimonials.map((testimonial, index) => (
        <div key={index} className="p-6 bg-white/5 rounded-lg">
          {testimonial.rating && (
            <div className="mb-4">{renderStars(testimonial.rating)}</div>
          )}
          <blockquote className="text-lg mb-4">"{testimonial.text}"</blockquote>
          <div className="flex items-center gap-3">
            {testimonial.image && (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <div className="font-semibold">{testimonial.author}</div>
              {(testimonial.role || testimonial.company) && (
                <div className="text-sm opacity-70">
                  {testimonial.role}
                  {testimonial.role && testimonial.company && ' · '}
                  {testimonial.company}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Pricing Block
function PricingBlock({ content }: { content: Record<string, unknown> }) {
  const plans = (content.plans as Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
    buttonText?: string;
    buttonUrl?: string;
  }>) || [];
  const columns = (content.columns as number) || 3;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {plans.map((plan, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg ${
            plan.highlighted
              ? 'bg-white text-black ring-2 ring-white'
              : 'bg-white/5'
          }`}
        >
          {plan.highlighted && (
            <span className="inline-block px-2 py-1 bg-black text-white text-xs font-medium rounded mb-4">
              Populaire
            </span>
          )}
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <div className="mt-4 mb-6">
            <span className="text-4xl font-bold">{plan.price}</span>
            {plan.period && (
              <span className={`text-sm ${plan.highlighted ? 'opacity-60' : 'opacity-70'}`}>
                /{plan.period}
              </span>
            )}
          </div>
          {plan.description && (
            <p className={`text-sm mb-6 ${plan.highlighted ? 'opacity-70' : 'opacity-70'}`}>
              {plan.description}
            </p>
          )}
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center gap-2">
                <Check className={`w-5 h-5 ${plan.highlighted ? 'text-green-600' : 'text-green-400'}`} />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          {plan.buttonUrl && (
            <Link
              href={plan.buttonUrl}
              className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                plan.highlighted
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {plan.buttonText || 'Choisir'}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

// FAQ Block
function FAQBlock({ content }: { content: Record<string, unknown> }) {
  const questions = (content.questions as Array<{ question: string; answer: string }>) || [];
  const layout = (content.layout as string) || 'accordion';

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (layout === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((item, index) => (
          <div key={index} className="p-6 bg-white/5 rounded-lg">
            <h3 className="font-semibold mb-2">{item.question}</h3>
            <p className="text-sm opacity-70">{item.answer}</p>
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'two-column') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {questions.map((item, index) => (
          <div key={index}>
            <h3 className="font-semibold mb-2">{item.question}</h3>
            <p className="text-sm opacity-70">{item.answer}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {questions.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-4 text-left hover:opacity-80 transition-opacity"
          >
            <span className="font-medium pr-4">{item.question}</span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-4 opacity-70">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// Contact Form Block
function ContactFormBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const description = content.description as string;
  const fields = (content.fields as Array<{
    type: string;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }>) || [];
  const submitText = (content.submitText as string) || 'Envoyer';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-white/5 rounded-lg">
        <Check className="w-12 h-12 mx-auto mb-4 text-green-400" />
        <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
        <p className="opacity-70">{(content.successMessage as string) || 'Nous vous répondrons dès que possible.'}</p>
      </div>
    );
  }

  return (
    <div>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-2xl font-semibold mb-2">{title}</h3>}
          {description && <p className="opacity-70">{description}</p>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:outline-none transition-colors"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                required={field.required}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:outline-none transition-colors"
              >
                <option value="">{field.placeholder || 'Sélectionner...'}</option>
                {field.options?.map((option, optIndex) => (
                  <option key={optIndex} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={field.name}
                  required={field.required}
                  className="w-4 h-4 rounded border-white/30"
                />
                <span className="text-sm">{field.placeholder}</span>
              </label>
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:outline-none transition-colors"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {submitText}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// Newsletter Block
function NewsletterBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const description = content.description as string;
  const placeholder = (content.placeholder as string) || 'Votre email';
  const buttonText = (content.buttonText as string) || 'S\'inscrire';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-white/5 rounded-lg">
        <Check className="w-10 h-10 mx-auto mb-3 text-green-400" />
        <p className="font-medium">Merci pour votre inscription !</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {title && <h3 className="text-2xl font-semibold mb-2">{title}</h3>}
      {description && <p className="opacity-70 mb-6">{description}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Mail className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// Store List Block - Dynamically fetches and displays stores from the database
function StoreListBlock({ content }: { content: Record<string, unknown> }) {
  const [stores, setStores] = useState<Array<{
    id: string;
    name: string;
    address: string;
    phone: string;
    rating: number;
    reviews: number;
    image: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const columns = (content.columns as number) || 3;
  const showRating = content.showRating !== false;
  const showPhone = content.showPhone !== false;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores');
        if (response.ok) {
          const data = await response.json();
          setStores(data.stores || []);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStores();
  }, []);

  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
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
              <div className="aspect-[4/3] bg-white/10" />
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
          <Link
            key={store.id}
            href={`/magasins/${store.id}`}
            className="group bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Store Image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-amber-900/20 to-neutral-900/40 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-amber-500/50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Store Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                {store.name}
              </h3>
              
              <div className="space-y-2 text-sm opacity-70">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{store.address}</span>
                </div>
                
                {showPhone && store.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
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
        ))}
      </div>
    </div>
  );
}

// ============================================
// STORE-SPECIFIC BLOCKS
// ============================================

// Store Hero Block - Premium hero section for store pages
function StoreHeroBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const description = content.description as string;
  const backgroundImage = content.backgroundImage as string;
  const buttons = (content.buttons as Array<{
    label: string;
    href: string;
    variant?: string;
    openInNewTab?: boolean;
  }>) || [];

  return (
    <motion.section 
      className="relative h-96 bg-gradient-to-r from-neutral-900 to-neutral-800 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)',
          backgroundSize: '50px 50px'
        }}></div>
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
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              className="text-xl opacity-90 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
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
                <Link
                  key={idx}
                  href={btn.href || '#'}
                  target={btn.openInNewTab ? '_blank' : undefined}
                  rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    btn.variant === 'secondary'
                      ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30'
                      : 'bg-amber-500 hover:bg-amber-600 text-black'
                  }`}
                >
                  {btn.label}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

// Store Contact Block - Contact information with hours
function StoreContactBlock({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Informations de contact';
  const address = content.address as string;
  const phone = content.phone as string;
  const phone2 = content.phone2 as string;
  const email = content.email as string;
  const hours = (content.hours as Record<string, string>) || {};

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h2>
      <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-amber-100 mb-6"></div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {address && (
            <div className="flex items-start gap-3 group">
              <MapPin className="w-5 h-5 text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h3 className="font-semibold text-neutral-900">Adresse</h3>
                <p className="text-neutral-600 whitespace-pre-line">{address}</p>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex items-start gap-3 group">
              <Phone className="w-5 h-5 text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h3 className="font-semibold text-neutral-900">Téléphone</h3>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-amber-700 hover:text-amber-900 transition-colors duration-300 block">
                  {phone}
                </a>
                {phone2 && (
                  <a href={`tel:${phone2.replace(/\s/g, '')}`} className="text-amber-700 hover:text-amber-900 transition-colors duration-300 block">
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
                <a href={`mailto:${email}`} className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                  {email}
                </a>
              </div>
            </div>
          )}
        </div>
        {Object.keys(hours).length > 0 && (
          <div>
            <div className="flex items-start gap-3 group">
              <svg className="w-5 h-5 text-amber-500 mt-1 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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

// Store Services Block - Services grid with animations
function StoreServicesBlock({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Nos services';
  const subtitle = content.subtitle as string;
  const services = (content.services as string[]) || [];

  if (services.length === 0) return null;

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-2 text-neutral-900 flex items-center">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h2>
      {subtitle && (
        <p className="text-neutral-600 mb-4">{subtitle}</p>
      )}
      <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-amber-100 mb-6"></div>
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={service}
            className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg hover:bg-amber-50 transition-colors duration-300 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            whileHover={{ x: 5 }}
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <span className="font-medium text-neutral-800 group-hover:text-amber-700 transition-colors duration-300">{service}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Store CTA Block - Call to action buttons
function StoreCtaBlock({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Prendre rendez-vous';
  const rdvUrl = content.rdvUrl as string;
  const rdvLabel = (content.rdvLabel as string) || 'JE PRENDS RDV EN LIGNE';
  const phone = content.phone as string;
  const phoneLabel = (content.phoneLabel as string) || 'APPELER LE MAGASIN';

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center">
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
            whileHover={{ 
              y: -2,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)"
            }}
            whileTap={{ y: 0 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{rdvLabel}</span>
          </motion.a>
        )}
        {phone && (
          <motion.a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="w-full border-2 border-neutral-800 text-neutral-900 py-4 px-6 rounded-lg font-semibold hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ 
              y: -2,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)"
            }}
            whileTap={{ y: 0 }}
          >
            <Phone className="w-5 h-5" />
            <span>{phoneLabel}</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

// Store Reviews Block - Customer reviews display
function StoreReviewsBlock({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Avis clients';
  const rating = (content.rating as number) || 0;
  const reviewCount = (content.reviewCount as number) || 0;
  const source = content.source as string;

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
        {title}
      </h3>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-amber-500 fill-amber-500' : 'text-neutral-300'}`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-neutral-900">{rating}/5</span>
        </div>
        <p className="text-neutral-600 mb-4">
          Sur {reviewCount} avis vérifiés
        </p>
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

// Store Map Block - Location map with address
function StoreMapBlock({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Localisation';
  const address = content.address as string;
  const mapUrl = content.mapUrl as string;
  const embedUrl = content.embedUrl as string;

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center">
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
          className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <MapPin className="w-16 h-16 text-amber-500/50 mb-4" />
          <p className="text-neutral-600 text-center px-4 mb-4">{address}</p>
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

// Store Layout Block - Complete store page layout with 2 columns
function StoreLayoutBlock({ content }: { content: Record<string, unknown> }) {
  // Main content (left column - 2/3)
  const contact = content.contact as Record<string, unknown>;
  const services = content.services as Record<string, unknown>;
  const specialties = content.specialties as Record<string, unknown>;
  
  // Sidebar content (right column - 1/3)
  const cta = content.cta as Record<string, unknown>;
  const reviews = content.reviews as Record<string, unknown>;
  const map = content.map as Record<string, unknown>;
  
  // Gallery (full width below)
  const gallery = content.gallery as Record<string, unknown>;

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white py-12 lg:py-16">
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
                  {(contact.title as string) || 'Informations de contact'}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Address & Contact */}
                  <div className="space-y-6">
                    {Boolean(contact.address) && (
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                          <MapPin className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">Adresse</h3>
                          <p className="text-neutral-600 whitespace-pre-line">{contact.address as string}</p>
                        </div>
                      </div>
                    )}
                    {Boolean(contact.phone) && (
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Phone className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">Téléphone</h3>
                          <a href={`tel:${(contact.phone as string).replace(/\s/g, '')}`} className="text-amber-700 hover:text-amber-900 transition-colors block font-medium">
                            {contact.phone as string}
                          </a>
                          {Boolean(contact.phone2) && (
                            <a href={`tel:${(contact.phone2 as string).replace(/\s/g, '')}`} className="text-amber-700 hover:text-amber-900 transition-colors block">
                              {contact.phone2 as string}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    {Boolean(contact.email) && (
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                          <a href={`mailto:${contact.email}`} className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                            {contact.email as string}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Hours */}
                  {contact.hours && Object.keys(contact.hours as Record<string, string>).length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 mb-3">Horaires d'ouverture</h3>
                        <div className="space-y-2">
                          {Object.entries(contact.hours as Record<string, string>).map(([day, hours]) => (
                            <div key={day} className="flex justify-between py-1.5 border-b border-neutral-100 last:border-0">
                              <span className="text-neutral-600">{day}</span>
                              <span className="font-medium text-neutral-900">{hours}</span>
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
            {services && (services.items as string[])?.length > 0 && (
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-neutral-900 flex items-center">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
                  {(services.title as string) || 'Nos services'}
                </h2>
                {Boolean(services.subtitle) && (
                  <p className="text-neutral-600 mb-6 ml-6">{services.subtitle as string}</p>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  {(services.items as string[]).map((service, idx) => (
                    <motion.div
                      key={service}
                      className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl hover:bg-amber-50 transition-all duration-300 group cursor-default"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                      <span className="font-medium text-neutral-800 group-hover:text-amber-800 transition-colors">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Specialties */}
            {specialties && (specialties.items as Array<{ title: string; icon?: string; description?: string }>)?.length > 0 && (
              <motion.div 
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 lg:p-8 border border-amber-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
                  {(specialties.title as string) || 'Nos spécialités'}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(specialties.items as Array<{ title: string; icon?: string; description?: string }>).map((spec, idx) => (
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
                  {(cta.title as string) || 'Prendre rendez-vous'}
                </h3>
                <div className="space-y-4">
                  {Boolean(cta.rdvUrl) && (
                    <motion.a
                      href={cta.rdvUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>{(cta.rdvLabel as string) || 'Réserver en ligne'}</span>
                    </motion.a>
                  )}
                  {Boolean(cta.phone) && (
                    <motion.a
                      href={`tel:${(cta.phone as string).replace(/\s/g, '')}`}
                      className="w-full border-2 border-white/30 hover:border-white/60 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Phone className="w-5 h-5" />
                      <span>{(cta.phoneLabel as string) || 'Appeler'}</span>
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
                  {(reviews.title as string) || 'Avis clients'}
                </h3>
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(reviews.rating as number) ? 'text-amber-500 fill-amber-500' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 mb-1">
                    {reviews.rating as number}<span className="text-lg text-neutral-400">/5</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {reviews.reviewCount as number} avis vérifiés
                  </p>
                  {Boolean(reviews.source) && (
                    <button className="mt-4 text-amber-700 hover:text-amber-900 font-medium text-sm underline-offset-4 hover:underline transition-all">
                      {reviews.source as string}
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
                    {(map.title as string) || 'Localisation'}
                  </h3>
                </div>
                <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <MapPin className="w-12 h-12 text-amber-500/60 mb-3" />
                    <p className="text-neutral-600 text-center text-sm mb-4 whitespace-pre-line">
                      {map.address as string}
                    </p>
                    {Boolean(map.mapUrl) && (
                      <a
                        href={map.mapUrl as string}
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
        {gallery && (gallery.images as string[])?.length > 0 && (
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
              {(gallery.title as string) || 'Découvrez notre magasin'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(gallery.images as string[]).map((img, idx) => (
                <motion.div
                  key={idx}
                  className="aspect-[4/3] rounded-xl overflow-hidden relative"
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

// ============================================
// PRIMITIVE BLOCKS - Reusable Building Blocks
// ============================================

// Icon mapping for primitive blocks
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  'map-pin': MapPin,
  'phone': Phone,
  'mail': Mail,
  'clock': Clock,
  'calendar': Calendar,
  'user': User,
  'star': Star,
  'info': (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'check': Check,
  'external-link': ExternalLink,
  'arrow-right': (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
};

// Info Box Block - Display information with icon
function InfoBoxBlock({ content }: { content: Record<string, unknown> }) {
  const icon = (content.icon as string) || 'info';
  const title = content.title as string;
  const mainContent = content.content as string;
  const link = content.link as string;
  const linkLabel = content.linkLabel as string;
  const secondaryContent = content.secondaryContent as string;
  const secondaryLink = content.secondaryLink as string;
  const variant = (content.variant as string) || 'default';

  const IconComponent = iconMap[icon] || iconMap['info'];

  const variantClasses = {
    default: 'bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-neutral-100',
    compact: 'p-3',
    card: 'bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300',
  };

  const ContentWrapper = link ? motion.a : motion.div;
  const wrapperProps = link ? { href: link, target: link.startsWith('http') ? '_blank' : undefined, rel: link.startsWith('http') ? 'noopener noreferrer' : undefined } : {};

  return (
    <ContentWrapper
      {...wrapperProps}
      className={`flex items-start gap-4 group ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${link ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={link ? { scale: 1.01 } : undefined}
    >
      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
        <IconComponent className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
        {mainContent && (
          <p className="text-neutral-600 whitespace-pre-line">{mainContent}</p>
        )}
        {secondaryContent && (
          secondaryLink ? (
            <a href={secondaryLink} className="text-amber-700 hover:text-amber-900 transition-colors block mt-1">
              {secondaryContent}
            </a>
          ) : (
            <p className="text-neutral-500 text-sm mt-1">{secondaryContent}</p>
          )
        )}
        {linkLabel && (
          <span className="text-amber-700 font-medium text-sm mt-2 inline-flex items-center gap-1">
            {linkLabel}
            <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </ContentWrapper>
  );
}

// Hours Table Block - Opening hours display
function HoursTableBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const hours = (content.hours as Record<string, string>) || {};
  const showIcon = content.showIcon !== false;
  const highlightToday = content.highlightToday !== false;
  const variant = (content.variant as string) || 'table';

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  if (Object.keys(hours).length === 0) return null;

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {showIcon && (
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          )}
          <h3 className="font-semibold text-neutral-900">{title}</h3>
        </div>
      )}
      <div className={`space-y-2 ${title ? '' : 'pt-0'}`}>
        {Object.entries(hours).map(([day, hoursValue]) => {
          const isToday = highlightToday && day.toLowerCase() === todayCapitalized.toLowerCase();
          return (
            <div 
              key={day} 
              className={`flex justify-between py-2 px-3 rounded-lg transition-colors ${
                isToday 
                  ? 'bg-amber-50 border border-amber-200' 
                  : 'border-b border-neutral-100 last:border-0'
              }`}
            >
              <span className={`${isToday ? 'font-semibold text-amber-800' : 'text-neutral-600'}`}>
                {day}
                {isToday && <span className="ml-2 text-xs text-amber-600">(Aujourd'hui)</span>}
              </span>
              <span className={`font-medium ${isToday ? 'text-amber-900' : 'text-neutral-900'}`}>
                {hoursValue}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Services List Block - List of services with styling
function ServicesListBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const services = (content.services as string[]) || [];
  const columns = (content.columns as number) || 2;
  const variant = (content.variant as string) || 'bullets';
  const iconColor = (content.iconColor as string) || 'amber';

  if (services.length === 0) return null;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
  };

  const variantStyles = {
    bullets: {
      container: 'bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100',
      item: 'flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors group',
      icon: <div className={`w-2 h-2 bg-${iconColor}-500 rounded-full flex-shrink-0`} />,
    },
    checks: {
      container: 'bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100',
      item: 'flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group',
      icon: <Check className="w-4 h-4 text-green-600 flex-shrink-0" />,
    },
    cards: {
      container: '',
      item: 'bg-white rounded-xl p-4 shadow-sm border border-neutral-100 hover:shadow-md hover:border-amber-200 transition-all group',
      icon: <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    },
    badges: {
      container: 'flex flex-wrap gap-2',
      item: 'inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-amber-100 rounded-full transition-colors group',
      icon: <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />,
    },
  };

  const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.bullets;

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <h3 className="text-xl font-bold mb-2 text-neutral-900 flex items-center">
          <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-3"></span>
          {title}
        </h3>
      )}
      {subtitle && <p className="text-neutral-600 mb-4 ml-5">{subtitle}</p>}
      <div className={`grid gap-3 ${gridCols[columns as keyof typeof gridCols] || gridCols[2]}`}>
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className={styles.item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ x: variant === 'badges' ? 0 : 3 }}
          >
            {styles.icon}
            <span className="font-medium text-neutral-800 group-hover:text-amber-800 transition-colors">
              {service}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// CTA Card Block - Call to action card with buttons
function CtaCardBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const description = content.description as string;
  const primaryButton = content.primaryButton as { label: string; url: string; icon?: string; newTab?: boolean } | undefined;
  const secondaryButton = content.secondaryButton as { label: string; url: string; icon?: string; newTab?: boolean } | undefined;
  const variant = (content.variant as string) || 'default';

  const variantClasses = {
    default: 'bg-white rounded-2xl shadow-lg p-6 border border-neutral-100',
    dark: 'bg-neutral-900 rounded-2xl p-6 text-white',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white',
    outline: 'border-2 border-neutral-200 rounded-2xl p-6 hover:border-amber-300 transition-colors',
  };

  const primaryBtnClasses = {
    default: 'bg-neutral-900 hover:bg-amber-700 text-white',
    dark: 'bg-amber-500 hover:bg-amber-400 text-black',
    gradient: 'bg-white hover:bg-neutral-100 text-amber-700',
    outline: 'bg-amber-500 hover:bg-amber-600 text-white',
  };

  const secondaryBtnClasses = {
    default: 'border-2 border-neutral-300 hover:border-neutral-400 text-neutral-800',
    dark: 'border-2 border-white/30 hover:border-white/60 text-white',
    gradient: 'border-2 border-white/50 hover:border-white text-white',
    outline: 'border-2 border-neutral-300 hover:border-amber-400 text-neutral-800',
  };

  const IconButton = ({ icon }: { icon?: string }) => {
    if (!icon) return null;
    const IconComp = iconMap[icon];
    return IconComp ? <IconComp className="w-5 h-5" /> : null;
  };

  return (
    <motion.div 
      className={variantClasses[variant as keyof typeof variantClasses] || variantClasses.default}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${variant === 'default' || variant === 'outline' ? 'text-neutral-900' : ''}`}>
          <Calendar className="w-5 h-5 text-amber-500" />
          {title}
        </h3>
      )}
      {description && (
        <p className={`mb-4 ${variant === 'default' || variant === 'outline' ? 'text-neutral-600' : 'opacity-90'}`}>
          {description}
        </p>
      )}
      <div className="space-y-3">
        {primaryButton && (
          <motion.a
            href={primaryButton.url}
            target={primaryButton.newTab ? '_blank' : undefined}
            rel={primaryButton.newTab ? 'noopener noreferrer' : undefined}
            className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              primaryBtnClasses[variant as keyof typeof primaryBtnClasses] || primaryBtnClasses.default
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconButton icon={primaryButton.icon} />
            <span>{primaryButton.label}</span>
          </motion.a>
        )}
        {secondaryButton && (
          <motion.a
            href={secondaryButton.url}
            target={secondaryButton.newTab ? '_blank' : undefined}
            rel={secondaryButton.newTab ? 'noopener noreferrer' : undefined}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              secondaryBtnClasses[variant as keyof typeof secondaryBtnClasses] || secondaryBtnClasses.default
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconButton icon={secondaryButton.icon} />
            <span>{secondaryButton.label}</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

// Review Badge Block - Customer reviews rating display
function ReviewBadgeBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const rating = (content.rating as number) || 0;
  const reviewCount = (content.reviewCount as number) || 0;
  const source = content.source as string;
  const sourceUrl = content.sourceUrl as string;
  const showStars = content.showStars !== false;
  const variant = (content.variant as string) || 'default';

  const variantClasses = {
    default: 'bg-white rounded-2xl shadow-lg p-6 border border-neutral-100',
    compact: 'bg-white rounded-xl p-4 border border-neutral-100 flex items-center gap-4',
    detailed: 'bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100',
  };

  const SourceWrapper = sourceUrl ? 'a' : 'span';
  const sourceProps = sourceUrl ? { href: sourceUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <motion.div 
      className={variantClasses[variant as keyof typeof variantClasses] || variantClasses.default}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {variant === 'compact' ? (
        <>
          {showStars && (
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-amber-500 fill-amber-500' : 'text-neutral-200'}`}
                />
              ))}
            </div>
          )}
          <div>
            <span className="text-xl font-bold text-neutral-900">{rating}</span>
            <span className="text-neutral-400">/5</span>
            <span className="text-sm text-neutral-500 ml-2">({reviewCount} avis)</span>
          </div>
        </>
      ) : (
        <>
          {title && (
            <h3 className="text-lg font-bold mb-4 text-neutral-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              {title}
            </h3>
          )}
          <div className="text-center py-2">
            {showStars && (
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < Math.floor(rating) ? 'text-amber-500 fill-amber-500' : 'text-neutral-200'}`}
                  />
                ))}
              </div>
            )}
            <div className="text-3xl font-bold text-neutral-900 mb-1">
              {rating}<span className="text-lg text-neutral-400">/5</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              {reviewCount} avis vérifiés
            </p>
            {source && (
              <SourceWrapper
                {...sourceProps}
                className="text-amber-700 hover:text-amber-900 font-medium text-sm underline-offset-4 hover:underline transition-all cursor-pointer"
              >
                {source}
              </SourceWrapper>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

// Location Card Block - Address with map link
function LocationCardBlock({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string;
  const address = content.address as string;
  const mapUrl = content.mapUrl as string;
  const embedUrl = content.embedUrl as string;
  const showPreview = content.showPreview !== false;
  const variant = (content.variant as string) || 'default';

  const variantClasses = {
    default: 'bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100',
    compact: 'bg-white rounded-xl p-4 border border-neutral-100',
    'map-only': 'rounded-2xl overflow-hidden shadow-lg',
  };

  return (
    <motion.div 
      className={variantClasses[variant as keyof typeof variantClasses] || variantClasses.default}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {variant !== 'map-only' && (
        <div className={`${variant === 'compact' ? '' : 'p-6'}`}>
          {title && (
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-amber-500" />
              {title}
            </h3>
          )}
          {variant === 'compact' && address && (
            <p className="text-neutral-600 text-sm mb-2">{address}</p>
          )}
          {variant === 'compact' && mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 text-sm font-medium inline-flex items-center gap-1"
            >
              Voir sur Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
      {showPreview && variant !== 'compact' && (
        <div className="aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-200 relative">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <MapPin className="w-12 h-12 text-amber-500/50 mb-4" />
              {address && (
                <p className="text-neutral-600 text-center text-sm mb-4 whitespace-pre-line">
                  {address}
                </p>
              )}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir sur Google Maps
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Icon Feature Block - Feature with icon, title and description
function IconFeatureBlock({ content }: { content: Record<string, unknown> }) {
  const icon = (content.icon as string) || 'star';
  const title = content.title as string;
  const description = content.description as string;
  const link = content.link as string;
  const variant = (content.variant as string) || 'default';
  const iconBackground = content.iconBackground !== false;
  const iconColor = (content.iconColor as string) || 'amber';

  const IconComponent = iconMap[icon] || Star;

  const variantClasses = {
    default: 'flex items-start gap-4',
    card: 'bg-white rounded-xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all',
    centered: 'text-center flex flex-col items-center',
    horizontal: 'flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-amber-50 transition-colors',
  };

  const Wrapper = link ? motion.a : motion.div;
  const wrapperProps = link ? { href: link, target: link.startsWith('http') ? '_blank' : undefined, rel: link.startsWith('http') ? 'noopener noreferrer' : undefined } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${link ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={link || variant === 'card' ? { y: -2 } : undefined}
    >
      <div className={`flex-shrink-0 ${
        iconBackground 
          ? `w-12 h-12 bg-${iconColor}-100 rounded-xl flex items-center justify-center group-hover:bg-${iconColor}-200 transition-colors`
          : ''
      } ${variant === 'centered' ? 'mb-3' : ''}`}>
        <IconComponent className={`w-6 h-6 text-${iconColor}-600`} />
      </div>
      <div className={variant === 'centered' ? '' : 'flex-1'}>
        <h4 className="font-bold text-neutral-900 mb-1 group-hover:text-amber-800 transition-colors">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}
        {link && (
          <span className="text-amber-700 text-sm font-medium inline-flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            En savoir plus
            <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </Wrapper>
  );
}