export interface RawFSM {
  startingState: string;
  [stateName: string]:
    | {
        isTerminatingState: boolean;
        [symbol: string]: string[] | boolean;
      }
    | string;
}

export interface ParsedFSM {
  type: "NFA" | "DFA" | "MIN_DFA";
  startingState: string;
  states: State[];
  transitions: Transition[];
}

export interface State {
  id: string;
  isTerminating: boolean;
  position?: { x: number; y: number };
  isActive?: boolean;
}

export interface Transition {
  from: string;
  to: string;
  symbol: string;
  isActive?: boolean;
}

export function parseRawFSM(
  rawFSM: RawFSM,
  type: ParsedFSM["type"],
): ParsedFSM {
  console.log("Parsing for type: " + type);
  const states: State[] = [];
  const transitions: Transition[] = [];

  // Extract state info
  Object.keys(rawFSM).forEach((key) => {
    if (key !== "startingState") {
      const stateData = rawFSM[key] as {
        isTerminatingState: boolean;
        [symbol: string]: any;
      };

      states.push({
        id: key,
        isTerminating: stateData.isTerminatingState,
        position: { x: 0, y: 0 }, // Random initial positions
      });

      // Extract transitions
      Object.keys(stateData).forEach((symbol) => {
        if (symbol !== "isTerminatingState") {
          const destinations = stateData[symbol] as string[];
          if (typeof destinations === "string") {
            transitions.push({
              from: key,
              to: destinations,
              symbol,
              isActive: false,
            });
          } else {
            destinations.forEach((dest) => {
              transitions.push({
                from: key,
                to: dest,
                symbol,
                isActive: false,
              });
            });
          }
        }
      });
    }
  });

  console.log(`====== Type: ${type} ======`);
  console.log(`Starting State: ${rawFSM.startingState}`);
  console.log(states);
  console.log(transitions);

  return {
    type: type,
    startingState: rawFSM.startingState,
    states,
    transitions,
  };
}
