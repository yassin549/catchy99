import { useEffect } from 'react';

/**
 * A hook that applies a transform effect to an element based on scroll position.
 * @param {React.RefObject<HTMLElement>} ref - The ref of the element to transform.
 * @param {number} end - The scroll position (in pixels) where the effect should complete.
 * @param {number} initialScale - The starting scale of the element at scroll position 0.
 * @param {number} finalScale - The final scale of the element at the 'end' scroll position.
 */
export const useScrollEffect = (ref, end, initialScale = 1.1, finalScale = 1.0) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / end, 1); // Progress from 0 to 1

      // Interpolate scale based on scroll progress
      const scale = initialScale - (initialScale - finalScale) * progress;
      
      ref.current.style.transform = `scale(${scale})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial state on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, end, initialScale, finalScale]);
};
