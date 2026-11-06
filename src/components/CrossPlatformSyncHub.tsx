import React, { useState } from 'react';
import { SyncConnector, SyncConflict } from '../types/agent';
import { 
  Network, 
  Share2, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  HardDrive, 
  Database, 
  Layers, 
  Globe, 
  Cpu,
  ArrowRight,
  Sparkles,
  Lock,
  Radio
} from 'lucide-react';

interface CrossPlatformSyncHubProps {
  connectors: SyncConnector[];
  setConnectors: React.Dispatch<React.SetStateAction<SyncConnector[]>>;
  conflicts: SyncConflict[];
  setConflicts: React.Dispatch<React.SetStateAction<SyncConflict[]>>;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

export const CrossPlatformSyncHub: React.FC<CrossPlatformSyncHubProps> = ({
  connectors,
  setConnectors,
  conflicts,
  setConflicts,
  isSyncing,
  onTriggerSync,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [liveSyncLog, setLiveSyncLog] = useState<string[]>([
    '[21:42:01] VectorClock initialized: node_asia_east1_edge_4',
    '[21:42:04] Linked canonical hash for Anthropic role across LinkedIn & Indeed',
    '[21:42:15] Heartbeat verified: PostgreSQL Primary (3ms latency)',
    '[21:42:20] Rate-limit check passed: LinkedIn 14/50 used',
    '[21:42:32] Playwright test traces uploaded to Staging storage bucket'
  ]);

  const toggleOffline = () => {
    if (!isOfflineSimulated) {
      setIsOfflineSimulated(true);
      setBufferedCount(4);
      setLiveSyncLog(prev => [
        `[${new Date().toLocaleTimeString()}] ⚠️ Disconnected from central sync bus. Edge buffering active.`,
        ...prev
      ]);
    } else {
      // Reconnect and flush
      setIsOfflineSimulated(false);
      setBufferedCount(0);
      onTriggerSync();
      setLiveSyncLog(prev => [
        `[${new Date().toLocaleTimeString()}] 🟢 Reconnected to sync bus! Reconciled 4 buffered mutations using 3-way vector merge.`,
        ...prev
      ]);
    }
  };

  const handleResolveConflict = (conflictId: string, resolutionType: string) => {
    setConflicts(prev => prev.map(c => {
      if (c.id === conflictId) {
        return {
          ...c,
          status: 'RESOLVED_AUTO',
          resolutionAction: resolutionType === 'SEMANTIC_MERGE'
            ? 'Merged candidate attributes using semantic deduplication algorithm.'
            : 'Applied Last-Write-Wins using higher cryptographic clock.'
        };
      }
      return c;
    }));
  };

  const filteredConnectors = connectors.filter(c => {
    if (filterType === 'ALL') return true;
    return c.type === filterType;
  });

  const totalDuplicatesPrevented = connectors.reduce((acc, curr) => acc + curr.duplicateDetections, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Network className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Cross-Platform & Multi-Environment Sync Hub
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Synchronizing state, candidate profiles, test results, and deduplicating actions across 12+ job platforms and 7+ technical environments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Offline Simulator Switch */}
            <button
              onClick={toggleOffline}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                isOfflineSimulated
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Simulate edge agent operating offline with local mutation buffer"
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-4 h-4 text-rose-400" />
                  <span>Simulating Offline ({bufferedCount} buffered)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span>Network Online</span>
                </>
              )}
            </button>

            {/* Sync Now */}
            <button
              onClick={onTriggerSync}
              disabled={isSyncing || isOfflineSimulated}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-700/20 ${
                isSyncing || isOfflineSimulated ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 text-emerald-200 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Reconciling State...' : 'Reconcile All Platforms'}</span>
            </button>
          </div>
        </div>

        {/* Sync Metric Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Connected Targets</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{connectors.length}</span>
            <span className="text-[10px] text-emerald-400">12 Portals &bull; 3 QA Targets</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Duplicates Prevented</span>
            <span className="text-xl font-extrabold text-cyan-400 mt-1 block">{totalDuplicatesPrevented}</span>
            <span className="text-[10px] text-slate-400">Cross-portal canonical hashes</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Conflicts Auto-Resolved</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
              {conflicts.filter(c => c.status === 'RESOLVED_AUTO').length} / {conflicts.length}
            </span>
            <span className="text-[10px] text-emerald-400">Vector Clock &bull; Last-Write-Wins</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Edge Buffer Status</span>
            <span className={`text-xl font-extrabold mt-1 block ${bufferedCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
              {bufferedCount > 0 ? `${bufferedCount} Pending` : 'Flushed & Synced'}
            </span>
            <span className="text-[10px] text-slate-400">Zero data-loss guarantee</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex border-t border-slate-800 pt-3 space-x-2">
          {[
            { id: 'ALL', label: 'All Targets (15)' },
            { id: 'JOB_PORTAL', label: 'Job Portals (12)' },
            { id: 'QA_ENVIRONMENT', label: 'QA Environments' },
            { id: 'DATA_STORE', label: 'Data Stores' },
            { id: 'DEV_TOOL', label: 'Dev Tools' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === f.id
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Sync Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConnectors.map(connector => {
          const quotaPercent = Math.round((connector.usedRateLimit / connector.dailyRateLimit) * 100);

          return (
            <div
              key={connector.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    isOfflineSimulated
                      ? 'bg-amber-400 animate-pulse'
                      : connector.status === 'CONNECTED'
                      ? 'bg-emerald-400'
                      : 'bg-rose-400'
                  }`} />
                  <h3 className="font-bold text-white text-sm">{connector.name}</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {connector.type.replace('_', ' ')}
                </span>
              </div>

              {/* Rate Limit Headroom Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Daily Quota & Rate Limit:</span>
                  <span className="font-mono text-slate-200">{connector.usedRateLimit} / {connector.dailyRateLimit} ({quotaPercent}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      quotaPercent > 80 ? 'bg-rose-500' : quotaPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, quotaPercent)}%` }}
                  />
                </div>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Last Synced: <strong className="text-slate-300">{connector.lastSynced}</strong></span>
                {connector.duplicateDetections > 0 && (
                  <span className="text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded text-[10px] border border-cyan-800/40">
                    {connector.duplicateDetections} dedups
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync Conflicts & Deduplication Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Conflicts Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Cross-Platform Conflict Resolution Engine</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Vector Clocks &bull; Last-Write-Wins
            </span>
          </div>

          <div className="space-y-3">
            {conflicts.map(conflict => (
              <div 
                key={conflict.id}
                className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 font-mono text-[11px]">{conflict.id} &bull; {conflict.entityType}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    conflict.status === 'RESOLVED_AUTO'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {conflict.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {conflict.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                  <div>Source A: <strong className="text-slate-200">{conflict.sourceA}</strong></div>
                  <div>Source B: <strong className="text-slate-200">{conflict.sourceB}</strong></div>
                </div>

                {conflict.resolutionAction && (
                  <div className="bg-slate-900 p-2 rounded text-[11px] text-emerald-300 border border-slate-800">
                    <strong className="text-white">Resolution:</strong> {conflict.resolutionAction}
                  </div>
                )}

                {conflict.status !== 'RESOLVED_AUTO' && (
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => handleResolveConflict(conflict.id, 'SEMANTIC_MERGE')}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px]"
                    >
                      Semantic Deduplicate & Merge
                    </button>
                    <button
                      onClick={() => handleResolveConflict(conflict.id, 'LAST_WRITE_WINS')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
                    >
                      Apply Last-Write-Wins
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Sync Event Telemetry Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="font-bold text-white text-sm">Real-Time Sync Telemetry Bus (WebSocket / SSE)</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Live Stream
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-2 h-64 overflow-y-auto border border-slate-800">
            {liveSyncLog.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                <span className="text-slate-500 select-none">&gt;</span>
                <span className={log.includes('⚠️') ? 'text-amber-300' : log.includes('🟢') ? 'text-emerald-300' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            Agents broadcast JSON mutations over a distributed pub/sub bus. Offline agents buffer mutations and reconcile upon reconnection.
          </p>
        </div>
      </div>
    </div>
  );
};
