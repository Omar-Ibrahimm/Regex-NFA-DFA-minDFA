import { State } from '../../types';

interface TransitionArrowProps {
  from: State;
  to: State;
  label: string;
}

const TransitionArrow = ({ from, to, label }: TransitionArrowProps) => {
  const isSelf = from.id === to.id;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  if (isSelf) {
    return (
      <g transform={`translate(${from.x}, ${from.y})`}>
        <path
          d="M 30 0 A 30 30 0 1 1 -30 0"
          className="fill-none stroke-gray-600 dark:stroke-gray-300"
          markerEnd="url(#arrowhead)"
          transform="rotate(-90)"
        />
        <text
          x="0"
          y="-40"
          textAnchor="middle"
          className="text-sm fill-gray-800 dark:fill-gray-200"
        >
          {label}
        </text>
      </g>
    );
  }

  const startX = from.x + Math.cos(angle) * 24;
  const startY = from.y + Math.sin(angle) * 24;
  const endX = to.x - Math.cos(angle) * 24;
  const endY = to.y - Math.sin(angle) * 24;

  return (
    <>
      <path
        d={`M ${startX} ${startY} Q ${(startX + endX)/2 + dy/3} ${(startY + endY)/2 - dx/3} ${endX} ${endY}`}
        className="fill-none stroke-gray-600 dark:stroke-gray-300"
        markerEnd="url(#arrowhead)"
      />
      <text
        x={(startX + endX)/2 + dy/6}
        y={(startY + endY)/2 - dx/6}
        textAnchor="middle"
        className="text-sm fill-gray-800 dark:fill-gray-200"
      >
        {label}
      </text>
    </>
  );
};

export default TransitionArrow;
