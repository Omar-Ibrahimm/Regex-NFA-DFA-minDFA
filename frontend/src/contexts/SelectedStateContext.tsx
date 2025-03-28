import { createContext, useContext, useState, ReactNode } from "react";

type SelectedStateContextType = {
  selectedState: string | null;
  setSelectedState: (state: string | null) => void;
};

const SelectedStateContext = createContext<SelectedStateContextType>({
  selectedState: null,
  setSelectedState: () => {},
});

export const SelectedStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  return (
    <SelectedStateContext.Provider value={{ selectedState, setSelectedState }}>
      {children}
    </SelectedStateContext.Provider>
  );
};

export const useSelectedState = () => useContext(SelectedStateContext);
