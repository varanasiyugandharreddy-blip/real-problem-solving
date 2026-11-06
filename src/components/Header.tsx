import React from 'react';
import { OperatingMode } from '../types/agent';
import { 
  Bot, 
  ShieldCheck, 
  SlidersHorizontal, 
  RefreshCw, 
  AlertCircle, 
  PauseCircle, 
  PlayCircle,
  Briefcase,
  Bug,
  ListOrdered,
  Share2,
  FileText,
  Activity,
  Sparkles,
  Zap,
  Compass,
  MessageSquare,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;
  pendingApprovalsCount: number;
  openApprovalModal: () => void;
  isSyncing: boolean;
  triggerGlobalSync: () => void;
  isPaused: boolean;
  togglePause: () => void;
  isRunningCycle: boolean;
  onRunAutonomousCycle: () => void;
  onOpen3DDeck: () => void;
  onOpenCopilot: () => void;
  currentUser: { email?: string | null; displayName?: string | null; photoURL?: string | null } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  operatingMode,
  setOperatingMode,
  pendingApprovalsCount,
  openApprovalModal,
  isSyncing,
  triggerGlobalSync,
  isPaused,
  togglePause,
  isRunningCycle,
  onRunAutonomousCycle,
  onOpen3DDeck,
  onOpenCopilot,
  currentUser,
  onSignIn,
  onSignOut,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100 shadow-xl">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <a 
              href="#/"
              onClick={(e) => { e.preventDefault(); setActiveTab('job-agent'); }}
              className="text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-cyan-300 transition-colors"
            >
              NexusAgent OS
            </a>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <button
              onClick={() => setActiveTab('job-agent')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'job-agent' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              Job Search & ATS
            </button>
            <button
              onClick={() => setActiveTab('prioritization')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'prioritization' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              Task Prioritization
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'sync' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              Cross-Platform Sync
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'blueprint' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              Requirements Blueprint
            </button>
            <button
              onClick={() => setActiveTab('qa-agent')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'qa-agent' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              QA & Testing
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'audit' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              Audit Log
            </button>
          </nav>

          {/* Zone 3: Primary Action Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* 3D Command Deck Button */}
            <button
              onClick={onOpen3DDeck}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-bold transition shadow-sm"
              title="Launch Full-Screen Three.js 3D Command Deck"
            >
              <Compass className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">3D Deck</span>
            </button>

            {/* Copilot Launcher Button */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              title="Open Gemini Agent Copilot"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Copilot</span>
            </button>

            {/* Primary Action Button: Run Autonomous Cycle */}
            <button
              onClick={onRunAutonomousCycle}
              disabled={isRunningCycle || isPaused}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-md ${
                isRunningCycle
                  ? 'bg-cyan-700 text-white cursor-wait'
                  : isPaused
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/20'
              } whitespace-nowrap shrink-0`}
              title="Execute full autonomous job search, ATS resume tailoring, question answering, and application cycle"
            >
              <Zap className={`w-3.5 h-3.5 ${isRunningCycle ? 'animate-bounce text-cyan-200' : 'text-cyan-300'}`} />
              <span className="hidden md:inline">{isRunningCycle ? 'Executing Cycle...' : 'Run Cycle'}</span>
            </button>

            {/* Firebase Google Auth Badge */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-5 h-5 rounded-full" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[80px] hidden sm:inline">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={onSignOut}
                  className="text-slate-400 hover:text-rose-400 p-0.5 ml-1"
                  title="Sign out of Firebase"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
                title="Sign in with Google (Firebase Auth)"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Operating Mode Selector (Compact Segmented) */}
            <div className="hidden xl:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-semibold">
              <button
                onClick={() => setOperatingMode('FULLY_AUTONOMOUS')}
                className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                  operatingMode === 'FULLY_AUTONOMOUS'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setOperatingMode('APPROVAL_MODE')}
                className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                  operatingMode === 'APPROVAL_MODE'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Approval
              </button>
            </div>

            {/* Pause / Resume */}
            <button
              onClick={togglePause}
              className={`p-1.5 rounded-lg border transition ${
                isPaused
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={isPaused ? 'Resume Autonomous Execution' : 'Emergency Pause All Agents'}
            >
              {isPaused ? <PlayCircle className="w-4 h-4 text-rose-400" /> : <PauseCircle className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Mobile / Responsive secondary tab bar */}
        <div className="lg:hidden flex space-x-2 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-2 text-xs">
          {[
            { id: 'job-agent', label: 'Job Search & ATS' },
            { id: 'prioritization', label: 'Prioritizer' },
            { id: 'sync', label: 'Sync Hub' },
            { id: 'blueprint', label: 'Blueprint' },
            { id: 'qa-agent', label: 'QA Suite' },
            { id: 'audit', label: 'Audit Log' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap text-xs font-semibold ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
