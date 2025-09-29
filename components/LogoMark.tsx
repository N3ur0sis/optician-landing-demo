import type { CSSProperties } from 'react';

interface LogoMarkProps {
  color?: string;
  className?: string;
}

const maskStyle: CSSProperties = {
  WebkitMaskImage: 'url(/Logo-ODB.png)',
  maskImage: 'url(/Logo-ODB.png)',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  display: 'block',
};

const LogoMark = ({ color = '#000', className = '' }: LogoMarkProps) => (
  <span
    aria-hidden="true"
    className={`aspect-[2628/1430] ${className}`.trim()}
    style={{ ...maskStyle, backgroundColor: color }}
  />
);

export default LogoMark;
