interface StateNodeProps {
  state: string;
  position: { x: number; y: number };
  isStarting: boolean;
  isTerminating: boolean;
  isSelected: boolean;
  onClick: (state: string) => void;
  isDarkMode: boolean;
}

const StateNode = ({
  state,
  position,
  isStarting,
  isTerminating,
  isSelected,
  onClick,
  isDarkMode,
}: StateNodeProps) => {
  return (
    <div
      className={`absolute w-16 h-16 rounded-full border-4 flex items-center justify-center cursor-pointer
          ${isStarting ? "border-blue-500" : isDarkMode ? "border-gray-300" : "border-gray-600"}
          ${isTerminating ? "border-double border-green-500" : ""}
          ${isSelected ? "border-4 border-yellow-500 font-bold" : ""}
          ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
          transition-all duration-200`}
      style={{
        left: position.x - 32,
        top: position.y - 32,
      }}
      onClick={() => onClick(state)}
    >
      {state}
    </div>
  );
};

export default StateNode;
