"""
Lexer module for tokenizing regular expressions.

This module provides classes for converting a regular expression string
into a stream of tokens that can be processed by a parser.
"""

from typing import Dict, List, Tuple
from utils import *
from enum import Enum, auto


class TokenType(Enum):
    """Enumeration of token types in regular expressions."""

    WILD = auto()           # '.' wildcard character
    OPTIONAL = auto()       # '?' optional character
    STAR = auto()           # '*' zero or more characters
    PLUS = auto()           # '+' one or more characters
    CONCAT = auto()         # '$' concatenation operator
    OR = auto()             # '|' OR operator
    LPAREN = auto()         # '(' left parenthesis
    RPAREN = auto()         # ')' right parenthesis     
    LBRACKET = auto()       # '[' left bracket
    RBRACKET = auto()       # ']' right bracket
    HYPHEN = auto()         # '-' hyphen
    LITERAL = auto()        # alphanumeric character


# Mapping from characters to their corresponding token types
mapToTokenType: Dict[chr, TokenType] = {
    '.': TokenType.WILD,
    '?': TokenType.OPTIONAL,
    '*': TokenType.STAR,
    '+': TokenType.PLUS,
    '$': TokenType.CONCAT,
    '|': TokenType.OR,
    '(': TokenType.LPAREN,
    ')': TokenType.RPAREN,
    '[': TokenType.LBRACKET,
    ']': TokenType.RBRACKET,
    '-': TokenType.HYPHEN,
    **{c: TokenType.LITERAL for c in alphanumeric}
}


class Token:
    """
    Represents a token in a regular expression.
    
    Attributes:
        tokenType (TokenType): Type of the token.
        value (str): String value of the token.
    """

    def __init__(self, tokenType: TokenType, value: str):
        """
        Initialize a new Token.
        
        Args:
            tokenType: The type of the token.
            value: The string value of the token.
        """
        self.tokenType = tokenType
        self.value = value


class Lexer:
    """
    A lexical analyzer for regular expressions.
    
    This class converts a regular expression string into a sequence of tokens.
    
    Attributes:
        regex (str): The preprocessed regular expression to tokenize.
    """

    def __init__(self, regex: str):
        """
        Initialize a new Lexer with a regular expression.
        
        Args:
            regex: The regular expression to tokenize.
            
        Raises:
            ValueError: If the regex is invalid.
        """
        if not validateRegex(regex):
            raise ValueError("Invalid regular expression.")
        self.regex = preprocessRegex(regex)

    def tokenize(self) -> Tuple[Token, ...]:
        """
        Convert the regular expression into a sequence of tokens.
        
        Returns:
            A tuple of Token objects representing the tokenized regex.
        """
        stream: List[Token] = []
        for c in self.regex:
            stream.append(Token(mapToTokenType[c], c))
        return tuple(stream)
