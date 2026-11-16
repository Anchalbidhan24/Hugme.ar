import React from 'react';
import primaryLogoImg from '../assets/logos/hugme_primary_logo.png';
import secondaryLogoImg from '../assets/logos/hugme_secondary_logo.png';
import bearIconImg from '../assets/logos/hugme_bear_icon.png';

export const LOGO_ASSETS = {
  primary: primaryLogoImg,
  secondary: secondaryLogoImg,
  icon: bearIconImg,
};

interface BrandLogoProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

export const BearMascotSvg: React.FC<{ className?: string }> = ({
  className = 'w-10 h-10',
}) => (
  <img
    src={bearIconImg}
    alt="HUGME.AR Teddy Bear Mascot"
    className={`object-contain select-none ${className}`}
  />
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  onClick,
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const heightClasses = {
    primary: {
      sm: 'h-10',
      md: 'h-12 sm:h-14',
      lg: 'h-16 sm:h-20',
      xl: 'h-24',
    },
    secondary: {
      sm: 'h-10',
      md: 'h-14 sm:h-16',
      lg: 'h-16 sm:h-20',
      xl: 'h-20 sm:h-24',
    },
    icon: {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-14',
      xl: 'h-16',
    },
  };

  const imgSrc =
    variant === 'secondary'
      ? secondaryLogoImg
      : variant === 'icon'
        ? bearIconImg
        : primaryLogoImg;

  const altText =
    variant === 'secondary'
      ? 'HUGME.AR — A hug in every little thing'
      : variant === 'icon'
        ? 'HUGME.AR Teddy Bear Icon'
        : 'HUGME.AR — A hug in every little thing';

  const imgElement = (
    <img
      src={imgSrc}
      alt={altText}
      className={`${heightClasses[variant][size]} w-auto max-w-full object-contain select-none transition-transform duration-200 ease-boutique group-hover:scale-[1.02] ${className}`}
    />
  );

  if (!onClick) {
    return <div className="inline-flex items-center shrink-0">{imgElement}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="HUGME.AR Home"
      className="inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98F9D] rounded-xl cursor-pointer shrink-0"
    >
      {imgElement}
    </button>
  );
};
