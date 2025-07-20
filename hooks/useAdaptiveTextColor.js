import { useEffect, useRef } from 'react';

// --- Precise WCAG Contrast Calculation (as specified) ---

function toLinear(c) {
  return c.map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
}
function luminance([r, g, b]) {
  const [R, G, B] = toLinear([r, g, b]);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrast(L1, L2) {
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function chooseTextColor(avgRgb) {
  const Lbg = luminance(avgRgb);
  const whiteContrast = contrast(1.0, Lbg);
  const blackContrast = contrast(Lbg, 0.0);

  if (whiteContrast >= 4.5 && whiteContrast >= blackContrast) return '#FFFFFF';
  if (blackContrast >= 4.5) return '#000000';

  // Both fail—pick best and log a warning
  console.warn('Cannot meet 4.5:1 contrast; selecting best effort.');
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

// --- React Hook with Advanced Canvas Sampling ---

export const useAdaptiveTextColor = (navbarRef, sectionSelector) => {
  // Use a ref to hold the canvas. It will be created client-side.
  const canvasRef = useRef(null);

  useEffect(() => {
    const navbarEl = navbarRef.current;
    if (!navbarEl) return;

    // --- Client-Side Canvas Creation ---
    // Create the canvas element only once and store it in the ref.
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const sections = document.querySelectorAll(sectionSelector);
    if (sections.length === 0) return;

    const navbarHeight = navbarEl.offsetHeight;

    /**
     * Samples the visual area of a section directly behind the navbar
     * by drawing it to a canvas and calculating the average pixel color.
     * @param {HTMLElement} sectionEl - The section element to sample.
     * @returns {[number, number, number]} The average [r, g, b] color.
     */
    /**
     * Samples the visual area of a section by rendering its DOM to an SVG,
     * drawing that SVG to a canvas, and calculating the average pixel color.
     * @param {HTMLElement} sectionEl - The section element to sample.
     * @param {() => void} callback - A function to call with the average RGB color.
     */
    function sampleBackground(sectionEl, callback) {
      const rect = sectionEl.getBoundingClientRect();
      const clone = sectionEl.cloneNode(true);

      // Must set the clone's position to match the original's scroll position
      clone.style.transform = `translateY(-${sectionEl.scrollTop}px)`;

      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('width', rect.width);
      foreignObject.setAttribute('height', rect.height);
      foreignObject.appendChild(clone);

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', rect.width);
      svg.setAttribute('height', rect.height);
      svg.appendChild(foreignObject);

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        canvas.width = rect.width;
        canvas.height = navbarHeight;

        // Draw the loaded SVG image onto the canvas.
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, rect.width, navbarHeight).data;
        let r = 0, g = 0, b = 0, count = 0;
        const step = 10; // Sample every 10px for performance

        for (let y = 0; y < navbarHeight; y += step) {
          for (let x = 0; x < rect.width; x += step) {
            const i = (y * rect.width + x) * 4;
            const alpha = data[i + 3] / 255;

            r += data[i] * alpha + 255 * (1 - alpha);
            g += data[i + 1] * alpha + 255 * (1 - alpha);
            b += data[i + 2] * alpha + 255 * (1 - alpha);
            count++;
          }
        }
        callback([Math.round(r / count), Math.round(g / count), Math.round(b / count)]);
      };

      img.onerror = () => {
        console.error('Failed to load SVG image for color sampling.');
      };

      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target.parentElement;
          if (section) {
            // The sampling is now async, so we use a callback.
            sampleBackground(section, (avgRgb) => {
              navbarEl.style.color = chooseTextColor(avgRgb);
            });
          }
        }
      },
      {
        rootMargin: `-${navbarHeight}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    const sentinels = [];
    sections.forEach(section => {
      const sentinel = document.createElement('div');
      sentinel.style.height = `${navbarHeight}px`;
      // Make sentinel invisible and non-interactive.
      sentinel.style.position = 'absolute';
      sentinel.style.top = '0';
      sentinel.style.zIndex = -1;
      sentinel.style.pointerEvents = 'none';

      // The section needs to be a positioning context for the sentinel.
      if (window.getComputedStyle(section).position === 'static') {
          section.style.position = 'relative';
      }

      section.prepend(sentinel);
      observer.observe(sentinel);
      sentinels.push(sentinel);
    });

    return () => {
      observer.disconnect(); // Disconnects all observers at once.
      sentinels.forEach(sentinel => sentinel.remove());
    };
  }, [navbarRef, sectionSelector, canvasRef]);
};
