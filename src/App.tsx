import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchInput from './components/SearchInput';
import SearchResults from './components/SearchResults';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import ReviewsSection from './components/ReviewsSection';
import DashboardPage from './components/DashboardPage';
import { ThemeProvider } from './context/ThemeContext';

function HomePage() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="royal-heading text-5xl font-bold text-white mb-4 tracking-tight">
            Research Made Majestic
          </h1>
          <p className="text-xl text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
            We save your time by creating research papers
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
          <SearchInput onSearch={handleSearch} />
        </div>

        {/* Reviews Section */}
        <div className="royal-card p-6" id="reviews">
          <h2 className="royal-heading text-2xl font-semibold mb-6 text-white">Student Reviews</h2>
          <ReviewsSection />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="royal-card p-6">
            <h2 className="royal-heading text-2xl font-semibold mb-6 text-white">About Me</h2>
            <AboutSection />
          </div>

          {/* Contact Section */}
          <div className="royal-card p-6">
            <h2 className="royal-heading text-2xl font-semibold mb-6 text-white">Contact Us</h2>
            <ContactSection />
          </div>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;