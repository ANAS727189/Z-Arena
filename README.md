# Z‑Arena


[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](./.github/workflows/)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Security](https://img.shields.io/badge/security-active-important)](./SECURITY.md)

---

> **Z‑Arena** is a modern, full-stack competitive programming platform supporting the custom Z-- language via my custom compiler and other popular languages via Judge0. It features real-time battles, leaderboards, and a robust challenge system, built for extensibility and developer experience.

---

## 📚 Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Configuration & Environment](#configuration--environment)
- [Deployment](#deployment)
- [Challenge System](#challenge-system)
- [Appwrite Functions](#appwrite-functions)
- [Security & Compliance](#security--compliance)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Contributing](#contributing)
- [License](#license)
- [Contact & Support](#contact--support)

---

## Introduction

**Z‑Arena** is a next-generation coding competition platform. It enables users to solve, create, and compete in programming challenges across Z--, C++, Python, JavaScript, Rust, and more. Designed for education, hackathons, and developer communities, Z‑Arena is open-source, cloud-ready, and easy to extend.

---

## Features

- ⚡ **Multi-language support**: Z--, C++, Python, JavaScript, Rust, and more via Judge0
- 🧩 **Challenge system**: JSON-based, schema-validated, easy to extend
- 🏆 **Competitive modes**: War (PvP), streaks, leaderboards, achievements
- 🔒 **Secure & scalable**: Appwrite for auth, DB, and real-time; Dockerized backend
- 🎨 **Modern UI/UX**: React 18, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- 🛠️ **Developer-friendly**: TypeScript, modular code, clear API/service layers
- ☁️ **Cloud-native**: Vercel (client), Render/Docker (server), Appwrite integration
- 📦 **Appwrite Functions**: Custom backend logic, challenge seeding, leaderboard updates

---

## Directory Structure

```
Z-challenger/
├── client/              # React frontend (Vite, Tailwind, shadcn/ui)
├── server/              # Node.js backend API, Z-- compiler integration
├── compiler/            # Z-- language compiler/runtime
├── challenges/          # 48+ challenge JSONs, schema
├── appwrite-functions/  # Appwrite cloud functions (seeder, leaderboard, etc)
├── docs/                # Architecture, challenge format, diagrams
├── .github/             # Workflows, issue templates
├── LICENSE, SECURITY.md, README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended for Docker)
- npm or pnpm
- Git
- Appwrite instance (cloud or local) for full features

### Quickstart
```bash
# Clone the repo
git clone <repo-url>
cd Z-challenger

# Client setup
cd client
npm install
npm run dev
# Visit http://localhost:5173

# Server setup
cd ../server
npm install
npm run dev
# API at http://localhost:3000
```

---

## Configuration & Environment

### Client (`client/.env`)
| Variable | Description |
|---|---|
| VITE_APPWRITE_ENDPOINT | Appwrite API endpoint |
| VITE_APPWRITE_PROJECT_ID | Appwrite project ID |
| VITE_APPWRITE_DATABASE_ID | Appwrite DB ID |
| VITE_APPWRITE_CHALLENGES_COLLECTION_ID | Challenges collection |
| VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID | Submissions collection |
| VITE_APPWRITE_USERS_COLLECTION_ID | Users collection |
| VITE_APPWRITE_STARS_LEVELS_COLLECTION_ID | Stars/levels collection |
| VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID | Achievements collection |
| VITE_APPWRITE_LEADERBOARD_COLLECTION_ID | Leaderboard collection |
| VITE_APPWRITE_USER_RANKINGS_COLLECTION_ID | User rankings collection |
| VITE_SERVER_URL | Backend API URL |
| VITE_CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| VITE_CLOUDINARY_UPLOAD_PRESET | Cloudinary upload preset |

### Server (`server/.env`)
| Variable | Description |
|---|---|
| PORT | API port |
| JUDGE0_BASE_URI | Judge0 API endpoint |
| RAPID_API_KEY | Judge0 API key |
| COMPILER_PATH | Path to Z-- compiler script |
| CORS_ORIGIN | Allowed origins |

> **Note:** All `VITE_` variables must be set in Vercel for production. `COMPILER_PATH` in Docker/Render must be `/app/compiler/src/index.js`.

---

## Deployment

### Client (Vercel)
- Import project, set all `VITE_` env vars, deploy.

### Server (Render/Docker)
- Use `server/Dockerfile` (Node 20, multi-stage, LLVM ready)
- Set `COMPILER_PATH=/app/compiler/src/index.js` in env
- Deploy and monitor logs for errors

### Appwrite Functions
- Deploy from `appwrite-functions/` using Appwrite CLI or console
- Use `challenge-seeder/` to seed challenges

---

## Challenge System
- All challenges are JSON files in `/challenges/` (48+ included)
- Schema enforced via `/challenges/schema.json`
- Add new challenges by copying and editing a template
- Use seeder function to upload to Appwrite DB

---

## Appwrite Functions
- Located in `/appwrite-functions/`
- Includes: challenge seeder, leaderboard updater, submission processor, etc.
- Each function has its own README/config

---

## Security & Compliance
- See [`SECURITY.md`](./SECURITY.md) for responsible disclosure and security policy
- Follows best practices for API security, CORS, and secrets management

---

## Troubleshooting & FAQ
- **Missing features in production?** Ensure all env vars are set in Vercel/Render
- **Compiler errors?** Set `COMPILER_PATH` to `/app/compiler/src/index.js` in Docker/Render
- **Judge0 errors?** Check API key and endpoint
- **Appwrite issues?** Confirm collection IDs and permissions
- **More help?** See logs, open an issue, or contact support

---

## Contributing
- Fork, branch, and PR workflow
- Code style: Prettier, ESLint, TypeScript
- Add tests for new features
- See [`CONTRIBUTING.md`](./CONTRIBUTING.md) (if present)

---

## License

[MIT](./LICENSE) © Z‑Arena Contributors

---

## Contact & Support
- Open an issue or discussion on GitHub
- For security, see [`SECURITY.md`](./SECURITY.md)
- For help, email: [support@example.com](mailto:support@example.com)

---

> _Z‑Arena is open-source and community-driven. Contributions, feedback, and new challenges are always welcome!_
