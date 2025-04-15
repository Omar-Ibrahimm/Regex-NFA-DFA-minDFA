import { useNavigate } from "react-router-dom";
import { useFSMContext } from "../../context/FSMContext";
import { motion } from "framer-motion";

interface FSMCardProps {
  fsmType: "NFA" | "DFA" | "MIN_DFA";
}

const FSMCard = ({ fsmType }: FSMCardProps) => {
  const navigate = useNavigate();
  const { FSMs } = useFSMContext();

  const handleClick = () => {
    navigate(`/fsm/${fsmType}`);
  };

  // Simple FSM visualization presets
  const getFSMOutline = (type: string) => (
    <svg viewBox="0 0 100 60" className="w-full h-32">
      {/* State circles */}
      <circle
        cx="20"
        cy="30"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="30"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="80"
        cy="30"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Transitions */}
      {type === "NFA" ? (
        <>
          <path
            d="M20 30 Q35 15 50 30"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
          />
          <path
            d="M50 30 Q65 45 80 30"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
          />
        </>
      ) : (
        <path
          d="M20 30 L80 30"
          stroke="currentColor"
          fill="none"
          strokeWidth="1.5"
        />
      )}

      {/* Arrowheads */}
      <path
        d="M78 30 L73 27 L73 33 Z"
        fill="currentColor"
        transform={type === "NFA" ? "rotate(180 65 30)" : ""}
      />
    </svg>
  );

  return (
    <motion.button
      onClick={handleClick}
      className="w-full p-6 rounded-lg border-2 border-card-border bg-card hover:shadow-lg relative overflow-hidden"
      disabled={FSMs.length === 0}
      initial={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {FSMs.length > 0 ? (
          <>
            <div className="mb-4">{getFSMOutline(fsmType)}</div>
            <h2 className="text-lg font-semibold text-text">
              {fsmType} Visualization
              <span className="block text-sm text-gray-400 mt-1">
                Click to explore detailed view
              </span>
            </h2>
          </>
        ) : (
          <h2 className="text-lg font-semibold text-text">
            Enter a regex to generate {fsmType}
          </h2>
        )}
      </motion.div>

      {/* Animated overlay */}
      <motion.div
        className="absolute inset-0 bg-black/10 opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default FSMCard;
