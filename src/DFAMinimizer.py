"""
DFA Minimization Module.

This module implements Hopcroft's algorithm for minimizing Deterministic Finite Automata
by combining equivalent states to create a smaller, equivalent DFA.
"""

from typing import List, Set
from DFA import *


class DFAMinimizer:
    """
    DFA Minimizer class for reducing the number of states in a DFA.
    
    Implements Hopcroft's algorithm to create a minimal DFA that recognizes
    the same language as the original DFA with fewer states.
    
    Attributes:
        dfa (DFA): The DFA to be minimized.
        alphabet (Set[str]): Set of all input symbols used in the DFA.
    """
    
    def __init__(self, dfa: DFA):
        """
        Initialize the minimizer with the DFA to be minimized.
        
        Args:
            dfa (DFA): The DFA to minimize.
        """
        self.dfa = dfa
        self.alphabet = dfa.getAlphabet()

    def minimize(self) -> DFA:
        """
        Minimize DFA using Hopcroft's algorithm.
        
        This method removes unreachable states and then applies Hopcroft's
        partition refinement algorithm to combine equivalent states.
        
        Returns:
            DFA: The minimized DFA that recognizes the same language.
        """
        # First, remove states that can't be reached from the start state
        self.removeUnreachableStates()
        
        dfa_structure = self.dfa.structure
        states = set()
        for state in dfa_structure:
            if state != "startingState":
                states.add(state)
        
        if not states:
            return self.dfa
        
        # Initial partition: accepting and non-accepting states
        accepting = set()
        non_accepting = set()
        
        for state in states:
            if dfa_structure[state]["isTerminatingState"]:
                accepting.add(state)
            else:
                non_accepting.add(state)
        
        partitions = []
        if accepting:
            partitions.append(accepting)
        if non_accepting:
            partitions.append(non_accepting)
        
        # Refine partitions until no more refinements are possible
        while True:
            new_partitions = self.refinePartitions(partitions)
            if len(new_partitions) == len(partitions):
                same = True
                for p1 in partitions:
                    if not any(p1 == p2 for p2 in new_partitions):
                        same = False
                        break
                if same:
                    break
            partitions = new_partitions
        
        # Create a new DFA based on the final partitions
        return self.createMinimizedDFA(partitions)

    def refinePartitions(self, partitions: List[Set[str]]) -> List[Set[str]]:
        """
        Refine partitions based on transitions.
        
        For each partition, attempt to split it by finding states that
        transition to different partitions on a given input symbol.
        
        Args:
            partitions (List[Set[str]]): The current set of partitions.
            
        Returns:
            List[Set[str]]: The refined set of partitions.
        """
        new_partitions = []
        
        for partition in partitions:
            # Singleton sets can't be split further
            if len(partition) <= 1:
                new_partitions.append(partition)
                continue
            
            # Try to split using each symbol in the alphabet
            for symbol in self.alphabet:
                split_result = self.splitPartition(partition, symbol, partitions)
                
                # If we can split the partition, add the pieces to the result
                if len(split_result) > 1:
                    new_partitions.extend(split_result)
                    break
            else:
                # If no symbol splits the partition, keep it intact
                new_partitions.append(partition)
                
        return new_partitions

    def splitPartition(self, partition: Set[str], symbol: str, partitions: List[Set[str]]) -> List[Set[str]]:
        """
        Split a partition based on transitions on given symbol.
        
        Two states p and q are in the same partition if they go to the same
        partition on the given symbol.
        
        Args:
            partition (Set[str]): The partition to split.
            symbol (str): The input symbol to check transitions on.
            partitions (List[Set[str]]): The current set of all partitions.
            
        Returns:
            List[Set[str]]: The resulting partitions after splitting.
        """
        dfa_structure = self.dfa.structure
        transition_groups = {}
        
        for state in partition:
            transition_target = None
            
            # Find which partition the state transitions to on the given symbol
            if symbol in dfa_structure[state]:
                target_state = dfa_structure[state][symbol]
                for i, p in enumerate(partitions):
                    if target_state in p:
                        transition_target = i
                        break
            
            # Group states by their transition target partition
            if transition_target not in transition_groups:
                transition_groups[transition_target] = set()
            transition_groups[transition_target].add(state)
            
        return list(transition_groups.values())

    def removeUnreachableStates(self) -> None:
        """
        Remove states that cannot be reached from the start state.
        
        Uses breadth-first search to identify all states reachable from
        the starting state, and removes any states that aren't reachable.
        """
        dfa_structure = self.dfa.structure
        start_state = dfa_structure["startingState"]
        
        # Use BFS to find all reachable states
        reachable = {start_state}
        queue = [start_state]
        
        while queue:
            current = queue.pop(0)
            if current not in dfa_structure:
                continue
                
            for symbol in dfa_structure[current]:
                if symbol != "isTerminatingState":
                    next_state = dfa_structure[current][symbol]
                    if next_state not in reachable:
                        reachable.add(next_state)
                        queue.append(next_state)
        
        # Remove states that aren't reachable
        to_remove = []
        for state in dfa_structure:
            if state != "startingState" and state not in reachable:
                to_remove.append(state)
        
        for state in to_remove:
            del dfa_structure[state]

    def createMinimizedDFA(self, partitions: List[Set[str]]) -> DFA:
        """
        Create a new DFA based on the partitions.
        
        Each partition becomes a state in the new DFA, with transitions
        determined by the transitions of any representative state from the partition.
        
        Args:
            partitions (List[Set[str]]): The final partitions representing equivalent states.
            
        Returns:
            DFA: The minimized DFA.
            
        Raises:
            ValueError: If the start state is not found in any partition.
        """
        minimized_dfa = DFA()
        dfa_structure = self.dfa.structure
        start_state = dfa_structure["startingState"]
        start_partition_index = None
        
        # Find which partition contains the start state
        for i, partition in enumerate(partitions):
            if start_state in partition:
                start_partition_index = i
                break
        
        if start_partition_index is None:
            raise ValueError("Start state not found in any partition")
            
        new_start_state = f"P{start_partition_index}"
        minimized_dfa.setStartingState(new_start_state)
        
        # Process each partition to create the new DFA
        for i, partition in enumerate(partitions):
            # A partition is accepting if any of its states is accepting
            is_accepting = any(dfa_structure[state]["isTerminatingState"] for state in partition)
            minimized_dfa.setTerminating(f"P{i}", is_accepting)
            
            # Use any state in the partition as representative for transitions
            representative = next(iter(partition))
            
            # Add transitions from this new state based on representative state
            for symbol in self.alphabet:
                if symbol in dfa_structure[representative]:
                    target_state = dfa_structure[representative][symbol]
                    
                    # Find which partition contains the target state
                    for j, p in enumerate(partitions):
                        if target_state in p:
                            minimized_dfa.addTransition(f"P{i}", symbol, f"P{j}")
                            break
        
        return minimized_dfa
