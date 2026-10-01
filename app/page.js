import { getMenuData } from "@/lib/getMenuData";
import { LocationProvider } from "@/context/LocationContext";
import SplashPicker from "@/components/SplashPicker";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Social from "@/components/Social";
import Story from "@/components/Story";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Menus from "@/components/Menus";
import Order from "@/components/Order";
import Visit from "@/components/Visit";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getMenuData();

  return (
    <LocationProvider>
      <SplashPicker />
      <Header />
      <main id="top">
        <Hero />
        <Social />
        <Story />
        <Reviews />
        <Gallery />
        <Menus locations={data.locations} />
        <Order />
        <Visit />
        <Contact />
      </main>
      <Footer />
    </LocationProvider>
  );
}
