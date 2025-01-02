import { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import { API_KEYS } from '../config/constants';

interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
}

export function useGoogleFonts() {
  const [fonts, setFonts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEYS.GOOGLE_FONTS}&sort=popularity`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch fonts');
        }

        const data = await response.json();
        const popularFonts = data.items
          .slice(0, 50) // Get top 50 popular fonts
          .map((font: GoogleFont) => font.family);

        setFonts(popularFonts);
        
        // Load fonts using WebFontLoader
        await new Promise((resolve, reject) => {
          WebFont.load({
            google: {
              families: popularFonts
            },
            active: resolve,
            inactive: () => reject(new Error('Failed to load fonts')),
            timeout: 5000 // 5 second timeout
          });
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load fonts');
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  return { fonts, loading, error };
}