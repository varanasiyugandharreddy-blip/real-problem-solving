import React, { useState } from 'react';
import { 
  QATestCase, 
  VisualValidationItem, 
  DevToolsTelemetry, 
  DetectedBug, 
  QAEnvironment 
} from '../types/agent';
import { 
  Bug, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Layers, 
  Cpu, 
  Globe, 
  Database, 
  Eye, 
  Activity, 
  Code2, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Sliders,
  Smartphone,
  ExternalLink,
  Search
} from 'lucide-react';

interface QATestingAgentViewProps {
  testCases: QATestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<QATestCase[]>>;
  visualValidations: VisualValidationItem[];
  setVisualValidations: React.Dispatch<React.SetStateAction<VisualValidationItem[]>>;
  devTools: DevToolsTelemetry;
  bugs: DetectedBug[];
  setBugs: React.Dispatch<React.SetStateAction<DetectedBug[]>>;
  activeEnv: QAEnvironment;
  setActiveEnv: (env: QAEnvironment) => void;
}

export const QATestingAgentView: React.FC<QATestingAgentViewProps> = ({
  testCases,
  setTestCases,
  visualValidations,
  setVisualValidations,
  devTools,
  bugs,
  setBugs,
  activeEnv,
  setActiveEnv,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tests' | 'visual' | 'devtools' | 'bugs' | 'explorer'>('tests');
  const [targetUrl, setTargetUrl] = useState('http://staging.app.internal');
  const [isExploring, setIsExploring] = useState(false);
  const [explorationComplete, setExplorationComplete] = useState(true);

  // Playwright generation state
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<QATestCase>(testCases[1] || testCases[0]);

  // Root cause analysis state
  const [isAnalyzingRCA, setIsAnalyzingRCA] = useState(false);
  const [selectedBug, setSelectedBug] = useState<DetectedBug>(bugs[0]);

  // Trigger Autonomous Exploration & Crawling
  const handleStartExploration = () => {
    setIsExploring(true);
    setTimeout(() => {
      setIsExploring(false);
      setExplorationComplete(true);
    }, 1800);
  };

  // Generate Playwright tests with Gemini
  const handleGenerateTestsWithGemini = async () => {
    setIsGeneratingTests(true);
    try {
      const response = await fetch('/api/agent/qa-generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          environment: activeEnv,
          applicationType: 'SaaS Multi-Tenant Cloud Platform',
          userWorkflows: ['Authentication', 'Order Checkout', 'Figma Responsive Layout', 'API DB Consistency']
        }),
      });

      if (!response.ok) throw new Error('Test generation failed');
      const data = await response.json();

      if (data.testSuite && Array.isArray(data.testSuite)) {
        const mapped: QATestCase[] = data.testSuite.map((item: any, idx: number) => ({
          id: item.id || `TC-GEN-${idx + 100}`,
          title: item.title,
          category: item.category?.toUpperCase() || 'FUNCTIONAL',
          environment: activeEnv,
          status: 'PASSED',
          durationMs: 450 + Math.floor(Math.random() * 800),
          lastExecuted: 'Just now',
          playwrightCode: item.playwrightCode || '// Generated Playwright Test'
        }));

        setTestCases(prev => [...mapped, ...prev]);
        setSelectedTestCase(mapped[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingTests(false);
    }
  };

  // Simulate Running All Tests
  const handleRunAllTests = () => {
    setIsRunningTests(true);
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'RUNNING' })));

    setTimeout(() => {
      setTestCases(prev => prev.map((tc, idx) => {
        // Keep TC-E2E-102 failing to demonstrate root cause correlation
        const isFailing = tc.id === 'TC-E2E-102';
        return {
          ...tc,
          status: isFailing ? 'FAILED' : 'PASSED',
          durationMs: isFailing ? 2450 : 380 + Math.floor(Math.random() * 300),
          lastExecuted: 'Just now'
        };
      }));
      setIsRunningTests(false);
    }, 2000);
  };

  // Trigger Gemini AI Root Cause Analysis
  const handleRunRCA = async (bug: DetectedBug) => {
    setSelectedBug(bug);
    setIsAnalyzingRCA(true);

    try {
      const response = await fetch('/api/agent/qa-root-cause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugTitle: bug.title,
          stepsToReproduce: bug.stepsToReproduce,
          consoleLogs: devTools.consoleLogs,
          networkFailures: devTools.networkRequests.filter(r => r.isFailed),
          uiState: { modalOpen: true, buttonState: 'loading_frozen' },
          databaseState: { table: 'orders', constraintViolation: 'customer_org_id NOT NULL' }
        }),
      });

      if (!response.ok) throw new Error('RCA failed');
      const data = await response.json();

      setBugs(prev => prev.map(b => {
        if (b.id === bug.id) {
          return {
            ...b,
            rootCauseLayer: data.rootCauseLayer || b.rootCauseLayer,
            rootCauseExplanation: data.rootCauseExplanation || b.rootCauseExplanation,
            codeFixSnippet: data.codeSnippet || b.codeFixSnippet
          };
        }
        return b;
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingRCA(false);
    }
  };

  const passedCount = testCases.filter(t => t.status === 'PASSED').length;
  const failedCount = testCases.filter(t => t.status === 'FAILED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Environment Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Bug className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Autonomous Senior QA & Testing Agent
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous app exploration &bull; Playwright test suite execution &bull; Figma visual validation &bull; DevTools anomaly correlation &bull; Root Cause Analysis (RCA).
            </p>
          </div>

          {/* Environment Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold px-2">Env:</span>
            {(['localhost', 'development', 'QA', 'staging', 'UAT', 'production', 'mobile'] as QAEnvironment[]).map(env => (
              <button
                key={env}
                onClick={() => setActiveEnv(env)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  activeEnv === env
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Test Cases</span>
            <span className="text-lg font-extrabold text-white mt-0.5 block">{testCases.length}</span>
            <span className="text-[10px] text-cyan-400">Playwright Specs</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Passed</span>
            <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">{passedCount}</span>
            <span className="text-[10px] text-emerald-400">Zero Regressions</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Failed / Blocked</span>
            <span className="text-lg font-extrabold text-rose-400 mt-0.5 block">{failedCount}</span>
            <span className="text-[10px] text-rose-400">1 Root Cause Correlated</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Figma Visual Diff</span>
            <span className="text-lg font-extrabold text-amber-400 mt-0.5 block">1 Defect</span>
            <span className="text-[10px] text-slate-400">Mobile Button Overflow</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Open RCA Bugs</span>
            <span className="text-lg font-extrabold text-violet-400 mt-0.5 block">{bugs.length}</span>
            <span className="text-[10px] text-violet-400">P0 Checkout Defect</span>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex border-t border-slate-800 pt-3 space-x-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'tests', label: 'Playwright Test Suite', icon: Play },
            { id: 'devtools', label: 'Browser DevTools & Runtime Tracing', icon: Terminal },
            { id: 'visual', label: 'UI & Figma Validation Studio', icon: Eye },
            { id: 'bugs', label: 'Intelligent Bug Tracker & RCA', icon: Bug },
            { id: 'explorer', label: 'Autonomous App Explorer', icon: Globe },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-800 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: Playwright Test Suite */}
      {activeSubTab === 'tests' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base">
                  Automated Playwright Test Suite Runner
                </h3>
                <p className="text-xs text-slate-400">
                  Target: <strong className="text-rose-300">{targetUrl} ({activeEnv})</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGenerateTestsWithGemini}
                  disabled={isGeneratingTests}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-cyan-300 ${isGeneratingTests ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingTests ? 'Synthesizing Tests...' : 'Generate with Gemini'}</span>
                </button>

                <button
                  onClick={handleRunAllTests}
                  disabled={isRunningTests}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-700/20"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                  <span>{isRunningTests ? 'Running Playwright Scenarios...' : 'Run All Tests'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Test List */}
              <div className="space-y-2">
                {testCases.map(tc => (
                  <div
                    key={tc.id}
                    onClick={() => setSelectedTestCase(tc)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedTestCase.id === tc.id
                        ? 'bg-slate-800 border-rose-500'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400">{tc.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tc.status === 'PASSED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        tc.status === 'RUNNING' ? 'bg-cyan-950 text-cyan-300 animate-pulse' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {tc.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs mt-1">{tc.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 text-[10px]">
                        {tc.category}
                      </span>
                      <span>{tc.durationMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code Viewer & Trace Snippet */}
              <div className="lg:col-span-2 bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-mono text-cyan-300 font-bold">{selectedTestCase.title}</span>
                  <span className="text-[11px] text-slate-400">Playwright TypeScript Runner</span>
                </div>

                {selectedTestCase.failureDetails && (
                  <div className="bg-rose-950/30 border border-rose-800/80 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Failure Diagnostic & Trace Log</span>
                    </div>
                    <p className="text-rose-200 font-mono text-[11px]">
                      {selectedTestCase.failureDetails.errorMessage}
                    </p>
                    <div className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-rose-900/40 font-mono">
                      {selectedTestCase.failureDetails.traceSnippet}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono block">Executable Spec Source:</span>
                  <pre className="font-mono text-[11px] text-slate-300 h-64 overflow-y-auto p-3 bg-slate-900/70 rounded-lg border border-slate-800 select-all leading-relaxed">
                    {selectedTestCase.playwrightCode}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Browser DevTools & Runtime Telemetry */}
      {activeSubTab === 'devtools' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>Browser DevTools & Runtime Anomaly Investigation</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time telemetry correlating visible UI crashes with failed network status codes and database transaction crashes.
                </p>
              </div>
            </div>

            {/* Cross Layer Causality Strip */}
            <div className="bg-gradient-to-r from-rose-950/40 via-slate-950 to-indigo-950/40 border border-rose-800/60 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                Full-Stack Anomaly Correlation Chain Identified:
              </span>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">1. Visible UI Issue</span>
                  <span className="font-bold text-white">Checkout Modal Button Freeze</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block shrink-0" />
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">2. DevTools Network</span>
                  <span className="font-bold text-rose-400">POST /api/v1/orders (500)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block shrink-0" />
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">3. DB Constraint</span>
                  <span className="font-bold text-amber-400">customer_org_id NOT NULL</span>
                </div>
              </div>
            </div>

            {/* Console & Network Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
              {/* Console Logs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block text-xs font-sans">Console Output</span>
                <div className="space-y-1.5 h-48 overflow-y-auto">
                  {devTools.consoleLogs.map((log, idx) => (
                    <div key={idx} className={`p-2 rounded text-[11px] ${
                      log.type === 'error' ? 'bg-rose-950/50 text-rose-300 border border-rose-900' :
                      log.type === 'warn' ? 'bg-amber-950/40 text-amber-300' : 'bg-slate-900 text-slate-300'
                    }`}>
                      <span className="text-slate-500 text-[10px] mr-2">[{log.timestamp}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network Requests */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block text-xs font-sans">Network Traffic Waterfall</span>
                <div className="space-y-1.5 h-48 overflow-y-auto">
                  {devTools.networkRequests.map((req, idx) => (
                    <div key={idx} className={`p-2 rounded text-[11px] flex items-center justify-between ${
                      req.isFailed ? 'bg-rose-950/50 text-rose-300 border border-rose-900' : 'bg-slate-900 text-slate-300'
                    }`}>
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-bold">{req.method}</span>
                        <span className="truncate">{req.url}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={req.statusCode >= 400 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {req.statusCode}
                        </span>
                        <span className="text-slate-500">{req.durationMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Visual & Figma Validation */}
      {activeSubTab === 'visual' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-base">UI & Figma Design Spec Validation Studio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visualValidations.map(vis => (
                <div key={vis.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{vis.componentName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vis.status === 'PASSED' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {vis.diffScore}% Diff ({vis.status})
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                    <span className="text-slate-400 font-semibold block">Identified Discrepancies:</span>
                    <ul className="text-slate-300 space-y-1 list-disc list-inside">
                      {vis.issues.map((iss, idx) => (
                        <li key={idx}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Intelligent Bug Tracker & RCA */}
      {activeSubTab === 'bugs' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base">Intelligent Bug Detection & Root Cause Analysis</h3>
                <p className="text-xs text-slate-400">Automated reproduction, cross-layer diagnostics, and AI code fix synthesis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bug List */}
              <div className="space-y-2">
                {bugs.map(bug => (
                  <div
                    key={bug.id}
                    onClick={() => setSelectedBug(bug)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedBug.id === bug.id
                        ? 'bg-slate-800 border-rose-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400 text-xs">{bug.prioritySuggestion} &bull; {bug.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300">
                        {bug.severity}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs mt-1 leading-snug">{bug.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{bug.rootCauseLayer}</p>
                  </div>
                ))}
              </div>

              {/* Bug Detail & AI RCA */}
              <div className="lg:col-span-2 bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedBug.title}</h4>
                    <span className="text-slate-400 text-[11px]">Layer: <strong className="text-rose-400">{selectedBug.rootCauseLayer}</strong></span>
                  </div>

                  <button
                    onClick={() => handleRunRCA(selectedBug)}
                    disabled={isAnalyzingRCA}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center space-x-1.5 shadow-md shadow-rose-900/30"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-rose-200 ${isAnalyzingRCA ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzingRCA ? 'Gemini 3.8 Flash RCA...' : 'Run Root Cause Analysis'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block">Root Cause Explanation:</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {selectedBug.rootCauseExplanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block">Steps to Reproduce:</span>
                  <ol className="text-slate-400 space-y-1 list-decimal list-inside bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {selectedBug.stepsToReproduce.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                {selectedBug.codeFixSnippet && (
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-400 block">Synthesized Code Patch & Remediation:</span>
                    <pre className="font-mono text-[11px] text-emerald-300 bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto">
                      {selectedBug.codeFixSnippet}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Autonomous App Explorer */}
      {activeSubTab === 'explorer' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Autonomous Application Explorer</h3>
              <p className="text-xs text-slate-400">Performs exploratory testing, constructing internal knowledge graphs of routes, forms, APIs, and states</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              />
              <button
                onClick={handleStartExploration}
                disabled={isExploring}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isExploring ? 'animate-spin' : ''}`} />
                <span>{isExploring ? 'Exploring App...' : 'Start Crawl'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-300 block">Pages & Screens (18)</span>
              <p className="text-slate-400 text-[11px]">/login, /dashboard, /orders/checkout, /settings, /api-keys</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-300 block">Forms & Actions (12)</span>
              <p className="text-slate-400 text-[11px]">Cart checkout, auth login, password reset, token generator</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-300 block">Discovered APIs (24)</span>
              <p className="text-slate-400 text-[11px]">GET/POST /api/v1/orders, /user/profile, /telemetry</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-rose-300 block">Error & Empty States</span>
              <p className="text-slate-400 text-[11px]">404 fallback, 500 boundary catch, empty cart illustration</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
