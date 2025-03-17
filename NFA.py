"""
Non-deterministic Finite Automaton (NFA) implementation.

This module provides an implementation of an NFA with support for epsilon transitions,
state management, and JSON serialization.
"""

import json


class NFA:
    """
    Non-deterministic Finite Automaton (NFA) class.
    
    Implements an NFA with support for multiple transitions from a state for the same symbol,
    epsilon transitions, and state management operations.
    
    Attributes:
        structure (dict): The internal representation of the NFA.
    """

    def __init__(self):
        """Initialize an empty NFA with no states and an empty starting state."""
        self.structure = {
            "startingState": ""
        }
    
    def setStartingState(self, state: str) -> None:
        """
        Set the starting state of the NFA.
        
        Args:
            state (str): The state to set as the starting state.
        """
        self.structure["startingState"] = state
        if state not in self.structure:
            self.addState(state, False)
    
    def addState(self, state: str, is_terminating: bool) -> None:
        """
        Add a new state to the NFA.
        
        Args:
            state (str): The name/identifier of the state.
            is_terminating (bool): Whether the state is a terminal/accepting state.
        """
        self.structure[state] = {
            "isTerminatingState": is_terminating
        }
    
    def addTransition(self, from_state: str, symbol: str, to_state: str) -> None:
        """
        Add a transition from one state to another via the given symbol.
        
        Creates states if they don't already exist. Special handling for epsilon transitions.
        
        Args:
            from_state (str): The source state.
            symbol (str): The transition symbol. Use 'ε' for epsilon transitions.
            to_state (str): The destination state.
        """
        # Create states if they don't exist
        if from_state not in self.structure:
            self.addState(from_state, False)
        if to_state not in self.structure:
            self.addState(to_state, False)
            
        state_obj = self.structure[from_state]
        
        # Handle epsilon transitions
        if symbol == 'ε':
            if "epsilon" not in state_obj:
                state_obj["epsilon"] = []
            if to_state not in state_obj["epsilon"]:
                state_obj["epsilon"].append(to_state)
        # Handle normal symbol transitions
        else:
            if symbol not in state_obj:
                state_obj[symbol] = []
            if to_state not in state_obj[symbol]:
                state_obj[symbol].append(to_state)
    
    def setTerminating(self, state: str, is_terminating: bool) -> None:
        """
        Set whether a state is terminating (accepting) or not.
        
        Args:
            state (str): The state to modify.
            is_terminating (bool): Whether the state is a terminal/accepting state.
        """
        if state not in self.structure:
            self.addState(state, is_terminating)
        else:
            self.structure[state]["isTerminatingState"] = is_terminating
    
    def toJson(self) -> str:
        """
        Convert the NFA to a JSON string.
        
        Returns:
            str: A JSON string representation of the NFA structure.
        """
        self.cleanUp()
        self.renumberStates()
        return json.dumps(self.structure, indent=4)
    
    def cleanUp(self) -> None:
        """
        Remove empty epsilon arrays from the structure.
        
        Cleans up the NFA structure by removing unnecessary empty lists.
        """
        for state in self.structure:
            if state != "startingState" and isinstance(self.structure[state], dict):
                state_obj = self.structure[state]
                if "epsilon" in state_obj and len(state_obj["epsilon"]) == 0:
                    del state_obj["epsilon"]

    def renumberStates(self, prefix: str = "S") -> None:
        """
        Renumber all states in sequential order starting from 0.
        
        Args:
            prefix (str, optional): Prefix to use for state names. Defaults to "S".
        """
        if "startingState" not in self.structure:
            return
            
        original_start = self.structure["startingState"]
        old_to_new = {}
        counter = 0
        
        # First, rename the starting state
        old_to_new[original_start] = f"{prefix}{counter}"
        counter += 1
        
        # Then rename all other states
        for state in self.structure:
            if state != "startingState" and state not in old_to_new:
                old_to_new[state] = f"{prefix}{counter}"
                counter += 1
        
        # Create new structure with renamed states
        new_structure = {
            "startingState": old_to_new[original_start]
        }
        
        # Update all transitions to use new state names
        for old_state, new_state in old_to_new.items():
            state_data = self.structure[old_state].copy()
            for symbol in state_data:
                if symbol != "isTerminatingState" and isinstance(state_data[symbol], list):
                    state_data[symbol] = [old_to_new[target] for target in state_data[symbol]]
            new_structure[new_state] = state_data
            
        self.structure = new_structure
