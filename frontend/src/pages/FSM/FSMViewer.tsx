import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegexContext } from "../../contexts/RegexContext";
import VisualizerContainer from "./Visualizer/VisualizerContainer";

const FSMViewer = () => {

  const { fsmType } = useParams();
  const { fsms, isRegexLoaded } = useRegexContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRegexLoaded) {
      navigate("/");
    }
  }, [isRegexLoaded, navigate]);

  const currentFSM = fsms.find(
    (fsm) => fsm.type.toLowerCase() === fsmType?.toLowerCase(),
  );

  if (!currentFSM) {
    return <div className="p-4 text-txt">FSM not found</div>;
  }

  return <VisualizerContainer fsmData={currentFSM.data} />;
};

export default FSMViewer;
