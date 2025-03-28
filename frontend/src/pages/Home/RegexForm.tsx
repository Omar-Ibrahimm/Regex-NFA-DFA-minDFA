import { useState, FormEvent } from "react";

const RegexForm = () => {
  const [regex, setRegex] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter regular expression to visualize (e.g., a|b*)"
          className="flex-1 p-3 w-2/3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-txt bg-secondary"
        />
        <button
          type="submit"
          disabled={regex === "" || isLoading}
          className="px-6 py-3 ml-4 bg-gradient-to-r from-button to-button/90 text-white rounded-lg 
                hover:from-button/90 hover:to-button/80 disabled:from-gray-400 disabled:to-gray-500 
                disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg 
                disabled:shadow-none disabled:opacity-70"
        >
          {isLoading ? "Generating..." : "Generate FSMs"}
        </button>
      </form>
    </>
  );
};

export default RegexForm;
