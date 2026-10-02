import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/layout/CartDrawer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-poppins text-gray-900">
        <Navbar />
        <CartDrawer />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes here as we build them */}
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-deep-green text-cream py-8 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="font-playfair text-xl mb-4">Baker's Choice</p>
            <p className="text-sm opacity-80">© {new Date().getFullYear()} Baker's Choice. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
