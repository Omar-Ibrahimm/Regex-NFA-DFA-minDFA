"""
Deterministic Finite Automaton (DFA) implementation.

This module provides an implementation of a DFA with support for state management,
transitions, and JSON serialization.
"""

from typing import Set
import json


class DFA:
    """
    Deterministic Finite Automaton (DFA) class.
    
    Implements a DFA with support for exactly one transition from a state for a given symbol,
    and state management operations.
    
    Attributes:
        structure (dict): The internal representation of the DFA.
    """

    def __init__(self):
        """Initialize an empty DFA with no states and an empty starting state."""
        self.structure = {
            "startingState": ""  # Default empty starting state
        }
    
    def setStartingState(self, state: str) -> None:
        """
        Set the starting state of the DFA.
        
        Args:
            state (str): The state to set as the starting state.
        """
        self.structure["startingState"] = state
        # Create the state if it doesn't exist already
        if state not in self.structure:
            self.addState(state, False)
    
    def addState(self, state: str, is_terminating: bool) -> None:
        """
        Add a new state to the DFA.
        
        Args:
            state (str): The name/identifier of the state.
            is_terminating (bool): Whether the state is a terminal/accepting state.
        """
        self.structure[state] = {
            "isTerminatingState": is_terminating  # Flag for accepting/terminal state
        }
    
    def addTransition(self, from_state: str, symbol: str, to_state: str) -> None:
        """
        Add a transition from one state to another via the given symbol.
        
        Creates states if they don't already exist.
        
        Args:
            from_state (str): The source state.
            symbol (str): The transition symbol.
            to_state (str): The destination state.
        """
        # Create states if they don't exist
        if from_state not in self.structure:
            self.addState(from_state, False)
        if to_state not in self.structure:
            self.addState(to_state, False)        
        
        # Add the transition - in a DFA, each state can have at most one transition for a given symbol
        state_obj = self.structure[from_state]
        state_obj[symbol] = to_state
    
    def setTerminating(self, state: str, is_terminating: bool) -> None:
        """
        Set whether a state is terminating (accepting) or not.
        
        Args:
            state (str): The state to modify.
            is_terminating (bool): Whether the state is a terminal/accepting state.
        """
        # Create state if it doesn't exist, otherwise update its terminating status
        if state not in self.structure:
            self.addState(state, is_terminating)
        else:
            self.structure[state]["isTerminatingState"] = is_terminating
    
    def toJson(self) -> str:
        """
        Convert the DFA to a JSON string.
        
        Returns:
            str: A JSON string representation of the DFA structure.
        """
        # Renumber states before serializing
        self.renumberStates()
        return json.dumps(self.structure, indent=4)
    
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
        
        # Create new structure with renamed starting state
        new_structure = {
            "startingState": old_to_new[original_start]
        }        
        
        # Update all transitions to use new state names
        for old_state, new_state in old_to_new.items():
            state_data = self.structure[old_state].copy()
            for symbol in state_data:
                # Update transition destinations
                if symbol != "isTerminatingState" and isinstance(state_data[symbol], str):
                    state_data[symbol] = old_to_new[state_data[symbol]]
            new_structure[new_state] = state_data        
        
        # Replace old structure with new one
        self.structure = new_structure
    
    def getAlphabet(self) -> Set[str]:
        """
        Get all input symbols used in the DFA.
        
        Returns:
            Set[str]: The set of all symbols used in the DFA's transitions.
        """
        alphabet = set()
        # Iterate through all states and collect unique transition symbols
        for state in self.structure:
            if state != "startingState":
                for symbol in self.structure[state]:
                    # Ignore metadata properties
                    if symbol != "isTerminatingState":
                        alphabet.add(symbol)
        return alphabet
