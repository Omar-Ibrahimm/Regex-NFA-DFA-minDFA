import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from '../GenericComponents/Navbar/Navbar';
import HomePage from '../pages/Home/HomePage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-secondary">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add FSM page route later */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;