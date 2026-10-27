'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';

export const GlobalPageLoader: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Initial page load state
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [initialFadeOut, setInitialFadeOut] = useState(false);

  // Top navigation progress bar state
  const [isNavigating, setIsNavigating] = useState(false);
  const [navProgress, setNavProgress] = useState(0);

  // Manual loading event state (triggered by custom events from any part of the app)
  const [customLoading, setCustomLoading] = useState<{
    active: boolean;
    text?: string;
    subtext?: string;
  }>({ active: false });

  // 1. Initial Page Load handler: wait until DOM is ready and window is loaded
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleComplete = () => {
      // Ensure smooth entrance without harsh flashing
      timeoutId = setTimeout(() => {
        setInitialFadeOut(true);
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500); // Wait for CSS fade-out transition to complete
      }, 350);
    };

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        handleComplete();
      } else {
        window.addEventListener('load', handleComplete);
        // Fallback safety timeout so it never gets stuck
        const safetyTimer = setTimeout(handleComplete, 2500);
        return () => {
          window.removeEventListener('load', handleComplete);
          clearTimeout(safetyTimer);
          clearTimeout(timeoutId);
        };
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // 2. Track route transitions via pathname/searchParams changes
  useEffect(() => {
    // When path changes, finish navigation progress bar
    if (isNavigating) {
      setNavProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setNavProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // 3. Intercept internal navigation clicks to show top luxury progress bar
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('https://wa.me') ||
        target.target === '_blank'
      ) {
        return;
      }

      // If it's an internal route that differs from current path
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          setIsNavigating(true);
          setNavProgress(25);
          startTransition(() => {
            setTimeout(() => setNavProgress(70), 100);
          });
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // 4. Listen for programmatic loading events from buttons, forms, or auth actions
  useEffect(() => {
    const handleCustomLoader = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.active === 'boolean') {
        setCustomLoading({
          active: detail.active,
          text: detail.text,
          subtext: detail.subtext,
        });
      }
    };

    window.addEventListener('zen:loading', handleCustomLoader);
    return () => {
      window.removeEventListener('zen:loading', handleCustomLoader);
    };
  }, []);

  return (
    <>
      {/* Sleek Top Gold Progress Bar for route navigation */}
      {isNavigating && (
        <div className="zen-top-loader-track" aria-hidden="true">
          <div
            className="zen-top-loader-bar"
            style={{ width: `${navProgress}%` }}
          />
        </div>
      )}

      {/* Initial Full Page Loader */}
      {isInitialLoading && (
        <div
          className={`zen-initial-loader ${initialFadeOut ? 'zen-initial-loader-fade' : ''}`}
        >
          <LoadingSpinner
            fullScreen
            size="lg"
            text="ESPACIO ÍNTIMO"
            subtext="Preparando tu santuario de bienestar..."
            showLogo
          />
        </div>
      )}

      {/* Programmatic / Custom Fullscreen Loader */}
      {customLoading.active && (
        <div className="zen-custom-loader-overlay">
          <LoadingSpinner
            fullScreen
            size="lg"
            text={customLoading.text || 'ESPACIO ÍNTIMO'}
            subtext={customLoading.subtext || 'Procesando tu solicitud...'}
            showLogo
          />
        </div>
      )}
    </>
  );
};

/**
 * Utility helper to programmatically trigger the global loading screen from anywhere
 */
export const triggerGlobalLoader = (active: boolean, text?: string, subtext?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('zen:loading', {
        detail: { active, text, subtext },
      })
    );
  }
};
