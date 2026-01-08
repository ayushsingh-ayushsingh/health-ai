import HeroSection from "@/components/ui/hero-section";
import ContentSection2 from "@/components/ui/content-2";
import ContentSection4 from "@/components/ui/content-4";
import FooterSection from "@/components/ui/footer";
import { HeroHeader } from "@/components/ui/header";

export default function Home() {
  return (
    <div className="bg-background/0">
      <HeroHeader />
      <HeroSection />
      <ContentSection2 />
      <ContentSection4 />
      <FooterSection />
    </div>
  );
}
