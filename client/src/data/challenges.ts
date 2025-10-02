import type { Challenge } from '../types';

export const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Hello Z-- World',
    description: `Welcome to Z--! Your first challenge is simple: write a program that prints "Hello, Z-- World!" to the console.

## Instructions
- Use the \`print()\` function to output text
- Remember to wrap your code in \`start\` and \`end\` blocks
- String literals use double quotes

## Example
\`\`\`z--
start
  print("Hello, Z-- World!")
end
\`\`\``,
    difficulty: 'easy',
    points: 10,
    timeLimit: 5,
    testCases: [
      {
        id: '1-1',
        input: '',
        expectedOutput: 'Hello, Z-- World!',
        isHidden: false
      }
    ],
    starterCode: `start
  // Write your code here
  
end`,
    tags: ['basics', 'hello-world', 'print'],
    totalSubmissions: 1250,
    successfulSubmissions: 1180
  },
  {
    id: '2',
    title: 'Simple Addition',
    description: `Create a program that reads two integers and prints their sum.

## Instructions
- Use \`let\` to declare variables
- Read input using appropriate methods
- Perform addition and print the result

## Input Format
Two integers on separate lines

## Output Format
Single integer representing the sum`,
    difficulty: 'easy',
    points: 20,
    timeLimit: 10,
    testCases: [
      {
        id: '2-1',
        input: '5\n3',
        expectedOutput: '8',
        isHidden: false
      },
      {
        id: '2-2',
        input: '10\n-2',
        expectedOutput: '8',
        isHidden: false
      },
      {
        id: '2-3',
        input: '0\n0',
        expectedOutput: '0',
        isHidden: true
      }
    ],
    starterCode: `start
  // Read two integers and print their sum
  let a = 0
  let b = 0
  
  // Your code here
  
end`,
    tags: ['basics', 'variables', 'arithmetic'],
    totalSubmissions: 980,
    successfulSubmissions: 850
  },
  {
    id: '3',
    title: 'FizzBuzz Z--',
    description: `Implement the classic FizzBuzz problem in Z--.

## Rules
- Print numbers from 1 to n
- For multiples of 3, print "Fizz"
- For multiples of 5, print "Buzz"  
- For multiples of both 3 and 5, print "FizzBuzz"
- Otherwise, print the number

## Input Format
Single integer n (1 ≤ n ≤ 100)

## Output Format
n lines of output following FizzBuzz rules`,
    difficulty: 'medium',
    points: 50,
    timeLimit: 15,
    testCases: [
      {
        id: '3-1',
        input: '15',
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
        isHidden: false
      },
      {
        id: '3-2',
        input: '5',
        expectedOutput: '1\n2\nFizz\n4\nBuzz',
        isHidden: false
      },
      {
        id: '3-3',
        input: '30',
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz',
        isHidden: true
      }
    ],
    starterCode: `start
  // Implement FizzBuzz
  let n = 0  // Read input
  
  // Your code here
  
end`,
    tags: ['loops', 'conditionals', 'modulo'],
    totalSubmissions: 650,
    successfulSubmissions: 420
  },
  {
    id: '4',
    title: 'Array Sum',
    description: `Calculate the sum of all elements in an array.

## Instructions
- Read the size of the array
- Read array elements
- Calculate and print the sum

## Input Format
First line: integer n (size of array)
Second line: n space-separated integers

## Output Format
Single integer representing the sum`,
    difficulty: 'medium',
    points: 40,
    timeLimit: 12,
    testCases: [
      {
        id: '4-1',
        input: '5\n1 2 3 4 5',
        expectedOutput: '15',
        isHidden: false
      },
      {
        id: '4-2',
        input: '3\n-1 0 1',
        expectedOutput: '0',
        isHidden: false
      },
      {
        id: '4-3',
        input: '1\n42',
        expectedOutput: '42',
        isHidden: true
      }
    ],
    starterCode: `start
  // Calculate array sum
  let n = 0
  // Your code here
  
end`,
    tags: ['arrays', 'loops', 'sum'],
    totalSubmissions: 780,
    successfulSubmissions: 650
  },
  {
    id: '5',
    title: 'Prime Number Checker',
    description: `Determine if a given number is prime.

## Definition
A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

## Input Format
Single integer n (2 ≤ n ≤ 10000)

## Output Format
Print "Prime" if the number is prime, "Not Prime" otherwise`,
    difficulty: 'hard',
    points: 75,
    timeLimit: 20,
    testCases: [
      {
        id: '5-1',
        input: '7',
        expectedOutput: 'Prime',
        isHidden: false
      },
      {
        id: '5-2',
        input: '12',
        expectedOutput: 'Not Prime',
        isHidden: false
      },
      {
        id: '5-3',
        input: '97',
        expectedOutput: 'Prime',
        isHidden: true
      },
      {
        id: '5-4',
        input: '100',
        expectedOutput: 'Not Prime',
        isHidden: true
      }
    ],
    starterCode: `start
  // Check if number is prime
  let n = 0  // Read input
  
  // Your code here
  
end`,
    tags: ['math', 'prime', 'algorithms'],
    totalSubmissions: 450,
    successfulSubmissions: 280
  }
];

export const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'medium':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'hard':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

export const getDifficultyPoints = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return '10-30 pts';
    case 'medium':
      return '40-70 pts';
    case 'hard':
      return '75-150 pts';
    default:
      return '0 pts';
  }
};