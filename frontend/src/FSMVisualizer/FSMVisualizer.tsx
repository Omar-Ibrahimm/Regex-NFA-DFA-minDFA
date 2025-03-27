import { useState } from "react";
import { FSM, FSMState } from "./FSMState";
import sampleData from "./FSMState";
import Transition from "./Transition";
import StateNode from "./StateNode";

const FSMVisualizer = () => {
  const [fsmData] = useState<FSM>(sampleData);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get states sorted alphabetically
  const states = Object.keys(fsmData)
    .filter((k) => k !== "startingState")
    .sort();

  // Calculate node positions
  const nodePositions: { [key: string]: { x: number; y: number } } = {};
  states.forEach((state, index) => {
    nodePositions[state] = { x: index * 200 + 100, y: 200 };
  });

  // Collect all transitions
  const transitions: Array<{ from: string; to: string; label: string }> = [];
  states.forEach((fromState) => {
    const stateData = fsmData[fromState] as FSMState;
    Object.entries(stateData).forEach(([key, value]) => {
      if (key === "isTerminatingState") return;
      const targets = value as string[];
      targets.forEach((toState) => {
        transitions.push({ from: fromState, to: toState, label: key });
      });
    });
  });

  return (
    <div
      className={`min-h-screen p-8 ${isDarkMode ? "dark bg-gray-900" : "bg-white"}`}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="mb-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
      >
        Toggle Dark Mode
      </button>

      <div className="relative w-full h-96">
        <svg className="absolute w-full h-full">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                className={isDarkMode ? "fill-gray-300" : "fill-gray-600"}
                points="0 0, 10 3.5, 0 7"
              />
            </marker>
          </defs>
          {transitions.map((t, i) => (
            <Transition
              key={i}
              from={t.from}
              to={t.to}
              label={t.label}
              fromPos={nodePositions[t.from]}
              toPos={nodePositions[t.to]}
              isSelected={selectedState === t.from}
              isDarkMode={isDarkMode}
            />
          ))}
        </svg>

        {states.map((state) => (
          <StateNode
            key={state}
            state={state}
            position={nodePositions[state]}
            isStarting={state === fsmData.startingState}
            isTerminating={(fsmData[state] as FSMState).isTerminatingState}
            isSelected={selectedState === state}
            onClick={setSelectedState}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {selectedState && (
        <div
          className={`mt-8 p-4 rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100"}`}
        >
          <h3 className="text-xl font-bold mb-2">{selectedState}</h3>
          <p>
            Terminating State:{" "}
            {(fsmData[selectedState] as FSMState).isTerminatingState
              ? "Yes"
              : "No"}
          </p>
          <div className="mt-2">
            <h4 className="font-semibold">Transitions:</h4>
            {Object.entries(
              fsmData[selectedState] as unknown as [string, string[]][],
            )
              .filter(([key]) => key !== "isTerminatingState")
              .map(([input, targets]) => (
                <p key={input}>
                  {input} → {targets.join(", ")}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FSMVisualizer;
