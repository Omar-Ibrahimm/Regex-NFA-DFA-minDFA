import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FSMProvider } from "./context/FSMContext";
import Navbar from "./generic/Navbar";
import Home from "./pages/Home/Home";
import FSMVisualizer from "./pages/FSMVisualizer/FSMVisualizer";

const App = () => {
  return (
    <FSMProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fsm/:fsmType" element={<FSMVisualizer />} />
        </Routes>
      </Router>
    </FSMProvider>
  );
};

export default App;
