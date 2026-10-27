export interface PartnerProduct {
  id: string;
  name: string;
  imageUrl: string;
  productLink: string;
}

export interface PartnerData {
  partnerName: string;
  websiteUrl: string;
  badge: string;
  products: PartnerProduct[];
}

const websiteUrl = 'https://rahulraabta.github.io/Rithvik-Foods/';

export const rithvikFoodsData: PartnerData = {
  partnerName: 'Rithvik Foods',
  websiteUrl,
  badge: '100% Natural & Homemade',
  products: [
    {
      id: 'rithvik-product-1',
      name: 'Health Powder',
      imageUrl: 'https://raw.githubusercontent.com/rahulraabta/Rithvik-Foods/main/cat_health.webp',
      productLink: websiteUrl,
    },
    {
      id: 'rithvik-product-2',
      name: 'Premix',
      imageUrl: 'https://raw.githubusercontent.com/rahulraabta/Rithvik-Foods/main/ragi_premix.webp',
      productLink: websiteUrl,
    },
    {
      id: 'rithvik-product-3',
      name: 'Masala Powder',
      imageUrl: 'https://raw.githubusercontent.com/rahulraabta/Rithvik-Foods/main/vangi_bath.webp',
      productLink: websiteUrl,
    },
  ],
};
