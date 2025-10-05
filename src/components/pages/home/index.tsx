import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Program from "./components/Program";
import NewsAndEvents from "./components/NewsAndEvents";
import Admissions from "./components/Admissions";
import Testimonials from "./components/Testimonials";
import FAQs from "./components/Faqs";
import ContactAndFooter from "./components/ContactAndFooter";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Program />
      <NewsAndEvents />
      <Admissions />
      <Testimonials />
      <FAQs />
      <ContactAndFooter />
    </div>
  );
}
