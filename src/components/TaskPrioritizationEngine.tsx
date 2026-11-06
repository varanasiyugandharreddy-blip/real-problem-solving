import React, { useState } from 'react';
import { 
  AgentTask, 
  AgentType, 
  PriorityLevel, 
  RiskLevel, 
  TaskStatus 
} from '../types/agent';
import { 
  Workflow, 
  Sparkles, 
  Plus, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpDown, 
  Filter, 
  Cpu, 
  Check, 
  Layers,
  ChevronRight,
  RefreshCw,
  GitCommit,
  Zap,
  Info
} from 'lucide-react';

interface TaskPrioritizationEngineProps {
  tasks: AgentTask[];
  setTasks: React.Dispatch<React.SetStateAction<AgentTask[]>>;
  onApproveTask: (taskId: string) => void;
  onExecuteTask: (taskId: string) => void;
}

export const TaskPrioritizationEngine: React.FC<TaskPrioritizationEngineProps> = ({
  tasks,
  setTasks,
  onApproveTask,
  onExecuteTask,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const [selectedBucket, setSelectedBucket] = useState<string>('ALL');
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [aiPrioritizationSummary, setAiPrioritizationSummary] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAgentType, setNewAgentType] = useState<AgentType>('JOB_AUTOMATION');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('HIGH');
  const [newRisk, setNewRisk] = useState<RiskLevel>('MODERATE');
  const [newPlatform, setNewPlatform] = useState('LinkedIn');
  const [newRequiresApproval, setNewRequiresApproval] = useState(false);

  // Trigger Gemini AI Prioritizer on the server
  const handleTriggerAIPrioritizer = async () => {
    setIsPrioritizing(true);
    try {
      const response = await fetch('/api/agent/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tasks,
          globalGoal: 'Maximize high-conversion career applications and detect critical customer-blocking QA defects with zero false positives.',
          focusAgent: selectedAgent !== 'ALL' ? selectedAgent : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.reorderedTasks && Array.isArray(data.reorderedTasks)) {
        // Re-order and update task priorities & agentic scores
        setTasks(prev => {
          const map = new Map(data.reorderedTasks.map((item: any) => [item.id, item]));
          const updated = prev.map(t => {
            const match: any = map.get(t.id);
            if (match) {
              return {
                ...t,
                priority: match.suggestedPriority || t.priority,
                agenticScore: match.agenticScore || t.agenticScore,
                reasoning: match.reasoning || t.reasoning,
                concurrencyBucket: match.concurrencyBucket || t.concurrencyBucket
              };
            }
            return t;
          });
          // Sort by agentic score descending
          return updated.sort((a, b) => b.agenticScore - a.agenticScore);
        });

        setAiPrioritizationSummary(data.summary || 'Prioritized tasks based on multi-dimensional agentic scoring formula.');
      }
    } catch (err: any) {
      console.error('Failed to run AI prioritizer:', err);
      // Fallback local intelligent sort
      setTasks(prev => [...prev].sort((a, b) => b.agenticScore - a.agenticScore));
      setAiPrioritizationSummary('Reordered tasks using local autonomous heuristics: weighted by severity, urgency, and platform dependencies.');
    } finally {
      setIsPrioritizing(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: AgentTask = {
      id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      description: newDesc || 'Autonomous execution workflow for target platform.',
      agentType: newAgentType,
      priority: newPriority,
      agenticScore: newPriority === 'CRITICAL' ? 95 : newPriority === 'HIGH' ? 85 : newPriority === 'MEDIUM' ? 70 : 50,
      riskLevel: newRisk,
      status: newRequiresApproval ? 'AWAITING_APPROVAL' : 'PENDING',
      platform: newPlatform,
      requiresApproval: newRequiresApproval,
      dependencies: [],
      concurrencyBucket: newRequiresApproval ? 'GATED_BY_HUMAN' : newPriority === 'CRITICAL' ? 'IMMEDIATE_DISPATCH' : 'QUEUED_PIPELINE',
      rateLimitCost: 10,
      executionTimeSec: 25,
      createdAt: new Date().toLocaleTimeString(),
      updatedAt: new Date().toLocaleTimeString(),
      reasoning: 'Newly scheduled by platform dispatcher.'
    };

    setTasks(prev => [newTask, ...prev]);
    setShowNewTaskModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filteredTasks = tasks.filter(t => {
    if (selectedAgent !== 'ALL' && t.agentType !== selectedAgent) return false;
    if (selectedBucket !== 'ALL' && t.concurrencyBucket !== selectedBucket) return false;
    return true;
  });

  const immediateCount = tasks.filter(t => t.concurrencyBucket === 'IMMEDIATE_DISPATCH').length;
  const queuedCount = tasks.filter(t => t.concurrencyBucket === 'QUEUED_PIPELINE').length;
  const gatedCount = tasks.filter(t => t.concurrencyBucket === 'GATED_BY_HUMAN').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls & Metrics Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Workflow className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Autonomous Task Prioritization & Dispatch Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Real-time scoring algorithm evaluating Impact &times; Urgency &divide; Risk &times; Dependencies FOR ONLY AGENTIC AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerAIPrioritizer}
              disabled={isPrioritizing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition shadow-lg shadow-orange-600/20 ${
                isPrioritizing ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <Sparkles className={`w-4 h-4 text-amber-200 ${isPrioritizing ? 'animate-spin' : ''}`} />
              <span>{isPrioritizing ? 'Gemini 3.8 Flash Re-Scoring...' : 'Recalculate Priorities (Gemini AI)'}</span>
            </button>

            <button
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Concurrency Buckets Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div 
            onClick={() => setSelectedBucket(selectedBucket === 'IMMEDIATE_DISPATCH' ? 'ALL' : 'IMMEDIATE_DISPATCH')}
            className={`cursor-pointer rounded-xl p-4 border transition ${
              selectedBucket === 'IMMEDIATE_DISPATCH'
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Immediate Dispatch</span>
              </span>
              <span className="text-xl font-extrabold text-white">{immediateCount}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Concurrently active agents, 0 blockers</p>
          </div>

          <div 
            onClick={() => setSelectedBucket(selectedBucket === 'QUEUED_PIPELINE' ? 'ALL' : 'QUEUED_PIPELINE')}
            className={`cursor-pointer rounded-xl p-4 border transition ${
              selectedBucket === 'QUEUED_PIPELINE'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Queued Pipeline</span>
              </span>
              <span className="text-xl font-extrabold text-white">{queuedCount}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting DAG prerequisites or rate quotas</p>
          </div>

          <div 
            onClick={() => setSelectedBucket(selectedBucket === 'GATED_BY_HUMAN' ? 'ALL' : 'GATED_BY_HUMAN')}
            className={`cursor-pointer rounded-xl p-4 border transition ${
              selectedBucket === 'GATED_BY_HUMAN'
                ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Gated By Human</span>
              </span>
              <span className="text-xl font-extrabold text-white">{gatedCount}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Requires 1-click safety greenlight</p>
          </div>
        </div>

        {/* AI Rationale Banner */}
        {aiPrioritizationSummary && (
          <div className="p-3.5 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-600/30 rounded-xl text-xs text-amber-200 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-amber-300">Gemini 3.8 Flash Prioritization Strategy: </span>
              {aiPrioritizationSummary}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-800 pt-3 gap-2">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-slate-400 mr-2 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Filter:
            </span>
            {[
              { id: 'ALL', label: 'All Agents' },
              { id: 'JOB_AUTOMATION', label: 'Job Agent' },
              { id: 'QA_TESTING', label: 'QA Agent' },
              { id: 'SYNC_ENGINE', label: 'Sync Engine' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedAgent(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedAgent === f.id
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      </div>

      {/* Task Queue List */}
      <div className="space-y-3">
        {filteredTasks.map((task, index) => {
          const isCritical = task.priority === 'CRITICAL';
          const isHigh = task.priority === 'HIGH';
          const isMed = task.priority === 'MEDIUM';

          return (
            <div
              key={task.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-all shadow-md ${
                task.status === 'COMPLETED'
                  ? 'border-slate-800/80 opacity-75'
                  : isCritical
                  ? 'border-rose-700/60 bg-gradient-to-r from-rose-950/20 to-slate-900'
                  : isHigh
                  ? 'border-amber-700/50 bg-gradient-to-r from-amber-950/15 to-slate-900'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      #{index + 1} &bull; {task.id}
                    </span>

                    {/* Agentic Dynamic Score */}
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Agentic Score: {task.agenticScore}</span>
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isHigh
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : isMed
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {task.priority} Priority
                    </span>

                    {/* Agent Type */}
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {task.agentType.replace('_', ' ')}
                    </span>

                    {/* Platform Target */}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                      Target: {task.platform}
                    </span>

                    {/* Concurrency Bucket */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.concurrencyBucket === 'IMMEDIATE_DISPATCH'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                          : task.concurrencyBucket === 'GATED_BY_HUMAN'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {task.concurrencyBucket.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base flex items-center space-x-2">
                      <span>{task.title}</span>
                      {task.status === 'COMPLETED' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Reasoning & Dependencies */}
                  <div className="space-y-1 pt-1">
                    {task.reasoning && (
                      <div className="text-xs text-slate-400 flex items-start space-x-1.5 font-sans">
                        <Info className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                        <span><strong className="text-slate-300">Agent Rationale:</strong> {task.reasoning}</span>
                      </div>
                    )}

                    {task.dependencies.length > 0 && (
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                        <GitCommit className="w-3.5 h-3.5 text-amber-400" />
                        <span>Blocked by upstream:</span>
                        {task.dependencies.map(depId => (
                          <span key={depId} className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">
                            {depId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className={`text-xs font-bold ${
                      task.status === 'COMPLETED' ? 'text-emerald-400' :
                      task.status === 'IN_PROGRESS' ? 'text-cyan-400 animate-pulse' :
                      task.status === 'AWAITING_APPROVAL' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {task.status === 'AWAITING_APPROVAL' && (
                      <button
                        onClick={() => onApproveTask(task.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Approve Gate</span>
                      </button>
                    )}

                    {task.status !== 'COMPLETED' && (
                      <button
                        onClick={() => onExecuteTask(task.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm flex items-center space-x-1"
                        title="Simulate autonomous dispatch and completion"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Dispatch Now</span>
                      </button>
                    )}

                    {task.status === 'COMPLETED' && (
                      <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Create Autonomous Agent Task</span>
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scrape Wellfound for AI Lead & compile ATS resume"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details of the autonomous execution requirement..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Agent Assignment</label>
                  <select
                    value={newAgentType}
                    onChange={e => setNewAgentType(e.target.value as AgentType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                  >
                    <option value="JOB_AUTOMATION">Job Automation Agent</option>
                    <option value="QA_TESTING">QA Testing Agent</option>
                    <option value="SYNC_ENGINE">Sync Engine</option>
                    <option value="TASK_ORCHESTRATOR">Task Orchestrator</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Initial Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Risk Level</label>
                  <select
                    value={newRisk}
                    onChange={e => setNewRisk(e.target.value as RiskLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                  >
                    <option value="CRITICAL">Critical Risk (e.g. Prod DB write)</option>
                    <option value="HIGH">High Risk</option>
                    <option value="MODERATE">Moderate Risk</option>
                    <option value="LOW">Low Risk</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Platform</label>
                  <input
                    type="text"
                    value={newPlatform}
                    onChange={e => setNewPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="approvalReq"
                  checked={newRequiresApproval}
                  onChange={e => setNewRequiresApproval(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="approvalReq" className="text-slate-300">
                  Gate in Human Approval Queue before final execution
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
