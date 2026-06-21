# 🎓 AI Curriculum Design & Asynchronous Assessment Engine

An AI-driven assessment creator built for educators. The platform enables teachers to generate curriculum-aligned assessments, question papers, answer keys, and evaluation grids using Large Language Models (LLMs).

Designed with a fully asynchronous, event-driven architecture, the system leverages Next.js, Express.js, BullMQ, Redis, MongoDB Atlas, and Gemini AI to process large educational datasets without blocking the user experience.

---

# 📖 Table of Contents

1. [System Architectural Design](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-system-architectural-design)
2. [Key Core Features](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-key-core-features)
3. [Repository Structure](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-repository-structure)
4. [Prerequisites &amp; System Dependencies](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-prerequisites--system-dependencies)
5. [Local Environment Setup](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-local-environment-setup)
6. [Running the Project Locally](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-running-the-project-locally)
7. [Production Deployment Strategy](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-production-deployment-strategy)
8. [Technology Stack](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-technology-stack)
9. [System Workflow](https://chatgpt.com/c/6a379b6b-01e4-83e8-a4b2-03cbbdb98a15#-system-workflow)

---

# 🚀 System Architectural Design

Traditional AI-powered document processing systems frequently encounter bottlenecks such as:

* HTTP timeout limitations
* Browser UI freezing
* Memory exhaustion
* Long-running AI requests
* Failed uploads for large files

To solve these challenges, the platform adopts a fully decoupled asynchronous architecture.

When a teacher uploads a large textbook (20MB+) or initiates assessment generation, the workflow proceeds as follows:

## 1. Instant Request Acknowledgement

The frontend uploads files and metadata through optimized multipart requests.

The backend:

* Stores initial metadata in MongoDB
* Creates a processing record
* Pushes a generation job into Redis via BullMQ
* Immediately returns a `202 Accepted` response

This keeps frontend response times under 200ms.

---

## 2. Background Processing Workers

Dedicated BullMQ workers consume queued jobs independently from the web server.

Worker responsibilities include:

* PDF parsing
* Text extraction
* OCR processing
* Compression pipelines
* Curriculum analysis
* Question generation
* Answer key creation
* Marking scheme generation

Since all heavy operations occur outside the HTTP request lifecycle, the API remains responsive regardless of workload.

---

## 3. Resilient Failure Recovery

If a worker crashes because of:

* Memory limits
* Container restarts
* Cloud infrastructure interruptions

BullMQ preserves the job state within Redis.

The system automatically:

* Retries failed jobs
* Applies fixed backoff delays
* Recovers unfinished work
* Prevents duplicate processing
* Maintains assessment integrity

This architecture is optimized for free-tier deployments with strict RAM limits.

---

# ✨ Key Core Features

## 📚 AI Assessment Generation

Generate:

* Question papers
* Practice worksheets
* Unit tests
* Midterm examinations
* Final examinations
* Revision assessments

---

## 🧠 Curriculum-Aware Question Creation

Questions are generated based on:

* Curriculum objectives
* Subject requirements
* Grade levels
* Difficulty distribution
* Assessment blueprints

---

## 🔍 Two-Tier Context Grounding (RAG)

The AI follows a strict contextual hierarchy:

### Layer 1 — Uploaded Notes & Attachments

Highest priority sources:

* Teacher notes
* Whiteboard images
* Handwritten documents
* Classroom materials

### Layer 2 — Textbook Repository

Secondary knowledge sources:

* Curriculum textbooks
* Syllabus references
* Subject libraries

This ensures generated assessments remain aligned with classroom instruction.

---

## 🗜️ Automated Data Compression

Large educational content is compressed before storage using Gzip.

Benefits include:

* Up to 90% storage reduction
* Faster retrieval
* Lower database costs
* Reduced network transfer sizes

---

## ⚡ Event-Driven Processing

The platform never blocks the user interface.

All resource-intensive operations execute through:

* BullMQ
* Redis queues
* Worker processes

Resulting in a seamless experience even for large uploads.

---

## 🌐 Network-Resilient Frontend

Custom API wrappers provide:

* Automatic FormData handling
* Multipart boundary management
* Retry-friendly requests
* Friendly processing notifications
* Improved cloud deployment reliability

---

## 🏗️ Decoupled Monorepo Architecture

The project separates responsibilities into:

* Frontend application
* Backend services
* Background workers

Improving scalability and maintainability.

---


# 📂 Repository Structure

The project follows a monorepo architecture with clearly separated frontend and backend applications.

```text
ai-assessment-creator/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
│
├── packages
│   │
│   ├── backend
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── tsconfig.json
│   │   │
│   │   └── src
│   │       ├── config
│   │       │   ├── db.ts
│   │       │   └── queue.ts
│   │       │
│   │       ├── controllers
│   │       │   └── assignment.controller.ts
│   │       │
│   │       ├── models
│   │       │   ├── Assignment.ts
│   │       │   ├── Pattern.ts
│   │       │   └── VaultMaterial.ts
│   │       │
│   │       ├── routes
│   │       │   ├── assignment.routes.ts
│   │       │   ├── pattern.routes.ts
│   │       │   └── vault.routes.ts
│   │       │
│   │       ├── workers
│   │       │   ├── aiGenerator.ts
│   │       │   ├── assessment.worker.ts
│   │       │   └── vaultWorker.ts
│   │       │
│   │       └── server.ts
│   │
│   └── frontend
│       ├── AGENTS.md
│       ├── CLAUDE.md
│       ├── README.md
│       ├── package.json
│       ├── next.config.ts
│       ├── eslint.config.mjs
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       │
│       ├── public
│       │   ├── file.svg
│       │   ├── globe.svg
│       │   ├── next.svg
│       │   ├── vercel.svg
│       │   └── window.svg
│       │
│       └── src
│           │
│           ├── app
│           │   ├── create
│           │   │   └── page.tsx
│           │   ├── dashboard
│           │   │   └── page.tsx
│           │   ├── library
│           │   │   └── page.tsx
│           │   ├── patterns
│           │   │   └── page.tsx
│           │   ├── settings
│           │   │   └── page.tsx
│           │   ├── vault
│           │   │   └── page.tsx
│           │   ├── layout.tsx
│           │   ├── page.tsx
│           │   ├── globals.css
│           │   └── favicon.ico
│           │
│           ├── components
│           │   ├── dashboard
│           │   │   ├── DashboardGreeting.tsx
│           │   │   ├── DashboardHeader.tsx
│           │   │   ├── DashboardMetrics.tsx
│           │   │   └── RecentAssignments.tsx
│           │   │
│           │   ├── forms
│           │   │   └── CreateAssignmentForm.tsx
│           │   │
│           │   ├── library
│           │   │   ├── LibraryCard.tsx
│           │   │   ├── LibraryFilters.tsx
│           │   │   └── LibraryHeader.tsx
│           │   │
│           │   ├── navigation
│           │   │   └── Sidebar.tsx
│           │   │
│           │   ├── patterns
│           │   │   ├── PatternCatalogList.tsx
│           │   │   ├── PatternHeader.tsx
│           │   │   └── PatternInspectionModal.tsx
│           │   │
│           │   ├── preview
│           │   │   └── AssessmentViewer.tsx
│           │   │
│           │   ├── settings
│           │   │   ├── AiSettings.tsx
│           │   │   ├── GeneralSettings.tsx
│           │   │   └── NetworkSettings.tsx
│           │   │
│           │   └── vault
│           │       ├── ConfirmationModal.tsx
│           │       ├── FeedbackModal.tsx
│           │       ├── UploadModal.tsx
│           │       ├── VaultCard.tsx
│           │       ├── VaultFilters.tsx
│           │       └── VaultHeader.tsx
│           │
│           ├── store
│           │   ├── useAssignmentStore.ts
│           │   └── useSettingsStore.ts
│           │
│           └── utils
│               └── api.ts
```

## Backend Responsibilities

### Config Layer

* `db.ts` → MongoDB Atlas connection management
* `queue.ts` → Redis and BullMQ configuration

### Controller Layer

* `assignment.controller.ts` → Assessment creation, generation lifecycle, and status management

### Models

* `Assignment.ts` → Generated assessments and metadata
* `Pattern.ts` → Assessment blueprint definitions
* `VaultMaterial.ts` → Uploaded learning materials and textbook repository

### Routes

* `assignment.routes.ts` → Assessment APIs
* `pattern.routes.ts` → Pattern management APIs
* `vault.routes.ts` → Learning material ingestion APIs

### Worker Layer

* `vaultWorker.ts` → Textbook parsing and preprocessing
* `assessment.worker.ts` → Question paper generation pipeline
* `aiGenerator.ts` → Gemini AI orchestration and prompt execution

---

## Frontend Responsibilities

### App Router Pages

* Dashboard
* Assessment Creation
* Assessment Library
* Pattern Management
* Vault Management
* System Settings

### Reusable Components

The UI is organized by feature modules:

* Dashboard Components
* Forms
* Library Components
* Navigation Components
* Pattern Components
* Preview Components
* Settings Components
* Vault Components

### State Management

Uses Zustand stores:

* `useAssignmentStore.ts`
* `useSettingsStore.ts`

### Utilities

* `api.ts` provides a centralized API wrapper with FormData-safe request handling and network resilience.

---

# 🛠️ Prerequisites & System Dependencies

Ensure the following software is installed before running the project.

| Dependency     | Version             |
| -------------- | ------------------- |
| Node.js        | v18+                |
| npm            | Latest              |
| Git            | Latest              |
| MongoDB Atlas  | Free Tier Supported |
| Upstash Redis  | Required            |
| Gemini API Key | Required            |

---

# 🔧 Local Environment Setup

## Backend Configuration

Navigate to the backend directory:

```bash
cd packages/backend
```

Create a `.env` file:

```env
PORT=5001

MONGODB_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/ai-assessment

REDIS_URL=rediss://default:your_upstash_redis_password@your_endpoint.upstash.io:6379

GEMINI_API_KEY=your_google_gemini_api_key
```

---

## Frontend Configuration

Navigate to the frontend directory:

```bash
cd packages/frontend
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

# 🏃 Running the Project Locally

## Step 1 — Start Backend Services

Open a terminal:

```bash
cd packages/backend
```

Install dependencies:

```bash
npm install
```

Start development mode:

```bash
npm run dev
```

Expected logs:

```text
👷 Background Assessment Worker thread listening...
👷 Background Vault Ingestion Worker successfully spawned.
🚀 Backend server running...
```

---

## Step 2 — Start Frontend

Open another terminal:

```bash
cd packages/frontend
```

Install dependencies:

```bash
npm install
```

Launch Next.js:

```bash
npm run dev
```

Expected output:

```text
ready - started server on http://localhost:3000
```

---

## Step 3 — Open Application

Visit:

```text
http://localhost:3000
```

The platform should now be fully operational.

---

# 🚀 Production Deployment Strategy

The architecture is optimized for modern CI/CD workflows.

## Frontend Deployment

Deploy using:

* Vercel

Benefits:

* Automatic builds
* Preview deployments
* Global CDN
* Edge optimization

---

## Backend Deployment

Deploy using:

* Render Web Services

Benefits:

* Background workers
* Persistent services
* Easy environment management
* Automatic GitHub deployments

---

## Database

MongoDB Atlas stores:

* Assessment metadata
* Generated papers
* Answer grids
* Textbook repositories
* Processing status

---

## Queue Infrastructure

Upstash Redis powers:

* BullMQ queues
* Job persistence
* Retry handling
* Event-driven processing

---

# 💻 Technology Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Zustand

## Backend

* Express.js
* Node.js
* TypeScript

## AI Layer

* Google Gemini 2.5 Flash

## Database

* MongoDB Atlas
* Mongoose

## Queue System

* BullMQ
* Upstash Redis

## Infrastructure

* Vercel
* Render
* GitHub Actions

---

# 🔄 System Workflow

```text
Teacher Upload
       │
       ▼
Next.js Frontend
       │
       ▼
Express API
       │
       ▼
MongoDB Metadata Record
       │
       ▼
BullMQ Queue
       │
       ▼
Redis Job Storage
       │
       ▼
Background Worker
       │
       ├── PDF Parsing
       ├── Text Extraction
       ├── Compression
       ├── RAG Processing
       ├── Gemini Generation
       └── Answer Key Creation
       │
       ▼
MongoDB Storage
       │
       ▼
Frontend Polling
       │
       ▼
Assessment Ready
```

---

# 📄 License

This project is intended for educational institutions and curriculum design workflows.

Feel free to customize the licensing model according to your organizational requirements.

---

**Built with Next.js, Express, BullMQ, Redis, MongoDB Atlas, and Gemini AI to create scalable AI-powered educational assessment systems.**
