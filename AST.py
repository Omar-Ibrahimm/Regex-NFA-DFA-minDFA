"""
Abstract Syntax Tree (AST) module for regular expression parsing.

This module defines the AST node classes used to represent parsed regular expressions
in a hierarchical tree structure.
"""
from abc import ABC, abstractmethod


class AstNode(ABC):
    """Base abstract class for all AST nodes in the regular expression parser."""

    @abstractmethod
    def __init__(self):
        """Initialize the AST node."""
        pass

    def printAST(self, indent: int = 0):
        """
        Print the AST node and its children with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}Unknown node type")


class LiteralAstNode(AstNode):
    """AST node representing a literal character in the regular expression."""

    def __init__(self, char: str):
        """
        Initialize a literal node.

        Args:
            char: The literal character this node represents
        """
        self.char = char

    def printAST(self, indent: int = 0):
        """
        Print this literal node with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}LiteralAstNode(char={self.char})")


class ConcatAstNode(AstNode):
    """AST node representing concatenation of two regular expressions."""

    def __init__(self, left: AstNode, right: AstNode):
        """
        Initialize a concatenation node.

        Args:
            left: The left child node
            right: The right child node
        """
        self.left = left
        self.right = right

    def printAST(self, indent: int = 0):
        """
        Print this concatenation node and its children with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}ConcatAstNode")
        self.left.printAST(indent + 2)
        self.right.printAST(indent + 2)


class OrAstNode(AstNode):
    """AST node representing alternation (|) between two regular expressions."""

    def __init__(self, left: AstNode, right: AstNode):
        """
        Initialize an alternation node.

        Args:
            left: The left child node
            right: The right child node
        """
        self.left = left
        self.right = right

    def printAST(self, indent: int = 0):
        """
        Print this alternation node and its children with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}OrAstNode")
        self.left.printAST(indent + 2)
        self.right.printAST(indent + 2)


class StarAstNode(AstNode):
    """AST node representing the Kleene star (*) operation on a regular expression."""

    def __init__(self, sub_expr: AstNode):
        """
        Initialize a Kleene star node.

        Args:
            sub_expr: The child node representing the expression to be repeated
        """
        self.sub_expr = sub_expr

    def printAST(self, indent: int = 0):
        """
        Print this star node and its child with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}StarAstNode")
        self.sub_expr.printAST(indent + 2)


class PlusAstNode(AstNode):
    """AST node representing the plus (+) operation on a regular expression."""

    def __init__(self, sub_expr: AstNode):
        """
        Initialize a plus node.

        Args:
            sub_expr: The child node representing the expression to be repeated at least once
        """
        self.sub_expr = sub_expr

    def printAST(self, indent: int = 0):
        """
        Print this plus node and its child with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}PlusAstNode")
        self.sub_expr.printAST(indent + 2)


class OptionalAstNode(AstNode):
    """AST node representing the optional (?) operation on a regular expression."""

    def __init__(self, sub_expr: AstNode):
        """
        Initialize an optional node.

        Args:
            sub_expr: The child node representing the expression that is optional
        """
        self.sub_expr = sub_expr

    def printAST(self, indent: int = 0):
        """
        Print this optional node and its child with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}OptionalAstNode")
        self.sub_expr.printAST(indent + 2)


class CharacterClassAstNode(AstNode):
    """AST node representing a character class (e.g., [a-z]) in the regular expression."""

    def __init__(self, char_set: set[str]):
        """
        Initialize a character class node.

        Args:
            char_set: Set of characters that this character class represents
        """
        self.char_set = char_set

    def printAST(self, indent: int = 0):
        """
        Print this character class node with indentation.

        Args:
            indent: Number of spaces to indent this node
        """
        prefix = ' ' * indent
        print(f"{prefix}CharacterClassAstNode(char_set={self.char_set})")
