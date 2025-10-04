# Z-Arena - Multi-Language Programming Challenge System

## 🎯 Project Overview

Z-Arena is a competitive programming platform. It supports both the custom Z-- programming language and popular languages like C++, Python, Java, JavaScript, and Rust through Judge0 API integration.

## 🚀 Key Features

### ✅ Completed Features
- **Multi-Language Support**: Challenges available in Z--, C++, Python, Java, JavaScript, and Rust
- **Professional UI**: Dark theme with Z-Studio inspired design using Tailwind CSS + shadcn/ui
- **Challenge System**: JSON-based challenge format with comprehensive metadata
- **Smart Filtering**: Search by title, description, difficulty, and programming language
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Modern Stack**: React 18 + Vite + React Router for optimal performance

### 📊 Current Statistics
- **4 Challenges Created**: Hello World, Two Sum, Fibonacci, String Reversal
- **6 Programming Languages**: Z--, C++, Python, Java, JavaScript, Rust
- **JSON Schema Validation**: Comprehensive schema for consistent challenge format
- **Professional UI**: Landing page, challenge listing, search/filter system

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + **shadcn/ui** for consistent design
- **Framer Motion** for smooth animations
- **React Router** for client-side routing

### Challenge System
- **JSON-based** challenge definitions with schema validation
- **Multi-language** support with language-specific:
  - Starter code templates
  - Solution code examples
  - Hints and explanations
  - Compiler integration (Z-Studio vs Judge0)

### Planned Backend Integration
- **Appwrite Services**:
  - Authentication & User Management
  - Databases for challenges, submissions, leaderboards
  - Functions for code compilation and execution
  - Realtime for live updates and competitions
  - Storage for user avatars and challenge assets

## 📁 Project Structure

```
Z-challenger/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   │   ├── LandingPage.tsx    # Hero section and features
│   │   │   ├── ChallengesPage.tsx # Challenge listing with filters
│   │   │   └── ...
│   │   ├── types/                  # TypeScript definitions
│   │   ├── utils/                  # Utility functions
│   │   │   └── challengeLoader.ts # Challenge management
│   │   └── lib/                   # Configuration and helpers
│   └── public/challenges/          # Challenge JSON files (dev)
├── challenges/                      # Challenge definitions
│   ├── schema.json                 # JSON schema for validation
│   ├── challenge-001-hello-world.json
│   ├── challenge-002-two-sum-array.json
│   ├── challenge-003-fibonacci-sequence.json
│   └── challenge-004-reverse-string.json
├── CHALLENGE_FORMAT.md             # Challenge format documentation
└── README.md                       # This file
```

## 🎮 Challenge Examples

### 1. Hello World (Z-- Focus)
- **Difficulty**: Easy (20 points)
- **Languages**: Z--, C++, Python, Java
- **Concepts**: Basic syntax, I/O operations
- **Z-- Features**: Variable declarations, print statements

### 2. Two Sum Array (Multi-Language)
- **Difficulty**: Medium (50 points)
- **Languages**: Z--, C++, Python, Java
- **Concepts**: Arrays, hash maps, algorithm optimization
- **Approaches**: Brute force O(n²) vs Hash map O(n)

### 3. Fibonacci Sequence (Algorithm Focus)
- **Difficulty**: Easy (30 points)
- **Languages**: Z--, C++, Python, Java, JavaScript
- **Concepts**: Loops, recursion, mathematical sequences
- **Optimization**: Iterative vs recursive approaches

### 4. String Reversal (Multi-Language)
- **Difficulty**: Easy (25 points)
- **Languages**: Z--, C++, Python, Java, JavaScript, Rust
- **Concepts**: String manipulation, two pointers, in-place algorithms
- **Language Features**: Built-in methods vs manual implementation

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Z-challenger

# Install dependencies
cd client
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Challenge Development
1. Create new challenge JSON file in `/challenges/` directory
2. Follow the schema defined in `/challenges/schema.json`
3. Copy to `/client/public/challenges/` for development
4. Update challenge loader in `challengeLoader.ts`

## 🎨 Design System

### Color Palette
- **Background Primary**: `#060111` (Deep dark blue)
- **Background Secondary**: `#0f0f23` (Darker blue)
- **Accent Purple**: `#8b5cf6` (Primary brand color)
- **Accent Cyan**: `#06b6d4` (Secondary accent)
- **Text Primary**: `#ffffff` (Pure white)
- **Text Secondary**: `#94a3b8` (Muted gray)

### Typography
- **Headings**: Darker Grotesque (bold, modern)
- **Body**: Inter (readable, professional)
- **Code**: JetBrains Mono (monospace)

---