import { useSelectedState } from "../../../contexts/SelectedStateContext";

const VisualizerContainer = () => {
  const { setSelectedState } = useSelectedState();

  return (
    <div className="relative w-full flex items-center justify-center bg-secondary">
      <h1
        className="text-4xl font-bold text-txt cursor-pointer hover:text-accent transition-colors"
        onClick={() => setSelectedState("S1")}
      >
        Hello World Visualizer
      </h1>
    </div>
  );
};

export default VisualizerContainer;
