import { useState } from "react";
import "./App.css";
import FSMVisualizer from "../FSMVisualizer/FSMVisualizer";

const App = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    const root = document.getElementById('root');
    const isDarkMode = root?.classList.contains('dark');
    root?.classList.remove('dark', 'light');
    root?.classList.add(isDarkMode ? 'light' : 'dark');
  };


  return (
    <div className={`min-h-screen bg-background`}>
      <div className="p-4">
        <button
          onClick={handleToggleDarkMode}
          className="mb-4 p-2 rounded bg-toggler hover:bg-togglerHover transition duration-150 text-gray-800 dark:text-white"
        >
          Toggle Dark Mode
        </button>
        <div className="w-full h-full flex justify-center">
          <FSMVisualizer isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default App;
