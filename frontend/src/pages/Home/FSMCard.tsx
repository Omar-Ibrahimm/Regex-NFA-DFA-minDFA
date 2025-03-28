import { useNavigate } from "react-router-dom";
import { useRegexContext } from "../../contexts/RegexContext";

interface FSMCardProps {
  fsmType: string;
  hasRegex: boolean;
}

const FSMCard = ({ fsmType, hasRegex }: FSMCardProps) => {
  const { isRegexLoaded } = useRegexContext();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/fsm/${fsmType}`);
  };

  return (
    <button
      className={`p-8 w-full h-48 border-2 rounded-xl transition-all duration-200
          ${
            hasRegex
              ? "border-border hover:border-accent cursor-pointer bg-secondary"
              : "border-dashed border-txt/30 bg-secondary/50 cursor-not-allowed"
          }
          flex items-center justify-center text-center`}
      onClick={handleClick}
      disabled={!isRegexLoaded}
    >
      <p
        className={`text-lg ${
          hasRegex ? "text-txt hover:text-accent" : "text-txt/50"
        }`}
      >
        {hasRegex
          ? `Click here to visualize ${fsmType}`
          : "Enter a regex to visualize"}
      </p>
    </button>
  );
};

export default FSMCard;
