import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Brand } from "@/types";

interface BrandContextType {
  currentBrand: Brand | null;
  brands: Brand[];
  setCurrentBrand: (brand: Brand) => void;
  isLoading: boolean;
}

const BrandContext = createContext<BrandContextType>({
  currentBrand: null,
  brands: [],
  setCurrentBrand: () => {},
  isLoading: true,
});

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['/api/brands'],
    staleTime: 60 * 1000, // 1 minute
  });

  useEffect(() => {
    if (brands.length > 0 && !currentBrand) {
      // Set first brand as default if none is selected
      setCurrentBrand(brands[0]);
    }
  }, [brands, currentBrand]);

  const handleSetCurrentBrand = (brand: Brand) => {
    setCurrentBrand(brand);
    // Save selected brand to localStorage
    localStorage.setItem('baytbrands-current-brand', JSON.stringify(brand));
  };

  // Load saved brand from localStorage on mount
  useEffect(() => {
    const savedBrand = localStorage.getItem('baytbrands-current-brand');
    if (savedBrand) {
      try {
        const parsedBrand = JSON.parse(savedBrand);
        setCurrentBrand(parsedBrand);
      } catch (error) {
        console.error('Error parsing saved brand', error);
      }
    }
  }, []);

  return (
    <BrandContext.Provider 
      value={{ 
        currentBrand, 
        brands, 
        setCurrentBrand: handleSetCurrentBrand, 
        isLoading 
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
