import React, { useEffect, useState } from 'react';
import { BearMascotSvg } from './BrandLogo';
import { resolveAssetUrl } from '../data/mockCatalog';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
}) => {
  const resolvedPrimary = resolveAssetUrl(src);
  const resolvedFallback = fallbackSrc ? resolveAssetUrl(fallbackSrc) : '';
  const [activeSrc, setActiveSrc] = useState(resolvedPrimary);
  const [failed, setFailed] = useState(!resolvedPrimary);

  useEffect(() => {
    const next = resolveAssetUrl(src);
    setActiveSrc(next);
    setFailed(!next);
  }, [src]);

  const handleError = () => {
    if (resolvedFallback && activeSrc !== resolvedFallback) {
      setActiveSrc(resolvedFallback);
      return;
    }
    setFailed(true);
  };

  if (failed || !activeSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4DDE3] via-[#FFF8EF] to-[#E9E2F5] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BearMascotSvg className="w-14 h-14 mb-2 opacity-95" />
        <span className="font-ui text-xs font-medium text-[#765B55]/80 line-clamp-2 max-w-[160px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={handleError}
      className={className}
    />
  );
};
