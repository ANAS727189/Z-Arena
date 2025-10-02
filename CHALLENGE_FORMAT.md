# Challenge Format Specification

## File Structure
Each challenge should be a separate file in `/challenges/` directory with the following structure:

```
challenges/
├── challenge-001-hello-world-z.json        # Z-- specific
├── challenge-002-hello-world-cpp.json      # C++ version  
├── challenge-003-array-sum-multi.json      # Multi-language
├── challenge-004-fibonacci-python.json     # Python specific
└── ...
```

## Supported Languages
- **Z--** (zmm) - Custom language with Z-Studio compiler
- **C++** (cpp) - Judge0 Language ID: 54
- **C** (c) - Judge0 Language ID: 50  
- **Java** (java) - Judge0 Language ID: 62
- **Python** (python) - Judge0 Language ID: 71
- **JavaScript** (javascript) - Judge0 Language ID: 63
- **Rust** (rust) - Judge0 Language ID: 73
- **Go** (go) - Judge0 Language ID: 60

## Multi-Language JSON Schema
```json
{
  "id": "unique-challenge-identifier",
  "metadata": {
    "title": "Challenge Title",
    "description": "Detailed description with markdown support",
    "difficulty": "easy|medium|hard", 
    "points": 10,
    "timeLimit": 5,
    "tags": ["tag1", "tag2", "tag3"],
    "author": "Challenge Creator",
    "createdAt": "2025-10-02T19:30:00Z",
    "version": "1.0",
    "supportedLanguages": ["z--", "cpp", "python", "java"]
  },
  "problem": {
    "statement": "Main problem statement",
    "inputFormat": "Description of input format", 
    "outputFormat": "Description of output format",
    "constraints": "Problem constraints",
    "examples": [
      {
        "input": "sample input",
        "output": "expected output", 
        "explanation": "Why this output"
      }
    ]
  },
  "languages": {
    "z--": {
      "starterCode": "start\n  // Your code here\nend",
      "solutionCode": "start\n  // Sample solution\nend",
      "hints": ["Z-- specific hints"],
      "judge0Id": null,
      "compilerType": "z-studio"
    },
    "cpp": {
      "starterCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}",
      "solutionCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World\" << endl;\n    return 0;\n}",
      "hints": ["C++ specific hints"],
      "judge0Id": 54,
      "compilerType": "judge0"
    }
  },
  "testCases": [
    {
      "id": "test-1",
      "input": "test input",
      "output": "expected output",
      "points": 25,
      "isHidden": false,
      "timeout": 1000
    }
  ],
  "editorial": {
    "approach": "Explanation of solution approach",
    "complexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "keywords": ["algorithm", "data-structure"]
  }
}
```

## Proposed Changes:
1. **Modular Structure**: Each challenge in its own JSON file
2. **Rich Metadata**: Author, version, creation date
3. **Detailed Problem Statement**: Separate sections for different parts
4. **Test Case Management**: Individual test cases with points and timeouts  
5. **Editorial Section**: Solution explanations and complexity analysis
6. **Examples**: Clear input/output examples with explanations

## Benefits:
- Easy to version control individual challenges
- Simple to add new challenges
- Clear separation of concerns
- Extensible format for future features
- Easy to validate with JSON schema
