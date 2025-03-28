export interface FSM {
  startingState: string;
  [state: string]:
    | {
        isTerminatingState: boolean;
        [transition: string]: string[] | boolean;
      }
    | string;
}

export interface State {
  id: string;
  x: number;
  y: number;
  isTerminating: boolean;
  isInitial: boolean;
}

export interface Transition {
  from: string;
  to: string;
  label: string;
}