import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "../GenericComponents/Navbar/Navbar";
import HomePage from "../pages/Home/HomePage";
import { RegexProvider } from "../contexts/RegexContext";
import FSMViewer from "../pages/FSM/FSMViewer";
import { SelectedStateProvider } from "../contexts/SelectedStateContext";

const App = () => {
  return (
    <SelectedStateProvider>
      <RegexProvider>
        <Router>
          <div className="min-h-screen bg-secondary">
            <NavBar />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/fsm/:fsmType" element={<FSMViewer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </RegexProvider>
    </SelectedStateProvider>
  );
};

export default App;
