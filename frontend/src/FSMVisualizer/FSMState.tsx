interface FSMState {
  isTerminatingState: boolean;
  [transition: string]: string[] | boolean;
}

interface FSM {
  startingState: string;
  [state: string]: FSMState | string;
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

export default sampleData;
export type { FSM, FSMState };
