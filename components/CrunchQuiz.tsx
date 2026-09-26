"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  ShoppingBag, 
  Heart, 
  Flame, 
  Leaf, 
  Star 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products as fallbackProducts, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface QuestionStep {
  title: string;
  subtitle: string;
  key: "flavor" | "occasion" | "diet";
  options: {
    id: string;
    label: string;
    descriptor: string;
    icon: string;
  }[];
}

const quizSteps: QuestionStep[] = [
  {
    title: "What flavor calls to your palate?",
    subtitle: "Select your preferred taste profile",
    key: "flavor",
    options: [
      {
        id: "Sweet",
        label: "Sweet & Naturally Caramelized",
        descriptor: "Honeycrisp apples, Ataulfo mango, toasted coconut",
        icon: "🍯",
      },
      {
        id: "Savory",
        label: "Savory & Herb-Infused",
        descriptor: "Paprika kale, Italian herbs zucchini, roasted sea salt",
        icon: "🌿",
      },
      {
        id: "Tangy",
        label: "Bright & Tangy Zest",
        descriptor: "Crisp berries, Costa Rican pineapple, freeze-dried strawberries",
        icon: "🍍",
      },
      {
        id: "Earthy",
        label: "Earthy & Mellow Crunch",
        descriptor: "Rosemary beetroot, avocado sweet potato, coconut-crisped carrots",
        icon: "🥕",
      },
    ],
  },
  {
    title: "What is your primary snacking moment?",
    subtitle: "Choose when you need that satisfying snap",
    key: "occasion",
    options: [
      {
        id: "Healthy Snack",
        label: "Mindful Daily Snack",
        descriptor: "Clean, nutrient-dense desk fuel with zero midday crash",
        icon: "🧘",
      },
      {
        id: "Party Mix",
        label: "Gourmet Party & Grazing Board",
        descriptor: "Vibrant colors & crunchy textures to impress guests",
        icon: "🥂",
      },
      {
        id: "Workout Fuel",
        label: "Pre/Post Workout Energy",
        descriptor: "Clean whole-food carbs & potassium for stamina and recovery",
        icon: "⚡",
      },
      {
        id: "Dessert",
        label: "Guilt-Free Dessert Alternative",
        descriptor: "Satisfies sweet cravings naturally without processed sugar",
        icon: "🍓",
      },
    ],
  },
  {
    title: "Any dietary preferences or lifestyle choices?",
    subtitle: "We curate exclusively whole foods with zero compromises",
    key: "diet",
    options: [
      {
        id: "No Added Sugar",
        label: "Zero Added Sugar",
        descriptor: "100% whole-fruit fructose stabilized by dietary fiber",
        icon: "🍏",
      },
      {
        id: "Vegan",
        label: "Vegan & Plant-Based",
        descriptor: "Pure harvest, unadulterated farm-to-pouch goodness",
        icon: "🌱",
      },
      {
        id: "Gluten-Free",
        label: "Gluten-Free & Clean Living",
        descriptor: "Safe, allergen-conscious small-batch drying",
        icon: "🌾",
      },
      {
        id: "Keto-Friendly",
        label: "Keto / Paleo Friendly",
        descriptor: "Low glycemic impact and wholesome clean fats",
        icon: "🥑",
      },
    ],
  },
];

export default function CrunchQuiz() {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    flavor: "Sweet",
    occasion: "Healthy Snack",
    diet: "No Added Sugar",
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>(fallbackProducts);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Fetch live products from Neon / API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProductsList(data.products);
          }
        }
      } catch (err) {
        console.error("Quiz products fetch error, using local fallback:", err);
      }
    }
    fetchProducts();
  }, []);

  const handleSelectOption = (key: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [key]: optionId }));
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    setAnswers({
      flavor: "Sweet",
      occasion: "Healthy Snack",
      diet: "No Added Sugar",
    });
  };

  // Intelligent matching calculation
  const getRecommendations = () => {
    const scored = productsList.map((p) => {
      let score = 0;
      // Flavor match
      if (p.flavorProfile === answers.flavor) score += 40;
      else if (
        (answers.flavor === "Sweet" && (p.category === "Fruit Chips" || p.category === "Dried Fruit")) ||
        (answers.flavor === "Savory" && p.category === "Vegetable Chips") ||
        (answers.flavor === "Tangy" && p.category.includes("Fruit"))
      ) {
        score += 20;
      }

      // Occasion match
      if (p.snackOccasion === answers.occasion) score += 30;

      // Dietary tag match
      if (p.tags && p.tags.some((t) => t.toLowerCase().includes(answers.diet.toLowerCase()))) {
        score += 30;
      }

      // Stock and rating bonus
      if (p.inStock) score += 5;
      if (p.rating >= 4.8) score += 5;

      return { product: p, score: Math.min(99, Math.max(78, score)) };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  };

  const recommendations = getRecommendations();

  return (
    <section id="quiz" className="relative bg-white py-20 lg:py-28 border-t border-[#F0E2C4] overflow-hidden">
      {/* Background warm aesthetic orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[#F57C00]/6 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-[400px] w-[400px] rounded-full bg-[#2E7D32]/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F57C00]/25 bg-[#FFF3D6] px-4 py-1.5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#C2410C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2410C]">
              Intelligent Taste Matcher
            </span>
          </div>

          <h2 className="font-heading mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#3E2723]">
            Find Your Perfect Crunch
          </h2>
          <p className="mt-3 text-base text-[#3E2723]/70 leading-relaxed">
            Answer 3 quick questions. Our flavor algorithm scans small-batch harvests from our
            pantry to find the exact artisanal crisps your body craves.
          </p>
        </div>

        {/* Quiz Container Card */}
        <div className="mt-12 rounded-[2.5rem] border border-[#F0E2C4] bg-[#FFF3D6]/70 p-6 sm:p-10 lg:p-12 shadow-[0_15px_45px_rgba(62,39,35,0.06)] backdrop-blur-sm">
          {!isCompleted ? (
            <div>
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-[#3E2723]/55 mb-2">
                  <span>Step {currentStep + 1} of {quizSteps.length}</span>
                  <span className="text-[#C2410C]">
                    {Math.round(((currentStep + 1) / quizSteps.length) * 100)}% Completed
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F0E2C4] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#F57C00] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>

              {/* Step Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                  <div className="mb-6">
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#3E2723]">
                      {quizSteps[currentStep].title}
                    </h3>
                    <p className="text-sm text-[#3E2723]/55 mt-1">
                      {quizSteps[currentStep].subtitle}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quizSteps[currentStep].options.map((option) => {
                      const isSelected = answers[quizSteps[currentStep].key] === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelectOption(quizSteps[currentStep].key, option.id)}
                          className={`group flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 ${
                            isSelected
                              ? "border-[#F57C00] bg-white shadow-[0_8px_24px_rgba(245,124,0,0.15)] ring-2 ring-[#F57C00]/20"
                              : "border-[#F0E2C4] bg-white/90 hover:border-[#2E7D32] hover:bg-white hover:shadow-sm"
                          }`}
                        >
                          <span className="text-3xl p-2 rounded-xl bg-[#FFF3D6] flex-shrink-0 group-hover:scale-110 transition-transform">
                            {option.icon}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-heading text-lg font-bold text-[#3E2723]">
                                {option.label}
                              </span>
                              {isSelected && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F57C00] text-white">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[#3E2723]/70 leading-relaxed">
                              {option.descriptor}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Footer */}
                  <div className="mt-8 flex items-center justify-between border-t border-[#F0E2C4] pt-6">
                    <button
                      onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                      disabled={currentStep === 0}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E2723]/55 hover:text-[#3E2723] transition-colors disabled:opacity-40 disabled:hover:text-[#3E2723]/55"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </button>

                    <button
                      onClick={() => {
                        if (currentStep < quizSteps.length - 1) {
                          setCurrentStep((prev) => prev + 1);
                        } else {
                          setIsCompleted(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#3E2723] px-6 py-2.5 text-xs font-semibold text-[#FFF8E7] shadow-sm transition-all duration-300 hover:bg-[#F57C00]"
                    >
                      {currentStep === quizSteps.length - 1 ? "Calculate Matches" : "Next Step"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Results Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F0E2C4] pb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
                    Personalized Recommendation
                  </span>
                  <h3 className="font-heading mt-1 text-2xl sm:text-3xl font-bold text-[#3E2723]">
                    Your Perfect Crunch Lineup
                  </h3>
                  <p className="mt-1 text-xs text-[#3E2723]/70">
                    Curated for <strong className="font-medium text-[#C2410C]">{answers.flavor}</strong> flavors, tailored for{" "}
                    <strong className="font-medium text-[#C2410C]">{answers.occasion}</strong> with{" "}
                    <strong className="font-medium text-[#2E7D32]">{answers.diet}</strong> integrity.
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#F0E2C4] bg-white px-4 py-2 text-xs font-semibold text-[#3E2723] transition-colors hover:bg-[#F0E2C4]"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#C2410C]" />
                  Retake Quiz
                </button>
              </div>

              {/* Recommended Product Cards Grid */}
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {recommendations.map(({ product, score }, idx) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col rounded-3xl border border-[#F0E2C4] bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#F57C00]/40"
                  >
                    {/* Top Match Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-[#F57C00]/10 px-3 py-1 text-[11px] font-bold text-[#C2410C] flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {score}% Match
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">
                          Top Choice
                        </span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#FFF3D6] mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <h4 className="font-heading text-lg font-bold text-[#3E2723] leading-tight">
                      <Link href={`/products/${product.id}`} className="hover:text-[#C2410C] transition-colors">
                        {product.name}
                      </Link>
                    </h4>
                    <p className="mt-1 text-xs text-[#3E2723]/70 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="mt-3 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#FFC107] text-[#C2410C]" />
                      <span className="text-xs font-bold text-[#3E2723]">{product.rating}</span>
                      <span className="text-[11px] text-[#3E2723]/55">({product.reviewCount})</span>
                    </div>

                    {/* Add to Basket Action */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#F0E2C4] pt-3">
                      <span className="font-heading text-lg font-bold text-[#3E2723]">
                        ${product.price.toFixed(2)}
                      </span>

                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          setAddedId(product.id);
                          setTimeout(() => setAddedId(null), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#3E2723] px-4 py-2 text-xs font-semibold text-[#FFF8E7] transition-all hover:bg-[#F57C00]"
                      >
                        {addedId === product.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Discovery Link */}
              <div className="mt-8 text-center">
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#3E2723] hover:text-[#C2410C] transition-colors"
                >
                  Explore All 12 Artisanal Varieties in The Pantry &rarr;
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
