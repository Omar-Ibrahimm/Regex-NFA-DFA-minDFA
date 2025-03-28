import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import ThemeSwitch from "./ThemeSwitch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.state && window.history.state.idx > 0);
  }, [location]);

  return (
    <nav className="w-full border-b border-border bg-secondary top-0 sticky overflow-hidden">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-extrabold text-txt hover:text-accent transition-colors tracking-wide drop-shadow-lg">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                <Link to="/">Regex Automata Visualizer</Link>
              </span>
            </h1>
          </div>

          <div className="flex items-center h-full">
            <button
              onClick={() => canGoBack && navigate(-1)}
              disabled={!canGoBack}
              className={`px-3 py-2 h-full text-primary transition-all duration-300 
                        hover:bg-button_secondary mr-1 gap-1 
                        ${!canGoBack ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ArrowBackIcon className="text-txt" />
              Go Back
            </button>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
