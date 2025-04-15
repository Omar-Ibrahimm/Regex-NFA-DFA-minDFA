import { createContext, useContext, useState } from "react";
import { ParsedFSM } from "../types/FSM";

interface FSMContextType {
  FSMs: ParsedFSM[];
  setFSMs: (FSMs: ParsedFSM[]) => void;
}

const FSMContext = createContext<FSMContextType>({
  FSMs: [],
  setFSMs: () => {},
});

export const FSMProvider = ({ children }: { children: React.ReactNode }) => {
  const [FSMs, setFSMs] = useState<ParsedFSM[]>([]);

  return (
    <FSMContext.Provider
      value={{
        FSMs,
        setFSMs,
      }}
    >
      {children}
    </FSMContext.Provider>
  );
};

export const useFSMContext = () => {
  return useContext(FSMContext);
};
