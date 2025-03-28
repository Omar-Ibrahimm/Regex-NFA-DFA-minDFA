import { useState } from "react";
import StateNode from "./StateNode";
import Transition from "./Transition";
import { FSM, FSMState } from "./FSMState";

interface FSMVisualizerProps {
  isDarkMode: boolean;
}

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

const FSMVisualizer = ({ isDarkMode }: FSMVisualizerProps) => {
  const [fsmData] = useState<FSM>(sampleData);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = Object.keys(fsmData)
    .filter((k) => k !== "startingState")
    .sort();

  // Calculate node positions in a horizontal layout
  const nodePositions: { [key: string]: { x: number; y: number } } = {};
  states.forEach((state, index) => {
    nodePositions[state] = { x: index * 200 + 100, y: 200 };
  });

  // Process transitions with counting for multiple arrows
  const transitionCounts: { [key: string]: number } = {};
  const transitions = states.flatMap((fromState) => {
    const stateData = fsmData[fromState] as FSMState;
    return Object.entries(stateData)
      .filter(([key]) => key !== "isTerminatingState")
      .flatMap(([label, targets]) =>
        (targets as string[]).map((toState, _) => {
          const key = `${fromState}-${toState}-${label}`;
          const count = (transitionCounts[key] || 0) + 1;
          transitionCounts[key] = count;
          return {
            from: fromState,
            to: toState,
            label,
            index: count - 1,
          };
        }),
      );
  });

  return (
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
            <polygon className="fill-filler" points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>

        {transitions.map((t) => (
          <Transition
            key={`${t.from}-${t.to}-${t.label}-${t.index}`}
            from={t.from}
            to={t.to}
            label={t.label}
            fromPos={nodePositions[t.from]}
            toPos={nodePositions[t.to]}
            isSelected={selectedState === t.from}
            isDarkMode={isDarkMode}
            transitionIndex={t.index}
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

      {selectedState && (
        <div
          className={`absolute bottom-0 left-0 p-4 rounded-t-lg ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">{selectedState}</h3>
          <p>
            Terminating:{" "}
            {(fsmData[selectedState] as FSMState).isTerminatingState
              ? "Yes"
              : "No"}
          </p>
          <div className="mt-2">
            <h4 className="font-medium">Transitions:</h4>
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
