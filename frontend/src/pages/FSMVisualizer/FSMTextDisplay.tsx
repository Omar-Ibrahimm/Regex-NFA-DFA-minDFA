import { State, Transition, ParsedFSM } from "../../types/FSM";
import { Download } from "@mui/icons-material";

interface FSMTextDisplayProps {
  fsm: ParsedFSM;
  selectedState: string | null;
}

const FSMTextDisplay = ({ fsm, selectedState }: FSMTextDisplayProps) => {
  const handleExport = () => {
    const jsonStr = JSON.stringify(fsm, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fsm.type}_fsm.json`;
    link.click();
  };

  return (
    <div className="relative bg-card text-text border border-card-border rounded p-4 w-[300px] h-[600px] overflow-y-auto">
      {/* Export Button on Top Right */}
      <button
        className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
        onClick={handleExport}
        title="Export as JSON"
      >
        <Download className="text-btn hover:text-btn-hover" />
      </button>

      <h2 className="text-lg font-bold mb-2">FSM {fsm.type} Summary</h2>

      <p>
        <span className="font-semibold">Type:</span> {fsm.type}
      </p>
      <p>
        <span className="font-semibold">Starting State:</span>{" "}
        {fsm.startingState}
      </p>

      <p className="mt-2 font-semibold">States:</p>
      <ul className="ml-4 list-disc">
        {fsm.states.map((state: State) => (
          <li key={state.id}>
            <span
              className={
                state.id === selectedState ? "font-bold text-text-selected" : ""
              }
            >
              {state.id}
              {state.isTerminating ? " (Terminating)" : ""}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-2 font-semibold">Transitions:</p>
      <ul className="ml-4 list-disc">
        {fsm.transitions.map((t: Transition, idx) => {
          const isSelected =
            selectedState &&
            (t.from === selectedState || t.to === selectedState);
          return (
            <li
              key={idx}
              className={isSelected ? "text-green-500 font-semibold" : ""}
            >
              {t.from} → [{t.symbol === "epsilon" ? "ε" : t.symbol}] → {t.to}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FSMTextDisplay;
