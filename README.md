# 🔄 Regex --> NFA --> DFA --> Minimized DFA

A tool for converting regular expressions to Non-deterministic Finite Automata (NFA), Deterministic Finite Automata (DFA), and Minimized DFAs.

## 📝 Overview

This project implements a complete pipeline for converting regular expressions into different types of finite state machines:

1. **Regular Expression → Parse Tree**: Parses regex syntax into an Abstract Syntax Tree (AST)
2. **AST → NFA**: Converts the AST into a Non-deterministic Finite Automaton using Thompson's Construction
3. **NFA → DFA**: Uses the Subset Construction algorithm to convert NFA to DFA
4. **DFA → Minimized DFA**: Implements Hopcroft's algorithm to minimize the DFA

## ✨ Features

- **🔣 Complete Regex Support**: Handles concatenation, alternation (|), Kleene star (*), plus (+), optional (?), and character classes
- **🖼️ Visualization**: Outputs automata as JSON for easy visualization
- **⚡ State Optimization**: Produces minimal DFAs with the fewest possible states
- **💻 Command-line Interface**: Simple command-line tool for processing regex patterns

## 📥 Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/Regex-NFA-DFA-minDFA.git
cd Regex-NFA-DFA-minDFA
```

2. Make sure you have Python 3.6+ installed

## 🚀 Usage

### 🧪 Running in Batch Mode (Backend)

You can run the backend directly by executing the main script with your regex pattern:

```bash
python backend/src/main.py "your_regex_pattern" [output_directory]
```

Examples:
```bash
python backend/src/main.py "(a|b)*abb"
python backend/src/main.py "[a-z]+(0|1)*" output_folder
```

This will generate three JSON files:
- `nfa.json`: Non-deterministic Finite Automaton
- `dfa.json`: Deterministic Finite Automaton
- `min_dfa.json`: Minimized Deterministic Finite Automaton

### 🌐 Running via Frontend

If a frontend is available, you can use it to interact with the tool through a graphical interface or a web-based interface. To run the frontend:

1. Execute the flask backend server:
```bash
cd backend/src
pip install flask flask-cors
python app.py
```

2. Then in another terminal, run the react app
```bash
cd frontend
npm install
npm run dev
```

3. Open your browser and navigate to the provided URL (e.g., `http://localhost:5173`).

The frontend will allow you to input regex patterns, visualize the automata, and download the generated JSON files.

## 📁 Project Structure

- `AST.py`: Abstract Syntax Tree node classes
- `Lexer.py`: Tokenizes regex input
- `Parser.py`: Parses tokens into an AST
- `NFA.py`: NFA representation and operations
- `NFABuilder.py`: Converts AST to NFA
- `DFA.py`: DFA representation and operations
- `NFAtoDFA.py`: Converts NFA to DFA
- `DFAMinimizer.py`: Minimizes a DFA
- `main.py`: Command-line interface

## ⚙️ How It Works

1. **🔍 Lexing & Parsing**: The regex is tokenized and parsed into an AST
2. **🏗️ NFA Construction**: Thompson's construction algorithm builds an NFA from the AST
3. **🔄 DFA Conversion**: The subset construction algorithm converts the NFA to a DFA
4. **✂️ DFA Minimization**: Hopcroft's algorithm minimizes the DFA by combining equivalent states

## 📋 Example

For the regex `(a|b)*abb`, the process creates:
- An NFA with epsilon transitions and multiple paths
- A DFA with fewer states but more transitions per state
- A minimal DFA with the optimal number of states needed to recognize the pattern

## 📊 JSON Format

The output is structured JSON describing the automata:

```json
{
  "startingState": "S0",
  "S0": {
    "isTerminatingState": false,
    "a": ["S1"],
    "b": ["S0"]
  },
  "S1": {
    "isTerminatingState": false,
    "a": ["S0"],
    "b": ["S2"]
  },
  "S2": {
    "isTerminatingState": false,
    "a": ["S0"],
    "b": ["S3"]
  },
  "S3": {
    "isTerminatingState": true,
    "a": ["S0"],
    "b": ["S0"]
  }
}
```

## 📋 Requirements

### Backend Dependencies
- Python 3.6+
- Flask
- flask-cors

### Frontend Dependencies
- npm

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Created by [Omar Ibrahim] - March 2025