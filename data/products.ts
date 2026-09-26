export interface NutrientInsight {
  name: string;
  amount: string;
  benefit: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isBestSeller?: boolean;
  stock?: number;
  weight: string;
  tags: string[];
  flavorProfile?: "Sweet" | "Savory" | "Tangy" | "Earthy";
  snackOccasion?: "Healthy Snack" | "Party Mix" | "Workout Fuel" | "Dessert";
  complementaryIds?: string[];
  nutrients?: NutrientInsight[];
}

const baseTags = ["100% Natural", "No Preservatives", "Vegan"];

export const products: Product[] = [
  {
    id: "sticky-banana",
    name: "Sticky Banana",
    price: 190,
    originalPrice: 220,
    description:
      "Our flagship dehydrated sticky banana. Naturally sweet Mysore bananas, slow-dried to a chewy golden bite with no preservatives or added sugar.",
    shortDescription: "Flagship dehydrated sticky banana. Chewy, naturally sweet.",
    image: "/images/sticky-banana.jpg",
    category: "Fruits",
    rating: 4.9,
    reviewCount: 512,
    inStock: true,
    isBestSeller: true,
    stock: 40,
    weight: "200g",
    tags: [...baseTags, "Best Seller", "Dehydrated"],
    flavorProfile: "Sweet",
    snackOccasion: "Healthy Snack",
    complementaryIds: ["dried-mango", "dried-banana", "dried-apple"],
  },
  {
    id: "dried-mango",
    name: "Dried Mango",
    price: 160,
    description: "Sweet and tangy dehydrated mango slices made from ripe Indian mangoes.",
    shortDescription: "Sweet and tangy dehydrated mango slices.",
    image: "/images/mango.jpg",
    category: "Fruits",
    rating: 4.8,
    reviewCount: 320,
    inStock: true,
    stock: 30,
    weight: "200g",
    tags: [...baseTags, "Dehydrated"],
    flavorProfile: "Sweet",
    snackOccasion: "Healthy Snack",
    complementaryIds: ["sticky-banana", "dried-banana", "dried-apple"],
  },
  {
    id: "dried-banana",
    name: "Dried Banana",
    price: 150,
    description: "Classic crispy banana chips, naturally sweet and dehydrated.",
    shortDescription: "Classic crispy banana chips, naturally sweet.",
    image: "/images/banana.jpg",
    category: "Fruits",
    rating: 4.8,
    reviewCount: 280,
    inStock: true,
    stock: 35,
    weight: "200g",
    tags: [...baseTags, "Dehydrated"],
    flavorProfile: "Sweet",
    snackOccasion: "Healthy Snack",
    complementaryIds: ["sticky-banana", "dried-mango", "dried-apple"],
  },
  {
    id: "dried-apple",
    name: "Dried Apple",
    price: 170,
    description: "Crisp apple rings with a hint of cinnamon, gently dehydrated.",
    shortDescription: "Crisp apple rings with a hint of cinnamon.",
    image: "/images/apple.jpg",
    category: "Fruits",
    rating: 4.7,
    reviewCount: 190,
    inStock: true,
    stock: 25,
    weight: "200g",
    tags: [...baseTags, "Gluten-Free"],
    flavorProfile: "Sweet",
    snackOccasion: "Healthy Snack",
    complementaryIds: ["dried-mango", "dried-banana", "sticky-banana"],
  },
  {
    id: "dried-carrot",
    name: "Dried Carrot",
    price: 155,
    description: "Earthy and sweet carrot coins, dehydrated for a satisfying crunch.",
    shortDescription: "Earthy and sweet carrot coins.",
    image: "/images/carrot.jpg",
    category: "Vegetables",
    rating: 4.6,
    reviewCount: 140,
    inStock: true,
    stock: 28,
    weight: "200g",
    tags: [...baseTags, "Dehydrated"],
    flavorProfile: "Earthy",
    snackOccasion: "Healthy Snack",
    complementaryIds: ["dried-beetroot", "dried-okra", "dried-carrot"],
  },
  {
    id: "dried-beetroot",
    name: "Dried Beetroot",
    price: 165,
    description: "Rich in iron, vibrant and healthy beetroot crisps.",
    shortDescription: "Rich in iron, vibrant and healthy.",
    image: "/images/beetroot.jpg",
    category: "Vegetables",
    rating: 4.7,
    reviewCount: 175,
    inStock: true,
    stock: 22,
    weight: "200g",
    tags: [...baseTags, "Iron-Rich"],
    flavorProfile: "Earthy",
    snackOccasion: "Healthy Snack",
    complementaryIds: ["dried-carrot", "dried-okra", "dried-beetroot"],
  },
  {
    id: "dried-okra",
    name: "Dried Okra",
    price: 175,
    description: "Crunchy and savory okra chips, dehydrated to perfection.",
    shortDescription: "Crunchy and savory okra chips.",
    image: "/images/okra.jpg",
    category: "Vegetables",
    rating: 4.6,
    reviewCount: 120,
    inStock: true,
    stock: 20,
    weight: "200g",
    tags: [...baseTags, "High Fibre"],
    flavorProfile: "Savory",
    snackOccasion: "Party Mix",
    complementaryIds: ["dried-carrot", "dried-beetroot", "dried-chillies"],
  },
  {
    id: "dried-chillies",
    name: "Dried Chillies",
    price: 180,
    description: "Spicy and aromatic dehydrated chillies from Karnataka farms.",
    shortDescription: "Spicy and aromatic dehydrated chillies.",
    image: "/images/red-chilli.jpg",
    category: "Spices",
    rating: 4.8,
    reviewCount: 210,
    inStock: true,
    stock: 32,
    weight: "200g",
    tags: [...baseTags, "Spicy", "Dehydrated"],
    flavorProfile: "Savory",
    snackOccasion: "Party Mix",
    complementaryIds: ["dried-okra", "dried-beetroot", "dried-carrot"],
  },
];
