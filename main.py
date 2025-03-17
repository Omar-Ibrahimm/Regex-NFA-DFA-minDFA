import sys
import os
from Lexer import Lexer
from Parser import Parser
from NFABuilder import NFABuilder
from NFAtoDFA import NFAtoDFA
from DFAMinimizer import DFAMinimizer

def main():
    # Check if regex is provided as command line argument
    if len(sys.argv) < 2:
        print("Usage: python main.py \"regex_pattern\" [output_dir]")
        print("Example: python main.py \"(a|b)*abb\" output")
        return
    
    # Get the regex pattern
    regex = sys.argv[1]
    
    # Get output directory (default is current directory)
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "."
    
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print(f"Processing regex: {regex}")
    
    try:
        # Step 1: Tokenize the regex
        print("Step 1: Tokenizing regex...")
        lexer = Lexer(regex)
        tokens = lexer.tokenize()
        
        # Step 2: Parse tokens into AST
        print("Step 2: Parsing tokens into AST...")
        parser = Parser(tokens)
        ast = parser.parse()
        
        # Step 3: Build NFA from AST
        print("Step 3: Building NFA from AST...")
        nfa_builder = NFABuilder()
        nfa = nfa_builder.buildFromAST(ast)
        
        # Step 4: Convert NFA to DFA
        print("Step 4: Converting NFA to DFA...")
        nfa_to_dfa = NFAtoDFA(nfa)
        dfa = nfa_to_dfa.convert()
        
        # Step 5: Minimize DFA
        print("Step 5: Minimizing DFA...")
        dfa_minimizer = DFAMinimizer(dfa)
        min_dfa = dfa_minimizer.minimize()
        
        # Step 6: Save outputs to files
        print("Step 6: Saving outputs to files...")
        
        # Save NFA
        nfa_path = os.path.join(output_dir, "nfa.json")
        with open(nfa_path, "w") as f:
            f.write(nfa.toJson())
        
        # Save DFA
        dfa_path = os.path.join(output_dir, "dfa.json")
        with open(dfa_path, "w") as f:
            f.write(dfa.toJson())
        
        # Save minimized DFA
        min_dfa_path = os.path.join(output_dir, "min_dfa.json")
        with open(min_dfa_path, "w") as f:
            f.write(min_dfa.toJson())
        
        print("\nConversion completed successfully!")
        print(f"NFA saved to: {nfa_path}")
        print(f"DFA saved to: {dfa_path}")
        print(f"Minimized DFA saved to: {min_dfa_path}")
        
        # Print some statistics
        print("\nStatistics:")
        print(f"NFA states: {count_states(nfa)}")
        print(f"DFA states: {count_states(dfa)}")
        print(f"Minimized DFA states: {count_states(min_dfa)}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()


def count_states(automaton):
    """Count the number of states in an NFA or DFA"""
    # Count all keys except 'startingState'
    return sum(1 for state in automaton.structure if state != "startingState")


if __name__ == "__main__":
    main()