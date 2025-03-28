import { createContext, useContext, useState, ReactNode } from "react";

interface FSM {
  type: "NFA" | "DFA" | "MIN_DFA";
  data: any; // Replace 'any' with your actual FSM type
}

interface RegexContextType {
  regex: string;
  isRegexLoaded: boolean;
  fsms: FSM[];
  setRegex: (regex: string) => void;
  setFsms: (fsms: FSM[]) => void;
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
  const [fsms, setFsms] = useState<FSM[]>([
    {
      type: "NFA",
      data: {},
    },
    {
      type: "DFA",
      data: {},
    },
    {
      type: "MIN_DFA",
      data: {},
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
