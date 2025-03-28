import { useState } from 'react';
import { State } from '../../types';

interface StateNodeProps {
  state: State;
  onMove: (id: string, x: number, y: number) => void;
}

const StateNode = ({ state, onMove }: StateNodeProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGGElement>) => {
    if (!isDragging) return;
    const svg = e.currentTarget.ownerSVGElement!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    onMove(state.id, x, y);
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <g
      transform={`translate(${state.x}, ${state.y})`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
    >
      <circle
        r="24"
        className={`stroke-2 ${
          state.isInitial 
            ? 'fill-blue-500/20 dark:fill-blue-300/20' 
            : 'fill-gray-100/50 dark:fill-gray-800/50'
        } ${
          state.isTerminating 
            ? 'stroke-red-500 dark:stroke-red-400' 
            : 'stroke-gray-600 dark:stroke-gray-300'
        }`}
      />
      {state.isInitial && (
        <circle r="26" className="fill-none stroke-blue-500 dark:stroke-blue-400 stroke-2" />
      )}
      <text
        x="0"
        y="5"
        textAnchor="middle"
        className="text-lg font-semibold fill-gray-800 dark:fill-gray-200"
      >
        {state.id}
      </text>
    </g>
  );
};

export default StateNode;
