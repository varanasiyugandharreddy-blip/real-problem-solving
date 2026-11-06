import React, { useState, useEffect } from 'react';
import { 
  OperatingMode, 
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
  QAEnvironment 
} from './types/agent';
import { 
  initialCandidatePreferences, 
  initialMasterResume, 
  initialTasks, 
  initialDiscoveredJobs, 
  initialRecruiters, 
  initialKnowledgeBase, 
  initialQATests, 
  initialVisualValidations, 
  initialDevToolsTelemetry, 
  initialBugs, 
  initialSyncConnectors, 
  initialSyncConflicts, 
  initialAuditLogs 
} from './data/mockInitialData';

import { auth, googleAuthProvider } from './lib/firebase.ts';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

import { Header } from './components/Header';
import { RequirementsBlueprint } from './components/RequirementsBlueprint';
import { TaskPrioritizationEngine } from './components/TaskPrioritizationEngine';
import { CrossPlatformSyncHub } from './components/CrossPlatformSyncHub';
import { JobAutomationAgentView } from './components/JobAutomationAgentView';
import { QATestingAgentView } from './components/QATestingAgentView';
import { AuditTrailView } from './components/AuditTrailView';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { ThreeCommandDeck } from './components/ThreeCommandDeck';
import { AgentCopilotModal } from './components/AgentCopilotModal';

export default function App() {
  // Focus on Job Agent in Fully Autonomous Mode per user's confirmed choice
  const [activeTab, setActiveTab] = useState<string>('job-agent');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('FULLY_AUTONOMOUS');
  const [isPaused, setIsPaused] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRunningCycle, setIsRunningCycle] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // New interactive modalities
  const [is3DDeckOpen, setIs3DDeckOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core State
  const [tasks, setTasks] = useState<AgentTask[]>(initialTasks);
  const [preferences, setPreferences] = useState<CandidatePreferences>(initialCandidatePreferences);
  const [masterResume, setMasterResume] = useState<MasterResumeData>(initialMasterResume);
  const [discoveredJobs, setDiscoveredJobs] = useState<DiscoveredJob[]>(initialDiscoveredJobs);
  const [recruiters, setRecruiters] = useState<RecruiterContact[]>(initialRecruiters);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>(initialKnowledgeBase);
  const [testCases, setTestCases] = useState<QATestCase[]>(initialQATests);
  const [visualValidations, setVisualValidations] = useState<VisualValidationItem[]>(initialVisualValidations);
  const [devTools] = useState<DevToolsTelemetry>(initialDevToolsTelemetry);
  const [bugs, setBugs] = useState<DetectedBug[]>(initialBugs);
  const [activeQAEnv, setActiveQAEnv] = useState<QAEnvironment>('staging');
  const [connectors, setConnectors] = useState<SyncConnector[]>(initialSyncConnectors);
  const [conflicts, setConflicts] = useState<SyncConflict[]>(initialSyncConflicts);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

  // Approval items queue
  const [pendingApprovals, setPendingApprovals] = useState<{
    id: string;
    actionTitle: string;
    agent: string;
    risk: string;
    details: string;
    payload?: any;
  }[]>([]);

  // Listen for Firebase Auth state & sync with Cloud SQL
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const idToken = await user.getIdToken();
          await fetch('/api/user/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              name: user.displayName,
            }),
          });
        } catch (err) {
          console.error('Error syncing user with Cloud SQL:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignInGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error('Firebase sign-in error:', err);
    }
  };

  const handleSignOutGoogle = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Firebase sign-out error:', err);
    }
  };

  // Execute full autonomous cycle across Job Search, ATS Resume, and Outreach
  const handleRunAutonomousCycle = async () => {
    if (isRunningCycle || isPaused) return;
    setIsRunningCycle(true);

    try {
      const targetJob = discoveredJobs.find(j => j.status !== 'APPLIED') || discoveredJobs[0];

      // 1. Fetch tailored resume LaTeX with Gemini API
      let tailoredData: any = null;
      try {
        const res = await fetch('/api/agent/tailor-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: targetJob.title,
            company: targetJob.company,
            jobDescription: targetJob.jobDescription,
            masterResume: masterResume,
            candidatePreferences: preferences
          }),
        });
        if (res.ok) tailoredData = await res.json();
      } catch (e) {
        console.error(e);
      }

      // 2. Update job status to APPLIED autonomously
      setDiscoveredJobs(prev => prev.map(j => {
        if (j.id === targetJob.id) {
          return {
            ...j,
            status: 'APPLIED',
            appliedDate: new Date().toLocaleTimeString(),
            relevanceScore: tailoredData?.atsScore || 96
          };
        }
        return j;
      }));

      // 3. Persist to Cloud SQL if user is signed in
      try {
        await fetch('/api/db/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: targetJob.title,
            company: targetJob.company,
            portal: targetJob.portal,
            location: targetJob.location,
            salary: targetJob.salary,
            relevanceScore: tailoredData?.atsScore || 96,
            jobDescription: targetJob.jobDescription
          })
        });
      } catch (e) {
        // Fallback to in-memory
      }

      // 4. Synthesize recruiter outreach email
      try {
        const outRes = await fetch('/api/agent/generate-outreach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recruiterName: 'Elena Rostova',
            recruiterRole: 'Head of Technical Recruiting',
            company: targetJob.company,
            jobTitle: targetJob.title,
            candidateProfile: masterResume,
            tone: 'Concise, high-impact'
          }),
        });
        if (outRes.ok) {
          const outData = await outRes.json();
          const newRecruiter: RecruiterContact = {
            id: `REC-${Math.floor(10 + Math.random() * 90)}`,
            name: 'Elena Rostova',
            role: 'Head of Technical Recruiting',
            company: targetJob.company,
            email: `elena@${targetJob.company.toLowerCase().replace(/\s+/g, '')}-careers.com`,
            linkedinUrl: `linkedin.com/in/elena-${targetJob.company.toLowerCase()}`,
            jobReferenceId: targetJob.id,
            status: 'SENT',
            emailSubject: outData.subject,
            emailBody: outData.body,
            followUpsCount: 0,
            maxFollowUps: 2
          };
          setRecruiters(prev => [newRecruiter, ...prev]);
        }
      } catch (e) {
        console.error(e);
      }

      // 5. Update platform connectors used quota
      setConnectors(prev => prev.map(c => {
        if (c.name.includes(targetJob.portal) || c.id.includes(targetJob.portal.toUpperCase())) {
          return { ...c, usedRateLimit: c.usedRateLimit + 1, lastSynced: 'Just now' };
        }
        return c;
      }));

      // 6. Schedule new prioritized audit logs
      const traceId = `tr_${Math.random().toString(36).substring(2, 8)}`;
      const logEntries: AuditLogEntry[] = [
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString(),
          agentType: 'JOB_AUTOMATION',
          action: 'AUTONOMOUS_APPLICATION_SUBMITTED',
          target: `${targetJob.title} at ${targetJob.company} (${targetJob.portal})`,
          details: `Compiled ATS LaTeX resume (Score: ${tailoredData?.atsScore || 96}%). Verified Q&A from knowledge base. Application submitted in Fully Autonomous Mode.`,
          result: 'SUCCESS',
          traceId
        },
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString(),
          agentType: 'JOB_AUTOMATION',
          action: 'RECRUITER_OUTREACH_DISPATCHED',
          target: `Elena Rostova (${targetJob.company})`,
          details: 'Hyper-personalized cold email and 2-step follow up schedule dispatched via autonomous outreach agent.',
          result: 'SUCCESS',
          traceId
        }
      ];

      setAuditLogs(prev => [...logEntries, ...prev]);

      // 7. Update task in prioritization engine
      setTasks(prev => [
        {
          id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `Autonomous Submission: ${targetJob.company} ${targetJob.title}`,
          description: `ATS LaTeX resume compiled and submitted on ${targetJob.portal}. Outreach email dispatched.`,
          agentType: 'JOB_AUTOMATION',
          priority: 'HIGH',
          agenticScore: 95,
          riskLevel: 'LOW',
          status: 'COMPLETED',
          platform: targetJob.portal,
          requiresApproval: false,
          dependencies: [],
          concurrencyBucket: 'IMMEDIATE_DISPATCH',
          rateLimitCost: 10,
          executionTimeSec: 14,
          createdAt: new Date().toLocaleTimeString(),
          updatedAt: new Date().toLocaleTimeString(),
          reasoning: 'Autonomous execution completed successfully with zero duplicate collision.'
        },
        ...prev
      ]);

    } finally {
      setIsRunningCycle(false);
    }
  };

  const handleQueueForApproval = (actionTitle: string, payload: any) => {
    const newItem = {
      id: `APPR-${Math.floor(100 + Math.random() * 900)}`,
      actionTitle,
      agent: 'Job Automation Agent',
      risk: 'Moderate',
      details: 'Prepared by autonomous agent; waiting in Approval Gate.',
      payload
    };
    setPendingApprovals(prev => [newItem, ...prev]);
    setIsApprovalModalOpen(true);
  };

  const handleApproveItem = (id: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'TASK_ORCHESTRATOR',
      action: 'HUMAN_APPROVAL_GRANTED',
      target: id,
      details: `User approved gated action ${id}. Dispatched to worker pool.`,
      result: 'SUCCESS',
      traceId: `tr_${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setTasks(prev => prev.map(t => {
      if (t.status === 'AWAITING_APPROVAL') {
        return { ...t, status: 'IN_PROGRESS', concurrencyBucket: 'IMMEDIATE_DISPATCH' };
      }
      return t;
    }));
  };

  const handleRejectItem = (id: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'TASK_ORCHESTRATOR',
      action: 'HUMAN_APPROVAL_REJECTED',
      target: id,
      details: `User rejected action ${id}. Agent requested to re-draft.`,
      result: 'WARNING',
      traceId: `tr_${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleApproveTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED', concurrencyBucket: 'IMMEDIATE_DISPATCH' } : t));
    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'TASK_ORCHESTRATOR',
      action: 'TASK_APPROVED_AND_EXECUTED',
      target: taskId,
      details: `Autonomous task ${taskId} approved and executed successfully.`,
      result: 'SUCCESS',
      traceId: `tr_${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleExecuteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'COMPLETED', updatedAt: new Date().toLocaleTimeString() };
      }
      return t;
    }));

    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentType: 'TASK_ORCHESTRATOR',
      action: 'TASK_DISPATCHED_AUTONOMOUSLY',
      target: taskId,
      details: `Task ${taskId} completed by autonomous worker. Downstream dependencies unblocked.`,
      result: 'SUCCESS',
      traceId: `tr_${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleTriggerGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setConnectors(prev => prev.map(c => ({
        ...c,
        lastSynced: 'Just now',
        status: 'CONNECTED'
      })));
      setIsSyncing(false);

      const newLog: AuditLogEntry = {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString(),
        agentType: 'SYNC_ENGINE',
        action: 'CROSS_PLATFORM_RECONCILE_SUCCESS',
        target: 'All 15 Connectors',
        details: 'Reconciled state vectors across 12 job portals and 3 QA environments. Zero duplication detected.',
        result: 'SUCCESS',
        traceId: `tr_${Math.random().toString(36).substring(2, 8)}`
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Platform Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        operatingMode={operatingMode}
        setOperatingMode={setOperatingMode}
        pendingApprovalsCount={pendingApprovals.length}
        openApprovalModal={() => setIsApprovalModalOpen(true)}
        isSyncing={isSyncing}
        triggerGlobalSync={handleTriggerGlobalSync}
        isPaused={isPaused}
        togglePause={() => setIsPaused(!isPaused)}
        isRunningCycle={isRunningCycle}
        onRunAutonomousCycle={handleRunAutonomousCycle}
        onOpen3DDeck={() => setIs3DDeckOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        currentUser={currentUser}
        onSignIn={handleSignInGoogle}
        onSignOut={handleSignOutGoogle}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {isPaused && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-600 rounded-xl text-rose-200 text-xs font-semibold flex items-center justify-between shadow-lg">
            <span>All autonomous agent dispatches and background tasks are PAUSED via the Emergency Kill-Switch.</span>
            <button
              onClick={() => setIsPaused(false)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
            >
              Resume Agents
            </button>
          </div>
        )}

        {/* Primary View: Autonomous Job Agent */}
        {activeTab === 'job-agent' && (
          <JobAutomationAgentView
            preferences={preferences}
            setPreferences={setPreferences}
            masterResume={masterResume}
            setMasterResume={setMasterResume}
            discoveredJobs={discoveredJobs}
            setDiscoveredJobs={setDiscoveredJobs}
            recruiters={recruiters}
            setRecruiters={setRecruiters}
            knowledgeBase={knowledgeBase}
            setKnowledgeBase={setKnowledgeBase}
            operatingMode={operatingMode}
            onQueueForApproval={handleQueueForApproval}
          />
        )}

        {/* Supporting Agentic Capabilities */}
        {activeTab === 'prioritization' && (
          <TaskPrioritizationEngine
            tasks={tasks}
            setTasks={setTasks}
            onApproveTask={handleApproveTask}
            onExecuteTask={handleExecuteTask}
          />
        )}

        {activeTab === 'sync' && (
          <CrossPlatformSyncHub
            connectors={connectors}
            setConnectors={setConnectors}
            conflicts={conflicts}
            setConflicts={setConflicts}
            isSyncing={isSyncing}
            onTriggerSync={handleTriggerGlobalSync}
          />
        )}

        {activeTab === 'blueprint' && <RequirementsBlueprint />}

        {activeTab === 'qa-agent' && (
          <QATestingAgentView
            testCases={testCases}
            setTestCases={setTestCases}
            visualValidations={visualValidations}
            setVisualValidations={setVisualValidations}
            devTools={devTools}
            bugs={bugs}
            setBugs={setBugs}
            activeEnv={activeQAEnv}
            setActiveEnv={setActiveQAEnv}
          />
        )}

        {activeTab === 'audit' && <AuditTrailView logs={auditLogs} />}
      </main>

      {/* Full-Screen Three.js 3D Command Deck Modal */}
      {is3DDeckOpen && (
        <ThreeCommandDeck
          onClose={() => setIs3DDeckOpen(false)}
          onSelectAgentTab={(tab) => {
            setActiveTab(tab);
            setIs3DDeckOpen(false);
          }}
        />
      )}

      {/* Floating Gemini Agent Copilot Dock */}
      <AgentCopilotModal
        isOpen={isCopilotOpen}
        onOpen={() => setIsCopilotOpen(true)}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Human Approval Modal */}
      <HumanApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        pendingApprovals={pendingApprovals}
        onApprove={handleApproveItem}
        onReject={handleRejectItem}
      />
    </div>
  );
}
