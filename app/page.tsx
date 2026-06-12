import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import HomeSections from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <div className="landing-scope flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HomeSections />
      </main>
      <Footer />
    </div>
  );
}
