# NexusAgent OS: 3D Command Deck, Cloud SQL, Search Grounding & Copilot Upgrade

This plan integrates an immersive Three.js 3D Command Deck, Cloud SQL PostgreSQL persistence with Firebase Authentication, real-time Google Search Grounding, and a floating multi-turn Gemini Agent Copilot across NexusAgent OS.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following confirmed architectural decisions guide this implementation:
> - **Primary Persistence & Auth**: Cloud SQL for PostgreSQL provisioned via Drizzle ORM, with Firebase Authentication (Google Sign-In) securing client access and API routes.
> - **Three.js 3D Visualization**: Full-screen immersive 3D Command Deck mode rendering a multi-part procedural Agentic Core and satellite agent drones, accompanied by a compact, collapsible floating HUD dock.
> - **Multi-Turn Chatbot**: Floating interactive Agent Copilot accessible across all views, maintaining multi-turn conversation history, persona switching (Career Strategist, QA Architect, Orchestration Lead), and live Google Search Grounding.
> - **Search Grounding**: Server-side Google Search integration via `@google/genai` (`gemini-3.8-flash` with `{ tools: [{ googleSearch: {} }] }`) for live market salary intelligence, recruiter discovery, and company hiring signals.

---

### 1. Overview & Core Concept

- **What It Delivers**:
  1. **Three.js 3D Command Deck**: An interactive WebGL environment featuring a composite procedural central orchestration core, orbital agent drones (Job Automation, Prioritization, QA Testing, Cross-Platform Sync), particle data streams, and studio PBR lighting (`ACESFilmicToneMapping`).
  2. **Cloud SQL PostgreSQL + Firebase Auth**: Relational database persistence for user profiles, master resumes, job pipeline items, prioritized tasks, and audit logs, managed via Drizzle ORM and authenticated using Firebase Google Sign-In.
  3. **Google Search Grounding Engine**: Server endpoint enabling agents to ground job descriptions, recruiter profiles, and interview tips in real-time web search results.
  4. **Floating Gemini Multi-Turn Copilot**: Global collapsible chat assistant with streaming response support, model selection (`gemini-3.8-flash` / `gemini-3.1-flash-lite`), and real-time search citations.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  - *Full-Screen 3D Command Deck*: Toggleable full-bleed WebGL view (`100vw x 100vh`) with orbit controls, interactive raycasting on agent satellites, and a collapsible HUD dock (`<= 15%` viewport footprint) showing live agent telemetry.
  - *Floating Copilot Dock*: Sleek bottom-right launcher button expanding into a responsive chat panel with model selector, conversation history thread, suggested prompts, and grounding citation pills.
  - *Cloud SQL & Auth Status*: Non-intrusive account profile in the top bar showing Google avatar, sync status, and persistence confirmation without exposing raw SQL connection strings.

- **Visual Identity & Theme**:
  - *Aesthetic*: Dark industrial cyber-slate (`#0A0E17` background, `#121826` structural surfaces) with cyan (`#06B6D4`), emerald (`#10B981`), and amber (`#F59E0B`) telemetry accents.
  - *3D Scene Craft*: 8-part procedural central reactor (gimbal rings, core crystal, waveguide arms, glowing emitter), procedural canvas particle grid, and dynamic key/fill lights.
  - *Typography*: Plus Jakarta Sans headings, DM Sans body text, and tabular numerals (`font-mono tabular-nums`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Cloud SQL via Guided Provisioning Workflow**
  - *Approach*: Check feature eligibility via `CheckFeatureEligibility` RPC, prompt UI consent with `show_aistudio_ui(ui_type: "cloudsql_setup")`, create instance via `CreateInstance`, configure OAuth via `set_up_oauth`, and initialize Drizzle ORM with connection pooling.
  - *Why*: Ensures production-grade relational integrity with zero connection leaks.

- **Decision 2: Procedural 3D Geometry (Zero External Assets)**
  - *Approach*: Construct all 3D assets programmatically using Three.js groups and procedural canvas textures rather than loading external `.gltf` or `.hdr` URLs.
  - *Why*: Guarantees zero 404s, instant loading, and zero external network dependencies in sandboxed environments.

- **Decision 3: Server-Side Search Grounding Proxy**
  - *Approach*: Expose `/api/agent/grounded-search` and `/api/agent/chat` on `server.ts` utilizing `@google/genai` with `{ tools: [{ googleSearch: {} }] }`.
  - *Why*: Complies with server-side API key security while delivering verified search citations to the client.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NexusAgent OS Client                            │
│                                                                             │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────┐  │
│  │   3D Command Deck     │ │ Floating AI Copilot   │ │  Job / QA Agents  │  │
│  │  (Three.js + Orbit)   │ │ (Multi-turn + Search) │ │ (ATS LaTeX, etc.) │  │
│  └──────────┬────────────┘ └───────────┬───────────┘ └─────────┬─────────┘  │
│             │                          │                       │            │
│             │              ┌───────────▼───────────┐           │            │
│             │              │  Firebase Client Auth │           │            │
│             │              │ (Google Sign-In Popup)│           │            │
│             │              └───────────┬───────────┘           │            │
└─────────────┼──────────────────────────┼───────────────────────┼────────────┘
              │                          │ Bearer ID Token       │
┌─────────────▼──────────────────────────▼───────────────────────▼────────────┐
│                    Full-Stack Express Server (server.ts)                    │
│                                                                             │
│  ┌────────────────────────┐ ┌──────────────────────┐ ┌───────────────────┐  │
│  │   /api/agent/chat      │ │ /api/agent/search-   │ │ Auth Middleware   │  │
│  │ (Multi-turn History)   │ │  grounding (Gemini)  │ │ (Firebase Admin)  │  │
│  └───────────┬────────────┘ └──────────┬───────────┘ └─────────┬─────────┘  │
│              │                         │                       │            │
│  ┌───────────▼─────────────────────────▼───────────┐ ┌─────────▼─────────┐  │
│  │      GoogleGenAI (gemini-3.8-flash)             │ │ Drizzle ORM (pg)  │  │
│  │      - Search Grounding Tool                    │ │ - Cloud SQL Pool  │  │
│  └─────────────────────────────────────────────────┘ └─────────┬─────────┘  │
└────────────────────────────────────────────────────────────────┼────────────┘
                                                                 │ Unix Socket
                                                 ┌───────────────▼────────────┐
                                                 │ Cloud SQL for PostgreSQL   │
                                                 │ Users, Jobs, Tasks, Logs   │
                                                 └────────────────────────────┘
```

- **Interactive State & Handlers**:
  - `viewMode`: `'WORKSPACE'` | `'3D_COMMAND_DECK'`.
  - `isCopilotOpen`: Toggles floating multi-turn chat copilot.
  - `chatHistory`: Multi-turn message history with model role, timestamps, and search citations.
  - `currentUser`: Firebase user object with ID token passing to `/api/*`.
  - `drizzleSchema`: `users`, `jobs`, `tasks`, and `audit_logs` tables in `src/db/schema.ts`.
