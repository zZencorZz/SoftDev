import { FaqSection } from "@/components/main/faq";
import { Hero } from "@/components/main/hero";
import { StatsSection } from "@/components/main/stats";
import { TechSpecs } from "@/components/main/tech";

export default function Home() {
  return (
    <div className="max-w-[1150px] mx-auto px-6 py-12">
      <Hero />
      <StatsSection />
      <TechSpecs />
      <FaqSection />
    </div>
  );
}
