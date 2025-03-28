import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../GenericComponents/Navbar/Navbar";
import HomePage from "../pages/Home/HomePage";
import { RegexProvider } from "../contexts/RegexContext";

const App = () => {
  return (
    <RegexProvider>
      <Router>
        <div className="min-h-screen bg-secondary">
          <NavBar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Add other routes later */}
            </Routes>
          </main>
        </div>
      </Router>
    </RegexProvider>
  );
};

export default App;
