import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrunchQuiz from "@/components/CrunchQuiz";

export const metadata = {
  title: "Find Your Perfect Crunch Quiz",
  description:
    "Answer 3 quick questions to discover your personalized artisan dehydrated fruit & vegetable snack curation from Anjanadri.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-[80vh] bg-white">
        <CrunchQuiz />
      </main>
      <Footer />
    </>
  );
}
