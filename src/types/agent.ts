export type AgentType = 'JOB_AUTOMATION' | 'QA_TESTING' | 'TASK_ORCHESTRATOR' | 'SYNC_ENGINE';

export type OperatingMode = 'FULLY_AUTONOMOUS' | 'APPROVAL_MODE' | 'ASSISTED_MODE';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'AWAITING_APPROVAL' | 'COMPLETED' | 'BLOCKED' | 'FAILED';

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  agentType: AgentType;
  priority: PriorityLevel;
  agenticScore: number; // 0-100 calculated dynamic score
  riskLevel: RiskLevel;
  status: TaskStatus;
  platform: string; // e.g. "LinkedIn", "Staging", "PostgreSQL", "Wellfound"
  requiresApproval: boolean;
  dependencies: string[]; // Task IDs that must finish first
  concurrencyBucket: 'IMMEDIATE_DISPATCH' | 'QUEUED_PIPELINE' | 'GATED_BY_HUMAN';
  rateLimitCost: number; // Token/quota cost
  executionTimeSec: number;
  createdAt: string;
  updatedAt: string;
  reasoning?: string;
  payload?: any;
}

// Job Automation Agent Types
export interface CandidatePreferences {
  targetJobTitles: string[];
  preferredLocations: string[];
  experienceLevel: string;
  minSalary: string;
  maxSalary: string;
  workModes: ('Remote' | 'Hybrid' | 'Onsite')[];
  maxDailyApplications: number;
  maxApplicationsPerPortal: number;
}

export interface MasterResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    cloudAndDevOps: string[];
    methodologies: string[];
  };
  experience: {
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    graduationYear: string;
  }[];
}

export interface DiscoveredJob {
  id: string;
  title: string;
  company: string;
  portal: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  salary: string;
  postedAgo: string;
  relevanceScore: number;
  status: 'DISCOVERED' | 'ANALYZED' | 'TAILORED' | 'PENDING_APPROVAL' | 'APPLIED' | 'REJECTED_BY_AGENT';
  jobDescription: string;
  requiredSkills: string[];
  appliedDate?: string;
  resumeVersionId?: string;
  answeredQuestions?: { question: string; answer: string; confidence: number }[];
  duplicatePortalSources?: string[];
}

export interface RecruiterContact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  linkedinUrl: string;
  jobReferenceId: string;
  status: 'DISCOVERED' | 'EMAIL_DRAFTED' | 'PENDING_APPROVAL' | 'SENT' | 'REPLIED_POSITIVE' | 'REPLIED_NEUTRAL' | 'NO_RESPONSE';
  lastContactDate?: string;
  emailSubject?: string;
  emailBody?: string;
  followUpsCount: number;
  maxFollowUps: number;
}

export interface KnowledgeBaseItem {
  id: string;
  category: 'SALARY' | 'WORK_AUTH' | 'NOTICE_PERIOD' | 'TECH_EXPERIENCE' | 'PERSONAL';
  question: string;
  verifiedAnswer: string;
  confidenceScore: number;
  requiresHumanConfirmation: boolean;
  lastUpdated: string;
}

// QA & Testing Agent Types
export type QAEnvironment = 'localhost' | 'development' | 'QA' | 'staging' | 'UAT' | 'production' | 'mobile';

export interface QATestCase {
  id: string;
  title: string;
  category: 'SMOKE' | 'FUNCTIONAL' | 'REGRESSION' | 'E2E' | 'NEGATIVE' | 'API' | 'ACCESSIBILITY' | 'PERFORMANCE' | 'DATABASE';
  environment: QAEnvironment;
  status: 'PASSED' | 'FAILED' | 'BLOCKED' | 'RUNNING' | 'SKIPPED' | 'FLAKY';
  durationMs: number;
  playwrightCode: string;
  lastExecuted: string;
  failureDetails?: {
    errorMessage: string;
    traceSnippet: string;
    screenshotUrl?: string;
    correlatedConsoleLog?: string;
    correlatedNetworkError?: string;
  };
}

export interface VisualValidationItem {
  id: string;
  componentName: string;
  pageUrl: string;
  figmaReferenceUrl: string;
  diffScore: number; // 0-100% diff percentage
  status: 'PASSED' | 'DEFECT_DETECTED';
  issues: string[];
  discrepancyType: 'SPACING' | 'COLOR' | 'FONT_SIZE' | 'OVERFLOW' | 'MOBILE_ALIGNMENT' | 'MISSING_ELEMENT';
}

export interface DevToolsTelemetry {
  consoleLogs: {
    type: 'error' | 'warn' | 'info';
    message: string;
    timestamp: string;
    source: string;
  }[];
  networkRequests: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    statusCode: number;
    durationMs: number;
    payloadSnippet?: string;
    responseSnippet?: string;
    isFailed: boolean;
  }[];
  storage: {
    key: string;
    value: string;
    storageType: 'cookie' | 'localStorage' | 'sessionStorage';
  }[];
  performance: {
    metric: string;
    value: number;
    unit: string;
    status: 'good' | 'warning' | 'poor';
  }[];
}

export interface DetectedBug {
  id: string;
  title: string;
  pageOrModule: string;
  environment: QAEnvironment;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  prioritySuggestion: 'P0' | 'P1' | 'P2' | 'P3';
  reproducibility: string;
  rootCauseLayer: 'UI Defect' | 'Frontend Logic' | 'API Defect' | 'Backend Exception' | 'Database Inconsistency' | 'Accessibility' | 'Environment Config';
  rootCauseExplanation: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  status: 'OPEN' | 'INVESTIGATING' | 'FIX_VERIFIED' | 'FALSE_POSITIVE_DISMISSED';
  correlatedTestId?: string;
  codeFixSnippet?: string;
}

// Cross Platform Sync Types
export interface SyncConnector {
  id: string;
  name: string;
  type: 'JOB_PORTAL' | 'QA_ENVIRONMENT' | 'DEV_TOOL' | 'DATA_STORE';
  status: 'CONNECTED' | 'SYNCING' | 'PAUSED' | 'RATE_LIMITED' | 'ERROR';
  lastSynced: string;
  activeSessions: number;
  dailyRateLimit: number;
  usedRateLimit: number;
  duplicateDetections: number;
}

export interface SyncConflict {
  id: string;
  entityType: 'JOB_APPLICATION' | 'TEST_RUN' | 'KNOWLEDGE_ENTRY' | 'RESUME_VERSION';
  sourceA: string;
  sourceB: string;
  description: string;
  status: 'DETECTED' | 'RESOLVING' | 'RESOLVED_AUTO' | 'REQUIRES_USER';
  resolutionAction?: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  agentType: AgentType;
  action: string;
  target: string;
  details: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED' | 'APPROVAL_REQUIRED';
  traceId: string;
}
