
import { useMemo, useState } from 'react';
import Visualizer from './Visualizer';
import { FSM, State } from '../../types';

interface VisualizerContainerProps {
  fsmData: FSM;
}

const VisualizerContainer = ({ fsmData }: VisualizerContainerProps) => {

  // Initialize states from FSM data
  const [states, setStates] = useState<State[]>(() => {
    const stateKeys = Object.keys(fsmData).filter(key => key !== 'startingState');
    return stateKeys.map((stateId, index) => ({
      id: stateId,
      x: 200 + index * 200, // Horizontal layout
      y: 300,
      isTerminating: typeof fsmData[stateId] === 'object' && 'isTerminatingState' in fsmData[stateId] ? fsmData[stateId].isTerminatingState : false,
      isInitial: stateId === fsmData.startingState
    }));
  });

  // Get transitions from FSM data
  const transitions = useMemo(() => {
    return Object.entries(fsmData)
      .filter(([key]) => key !== 'startingState')
      .flatMap(([fromState, stateData]) => 
        Object.entries(stateData)
          .filter(([key]) => key !== 'isTerminatingState')
          .flatMap(([label, toStates]) =>
            (toStates as string[]).map(toState => ({
              from: fromState,
              to: toState,
              label
            }))
          )
      );
  }, [fsmData]);

  const handleStateMove = (id: string, x: number, y: number) => {
    setStates(prevStates => 
      prevStates.map(state => 
        state.id === id ? { ...state, x, y } : state
      )
    );
  };

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Visualizer
        states={states}
        transitions={transitions}
        onStateMove={handleStateMove}
      />
    </div>
  );
};

export default VisualizerContainer;