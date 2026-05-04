import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Modules from "./components/Modules";
import About from "./components/About";
import Contact from "./components/Contact";

// Page d'accueil (Landing Page)
const Home = () => (
  <>
    <Hero />
    <Features />
    <Testimonials />
    <CTA />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Modules />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Pages à venir : Login, Register */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;