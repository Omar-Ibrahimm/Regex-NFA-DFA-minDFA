export interface FSMState {
  isTerminatingState: boolean;
  [transition: string]: string[] | boolean;
}

export interface FSM {
  startingState: string;
  [state: string]: FSMState | string;
}
