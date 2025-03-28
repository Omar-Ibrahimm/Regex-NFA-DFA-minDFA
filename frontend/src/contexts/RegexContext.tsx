import { createContext, useContext, useState, ReactNode } from "react";
import { FSM } from "../pages/types";

interface FSMContext {
  type: "NFA" | "DFA" | "MIN_DFA";
  data: FSM;
}

interface RegexContextType {
  regex: string;
  isRegexLoaded: boolean;
  fsms: FSMContext[];
  setRegex: (regex: string) => void;
  setFsms: (fsms: FSMContext[]) => void;
  setIsRegexLoaded: (loaded: boolean) => void;
}

const RegexContext = createContext<RegexContextType>({
  regex: "",
  isRegexLoaded: false,
  fsms: [],
  setRegex: () => {},
  setFsms: () => {},
  setIsRegexLoaded: () => {},
});

export const RegexProvider = ({ children }: { children: ReactNode }) => {
  const [regex, setRegex] = useState("");
  const [isRegexLoaded, setIsRegexLoaded] = useState(false);
  const [fsms, setFsms] = useState<FSMContext[]>([
    {
      type: "NFA",
      data: {
        startingState: ""
      },
    },
    {
      type: "DFA",
      data: {
        startingState: ""
      },
    },
    {
      type: "MIN_DFA",
      data: {
        startingState: ""
      },
    },
  ]);

  return (
    <RegexContext.Provider
      value={{
        regex,
        isRegexLoaded,
        fsms,
        setRegex,
        setFsms,
        setIsRegexLoaded,
      }}
    >
      {children}
    </RegexContext.Provider>
  );
};

export const useRegexContext = () => {
  return useContext(RegexContext);
};
