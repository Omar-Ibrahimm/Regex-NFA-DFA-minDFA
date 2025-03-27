"""
Utility functions for regular expression processing and validation.

This module provides helper functions for working with regular expressions,
including validation and preprocessing operations.
"""

import re

# Valid alphanumeric characters that can be used in regex expressions
alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


def validateRegex(regex: str) -> bool:
    """
    Validate if a string is a valid regular expression.
    
    Args:
        regex (str): The regular expression to validate.
        
    Returns:
        bool: True if the regex is valid, False otherwise.
    """
    try:
        re.compile(regex)
        return True
    except re.error:
        return False


def preprocessRegex(regex: str) -> str:
    """
    Preprocess a regular expression by adding concatenation operators.
    
    This function inserts explicit concatenation operators ('$') between
    characters where concatenation is implied in standard regex notation.
    
    Args:
        regex (str): The regular expression string to preprocess.
        
    Returns:
        str: The preprocessed regular expression with explicit concatenation.
    """
    res = ""
    in_char_class = False
    length = len(regex)
    i = 0
    
    while i < length:
        char = regex[i]
        
        # Track if we're inside a character class [...]
        if char == '[':
            in_char_class = True
        elif char == ']':
            in_char_class = False
            
        res += char
        
        # Skip concatenation processing inside character classes
        if in_char_class:
            i += 1
            continue
            
        # Check if we need to add a concatenation operator
        if i + 1 < length:
            next_char = regex[i + 1]
            
            # Insert concatenation operator between various character combinations
            # where concatenation is implied
            if (
                # Alphanumeric or closing symbols followed by opening elements
                (char.isalnum() or char in ")*.") and 
                (next_char.isalnum() or next_char in "([.")
            ) or (
                # Quantifiers followed by opening elements
                (char in "*+?") and 
                (next_char.isalnum() or next_char in "([.")
            ) or (
                # Closing parenthesis followed by opening elements
                (char == ')') and 
                (next_char.isalnum() or next_char in "([.")
            ) or (
                # Closing character class followed by opening elements
                (char == ']') and 
                (next_char.isalnum() or next_char in "([.")
            ):
                res += '$'
                
        i += 1
        
    return res
