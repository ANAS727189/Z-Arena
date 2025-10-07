// Starter code templates for different programming languages
export const starterCodeTemplates = {
  'z--': `
  start
  // Your code goes here
  end
`,

  javascript: `
function solve() {
    // Write your solution here
    
}

// Example usage
// console.log(solve());
`,

  typescript: `
function solve(): any {
    // Write your solution here
    
}

// Example usage
// console.log(solve());
`,

  python: `
def solve():
    """
    Write your solution here
    """
    pass

# Example usage
# print(solve())
`,

  java: `
import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Write your solution here
        
        scanner.close();
    }
    
    public static void solve() {
        // Your solution logic here
    }
}
`,

  cpp: `
#include <iostream>
#include<bits/stdc++.h>

using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}
`,

  c: `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Write your solution here
    
    return 0;
}
`,

  csharp: `
using System;
using System.Collections.Generic;
using System.Linq;

public class Solution 
{
    public static void Main(string[] args) 
    {
        // Write your solution here
        
    }
    
    public static void Solve() 
    {
        // Your solution logic here
    }
}
`,

  go: `
package main

import (
    "fmt"
)

func main() {
    // Write your solution here
    
}

func solve() {
    // Your solution logic here
}
`,

  rust: `
use std::io::{self, BufRead};

fn main() {
    // Write your solution here
    
}

fn solve() {
    // Your solution logic here
}
`,

  php: `<?php

function solve() {
    // Write your solution here
    
}

// Example usage
// echo solve();
?>
`,

  ruby: `
def solve
    # Write your solution here
    
end

# Example usage
# puts solve()
`,

  kotlin: `
fun main() {
    // Write your solution here
    
}

fun solve() {
    // Your solution logic here
}
`,

  scala: `
object Solution {
    def main(args: Array[String]): Unit = {
        // Write your solution here
        
    }
    
    def solve(): Unit = {
        // Your solution logic here
    }
}
`,

  swift: `
import Foundation

func solve() {
    // Write your solution here
    
}

// Main execution
solve()
`,

  r: `
solve <- function() {
    # Write your solution here
    
}

# Example usage
# result <- solve()
# print(result)
`,
};


export const getStarterCode = (
  language: string,
  challengeTitle?: string
): string => {
  const template =
    starterCodeTemplates[language as keyof typeof starterCodeTemplates];

  if (!template) {
    return `// ${language.charAt(0).toUpperCase() + language.slice(1)} Solution
// Write your solution here for: ${challengeTitle || 'Challenge'}

`;
  }

  return template;
};

// Get all supported languages
export const getSupportedLanguages = (): string[] => {
  return Object.keys(starterCodeTemplates);
};

// Language display names
export const languageDisplayNames: Record<string, string> = {
  'z--': 'Z--',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  kotlin: 'Kotlin',
  scala: 'Scala',
  swift: 'Swift',
  r: 'R',
};

// Get display name for a language
export const getLanguageDisplayName = (language: string): string => {
  return (
    languageDisplayNames[language] ||
    language.charAt(0).toUpperCase() + language.slice(1)
  );
};
