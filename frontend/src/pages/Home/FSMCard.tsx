import { useNavigate } from "react-router-dom";
import { useFSMContext } from "../../context/FSMContext";

interface FSMCardProps {
  fsmType: "NFA" | "DFA" | "MIN_DFA";
}

const FSMCard = ({ fsmType }: FSMCardProps) => {
  const navigate = useNavigate();
  const { FSMs } = useFSMContext();

  const handleClick = () => {
    navigate(`/fsm/${fsmType}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full p-12 rounded-lg border-2 border-card-border bg-card hover:shadow-lg transition-shadow disabled:cursor-not-allowed"
      disabled={FSMs.length === 0}
    >
      <h2 className="text-lg font-semibold text-text">
        {FSMs.length > 0
          ? `Click here to navigate to ${fsmType}`
          : "Enter a regex to display the automata"}
      </h2>
    </button>
  );
};

export default FSMCard;
