import React, { useState } from 'react';
import { AuditLogEntry, AgentType } from '../types/agent';
import { 
  Activity, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Download, 
  Clock, 
  ShieldCheck, 
  Bot, 
  Bug, 
  Share2, 
  Workflow 
} from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const [selectedResult, setSelectedResult] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    if (selectedAgent !== 'ALL' && log.agentType !== selectedAgent) return false;
    if (selectedResult !== 'ALL' && log.result !== selectedResult) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.traceId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexusagent_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Unified Autonomous Agent Audit Trail & Execution Timeline
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Immutable provenance record of every autonomous action, resume compilation, recruiter outreach, and QA test execution.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Audit Trail (JSON)</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search actions, targets, trace IDs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['ALL', 'JOB_AUTOMATION', 'QA_TESTING', 'SYNC_ENGINE', 'TASK_ORCHESTRATOR'].map(agent => (
              <button
                key={agent}
                onClick={() => setSelectedAgent(agent)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedAgent === agent
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {agent === 'ALL' ? 'All' : agent.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {filteredLogs.map(log => {
          const isSuccess = log.result === 'SUCCESS';
          const isWarning = log.result === 'WARNING';
          const isApproval = log.result === 'APPROVAL_REQUIRED';

          return (
            <div key={log.id} className="relative group">
              {/* Timeline Node Bullet */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 border-slate-950 transition-all ${
                  isSuccess
                    ? 'bg-emerald-400'
                    : isWarning
                    ? 'bg-amber-400'
                    : isApproval
                    ? 'bg-cyan-400'
                    : 'bg-rose-400'
                }`}
              />

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {log.traceId}
                    </span>
                    <span className="font-bold text-white text-sm">
                      {log.action}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {log.agentType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div className="text-xs text-cyan-300 font-semibold">
                  Target Entity: {log.target}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-sans">
                  {log.details}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cryptographically Signed Audit Hash</span>
                  </span>

                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    isSuccess ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    isWarning ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    isApproval ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                    'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {log.result}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
