import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Toaster } from "./components/ui/sonner";
import { FluidCanvas } from "./components/site/FluidCanvas";
import { Nav } from "./components/site/Nav";
import { Hero } from "./components/site/Hero";
import { Marquee } from "./components/site/Marquee";
import { Projects } from "./components/site/Projects";
import { CurrentProject } from "./components/site/CurrentProject";
import { Experience } from "./components/site/Experience";
import { ResumePaint } from "./components/site/ResumePaint";
import { Contact } from "./components/site/Contact";
import { Footer } from "./components/site/Footer";
import Inbox from "./pages/Inbox";

const Home = () => {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);
  return (
    <main className="relative z-10">
      <Nav />
      <Hero />
      <Marquee />
      <Projects />
      <CurrentProject />
      <Experience />
      <ResumePaint />
      <Contact />
      <Footer />
    </main>
  );
};

function App() {
  return (
    <div className="App">
      <div className="ambient-bg" />
      <FluidCanvas />
      <div className="grain" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inbox" element={<Inbox />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
