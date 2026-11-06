import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  Workflow, 
  Network, 
  Zap, 
  ShieldAlert, 
  Download, 
  Copy, 
  Check, 
  ChevronRight,
  Database,
  Cpu,
  Target,
  ArrowRight,
  Sparkles,
  GitBranch,
  Search,
  Sliders,
  Scale
} from 'lucide-react';

export const RequirementsBlueprint: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'problem' | 'requirements' | 'features' | 'prioritization_arch' | 'sync_arch'>('problem');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyMarkdown = () => {
    const md = `# NexusAgent OS: Functional Requirements & Architectural Blueprint (Agentic AI Only)

## 1. Problem Statement Understanding & Analysis
Based on the Autonomous Job Automation Agent and Autonomous AI Testing & QA Agent specifications:
- Problem 1: Autonomous Job Search & Career Workflow
  * High-friction manual job searching across 12+ fragmented platforms (LinkedIn, Naukri, Indeed, Glassdoor, etc.).
  * Need for tailored ATS-friendly Overleaf/LaTeX resumes for each specific Job Description.
  * Recruiter discovery and high-converting personalized cold email outreach.
  * Self-learning feedback loops and verified Candidate Knowledge Base.
- Problem 2: Autonomous Software QA & Testing
  * Autonomous application exploration without brittle scripted journeys.
  * Playwright automated test generation across Smoke, Functional, E2E, API, and Accessibility.
  * Visual & Figma validation with layout diffs.
  * Runtime DevTools anomaly correlation (Console errors -> Network 500 -> Backend -> DB Foreign Key constraints).
  * Root Cause Analysis (RCA) and continuous regression knowledge base.

## 2. Why Legacy Productivity Platforms Fail for Agentic AI
Traditional platforms (Jira, Linear, Asana, Notion) are human-centric:
- Assume humans manually click cards, type descriptions, and attend daily standups.
- Cannot calculate machine-level concurrency, token consumption, or platform rate limits.
- Lack cryptographic audit provenance and automated human-in-the-loop approval gates.
- Lack vector-clock state sync across distributed headless agents and external cloud portals.

## 3. Core Functional Requirements (Agentic AI Only)
1. Autonomous Perception & Exploration: Self-crawling web apps, job portals, and APIs.
2. Dynamic Task Prioritization: Continuous re-scoring: Score = (Impact * Urgency) / (Risk * DependencyDepth) * AutonomyConfidence.
3. Cross-Platform Synchronization: Real-time vector-clock state sync, deduplication fingerprinting across 12+ portals and 7+ QA targets.
4. Tri-Modal Autonomy Controls: Fully Autonomous, Approval Mode, and Assisted Mode.
5. Self-Learning Knowledge Engine: Continuous refinement without factual hallucination.
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Blueprint & Core Functional Requirements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NexusAgent OS: The Productivity Platform FOR ONLY AGENTIC AI
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Synthesizing autonomous capabilities from the comprehensive Job Automation Agent and Autonomous QA & Testing Agent specifications. Engineered exclusively for autonomous software agents to schedule, prioritize, synchronize, and execute tasks across distributed environments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Spec (MD)'}</span>
            </button>
            <a
              href="/public/assets/aistudio/Agents__e1320ffa.pdf"
              download="Agents_Spec.pdf"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-md shadow-indigo-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Original PDF Spec</span>
            </a>
          </div>
        </div>
      </div>

      {/* Blueprint Sub-navigation */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'problem', label: '1. Problem Statements & Paradigm Shift', icon: Target },
          { id: 'requirements', label: '2. Core Functional Requirements', icon: CheckCircle2 },
          { id: 'features', label: '3. Comprehensive Feature Matrix', icon: Layers },
          { id: 'prioritization_arch', label: '4. Dynamic Task Prioritization Engine', icon: Workflow },
          { id: 'sync_arch', label: '5. Cross-Platform Sync Architecture', icon: Network },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Problem Statement Understanding */}
      {activeSection === 'problem' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Autonomous Job Automation Agent Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <h3 className="font-bold text-white text-base">Domain 1: Autonomous Job Automation Agent</h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  Pages 1–4
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Candidates face an exhausting, repetitive, and fragmented job search across dozens of portals. The agent must operate persistently, autonomously finding jobs, tailoring LaTeX ATS resumes, answering verified questions, discovering recruiter contacts, and conducting personalized cold outreach.
              </p>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Functional Pillars:</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong className="text-cyan-300">12+ Portals Discovery:</strong> LinkedIn, Naukri, Indeed, Glassdoor, Foundit, Wellfound, Cutshort, Instahyre, etc.</li>
                  <li><strong className="text-cyan-300">ATS LaTeX Generator:</strong> Tailors Overleaf-compatible LaTeX code matching specific JD keywords without fabricating candidate data.</li>
                  <li><strong className="text-cyan-300">Recruiter Cold Outreach:</strong> Discovers HR contacts, generates human-like personalized emails, and automates multi-stage follow-ups.</li>
                  <li><strong className="text-cyan-300">Tri-Modal Operating Control:</strong> Fully Autonomous, Approval Mode, and Assisted Mode with daily application limits and duplicate prevention.</li>
                </ul>
              </div>
            </div>

            {/* Autonomous AI Testing & QA Agent Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <h3 className="font-bold text-white text-base">Domain 2: Autonomous AI Testing & QA Agent</h3>
                </div>
                <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
                  Pages 5–10
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Traditional QA scripts are brittle and surface-level. The Autonomous QA Agent acts as a Senior QA Engineer across web, APIs, databases, and mobile: exploring applications autonomously, executing Playwright suites, validating UI against Figma, and diagnosing root causes via browser DevTools.
              </p>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Functional Pillars:</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong className="text-rose-300">Autonomous Exploration:</strong> Discovers navigation, dynamic forms, API interactions, and error states without predefined scripts.</li>
                  <li><strong className="text-rose-300">Playwright Generation:</strong> Smoke, Functional, E2E, Negative, Auth/RBAC, and Accessibility (WCAG 2.1 AA).</li>
                  <li><strong className="text-rose-300">Full-Stack Root Cause Analysis:</strong> Correlates UI failures directly with DevTools console logs, failed HTTP 500 requests, and PostgreSQL DB constraint violations.</li>
                  <li><strong className="text-rose-300">Visual & Figma Diff:</strong> Pixel and layout audits identifying spacing, color tokens, and mobile viewport overflow bugs.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Paradigm Shift: Human Productivity vs Agentic AI Productivity */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">The Core Paradigm Shift: Human Tools vs. Agentic AI Platform</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Why do we need a new productivity platform <span className="text-cyan-300 font-semibold underline decoration-cyan-500 underline-offset-4">FOR ONLY AGENTIC AI</span>? Human productivity platforms (Jira, Linear, Asana, Trello) are completely ill-suited for autonomous agents:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2 text-rose-300 font-semibold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Legacy Human Productivity Platforms (Broken for AI)</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>Require humans to manually type tickets, click dropdowns, and drag Kanban cards.</li>
                  <li>Zero awareness of machine token budgets, LLM reasoning costs, or API rate limits.</li>
                  <li>No automated risk-weighted concurrency bucketing or automated approval gates.</li>
                  <li>Cannot synchronize distributed headless agent memory across 12+ external web portals.</li>
                  <li>Static priority levels (P0/P1) that ignore dynamic agent confidence and execution risk.</li>
                </ul>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-xs">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>NexusAgent OS (Designed FOR ONLY AGENTIC AI)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li><strong className="text-emerald-300">Agent-Native Task Ingestion:</strong> Ingests tasks programmatically from crawl pipelines, test failures, and sync events.</li>
                  <li><strong className="text-emerald-300">Continuous Algorithmic Prioritization:</strong> Re-calculates priorities dynamically using real LLM reasoning & risk-benefit vectors.</li>
                  <li><strong className="text-emerald-300">Multi-Platform State Sync:</strong> Real-time vector clock deduplication & cross-portal reconciliation.</li>
                  <li><strong className="text-emerald-300">Tri-Modal Safety Gates:</strong> Routes high-risk actions to Human Approval Queue while letting low-risk tasks execute autonomously.</li>
                  <li><strong className="text-emerald-300">Cryptographic Audit Trail:</strong> Every single agent click, LaTeX compilation, and API call is stamped with trace provenance.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Core Functional Requirements */}
      {activeSection === 'requirements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Req 1: Dynamic Prioritization */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">FR-1: Dynamic Agentic Task Prioritization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The platform must continuously calculate execution priority for all autonomous tasks. Unlike static human backlogs, agent priorities shift based on:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">Execution Urgency:</strong> Job posting age, recruiter reply SLA, staging test deadlines.</li>
                <li><strong className="text-slate-200">Business Impact:</strong> Critical production defect vs minor visual padding diff; 96% match role vs 70% match.</li>
                <li><strong className="text-slate-200">Agent Risk Rating:</strong> Production database write test vs local exploratory crawl.</li>
                <li><strong className="text-slate-200">DAG Dependency Graphs:</strong> Automatically unblocks child tasks once upstream prerequisites complete.</li>
              </ul>
            </div>

            {/* Req 2: Cross Platform Sync */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">FR-2: Cross-Platform & Environment Sync</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Agents operate across 12+ external job portals (LinkedIn, Naukri, Indeed) and 7+ technical environments (Local, QA, Staging, Mobile, PostgreSQL, Figma):
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">Deduplication Fingerprinting:</strong> Prevents duplicate job applications across multiple portals.</li>
                <li><strong className="text-slate-200">Vector Clock Reconciliation:</strong> Resolves state conflicts between distributed cloud agents and local cache.</li>
                <li><strong className="text-slate-200">Offline & Edge Buffer:</strong> Tasks queued while disconnected sync seamlessly upon reconnect.</li>
                <li><strong className="text-slate-200">Platform Rate Limit Gauges:</strong> Throttles calls to adhere to portal quotas (e.g. max 25 apps/day).</li>
              </ul>
            </div>

            {/* Req 3: Full Lifecycle Job Automation */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">FR-3: Autonomous Job Search & Outreach</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Persistent execution loop covering candidate discovery to final recruiter follow-ups:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">Master Resume & Preference Matrix:</strong> Target job titles (up to 3), locations, compensation thresholds, work modes.</li>
                <li><strong className="text-slate-200">LaTeX ATS Engine:</strong> Generates Overleaf-ready LaTeX code highlighting JD keywords.</li>
                <li><strong className="text-slate-200">Recruiter Discovery & Cold Email:</strong> Discovers verified HR contacts, drafts natural non-template emails + 2 follow-ups.</li>
                <li><strong className="text-slate-200">Knowledge Base Q&A:</strong> Verifies application questions; halts on sensitive questions for human approval.</li>
              </ul>
            </div>

            {/* Req 4: Full Stack Autonomous QA */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">FR-4: Autonomous Senior QA Testing Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Acts as an autonomous Senior QA Engineer across software products:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">Playwright Test Generation:</strong> Generates and executes full E2E, Smoke, API, and Accessibility suites.</li>
                <li><strong className="text-slate-200">DevTools Correlation:</strong> Inspects console logs, network waterfall (HTTP 500s), cookies, and Core Web Vitals.</li>
                <li><strong className="text-slate-200">Visual & Figma Validation:</strong> Compares Figma designs with rendered DOM (padding, colors, mobile overflow).</li>
                <li><strong className="text-slate-200">Root Cause Analysis (RCA):</strong> Classifies whether defects stem from UI, API, Backend exception, or DB constraint.</li>
              </ul>
            </div>

            {/* Req 5: Tri-Modal Operating Safety */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">FR-5: Tri-Modal Safety & Human Gatekeeping</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Candidates and QA teams must have absolute governance over agent actions:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">Fully Autonomous Mode:</strong> Auto-executes approved actions within configured limits.</li>
                <li><strong className="text-slate-200">Approval Mode:</strong> Prepares applications & emails, holding submission in a 1-click Approval Queue.</li>
                <li><strong className="text-slate-200">Assisted Mode:</strong> Gathers intelligence and stages payloads; human performs the final action.</li>
                <li><strong className="text-slate-200">Emergency Kill Switch:</strong> One-click instant freeze of all running agents and outbound dispatches.</li>
              </ul>
            </div>

            {/* Req 6: Self Learning & Knowledge Evolution */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">FR-6: Continuous Learning & Regression Memory</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Agents must self-improve without hallucinating candidate details:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">Job Outreach Learning:</strong> Identifies which email subject lines and resume formats generate interviews vs rejections.</li>
                <li><strong className="text-slate-200">QA Flaky Test Detection:</strong> Dynamically adjusts test depth around high-defect modules.</li>
                <li><strong className="text-slate-200">Candidate Knowledge Base:</strong> Safely stores verified answers for application forms.</li>
                <li><strong className="text-slate-200">Regression Suite Pinning:</strong> Auto-generates regression tests whenever a bug fix is confirmed.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Feature Matrix */}
      {activeSection === 'features' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-sm">Comprehensive Feature Inventory FOR ONLY AGENTIC AI</h3>
              <p className="text-xs text-slate-400">Mapped across Autonomy Levels (L1 Assistive to L5 Full Autonomy), Rate Limits & Systems</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search agent features..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Feature Name</th>
                  <th className="py-3 px-4">Subsystem</th>
                  <th className="py-3 px-4">Autonomy Level</th>
                  <th className="py-3 px-4">Task Prioritization Role</th>
                  <th className="py-3 px-4">Cross-Platform Sync Role</th>
                  <th className="py-3 px-4">Safety Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {[
                  { name: 'Algorithmic Priority Matrix', sys: 'Prioritizer', lvl: 'L5 Autonomous', prio: 'Scores tasks by Urgency x Impact / Risk', sync: 'Syncs queue order across cloud workers', gate: 'Automated' },
                  { name: 'DAG Dependency Graph Engine', sys: 'Prioritizer', lvl: 'L5 Autonomous', prio: 'Blocks child tasks until upstream finishes', sync: 'Propagates status updates globally', gate: 'Automated' },
                  { name: 'Multi-Portal Job Aggregator (12+)', sys: 'Job Agent', lvl: 'L4 Autonomous', prio: 'Scores job matches by JD semantic match', sync: 'Deduplicates cross-portal postings', gate: 'Configurable' },
                  { name: 'ATS LaTeX Resume Compiler', sys: 'Job Agent', lvl: 'L4 Autonomous', prio: 'Pre-requisite for application submission', sync: 'Stores versioned LaTeX artifact', gate: 'Approval in Mode 2' },
                  { name: 'Recruiter Outreach Synthesizer', sys: 'Job Agent', lvl: 'L4 Autonomous', prio: 'High priority for newly opened roles', sync: 'Tracks email sequences & follow-ups', gate: 'Human Approval Gate' },
                  { name: 'Candidate Verified Knowledge Base', sys: 'Job Agent', lvl: 'L3 Supervised', prio: 'Unblocks form question answering', sync: 'Cryptographic hash sync with master', gate: 'Flags low confidence' },
                  { name: 'Autonomous App Explorer', sys: 'QA Agent', lvl: 'L5 Autonomous', prio: 'Top priority for new deployments', sync: 'Uploads app route & form topology', gate: 'Automated' },
                  { name: 'Playwright E2E & Smoke Runner', sys: 'QA Agent', lvl: 'L4 Autonomous', prio: 'P0 for staging release validation', sync: 'Exports test traces and timings', gate: 'Automated' },
                  { name: 'Figma Visual Diff Studio', sys: 'QA Agent', lvl: 'L3 Supervised', prio: 'Triggered upon UI component update', sync: 'Fetches Figma API tokens', gate: 'Review if diff > 15%' },
                  { name: 'DevTools Anomaly Correlator', sys: 'QA Agent', lvl: 'L4 Autonomous', prio: 'Boosts priority of 500 error bugs', sync: 'Pairs console logs with network traces', gate: 'Automated' },
                  { name: 'Root Cause Analysis (RCA) Engine', sys: 'QA Agent', lvl: 'L4 Autonomous', prio: 'Generates bug report & suggested fix', sync: 'Syncs defect state to repo/DB', gate: 'Automated' },
                  { name: 'Vector Clock Conflict Resolver', sys: 'Sync Hub', lvl: 'L5 Autonomous', prio: 'Immediate dispatch on race condition', sync: 'Merges distributed agent state', gate: 'Automated' },
                  { name: 'Offline Buffer & Edge Reconnect', sys: 'Sync Hub', lvl: 'L5 Autonomous', prio: 'Flushes queued tasks upon reconnect', sync: 'Reconciles offline action log', gate: 'Automated' },
                  { name: 'Daily Application Quota Guard', sys: 'Governance', lvl: 'L5 Autonomous', prio: 'Throttles tasks when quota reached', sync: 'Enforces rate limits across all nodes', gate: 'Hard Stop' },
                  { name: 'Emergency Kill-Switch Engine', sys: 'Governance', lvl: 'Human Control', prio: 'Overrides all queues immediately', sync: 'Broadcasts pause signal to all agents', gate: 'Human 1-Click' }
                ]
                  .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.sys.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-sans font-semibold text-white">{row.name}</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">{row.sys}</span></td>
                      <td className="py-3 px-4 text-emerald-400">{row.lvl}</td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{row.prio}</td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{row.sync}</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">{row.gate}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Task Prioritization Architecture */}
      {activeSection === 'prioritization_arch' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Mathematical Task Prioritization Architecture</h3>
                <p className="text-xs text-slate-400">How NexusAgent OS autonomously orders work for heterogeneous AI agents</p>
              </div>
            </div>

            {/* Formula Block */}
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-3 font-mono">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                Autonomous Priority Score Formula:
              </div>
              <div className="text-sm sm:text-base text-cyan-300 font-bold bg-slate-900/80 p-3 rounded-lg border border-slate-800 overflow-x-auto">
                PriorityScore = [ (Impact &times; Urgency) &divide; (Risk &times; DependencyDepth) ] &times; AutonomyConfidence &times; RateLimitFactor
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-sans text-slate-300">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-cyan-400 font-semibold block">Impact (1-10):</span>
                  Critical checkout defect (10) vs small padding visual fix (2).
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-amber-400 font-semibold block">Urgency (1-10):</span>
                  Job posted 1 hour ago (9) vs 14 days ago (2).
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-rose-400 font-semibold block">Risk Penalty (1-5):</span>
                  Production DB write (5) vs Staging exploratory read (1).
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-emerald-400 font-semibold block">Rate Limit Factor (0-1):</span>
                  Down-weighted if portal is nearing daily 25-cap quota.
                </div>
              </div>
            </div>

            {/* Concurrency Bucketing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Bucket 1: Immediate Dispatch</span>
                </div>
                <p className="text-xs text-slate-300">
                  Tasks with high score (&gt;80), zero unfinished dependencies, and low risk rating. Dispatched concurrently to headless agent workers.
                </p>
                <div className="text-[11px] text-emerald-300 bg-emerald-950/60 p-2 rounded">
                  Examples: Staging app exploration, ATS resume tailoring, console log profiling.
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-900/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span>Bucket 2: Queued Pipeline</span>
                </div>
                <p className="text-xs text-slate-300">
                  Tasks blocked by upstream prerequisites in the DAG or throttled by platform rate limits. Automatically promoted upon prerequisite resolution.
                </p>
                <div className="text-[11px] text-indigo-300 bg-indigo-950/60 p-2 rounded">
                  Examples: Regression suite waiting on bug repro; job apply waiting on resume compile.
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Bucket 3: Gated By Human</span>
                </div>
                <p className="text-xs text-slate-300">
                  High-risk actions, unverified questions, or operations in Approval Mode. Agent completes 95% of preparation, then awaits 1-click confirmation.
                </p>
                <div className="text-[11px] text-amber-300 bg-amber-950/60 p-2 rounded">
                  Examples: Cold email dispatch, sensitive question confirmation, prod DB alterations.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Cross-Platform Sync Architecture */}
      {activeSection === 'sync_arch' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Cross-Platform Syncing Architecture FOR AGENTIC AI</h3>
                <p className="text-xs text-slate-400">Ensuring zero duplicated work across 12+ job platforms and 7+ QA environments</p>
              </div>
            </div>

            {/* Network Topology Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Column: Job Portals */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>12+ Job Portals</span>
                  <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300">Portals Sync</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">LinkedIn Jobs</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Naukri.com</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Indeed Prime</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Glassdoor</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Wellfound</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Foundit</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Cutshort AI</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Instahyre</div>
                </div>
              </div>

              {/* Center Column: NexusAgent Sync Bus */}
              <div className="bg-gradient-to-b from-indigo-950/60 to-slate-950 p-5 rounded-xl border border-indigo-700/60 space-y-3 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-cyan-300">
                  <Layers className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-extrabold text-white text-sm">NexusAgent Central Sync Bus</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vector Clocks &bull; Canonical Deduplication &bull; Offline Buffer &bull; Concurrency Token Bucket
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] text-slate-400 text-left">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cross-Portal Job Application Hash Sync</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-time DevTools Telemetry Stream</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Distributed Candidate Knowledge Sync</span>
                  </div>
                </div>
              </div>

              {/* Right Column: QA & Runtime Targets */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                  <span>QA & Cloud Targets</span>
                  <span className="text-[10px] bg-rose-950 px-2 py-0.5 rounded text-rose-300">QA Sync</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Localhost :3000</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Development Env</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">QA Cluster</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Staging Server</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Production K8s</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Mobile Emulators</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">Figma Cloud API</div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">PostgreSQL DB</div>
                </div>
              </div>
            </div>

            {/* Deduplication & Conflict Mechanics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Deduplication Engine Mechanics
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a job is posted on LinkedIn, Naukri, and Wellfound simultaneously, the sync engine generates a canonical fingerprint:
                  <code className="block mt-1 text-[11px] text-cyan-300 bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                    SHA256(canonical(company) + canonical(title) + location + salaryTier)
                  </code>
                  Any subsequent application trigger on another portal is immediately intercepted and linked, preventing spamming or candidate disqualification.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Offline Buffer & Partition Recovery
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If an agent loses connectivity while running exploratory Playwright tests or scraping portals, execution state and test evidence are stored in an indexed, append-only buffer. Upon reconnect, the engine performs a 3-way semantic reconciliation to merge results without data loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
