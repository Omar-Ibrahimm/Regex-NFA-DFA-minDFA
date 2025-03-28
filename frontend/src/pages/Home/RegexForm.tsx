import { useState, FormEvent } from "react";
import { useRegexContext } from "../../contexts/RegexContext";
import { FSM } from "../../GenericComponents/Interfaces/FSMState";

const sampleData: FSM = {
  startingState: "S0",
  S0: {
    isTerminatingState: false,
    a: ["S1"],
    b: ["S0"],
  },
  S1: {
    isTerminatingState: false,
    a: ["S0"],
    b: ["S2"],
  },
  S2: {
    isTerminatingState: false,
    a: ["S0"],
    b: ["S3"],
  },
  S3: {
    isTerminatingState: true,
    a: ["S0"],
    b: ["S0"],
  },
};

const RegexForm = () => {
  const [localRegex, setLocalRegex] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setRegex, setIsRegexLoaded, setFsms } = useRegexContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setIsRegexLoaded(false);

    try {
      // TODO: Add API here to fetch the array of 3 jsons

      // Update context
      setRegex(localRegex);
      setFsms([
        {
          type: "NFA",
          data: sampleData,
        },
        {
          type: "DFA",
          data: sampleData,
        },
        {
          type: "MIN_DFA",
          data: sampleData,
        },
      ]); // TODO: set with the response when API is implemented
      setIsRegexLoaded(true);
      setLocalRegex("");
    } catch (error) {
      console.error("Error generating FSMs:", error);
      // Handle error (maybe add error state to context)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={localRegex}
          onChange={(e) => setLocalRegex(e.target.value)}
          placeholder="Enter regular expression to visualize (e.g., a|b*)"
          className="flex-1 p-3 border-2 border-border rounded-lg
            focus:outline-none focus:border-accent
            text-txt bg-secondary placeholder:text-txt/50
            transition-colors duration-200"
        />

        <button
          type="submit"
          disabled={localRegex === "" || isLoading}
          className="px-6 py-3 bg-gradient-to-r from-button to-button/90 text-white rounded-lg 
                hover:from-button/90 hover:to-button/80 disabled:from-gray-400 disabled:to-gray-500 
                disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg 
                disabled:shadow-none disabled:opacity-70"
        >
          {isLoading ? "Generating..." : "Generate FSMs"}
        </button>
      </div>
    </form>
  );
};

export default RegexForm;
