"""
NFA to DFA Converter.

This module provides functionality to convert a Non-deterministic Finite Automaton (NFA)
to a Deterministic Finite Automaton (DFA) using the subset construction algorithm.
"""

from typing import Set, FrozenSet
from NFA import *
from DFA import *


class NFAtoDFA:
    """
    Converter class for transforming an NFA to an equivalent DFA.
    
    Implements the subset construction algorithm to convert NFAs to DFAs
    by creating states in the DFA that correspond to sets of states in the NFA.
    
    Attributes:
        nfa (NFA): The source NFA to be converted.
        dfa (DFA): The target DFA being constructed.
    """
    
    def __init__(self, nfa: NFA):
        """
        Initialize the converter with the source NFA.
        
        Args:
            nfa (NFA): The NFA to be converted to a DFA.
        """
        self.nfa = nfa
        self.dfa = DFA()
    
    def convert(self) -> DFA:
        """
        Convert NFA to DFA using the subset construction algorithm.
        
        This method implements the subset construction algorithm:
        1. Compute epsilon closure of the NFA's start state
        2. Create a DFA state representing this set of NFA states
        3. Recursively process transitions from this set for each input symbol
        4. Create new DFA states as needed
        
        Returns:
            DFA: The resulting deterministic finite automaton.
        """
        nfa_structure = self.nfa.structure
        alphabet = self.getAlphabet()
        nfa_start = nfa_structure["startingState"]
        
        # Get epsilon closure of start state to form the first DFA state
        start_states = self.epsilonClosure({nfa_start})
        dfa_start = self.setToStateName(start_states)
        self.dfa.setStartingState(dfa_start)
        
        # Determine if this DFA state should be accepting
        is_accepting = any(nfa_structure[state]["isTerminatingState"] 
                         for state in start_states if state in nfa_structure)
        self.dfa.setTerminating(dfa_start, is_accepting)
        
        # Track state mappings and processing status
        state_mapping = {frozenset(start_states): dfa_start}
        unprocessed = [start_states]
        processed = set()
        
        # Process all reachable state sets
        while unprocessed:
            current_states = unprocessed.pop(0)
            if frozenset(current_states) in processed:
                continue
            
            processed.add(frozenset(current_states))
            current_dfa_state = state_mapping[frozenset(current_states)]
            
            # Process each input symbol
            for symbol in alphabet:
                next_states = set()
                
                # Compute reachable states via this symbol
                for state in current_states:
                    if state in nfa_structure and symbol in nfa_structure[state]:
                        for target in nfa_structure[state][symbol]:
                            next_states.add(target)
                
                # Include epsilon transitions from the reachable states
                next_states_with_epsilon = self.epsilonClosure(next_states)
                if not next_states_with_epsilon:
                    continue
                
                # Create a new DFA state if needed
                if frozenset(next_states_with_epsilon) not in state_mapping:
                    next_dfa_state = self.setToStateName(next_states_with_epsilon)
                    state_mapping[frozenset(next_states_with_epsilon)] = next_dfa_state
                    
                    # Determine if this new state should be accepting
                    is_accepting = any(nfa_structure[state]["isTerminatingState"] 
                                     for state in next_states_with_epsilon 
                                     if state in nfa_structure)
                    self.dfa.setTerminating(next_dfa_state, is_accepting)
                    
                    # Process this new state in a future iteration
                    unprocessed.append(next_states_with_epsilon)
                else:
                    # Use existing DFA state
                    next_dfa_state = state_mapping[frozenset(next_states_with_epsilon)]
                
                # Add the transition in the DFA
                self.dfa.addTransition(current_dfa_state, symbol, next_dfa_state)
        
        return self.dfa
    
    def epsilonClosure(self, states: Set[str]) -> Set[str]:
        """
        Compute epsilon closure of a set of states.
        
        For a given set of NFA states, this method computes the set of all states
        reachable from these states by following epsilon transitions.
        
        Args:
            states (Set[str]): Initial set of states.
            
        Returns:
            Set[str]: Set of states reachable via epsilon transitions.
        """
        if not states:
            return set()
        
        nfa_structure = self.nfa.structure
        result = set(states)
        stack = list(states)
        
        # Use depth-first search to find all epsilon-reachable states
        while stack:
            state = stack.pop()
            if state in nfa_structure and "epsilon" in nfa_structure[state]:
                for target in nfa_structure[state]["epsilon"]:
                    if target not in result:
                        result.add(target)
                        stack.append(target)
        
        return result
    
    def getAlphabet(self) -> Set[str]:
        """
        Get all input symbols used in the NFA (excluding epsilon).
        
        Returns:
            Set[str]: Set of all transition symbols in the NFA.
        """
        alphabet = set()
        nfa_structure = self.nfa.structure
        
        # Collect all non-epsilon transition symbols
        for state in nfa_structure:
            if state != "startingState":
                for symbol in nfa_structure[state]:
                    if symbol != "isTerminatingState" and symbol != "epsilon":
                        alphabet.add(symbol)
        
        return alphabet
    
    def setToStateName(self, states: Set[str]) -> str:
        """
        Convert a set of NFA states to a DFA state name.
        
        Creates a deterministic, readable name for a DFA state representing
        a set of NFA states.
        
        Args:
            states (Set[str]): Set of NFA states to convert.
            
        Returns:
            str: A name for the DFA state.
        """
        # Create a deterministic ordering for consistent naming
        sorted_states = sorted(list(states))
        return "DFA_" + "_".join(sorted_states)
