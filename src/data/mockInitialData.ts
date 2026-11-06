import {
  AgentTask,
  CandidatePreferences,
  MasterResumeData,
  DiscoveredJob,
  RecruiterContact,
  KnowledgeBaseItem,
  QATestCase,
  VisualValidationItem,
  DevToolsTelemetry,
  DetectedBug,
  SyncConnector,
  SyncConflict,
  AuditLogEntry,
} from '../types/agent';

export const initialCandidatePreferences: CandidatePreferences = {
  targetJobTitles: [
    'Senior Full-Stack Engineer',
    'Autonomous AI Systems Engineer',
    'Lead QA & Automation Architect'
  ],
  preferredLocations: ['San Francisco, CA', 'New York, NY', 'Remote (Global)'],
  experienceLevel: 'Senior (5-8 Years)',
  minSalary: '$160,000 / yr',
  maxSalary: '$220,000 / yr',
  workModes: ['Remote', 'Hybrid'],
  maxDailyApplications: 25,
  maxApplicationsPerPortal: 8,
};

export const initialMasterResume: MasterResumeData = {
  fullName: 'Alex Vance',
  email: 'alex.vance@agenticos.net',
  phone: '+1 (415) 890-4421',
  linkedin: 'linkedin.com/in/alex-vance-ai',
  github: 'github.com/alexvance-core',
  summary: 'Senior Full-Stack & Autonomous AI Systems Engineer with 6+ years specializing in reactive distributed architectures, end-to-end automated testing harnesses, and multi-agent workflow orchestration. Proven track record eliminating manual verification overhead and delivering 99.9% uptime systems.',
  skills: {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'],
    frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'Playwright', 'FastAPI'],
    databases: ['PostgreSQL', 'Redis', 'Drizzle ORM', 'MongoDB'],
    cloudAndDevOps: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'GitHub Actions CI/CD'],
    methodologies: ['Agentic Workflows', 'Test-Driven Development', 'WCAG 2.1 AA Accessibility', 'Root Cause Analysis']
  },
  experience: [
    {
      company: 'Aetheria Distributed Labs',
      role: 'Staff Automation & Core Engineer',
      duration: '2023 - Present',
      highlights: [
        'Engineered distributed task queue dispatching 25,000+ daily autonomous agent workflows across heterogeneous cloud endpoints.',
        'Implemented automated Playwright regression test suite cutting deployment regressions by 74% and catching 40+ critical edge-case bugs.',
        'Constructed cross-platform sync layer utilizing vector clocks to resolve distributed data race conditions in sub-100ms latency.'
      ]
    },
    {
      company: 'OmniCloud Technologies',
      role: 'Senior Full-Stack Engineer',
      duration: '2020 - 2023',
      highlights: [
        'Spearheaded transition of legacy microservices to high-throughput TypeScript/Node API gateways with integrated DevTools tracing.',
        'Created dynamic resume parsing and real-time ATS keyword scoring algorithm with 94% precision against Fortune 500 job specs.',
        'Authored comprehensive accessibility audit tool verifying ARIA landmark hierarchies and keyboard navigation compliance.'
      ]
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science & Applied Mathematics',
      graduationYear: '2019'
    }
  ]
};

export const initialTasks: AgentTask[] = [
  {
    id: 'TASK-901',
    title: 'Autonomous Exploration & Crawl of Staging App',
    description: 'Explore all user journeys, discover dynamic forms, inspect API routes, and construct internal application graph on http://staging.app.internal',
    agentType: 'QA_TESTING',
    priority: 'CRITICAL',
    agenticScore: 96,
    riskLevel: 'LOW',
    status: 'IN_PROGRESS',
    platform: 'Staging Env',
    requiresApproval: false,
    dependencies: [],
    concurrencyBucket: 'IMMEDIATE_DISPATCH',
    rateLimitCost: 15,
    executionTimeSec: 42,
    createdAt: '2026-11-05 21:00',
    updatedAt: '2026-11-05 21:30',
    reasoning: 'Pre-requisite for all subsequent Playwright test generation and Figma visual diff analysis.'
  },
  {
    id: 'TASK-902',
    title: 'ATS Resume Customization: Stripe Principal AI Role',
    description: 'Extract JD keywords from Stripe Job #44891, synthesize LaTeX Overleaf resume matching candidate verified experience, and verify ATS score > 90.',
    agentType: 'JOB_AUTOMATION',
    priority: 'HIGH',
    agenticScore: 88,
    riskLevel: 'MODERATE',
    status: 'COMPLETED',
    platform: 'LinkedIn',
    requiresApproval: true,
    dependencies: [],
    concurrencyBucket: 'IMMEDIATE_DISPATCH',
    rateLimitCost: 12,
    executionTimeSec: 28,
    createdAt: '2026-11-05 20:45',
    updatedAt: '2026-11-05 21:15',
    reasoning: 'High-relevance match (96%). Tailored resume generated; awaiting human greenlight before automated submission.'
  },
  {
    id: 'TASK-903',
    title: 'Recruiter Contact Discovery & Cold Email Prep: Datadog',
    description: 'Discover Lead Tech Recruiter at Datadog, craft hyper-personalized cold outreach referencing candidate distributed systems background, prepare 2 follow-ups.',
    agentType: 'JOB_AUTOMATION',
    priority: 'HIGH',
    agenticScore: 84,
    riskLevel: 'MODERATE',
    status: 'AWAITING_APPROVAL',
    platform: 'Wellfound',
    requiresApproval: true,
    dependencies: ['TASK-902'],
    concurrencyBucket: 'GATED_BY_HUMAN',
    rateLimitCost: 10,
    executionTimeSec: 19,
    createdAt: '2026-11-05 21:10',
    updatedAt: '2026-11-05 21:35',
    reasoning: 'Approval Mode active: outreach generated with confidence score 94%. Requires 1-click confirmation before live dispatch.'
  },
  {
    id: 'TASK-904',
    title: 'Correlate UI Button Freeze with DevTools & PostgreSQL Constraint',
    description: 'Investigate 500 Internal Server Error on /api/v1/orders when user clicks "Finalize Order" button in staging environment.',
    agentType: 'QA_TESTING',
    priority: 'CRITICAL',
    agenticScore: 98,
    riskLevel: 'HIGH',
    status: 'PENDING',
    platform: 'PostgreSQL DB',
    requiresApproval: false,
    dependencies: ['TASK-901'],
    concurrencyBucket: 'IMMEDIATE_DISPATCH',
    rateLimitCost: 20,
    executionTimeSec: 35,
    createdAt: '2026-11-05 21:25',
    updatedAt: '2026-11-05 21:38',
    reasoning: 'Critical customer-facing checkout failure identified. Correlating UI state with network payload and DB transaction logs.'
  },
  {
    id: 'TASK-905',
    title: 'Cross-Portal Duplicate Prevention Reconciliation',
    description: 'Scan LinkedIn, Naukri, and Indeed job feeds for duplicate postings of "Staff Platform Engineer" at Anthropic; merge application hashes.',
    agentType: 'SYNC_ENGINE',
    priority: 'MEDIUM',
    agenticScore: 71,
    riskLevel: 'LOW',
    status: 'IN_PROGRESS',
    platform: 'Multi-Portal Bus',
    requiresApproval: false,
    dependencies: [],
    concurrencyBucket: 'QUEUED_PIPELINE',
    rateLimitCost: 5,
    executionTimeSec: 15,
    createdAt: '2026-11-05 21:15',
    updatedAt: '2026-11-05 21:40',
    reasoning: 'Prevents candidate from submitting duplicate applications across different platforms.'
  },
  {
    id: 'TASK-906',
    title: 'Figma Visual QA: Checkout Modal Responsive Diff',
    description: 'Compare actual mobile viewport rendering against Figma design spec #FIG-8902; identify padding and font-weight discrepancies.',
    agentType: 'QA_TESTING',
    priority: 'MEDIUM',
    agenticScore: 68,
    riskLevel: 'LOW',
    status: 'COMPLETED',
    platform: 'Mobile / Figma',
    requiresApproval: false,
    dependencies: ['TASK-901'],
    concurrencyBucket: 'QUEUED_PIPELINE',
    rateLimitCost: 8,
    executionTimeSec: 22,
    createdAt: '2026-11-05 20:30',
    updatedAt: '2026-11-05 20:55',
    reasoning: 'Visual mismatch detected: CTA button overflow on 375px viewport.'
  },
  {
    id: 'TASK-907',
    title: 'Execute Regression Test Suite (Playwright 48 Scenarios)',
    description: 'Run automated end-to-end regression tests across Chrome, Firefox, and WebKit on staging environment before deployment.',
    agentType: 'QA_TESTING',
    priority: 'HIGH',
    agenticScore: 82,
    riskLevel: 'MODERATE',
    status: 'PENDING',
    platform: 'Staging Env',
    requiresApproval: false,
    dependencies: ['TASK-904'],
    concurrencyBucket: 'QUEUED_PIPELINE',
    rateLimitCost: 25,
    executionTimeSec: 65,
    createdAt: '2026-11-05 21:20',
    updatedAt: '2026-11-05 21:35',
    reasoning: 'Ensures no side-effects are introduced following the recent cart and auth modifications.'
  }
];

export const initialDiscoveredJobs: DiscoveredJob[] = [
  {
    id: 'JOB-STRIPE-01',
    title: 'Staff Autonomous Systems & Agentic Engineer',
    company: 'Stripe',
    portal: 'LinkedIn',
    location: 'San Francisco, CA (Hybrid)',
    workMode: 'Hybrid',
    salary: '$195,000 - $240,000',
    postedAgo: '3 hours ago',
    relevanceScore: 96,
    status: 'TAILORED',
    jobDescription: 'Join the Core Automation Architecture team at Stripe. You will build autonomous systems, real-time agent prioritization pipelines, and high-reliability workflow engines using TypeScript, Playwright, and PostgreSQL.',
    requiredSkills: ['TypeScript', 'Distributed Systems', 'Agentic Workflows', 'PostgreSQL', 'Playwright', 'API Architecture'],
    appliedDate: 'Pending Approval',
    duplicatePortalSources: ['Indeed', 'Wellfound'],
    answeredQuestions: [
      { question: 'What is your experience architecting agentic execution pipelines?', answer: 'Led architecture of multi-agent distributed queues handling 25k+ daily workflows at Aetheria Labs.', confidence: 98 },
      { question: 'What are your salary expectations?', answer: '$210,000 base + equity', confidence: 95 }
    ]
  },
  {
    id: 'JOB-DATADOG-02',
    title: 'Senior QA Automation & Runtime Telemetry Engineer',
    company: 'Datadog',
    portal: 'Wellfound',
    location: 'Remote (US/Global)',
    workMode: 'Remote',
    salary: '$175,000 - $210,000',
    postedAgo: '5 hours ago',
    relevanceScore: 92,
    status: 'PENDING_APPROVAL',
    jobDescription: 'Datadog is seeking a Senior Engineer to construct deep browser-level telemetry, Playwright automated testing suites, and root-cause correlation engines connecting frontend errors to distributed traces.',
    requiredSkills: ['Playwright', 'Browser DevTools', 'TypeScript', 'Root Cause Analysis', 'Performance Profiling', 'Docker'],
    duplicatePortalSources: ['Glassdoor'],
    answeredQuestions: [
      { question: 'Have you built browser DevTools automation?', answer: 'Yes, engineered real-time console, network, and storage telemetry analyzers for production SPAs.', confidence: 96 }
    ]
  },
  {
    id: 'JOB-SCALE-03',
    title: 'Lead Full-Stack Agent Orchestration Engineer',
    company: 'Scale AI',
    portal: 'Naukri',
    location: 'San Francisco, CA / Remote',
    workMode: 'Remote',
    salary: '$180,000 - $230,000',
    postedAgo: '1 day ago',
    relevanceScore: 94,
    status: 'ANALYZED',
    jobDescription: 'Build next-generation autonomous agent platforms with dynamic scheduling, task prioritization graphs, and multi-portal synchronization for enterprise customers.',
    requiredSkills: ['TypeScript', 'React', 'Agentic Scheduling', 'WebSocket', 'Node.js', 'System Architecture'],
    duplicatePortalSources: ['Instahyre', 'Cutshort']
  },
  {
    id: 'JOB-VERCEL-04',
    title: 'Senior Frontend & Automated Quality Engineer',
    company: 'Vercel',
    portal: 'Cutshort',
    location: 'Remote',
    workMode: 'Remote',
    salary: '$170,000 - $205,000',
    postedAgo: '2 days ago',
    relevanceScore: 89,
    status: 'DISCOVERED',
    jobDescription: 'Help us maintain the highest standards of web performance and accessibility. You will automate visual regression testing with Playwright, integrate Figma design tokens, and enforce zero-defect releases.',
    requiredSkills: ['React', 'Next.js', 'Playwright', 'Visual Regression', 'Figma API', 'Accessibility WCAG']
  }
];

export const initialRecruiters: RecruiterContact[] = [
  {
    id: 'REC-01',
    name: 'Sarah Jenkins',
    role: 'Principal Technical Recruiter',
    company: 'Stripe',
    email: 'sjenkins@stripe-talent.com',
    linkedinUrl: 'linkedin.com/in/sarah-jenkins-tech',
    jobReferenceId: 'JOB-STRIPE-01',
    status: 'EMAIL_DRAFTED',
    emailSubject: 'Regarding Staff Autonomous Systems Role - Alex Vance',
    emailBody: `Hi Sarah,\n\nI noticed Stripe's push into autonomous agent workflows and came across the Staff Autonomous Systems opening on your team.\n\nAt Aetheria Labs, I engineered distributed task queues managing 25,000+ daily agent workflows and constructed real-time telemetry analyzers with sub-100ms latency. My background directly aligns with Stripe's reliability standards.\n\nI have prepared a tailored ATS resume and would welcome 10 minutes to discuss how I can contribute to your Q4 automation milestones.\n\nBest regards,\nAlex Vance\nhttps://github.com/alexvance-core`,
    followUpsCount: 0,
    maxFollowUps: 2
  },
  {
    id: 'REC-02',
    name: 'Marcus Chen',
    role: 'Head of Engineering Talent',
    company: 'Datadog',
    email: 'marcus.chen@datadoghq-recruit.com',
    linkedinUrl: 'linkedin.com/in/marcus-chen-talent',
    jobReferenceId: 'JOB-DATADOG-02',
    status: 'PENDING_APPROVAL',
    emailSubject: 'Senior QA Automation & Telemetry - Candidate Background',
    emailBody: `Hi Marcus,\n\nFollowing Datadog's recent advancements in synthetic monitoring, I wanted to reach out regarding the Senior QA Automation & Runtime Telemetry role.\n\nI have extensive experience correlating browser DevTools console/network telemetry directly with backend database transaction failures, eliminating false positives in Playwright test suites.\n\nAttached is my tailored resume. Would you have a few minutes for a brief call next week?\n\nBest,\nAlex Vance`,
    followUpsCount: 1,
    maxFollowUps: 2
  }
];

export const initialKnowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 'KB-01',
    category: 'WORK_AUTH',
    question: 'Are you legally authorized to work in the United States without sponsorship?',
    verifiedAnswer: 'Yes, US Citizen with full unrestricted work authorization. No sponsorship required now or in the future.',
    confidenceScore: 100,
    requiresHumanConfirmation: false,
    lastUpdated: '2026-11-01'
  },
  {
    id: 'KB-02',
    category: 'NOTICE_PERIOD',
    question: 'What is your current notice period / earliest start date?',
    verifiedAnswer: '2 weeks standard notice period; available to onboard immediately for high-impact opportunities.',
    confidenceScore: 98,
    requiresHumanConfirmation: false,
    lastUpdated: '2026-11-01'
  },
  {
    id: 'KB-03',
    category: 'SALARY',
    question: 'What is your minimum acceptable base compensation?',
    verifiedAnswer: '$160,000 base salary with equity/bonus components. Open to negotiating based on total compensation and role impact.',
    confidenceScore: 95,
    requiresHumanConfirmation: false,
    lastUpdated: '2026-11-02'
  },
  {
    id: 'KB-04',
    category: 'PERSONAL',
    question: 'Are you bound by any non-compete agreements or intellectual property restrictions with your current employer?',
    verifiedAnswer: 'Unconfirmed by candidate. Please confirm whether any IP restrictions exist for AI/Agentic side projects.',
    confidenceScore: 62,
    requiresHumanConfirmation: true,
    lastUpdated: '2026-11-05'
  }
];

export const initialQATests: QATestCase[] = [
  {
    id: 'TC-SMK-101',
    title: 'Core App Shell & Authentication Session Boot',
    category: 'SMOKE',
    environment: 'staging',
    status: 'PASSED',
    durationMs: 412,
    lastExecuted: '12 mins ago',
    playwrightCode: `import { test, expect } from '@playwright/test';

test('verify authenticated app shell loads within SLA', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('http://staging.app.internal/dashboard');
  await expect(page.locator('#app-root')).toBeVisible();
  const elapsed = Date.now() - startTime;
  expect(elapsed).toBeLessThan(800);
});`
  },
  {
    id: 'TC-E2E-102',
    title: 'End-to-End Autonomous Order Checkout & DB Sync',
    category: 'E2E',
    environment: 'staging',
    status: 'FAILED',
    durationMs: 2310,
    lastExecuted: '5 mins ago',
    failureDetails: {
      errorMessage: 'TimeoutError: locator.click: Target page.locator("[data-testid=checkout-confirm]") closed or timed out after 5000ms',
      traceSnippet: 'at CheckoutModal.submitOrder (checkout.spec.ts:42:19)\n   HTTP 500 POST /api/v1/orders/create: { error: "Foreign key violation: customer_org_id" }',
      correlatedConsoleLog: '[ERROR] Uncaught (in promise) Error: Request failed with status code 500 at orderService.ts:89',
      correlatedNetworkError: 'POST /api/v1/orders/create -> 500 Internal Server Error (Duration: 340ms)'
    },
    playwrightCode: `import { test, expect } from '@playwright/test';

test('execute complete order workflow and verify database state', async ({ page, request }) => {
  await page.goto('http://staging.app.internal/orders/new');
  await page.fill('[data-testid="item-sku"]', 'AGENT-UNIT-01');
  await page.click('[data-testid="add-item-btn"]');
  await page.click('[data-testid="checkout-confirm"]');
  
  // Verify UI success notification
  await expect(page.locator('.toast-success')).toHaveText(/Order Created/);
  
  // Cross-layer DB verification
  const dbCheck = await request.get('http://staging.app.internal/api/orders/latest');
  expect(dbCheck.status()).toBe(200);
});`
  },
  {
    id: 'TC-ACC-103',
    title: 'WCAG 2.1 AA Keyboard Trapping & ARIA Landmark Audit',
    category: 'ACCESSIBILITY',
    environment: 'staging',
    status: 'PASSED',
    durationMs: 680,
    lastExecuted: '25 mins ago',
    playwrightCode: `import { test, expect } from '@playwright/test';

test('audit modal keyboard focus trap and esc dismiss', async ({ page }) => {
  await page.goto('http://staging.app.internal/settings');
  await page.click('[data-testid="open-api-modal"]');
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).toBeHidden();
});`
  },
  {
    id: 'TC-DB-104',
    title: 'API-to-Database Referential Integrity & Transaction Rollback',
    category: 'DATABASE',
    environment: 'QA',
    status: 'PASSED',
    durationMs: 920,
    lastExecuted: '40 mins ago',
    playwrightCode: `import { test, expect, request } from '@playwright/test';

test('simulate failed transaction and ensure zero orphaned rows', async ({ request }) => {
  const res = await request.post('http://qa.app.internal/api/transactions/fault-inject', {
    data: { triggerRollback: true }
  });
  expect(res.status()).toBe(400);
});`
  }
];

export const initialVisualValidations: VisualValidationItem[] = [
  {
    id: 'VIS-01',
    componentName: 'Checkout Slide-over Modal',
    pageUrl: '/orders/checkout',
    figmaReferenceUrl: 'figma.com/design/checkout-v3-mobile',
    diffScore: 18.4,
    status: 'DEFECT_DETECTED',
    issues: [
      'Primary CTA button padding is 8px instead of 16px from design spec',
      'Text label wraps onto 2 lines on viewport width <= 375px',
      'Color token mismatch: #2563EB rendered, #1D4ED8 expected in Figma token'
    ],
    discrepancyType: 'MOBILE_ALIGNMENT'
  },
  {
    id: 'VIS-02',
    componentName: 'Navigation Top Bar & Profile Dropdown',
    pageUrl: '/dashboard',
    figmaReferenceUrl: 'figma.com/design/nav-header-v2',
    diffScore: 1.2,
    status: 'PASSED',
    issues: ['Visual match within 98.8% tolerance threshold.'],
    discrepancyType: 'SPACING'
  }
];

export const initialDevToolsTelemetry: DevToolsTelemetry = {
  consoleLogs: [
    { type: 'error', message: 'Uncaught (in promise) Error: Request failed with status code 500 at orderService.ts:89', timestamp: '21:38:12', source: 'orderService.ts:89' },
    { type: 'warn', message: '[ReactRouter] No matching route found for /favicon.ico', timestamp: '21:38:10', source: 'router.ts:14' },
    { type: 'info', message: 'WebSocket connection established: wss://staging.app.internal/events', timestamp: '21:38:05', source: 'syncClient.ts:44' }
  ],
  networkRequests: [
    { method: 'POST', url: '/api/v1/orders/create', statusCode: 500, durationMs: 340, isFailed: true, payloadSnippet: '{"items":[{"sku":"AGENT-UNIT-01","qty":1}],"billingAddressId":"addr_991"}', responseSnippet: '{"error":"Foreign key violation: customer_org_id cannot be null"}' },
    { method: 'GET', url: '/api/v1/user/profile', statusCode: 200, durationMs: 45, isFailed: false, responseSnippet: '{"id":"usr_440","role":"QA_ENGINEER","tenant":null}' },
    { method: 'GET', url: '/api/v1/telemetry/heartbeat', statusCode: 200, durationMs: 18, isFailed: false }
  ],
  storage: [
    { key: 'session_jwt', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', storageType: 'cookie' },
    { key: 'agent_active_mode', value: 'APPROVAL_MODE', storageType: 'localStorage' },
    { key: 'draft_order_state', value: '{"step":2,"itemCount":1}', storageType: 'sessionStorage' }
  ],
  performance: [
    { metric: 'First Contentful Paint (FCP)', value: 0.72, unit: 's', status: 'good' },
    { metric: 'Largest Contentful Paint (LCP)', value: 1.45, unit: 's', status: 'good' },
    { metric: 'Cumulative Layout Shift (CLS)', value: 0.02, unit: 'score', status: 'good' },
    { metric: 'API Latency (p95)', value: 340, unit: 'ms', status: 'warning' }
  ]
};

export const initialBugs: DetectedBug[] = [
  {
    id: 'BUG-401',
    title: 'Order Checkout Fails with 500: Missing tenant header causes DB Foreign Key Violation',
    pageOrModule: 'Orders / Checkout Module',
    environment: 'staging',
    severity: 'CRITICAL',
    prioritySuggestion: 'P0',
    reproducibility: '100% reproducible when session lacks associated tenant header',
    rootCauseLayer: 'API Defect',
    rootCauseExplanation: 'Frontend orderService initiates POST /api/v1/orders/create without passing "x-tenant-id" in request headers when user.tenant is null. The backend SQL migration expects customer_org_id NOT NULL constraint, throwing an unhandled database exception that returns HTTP 500 and hangs the UI modal.',
    stepsToReproduce: [
      'Navigate to /orders/new with a freshly logged-in QA profile (usr_440)',
      'Add AGENT-UNIT-01 to cart',
      'Click "Finalize Order" button in checkout modal',
      'Observe spinner freezes indefinitely; inspect DevTools network tab showing 500 Internal Server Error'
    ],
    expectedResult: 'Backend should validate tenant payload, gracefully prompt user or inherit default workspace org, and return HTTP 201 or clean HTTP 400 with actionable error.',
    actualResult: 'HTTP 500 unhandled database crash; UI button enters permanent loading state with no error toast shown.',
    status: 'OPEN',
    correlatedTestId: 'TC-E2E-102',
    codeFixSnippet: `// In /src/services/orderService.ts
headers: {
  'Content-Type': 'application/json',
  'x-tenant-id': user.tenantId || user.defaultWorkspaceId || 'default-tenant'
}`
  },
  {
    id: 'BUG-402',
    title: 'Mobile Viewport CTA Overflow in Checkout Slide-over',
    pageOrModule: 'UI / Mobile Component',
    environment: 'mobile',
    severity: 'MEDIUM',
    prioritySuggestion: 'P2',
    reproducibility: '100% on viewport width < 380px',
    rootCauseLayer: 'UI Defect',
    rootCauseExplanation: 'Fixed min-width on action buttons causes container horizontal overflow on standard iPhone SE and Android viewports.',
    stepsToReproduce: [
      'Switch DevTools responsive mode to 375x667',
      'Open checkout slide-over',
      'Observe horizontal scrollbar and button clipping'
    ],
    expectedResult: 'Buttons should wrap gracefully using flex-col on small screen breakpoints.',
    actualResult: 'Buttons overflow container bounding box by 28px.',
    status: 'OPEN',
    correlatedTestId: 'VIS-01'
  }
];

export const initialSyncConnectors: SyncConnector[] = [
  { id: 'CONN-LINKEDIN', name: 'LinkedIn Jobs API', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '4 mins ago', activeSessions: 1, dailyRateLimit: 50, usedRateLimit: 14, duplicateDetections: 3 },
  { id: 'CONN-NAUKRI', name: 'Naukri Portal Sync', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '7 mins ago', activeSessions: 1, dailyRateLimit: 40, usedRateLimit: 8, duplicateDetections: 2 },
  { id: 'CONN-INDEED', name: 'Indeed Aggregator', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '12 mins ago', activeSessions: 1, dailyRateLimit: 60, usedRateLimit: 19, duplicateDetections: 4 },
  { id: 'CONN-WELLFOUND', name: 'Wellfound (AngelList)', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '2 mins ago', activeSessions: 1, dailyRateLimit: 30, usedRateLimit: 5, duplicateDetections: 1 },
  { id: 'CONN-GLASSDOOR', name: 'Glassdoor Enterprise', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '18 mins ago', activeSessions: 1, dailyRateLimit: 35, usedRateLimit: 11, duplicateDetections: 1 },
  { id: 'CONN-FOUNDIT', name: 'Foundit (Monster)', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '25 mins ago', activeSessions: 1, dailyRateLimit: 25, usedRateLimit: 4, duplicateDetections: 0 },
  { id: 'CONN-CUTSHORT', name: 'Cutshort AI', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '15 mins ago', activeSessions: 1, dailyRateLimit: 25, usedRateLimit: 6, duplicateDetections: 1 },
  { id: 'CONN-INSTAHYRE', name: 'Instahyre Premium', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '30 mins ago', activeSessions: 1, dailyRateLimit: 20, usedRateLimit: 3, duplicateDetections: 0 },
  { id: 'CONN-HIRIST', name: 'Hirist Tech', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '35 mins ago', activeSessions: 1, dailyRateLimit: 20, usedRateLimit: 2, duplicateDetections: 0 },
  { id: 'CONN-SHINE', name: 'Shine Jobs', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '45 mins ago', activeSessions: 1, dailyRateLimit: 20, usedRateLimit: 1, duplicateDetections: 0 },
  { id: 'CONN-TIMESJOBS', name: 'TimesJobs', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '50 mins ago', activeSessions: 1, dailyRateLimit: 20, usedRateLimit: 1, duplicateDetections: 0 },
  { id: 'CONN-INTERNSHALA', name: 'Internshala Tech', type: 'JOB_PORTAL', status: 'CONNECTED', lastSynced: '1 hour ago', activeSessions: 1, dailyRateLimit: 15, usedRateLimit: 0, duplicateDetections: 0 },
  { id: 'CONN-STAGING-ENV', name: 'Staging K8s Cluster', type: 'QA_ENVIRONMENT', status: 'CONNECTED', lastSynced: 'Just now', activeSessions: 3, dailyRateLimit: 1000, usedRateLimit: 142, duplicateDetections: 0 },
  { id: 'CONN-POSTGRES', name: 'PostgreSQL DB Primary', type: 'DATA_STORE', status: 'CONNECTED', lastSynced: 'Just now', activeSessions: 2, dailyRateLimit: 5000, usedRateLimit: 620, duplicateDetections: 0 },
  { id: 'CONN-FIGMA', name: 'Figma Design Tokens API', type: 'DEV_TOOL', status: 'CONNECTED', lastSynced: '14 mins ago', activeSessions: 1, dailyRateLimit: 500, usedRateLimit: 48, duplicateDetections: 0 }
];

export const initialSyncConflicts: SyncConflict[] = [
  {
    id: 'CONF-01',
    entityType: 'JOB_APPLICATION',
    sourceA: 'LinkedIn (Job ID #99104)',
    sourceB: 'Indeed (Job ID #IND-3392)',
    description: 'Anthropic Staff Platform Engineer position listed on both LinkedIn and Indeed with slight title variation. Cross-platform sync prevented double submission.',
    status: 'RESOLVED_AUTO',
    resolutionAction: 'Merged application records under primary LinkedIn canonical hash. Deduplication recorded in audit trail.',
    timestamp: '2026-11-05 21:18'
  },
  {
    id: 'CONF-02',
    entityType: 'KNOWLEDGE_ENTRY',
    sourceA: 'Local Candidate Profile (2026-11-05)',
    sourceB: 'Cloud Master Store (2026-11-04)',
    description: 'Candidate updated minimum salary preference to $160,000; cloud node was caching $150,000.',
    status: 'RESOLVED_AUTO',
    resolutionAction: 'Applied Last-Write-Wins with higher cryptographic version clock.',
    timestamp: '2026-11-05 20:50'
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-1001',
    timestamp: '2026-11-05 21:40:02',
    agentType: 'SYNC_ENGINE',
    action: 'DUPLICATE_CHECK_COMPLETED',
    target: 'Anthropic Staff Role',
    details: 'Prevented duplicate submission on Indeed after identifying match on LinkedIn (Fingerprint SHA256: 7f8a9e...).',
    result: 'SUCCESS',
    traceId: 'tr_77109a'
  },
  {
    id: 'AUD-1002',
    timestamp: '2026-11-05 21:38:15',
    agentType: 'QA_TESTING',
    action: 'TEST_FAILURE_DETECTED',
    target: 'TC-E2E-102 (Order Checkout)',
    details: 'Captured HTTP 500 and timeout. Auto-created BUG-401 with correlated network trace and database stack trace.',
    result: 'WARNING',
    traceId: 'tr_44921b'
  },
  {
    id: 'AUD-1003',
    timestamp: '2026-11-05 21:35:40',
    agentType: 'JOB_AUTOMATION',
    action: 'OUTREACH_EMAIL_STAGED',
    target: 'Sarah Jenkins (Stripe)',
    details: 'Drafted human-like cold email + 2-stage follow up sequence. Queued in Approval Gate (Confidence: 94%).',
    result: 'APPROVAL_REQUIRED',
    traceId: 'tr_28103c'
  },
  {
    id: 'AUD-1004',
    timestamp: '2026-11-05 21:28:10',
    agentType: 'JOB_AUTOMATION',
    action: 'LATEX_RESUME_GENERATED',
    target: 'Stripe Staff Role',
    details: 'Synthesized job-tailored ATS LaTeX document with Overleaf compatibility. ATS match score: 96%.',
    result: 'SUCCESS',
    traceId: 'tr_90142d'
  },
  {
    id: 'AUD-1005',
    timestamp: '2026-11-05 21:10:05',
    agentType: 'TASK_ORCHESTRATOR',
    action: 'PRIORITIES_RECALCULATED',
    target: 'Unified Agent Queue',
    details: 'Autonomous prioritization engine re-ordered 7 tasks based on checkout defect severity and Stripe deadline.',
    result: 'SUCCESS',
    traceId: 'tr_11094e'
  }
];
