import { useEffect, useRef, useState } from 'react';

const ScrollAnimator = ({ children, className = '', animation = 'fade-in-up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`${className} scroll-animator ${animation} ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

export default ScrollAnimator;
