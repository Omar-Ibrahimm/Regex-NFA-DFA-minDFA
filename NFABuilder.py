"""
NFA Builder for Regular Expression ASTs.

This module provides functionality to construct NFAs from Abstract Syntax Trees
representing regular expressions, with support for various regex operations.
"""

from typing import Tuple
from AST import *
from NFA import *


class NFABuilder:
    """
    Builder class for constructing NFAs from regular expression ASTs.
    
    This class traverses the AST nodes and constructs corresponding NFA components
    for each regular expression operation (concatenation, alternation, etc.).
    
    Attributes:
        state_counter (int): Counter to generate unique state names.
    """
    
    def __init__(self):
        """Initialize an NFABuilder with a reset state counter."""
        self.state_counter = 0
    
    def getNextState(self) -> str:
        """
        Generate the next unique state name.
        
        Returns:
            str: A unique state identifier using the prefix 'S' followed by a number.
        """
        state = f"S{self.state_counter}"
        self.state_counter += 1
        return state
    
    def buildFromAST(self, ast: AstNode) -> NFA:
        """
        Build a complete NFA from an AST.
        
        Args:
            ast (AstNode): The root node of the abstract syntax tree.
            
        Returns:
            NFA: A complete NFA representing the regular expression.
        """
        nfa = NFA()
        self.state_counter = 0        
        start, end = self.processNode(ast, nfa)
        nfa.setStartingState(start)
        nfa.setTerminating(end, True)        
        return nfa
    
    def processNode(self, node: AstNode, nfa: NFA) -> Tuple[str, str]:
        """
        Process an AST node and update the NFA accordingly.
        
        This method dispatches to the appropriate NFA construction method based on the node type.
        
        Args:
            node (AstNode): The AST node to process.
            nfa (NFA): The NFA being constructed.
            
        Returns:
            Tuple[str, str]: A tuple containing (start_state, end_state) of the constructed sub-NFA.
            
        Raises:
            ValueError: If an unsupported AST node type is encountered.
        """
        if isinstance(node, LiteralAstNode):
            return self.createBasicNFA(nfa, node.char)
        elif isinstance(node, ConcatAstNode):
            return self.createConcatNFA(nfa, node.left, node.right)
        elif isinstance(node, OrAstNode):
            return self.createOrNFA(nfa, node.left, node.right)
        elif isinstance(node, StarAstNode):
            return self.createStarNFA(nfa, node.sub_expr)
        elif isinstance(node, PlusAstNode):
            return self.createPlusNFA(nfa, node.sub_expr)
        elif isinstance(node, OptionalAstNode):
            return self.createOptionalNFA(nfa, node.sub_expr)
        elif isinstance(node, CharacterClassAstNode):
            return self.createCharacterClassNFA(nfa, node.char_set)
        else:
            raise ValueError(f"Unsupported AST node type: {type(node).__name__}")
    
    def createBasicNFA(self, nfa: NFA, symbol: str) -> Tuple[str, str]:
        """
        Create a basic NFA for a single symbol.
        
        Constructs a simple NFA with two states connected by a transition on the given symbol.
        
        Args:
            nfa (NFA): The NFA to modify.
            symbol (str): The transition symbol.
            
        Returns:
            Tuple[str, str]: Start and end states of the created NFA.
        """
        start_state = self.getNextState()
        end_state = self.getNextState()
        
        nfa.addState(start_state, False)
        nfa.addState(end_state, False)
        nfa.addTransition(start_state, symbol, end_state)
        
        return start_state, end_state
    
    def createConcatNFA(self, nfa: NFA, left: AstNode, right: AstNode) -> Tuple[str, str]:
        """
        Create an NFA for concatenation operation.
        
        Processes the left and right expressions and connects them with an epsilon transition.
        
        Args:
            nfa (NFA): The NFA to modify.
            left (AstNode): The left expression.
            right (AstNode): The right expression.
            
        Returns:
            Tuple[str, str]: Start and end states of the created NFA.
        """
        left_start, left_end = self.processNode(left, nfa)
        right_start, right_end = self.processNode(right, nfa)
        
        # Connect the end of the left expression to the start of the right expression
        nfa.addTransition(left_end, 'ε', right_start)
        
        return left_start, right_end
    
    def createOrNFA(self, nfa: NFA, left: AstNode, right: AstNode) -> Tuple[str, str]:
        """
        Create an NFA for alternation (OR) operation.
        
        Creates a new start and end state, and connects them to the sub-NFAs with epsilon transitions.
        
        Args:
            nfa (NFA): The NFA to modify.
            left (AstNode): The first alternative expression.
            right (AstNode): The second alternative expression.
            
        Returns:
            Tuple[str, str]: Start and end states of the created NFA.
        """
        start_state = self.getNextState()
        end_state = self.getNextState()
        
        left_start, left_end = self.processNode(left, nfa)
        right_start, right_end = self.processNode(right, nfa)
        
        nfa.addState(start_state, False)
        nfa.addState(end_state, False)
        
        # Connect start state to both alternatives
        nfa.addTransition(start_state, 'ε', left_start)
        nfa.addTransition(start_state, 'ε', right_start)
        
        # Connect both alternatives to end state
        nfa.addTransition(left_end, 'ε', end_state)
        nfa.addTransition(right_end, 'ε', end_state)
        
        return start_state, end_state
    
    def createStarNFA(self, nfa: NFA, node: AstNode) -> Tuple[str, str]:
        """
        Create an NFA for Kleene star operation (zero or more).
        
        Creates a new start and end state with epsilon transitions that:
        1. Allow bypassing the sub-expression
        2. Allow repeating the sub-expression
        
        Args:
            nfa (NFA): The NFA to modify.
            node (AstNode): The sub-expression to apply the star operation to.
            
        Returns:
            Tuple[str, str]: Start and end states of the created NFA.
        """
        start_state = self.getNextState()
        end_state = self.getNextState()
        
        sub_start, sub_end = self.processNode(node, nfa)
        
        nfa.addState(start_state, False)
        nfa.addState(end_state, False)
        
        # Epsilon path to bypass the expression (zero occurrences)
        nfa.addTransition(start_state, 'ε', end_state)
        
        # Path to execute the expression
        nfa.addTransition(start_state, 'ε', sub_start)
        
        # Path to repeat the expression (many occurrences)
        nfa.addTransition(sub_end, 'ε', sub_start)
        
        # Path to exit after one or more occurrences
        nfa.addTransition(sub_end, 'ε', end_state)
        
        return start_state, end_state
    
    def createPlusNFA(self, nfa: NFA, node: AstNode) -> Tuple[str, str]:
        """
        Create an NFA for plus operation (one or more).
        
        Similar to star but requires at least one occurrence of the sub-expression.
        
        Args:
            nfa (NFA): The NFA to modify.
            node (AstNode): The sub-expression to apply the plus operation to.
            
        Returns:
            Tuple[str, str]: Start and end states of the created NFA.
        """
        start_state = self.getNextState()
        end_state = self.getNextState()
        
        sub_start, sub_end = self.processNode(node, nfa)
        
        nfa.addState(start_state, False)
        nfa.addState(end_state, False)
        
        # Path to execute the expression (required first occurrence)
        nfa.addTransition(start_state, 'ε', sub_start)
        
        # Path to exit after one occurrence
        nfa.addTransition(sub_end, 'ε', end_state)
        
        # Path to repeat the expression (more occurrences)
        nfa.addTransition(sub_end, 'ε', sub_start)
        
        return start_state, end_state
    
    def createOptionalNFA(self, nfa: NFA, node: AstNode) -> Tuple[str, str]:
        """
        Create an NFA for optional operation (zero or one).
        
        Creates a new start and end state with epsilon transitions that allow
        bypassing the sub-expression or executing it once.
        
        Args:
            nfa (NFA): The NFA to modify.
            node (AstNode): The optional sub-expression.
            
        Returns:
            Tuple[str, str]: Start and end states of the created NFA.
        """
        start_state = self.getNextState()
        end_state = self.getNextState()
        
        sub_start, sub_end = self.processNode(node, nfa)
        
        nfa.addState(start_state, False)
        nfa.addState(end_state, False)
        
        # Path to bypass the expression (zero occurrences)
        nfa.addTransition(start_state, 'ε', end_state)
        
        # Path to execute the expression once
        nfa.addTransition(start_state, 'ε', sub_start)
        nfa.addTransition(sub_end, 'ε', end_state)
        
        return start_state, end_state
    
    def createCharacterClassNFA(self, nfa: NFA, char_set: set[chr]) -> Tuple[str, str]:
        """
        Create an NFA for a character class [a-z].
        
        Creates a simple NFA that accepts any character from the given set.
        
        Args:
            nfa (NFA): The NFA to modify.
            char_set (set[chr]): Set of characters in the character class.
            
        Returns:
            Tuple[str, str]: Start and end states of the created NFA.
        """
        start_state = self.getNextState()
        end_state = self.getNextState()
        
        nfa.addState(start_state, False)
        nfa.addState(end_state, False)
        
        # Add a transition for each character in the set
        for char in char_set:
            nfa.addTransition(start_state, char, end_state)
        
        return start_state, end_state
