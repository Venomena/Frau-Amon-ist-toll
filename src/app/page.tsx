'use client';

import { useState, useRef, FormEvent } from 'react';
import NextImage from 'next/image';

interface ProductAnalysis {
  productName: string;
  currentPrice: string;
  withoutEUPrice: string;
  priceIncrease: string;
  explanation: string;
  madeInEU: boolean;
}

// Helper function to fix iOS image orientation issues
const fixImageOrientation = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx?.drawImage(img, 0, 0);
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setAnalysis(null);
    
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Use orientation fixing for iOS photos
        const fixedImage = await fixImageOrientation(file);
        setImage(fixedImage);
      } catch {
        // Fallback to standard method if the fix fails
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      setError('Bitte wählen Sie ein Bild aus.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const formData = new FormData();
      const blob = await fetch(image).then(r => r.blob());
      formData.append('image', blob);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Analyse. Bitte versuchen Sie es erneut.');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-6 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">
            Binnenmarkt Preisdetektiv
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
            Laden Sie ein Bild eines Produkts hoch und erfahren Sie, wie viel Sie dank des EU-Binnenmarkts sparen.
          </p>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Produkt-Bild hochladen
              </label>
              
              <div className="flex justify-center px-4 sm:px-6 pt-4 pb-5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="space-y-4 text-center">
                  {image ? (
                    <div className="relative mx-auto w-full max-w-xs h-48 sm:h-64">
                      <NextImage 
                        src={image} 
                        alt="Hochgeladenes Produkt" 
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto h-24 w-24 sm:h-32 sm:w-32 text-gray-400">
                      <svg className="mx-auto h-full w-full" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none px-3 py-2 text-sm">
                      <span>{image ? 'Anderes Bild wählen' : 'Bild auswählen'}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF bis zu 10MB
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center space-x-3 sm:space-x-4">
              {image && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2 px-3 sm:px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                >
                  Zurücksetzen
                </button>
              )}
              <button
                type="submit"
                disabled={!image || isAnalyzing}
                className="py-2 px-4 sm:px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
              >
                {isAnalyzing ? 'Analysiere...' : 'Analysieren'}
              </button>
            </div>
          </form>

          {analysis && (
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 break-words">
                {analysis.productName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Aktueller Preis:</span>
                    <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{analysis.currentPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Preis ohne EU-Binnenmarkt:</span>
                    <span className="font-medium text-sm sm:text-base text-red-600 dark:text-red-400">{analysis.withoutEUPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Preisunterschied:</span>
                    <span className="font-medium text-sm sm:text-base text-blue-600 dark:text-blue-400">+{analysis.priceIncrease}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">In der EU produziert:</span>
                    <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {analysis.madeInEU ? 'Wahrscheinlich ja' : 'Wahrscheinlich nein'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t md:border-t-0 md:pt-0 border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Erklärung:</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {analysis.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
