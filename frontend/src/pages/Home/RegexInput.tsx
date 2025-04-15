import { useState, FormEvent, useEffect } from "react";
import { useFSMContext } from "../../context/FSMContext";
import useAxiosFetch from "../../services/useAxiosFetch";
import { RawFSM, parseRawFSM } from "../../types/FSM";

const RegexInput = () => {
  const [regex, setRegex] = useState<string>("");
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const { setFSMs } = useFSMContext();

  const { data, error, loading } = useAxiosFetch<{
    nfa: RawFSM;
    dfa: RawFSM;
    min_dfa: RawFSM;
  }>("http://127.0.0.1:5000/generate", triggerFetch ? { regex } : null);

  useEffect(() => {
    if (data) {
      console.log(data);
      const parsedResults = [
        parseRawFSM(data.nfa, "NFA"),
        parseRawFSM(data.dfa, "DFA"),
        parseRawFSM(data.min_dfa, "MIN_DFA"),
      ];
      setFSMs(parsedResults);
      setTriggerFetch(false); // reset fetch trigger
    }
  }, [data, setFSMs]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!regex.trim()) return;
    setTriggerFetch(true); // trigger POST request with payload
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full mx-auto"
    >
      <div className="flex flex-col gap-2">
        <input
          type="text"
          required
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter regular expression"
          className={`p-3 rounded-lg border-2 bg-input border-input-border text-title 
                        focus:outline-none focus:border-btn ${error ? "border-red-500" : ""}`}
          disabled={loading}
        />
        {error && (
          <p className="text-red-500 text-sm">
            Error:{" "}
            {error.response?.data?.error || "Failed to generate automata"}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || (regex.length === 0 && !data)}
        className="p-3 rounded-lg bg-btn hover:bg-btn-hover font-semibold transition-colors text-text disabled:cursor-not-allowed"
      >
        {loading ? "Generating Automata..." : "Generate Automata"}
      </button>
    </form>
  );
};

export default RegexInput;
