import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  hidden?: boolean;
  routeKey?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  hidden = false,
  routeKey,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      setIsVisible(scrollTop > threshold);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateVisibility);
    };
  }, [threshold, routeKey]);

  const handleScrollToTop = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const showButton = isVisible && !hidden;

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!showButton}
      tabIndex={showButton ? 0 : -1}
      className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#C98F9D] hover:bg-[#b87b8a] text-[#FFFFFF] border border-[#FFFFFF]/45 shadow-[0_10px_25px_-8px_rgba(118,91,85,0.45)] hover:shadow-[0_14px_28px_-8px_rgba(118,91,85,0.55)] flex items-center justify-center transition-all duration-300 ease-boutique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#765B55] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8EF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        showButton
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
          : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 text-[#FFFFFF]" strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
};
