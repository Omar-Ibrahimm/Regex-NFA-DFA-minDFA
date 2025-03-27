interface TransitionProps {
  from: string;
  to: string;
  label: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  isSelected: boolean;
  isDarkMode: boolean;
}

const Transition = ({
  from,
  to,
  label,
  fromPos,
  toPos,
  isSelected,
  isDarkMode,
}: TransitionProps) => {
  const isSelfTransition = from === to;
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radius = 32;

  if (isSelfTransition) {
    // Loopback transition
    const loopRadius = 40;
    return (
      <g>
        <circle
          cx={fromPos.x}
          cy={fromPos.y - radius - loopRadius}
          r={loopRadius}
          fill="none"
          stroke={isSelected ? "#f59e0b" : isDarkMode ? "#cbd5e0" : "#4a5568"}
          strokeWidth={isSelected ? 3 : 2}
          markerEnd="url(#arrowhead)"
        />
        <text
          x={fromPos.x}
          y={fromPos.y - radius - loopRadius * 2}
          className={`text-sm ${isSelected ? "font-bold" : ""} ${isDarkMode ? "fill-white" : "fill-gray-800"}`}
          textAnchor="middle"
        >
          {label}
        </text>
      </g>
    );
  }

  // Normal transition
  const startX = fromPos.x + (dx / distance) * radius;
  const startY = fromPos.y + (dy / distance) * radius;
  const endX = toPos.x - (dx / distance) * radius;
  const endY = toPos.y - (dy / distance) * radius;

  // Quadratic bezier control point
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const offset = 50;
  const ctrlX = midX + (-dy / distance) * offset;
  const ctrlY = midY + (dx / distance) * offset;

  return (
    <g>
      <path
        d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY}, ${endX} ${endY}`}
        fill="none"
        stroke={isSelected ? "#f59e0b" : isDarkMode ? "#cbd5e0" : "#4a5568"}
        strokeWidth={isSelected ? 3 : 2}
        markerEnd="url(#arrowhead)"
      />
      <text
        x={(startX + ctrlX + endX) / 3}
        y={(startY + ctrlY + endY) / 3}
        className={`text-sm ${isSelected ? "font-bold" : ""} ${isDarkMode ? "fill-white" : "fill-gray-800"}`}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
};

export default Transition;
