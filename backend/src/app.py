import os
import json
import subprocess
import shutil
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

def read_json_file(path):
    """Read and parse a JSON file."""
    with open(path, 'r') as f:
        return json.load(f)

@app.route('/generate', methods=['POST'])
def generate_automata():
    print("hello")

    # Get regex from request body
    data = request.get_json()
    regex = data.get('regex')
    if not regex:
        return jsonify({"error": "Regex parameter is required"}), 400

    # Create a temporary directory for output files
    output_dir = tempfile.mkdtemp()
    try:
        # Execute the main.py script with the provided regex and output directory
        result = subprocess.run(
            ['python', 'main.py', regex, output_dir],
            capture_output=True,
            text=True,
            check=True
        )

    except subprocess.CalledProcessError as e:
        # Return error details if the script fails
        return jsonify({
            "error": "Failed to generate automata",
            "details": e.stderr.strip()
        }), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    else:
        # Read the generated JSON files
        try:
            nfa = read_json_file(os.path.join(output_dir, 'nfa.json'))
            dfa = read_json_file(os.path.join(output_dir, 'dfa.json'))
            min_dfa = read_json_file(os.path.join(output_dir, 'min_dfa.json'))
        except FileNotFoundError as e:
            return jsonify({"error": f"Missing output file: {str(e)}"}), 500
        
        # Prepare the response
        response = {
            "nfa": nfa,
            "dfa": dfa,
            "min_dfa": min_dfa
        }
        print(response)
        return jsonify(response)
    
    finally:
        # Clean up the temporary directory
        shutil.rmtree(output_dir)

if __name__ == '__main__':
    app.run(debug=True)