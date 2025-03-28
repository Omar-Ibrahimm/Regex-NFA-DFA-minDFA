import { State, Transition } from '../../types';
import StateNode from './StateNode';
import TransitionArrow from './TransitionArrow';

interface VisualizerProps {
  states: State[];
  transitions: Transition[];
  onStateMove: (id: string, x: number, y: number) => void;
}

const Visualizer = ({ states, transitions, onStateMove }: VisualizerProps) => {
  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
      <svg className="w-full h-full">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 3.5, 0 7" 
              className="fill-gray-600 dark:fill-gray-300"
            />
          </marker>
        </defs>
        
        {transitions.map((transition) => (
          <TransitionArrow
            key={`${transition.from}-${transition.to}-${transition.label}`}
            from={states.find(s => s.id === transition.from)!}
            to={states.find(s => s.id === transition.to)!}
            label={transition.label}
          />
        ))}
        
        {states.map((state) => (
          <StateNode
            key={state.id}
            state={state}
            onMove={onStateMove}
          />
        ))}
      </svg>
    </div>
  );
};
export default Visualizer;
