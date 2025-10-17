export interface RingProductAttributes {
  metalType: string;
  category: string;
  availability: string;
}

export interface RingProduct {
  id: string;
  title: string;
  sku: string;
  category: string;
  collection: string;
  price: number | null;
  priceRaw: string;
  metalType: string;
  attributes: RingProductAttributes;
  mainImage: string;
  thumbnails: string[];
  description: string;
  availability: string;
  url: string;
  scrapedAt: string;
}

export type RingProductFilter = {
  category?: string[];
  collection?: string[];
  metalType?: string[];
  availability?: string[];
  searchQuery?: string;
};
