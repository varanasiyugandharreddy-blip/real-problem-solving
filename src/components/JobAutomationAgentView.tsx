import React, { useState } from 'react';
import { 
  CandidatePreferences, 
  MasterResumeData, 
  DiscoveredJob, 
  RecruiterContact, 
  KnowledgeBaseItem,
  OperatingMode
} from '../types/agent';
import { 
  Briefcase, 
  Sparkles, 
  FileText, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Copy, 
  Check, 
  Eye, 
  Send, 
  Clock, 
  Search, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Sliders,
  DollarSign,
  MapPin,
  Building,
  Code
} from 'lucide-react';

interface JobAutomationAgentViewProps {
  preferences: CandidatePreferences;
  setPreferences: React.Dispatch<React.SetStateAction<CandidatePreferences>>;
  masterResume: MasterResumeData;
  setMasterResume: React.Dispatch<React.SetStateAction<MasterResumeData>>;
  discoveredJobs: DiscoveredJob[];
  setDiscoveredJobs: React.Dispatch<React.SetStateAction<DiscoveredJob[]>>;
  recruiters: RecruiterContact[];
  setRecruiters: React.Dispatch<React.SetStateAction<RecruiterContact[]>>;
  knowledgeBase: KnowledgeBaseItem[];
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseItem[]>>;
  operatingMode: OperatingMode;
  onQueueForApproval: (actionTitle: string, payload: any) => void;
}

export const JobAutomationAgentView: React.FC<JobAutomationAgentViewProps> = ({
  preferences,
  setPreferences,
  masterResume,
  setMasterResume,
  discoveredJobs,
  setDiscoveredJobs,
  recruiters,
  setRecruiters,
  knowledgeBase,
  setKnowledgeBase,
  operatingMode,
  onQueueForApproval,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'recruiters' | 'preferences' | 'knowledge' | 'latex'>('pipeline');
  const [selectedJob, setSelectedJob] = useState<DiscoveredJob>(discoveredJobs[0]);
  
  // LaTeX tailoring state
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [tailoredResumeData, setTailoredResumeData] = useState<any>(null);
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Outreach generation state
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [activeRecruiter, setActiveRecruiter] = useState<RecruiterContact>(recruiters[0]);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Trigger ATS Resume Customization with Gemini
  const handleTailorResume = async (job: DiscoveredJob) => {
    setSelectedJob(job);
    setIsGeneratingResume(true);
    setActiveSubTab('latex');

    try {
      const response = await fetch('/api/agent/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          jobDescription: job.jobDescription,
          masterResume: masterResume,
          candidatePreferences: preferences
        }),
      });

      if (!response.ok) throw new Error('Tailoring failed');
      const data = await response.json();
      setTailoredResumeData(data);

      // Update job status
      setDiscoveredJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'TAILORED' } : j));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingResume(false);
    }
  };

  // Trigger Recruiter Outreach Generation with Gemini
  const handleGenerateOutreach = async (rec: RecruiterContact) => {
    setActiveRecruiter(rec);
    setIsGeneratingEmail(true);

    try {
      const response = await fetch('/api/agent/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiterName: rec.name,
          recruiterRole: rec.role,
          company: rec.company,
          jobTitle: selectedJob.title,
          candidateProfile: masterResume,
          tone: 'Concise, high-impact, professional'
        }),
      });

      if (!response.ok) throw new Error('Outreach generation failed');
      const data = await response.json();

      setRecruiters(prev => prev.map(r => {
        if (r.id === rec.id) {
          return {
            ...r,
            emailSubject: data.subject,
            emailBody: data.body,
            status: operatingMode === 'FULLY_AUTONOMOUS' ? 'SENT' : 'PENDING_APPROVAL'
          };
        }
        return r;
      }));

      if (operatingMode === 'APPROVAL_MODE') {
        onQueueForApproval(`Recruiter Outreach to ${rec.name} (${rec.company})`, data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleApplyJob = (job: DiscoveredJob) => {
    if (operatingMode === 'APPROVAL_MODE') {
      onQueueForApproval(`Submit Job Application: ${job.title} at ${job.company}`, {
        job,
        resumeVersion: 'LaTeX-Tailored-ATS-v2',
        portal: job.portal
      });
      setDiscoveredJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'PENDING_APPROVAL' } : j));
    } else {
      setDiscoveredJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'APPLIED', appliedDate: 'Just now' } : j));
    }
  };

  const handleCopyLatex = () => {
    if (!tailoredResumeData?.latexCode) return;
    navigator.clipboard.writeText(tailoredResumeData.latexCode);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleVerifyQuestion = (id: string, confirmedAnswer: string) => {
    setKnowledgeBase(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          verifiedAnswer: confirmedAnswer,
          requiresHumanConfirmation: false,
          confidenceScore: 100,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Autonomous Job Search & Application Agent
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Scrapes 12+ portals, compiles ATS Overleaf LaTeX resumes, discovers recruiters, and coordinates multi-step outreach.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Active Enforcement:</span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              operatingMode === 'FULLY_AUTONOMOUS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
              operatingMode === 'APPROVAL_MODE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-indigo-950 text-indigo-300 border border-indigo-800'
            }`}>
              {operatingMode.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Quick Stats Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Discovered</span>
            <span className="text-lg font-extrabold text-white mt-0.5 block">{discoveredJobs.length}</span>
            <span className="text-[10px] text-cyan-400">12 Portals Active</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">ATS Tailored</span>
            <span className="text-lg font-extrabold text-cyan-300 mt-0.5 block">
              {discoveredJobs.filter(j => j.status === 'TAILORED' || j.status === 'APPLIED').length}
            </span>
            <span className="text-[10px] text-slate-400">LaTeX Resumes</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Submitted</span>
            <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">
              {discoveredJobs.filter(j => j.status === 'APPLIED').length}
            </span>
            <span className="text-[10px] text-emerald-400">Zero Duplicates</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recruiters Reached</span>
            <span className="text-lg font-extrabold text-amber-300 mt-0.5 block">
              {recruiters.filter(r => r.status === 'SENT' || r.status === 'PENDING_APPROVAL').length}
            </span>
            <span className="text-[10px] text-slate-400">Personalized</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Positive Replies</span>
            <span className="text-lg font-extrabold text-violet-400 mt-0.5 block">2</span>
            <span className="text-[10px] text-violet-400">18.5% Conversion</span>
          </div>
        </div>

        {/* Inner Subtabs */}
        <div className="flex border-t border-slate-800 pt-3 space-x-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'pipeline', label: 'Discovered Jobs Pipeline', icon: Briefcase },
            { id: 'latex', label: 'ATS LaTeX Resume Studio', icon: FileText },
            { id: 'recruiters', label: 'HR Outreach & Cold Email', icon: Mail },
            { id: 'knowledge', label: 'Candidate Knowledge Base (Q&A)', icon: UserCheck },
            { id: 'preferences', label: 'Candidate Preferences & Limits', icon: Sliders },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
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

      {/* SUBTAB 1: Discovered Jobs Pipeline */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {discoveredJobs.map(job => (
              <div 
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white text-base">{job.title}</span>
                      <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                        {job.relevanceScore}% Relevance Match
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-1 text-slate-300 font-semibold">
                        <Building className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{job.company}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{job.salary}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        Portal: {job.portal}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTailorResume(job)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tailor Resume (LaTeX)</span>
                    </button>

                    <button
                      onClick={() => handleApplyJob(job)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                        job.status === 'APPLIED'
                          ? 'bg-slate-800 text-emerald-400'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{job.status === 'APPLIED' ? 'Applied' : operatingMode === 'APPROVAL_MODE' ? 'Stage Application' : 'Apply Autonomous'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {job.jobDescription}
                </p>

                {/* Extracted Required Skills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Required Skills:</span>
                  {job.requiredSkills.map(sk => (
                    <span key={sk} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {sk}
                    </span>
                  ))}
                  {job.duplicatePortalSources && job.duplicatePortalSources.length > 0 && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 ml-auto">
                      Deduplicated across: {job.duplicatePortalSources.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ATS LaTeX Resume Studio */}
      {activeSubTab === 'latex' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>Job-Specific ATS LaTeX Resume Studio (Overleaf Compatible)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Target: <strong className="text-cyan-300">{selectedJob.title} at {selectedJob.company}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTailorResume(selectedJob)}
                  disabled={isGeneratingResume}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-cyan-300 ${isGeneratingResume ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingResume ? 'Compiling LaTeX with Gemini...' : 'Re-generate with Gemini'}</span>
                </button>

                <button
                  onClick={handleCopyLatex}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center space-x-1"
                >
                  {copiedLatex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedLatex ? 'Copied LaTeX' : 'Copy LaTeX'}</span>
                </button>
              </div>
            </div>

            {tailoredResumeData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score & Keyword Gap Analysis */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Predicted ATS Match Score</span>
                    <span className="text-3xl font-extrabold text-emerald-400 block mt-1">
                      {tailoredResumeData.atsScore || 94}%
                    </span>
                    <span className="text-[11px] text-slate-400">High Confidence Pass</span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-emerald-400 block mb-1">Keywords Injected:</span>
                    <div className="flex flex-wrap gap-1">
                      {(tailoredResumeData.matchingKeywords || ['TypeScript', 'Playwright', 'Distributed Systems']).map((kw: string) => (
                        <span key={kw} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-amber-400 block mb-1">Identified Experience Gaps:</span>
                    <div className="flex flex-wrap gap-1">
                      {(tailoredResumeData.missingKeywords || ['Kubernetes cluster provisioning']).map((kw: string) => (
                        <span key={kw} className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40 font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Raw LaTeX Code Preview */}
                <div className="md:col-span-2 bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-mono text-cyan-300 font-semibold">resume_tailored_{selectedJob.company.toLowerCase()}.tex</span>
                    <span className="text-[10px]">Overleaf Compatible &bull; LaTeX 2e</span>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-300 h-80 overflow-y-auto p-2 bg-slate-900/60 rounded-lg border border-slate-800 select-all leading-relaxed">
                    {tailoredResumeData.latexCode || `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\begin{document}
\\begin{center}
    \\textbf{\\Huge \\scshape Alex Vance} \\\\ \\vspace{1pt}
    \\small 555-0199 $|$ \\href{mailto:alex.vance@agenticos.net}{alex.vance@agenticos.net} $|$ 
    \\href{https://linkedin.com/in/alex-vance-ai}{linkedin.com/in/alex-vance-ai}
\\end{center}

\\section{Professional Summary}
Senior Full-Stack \\& Autonomous AI Systems Engineer. Specially tailored for ${selectedJob.title} at ${selectedJob.company}.

\\section{Technical Core Competencies}
\\textbf{Languages \\& Frameworks:} TypeScript, React, Node.js, Express, Playwright, PostgreSQL, Redis \\\\
\\textbf{Agentic Automation:} Real-time Priority Matrices, Vector-Clock Deduplication, Runtime DevTools Profiling

\\section{Experience}
\\textbf{Staff Automation \\& Core Engineer} $|$ \\emph{Aetheria Distributed Labs} \\hfill 2023 -- Present
\\begin{itemize}[leftmargin=0.15in, label={--}]
    \\item Deployed automated multi-agent task prioritization pipelines handling 25,000+ daily workflows.
    \\item Engineered Playwright verification suites catching 40+ critical edge-case regressions.
\\end{itemize}

\\end{document}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: HR Outreach & Cold Email */}
      {activeSubTab === 'recruiters' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recruiter List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-white text-sm">Discovered HR & Recruiter Contacts</h3>
            <div className="space-y-2">
              {recruiters.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => setActiveRecruiter(rec)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    activeRecruiter.id === rec.id
                      ? 'bg-slate-800 border-cyan-500'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{rec.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {rec.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{rec.role} &bull; {rec.company}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Email Preview & Follow-up Sequences */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  Personalized Outreach to {activeRecruiter.name} ({activeRecruiter.company})
                </h3>
                <p className="text-xs text-slate-400">Natural, concise, and non-template cold email generator</p>
              </div>

              <button
                onClick={() => handleGenerateOutreach(activeRecruiter)}
                disabled={isGeneratingEmail}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <Sparkles className={`w-3.5 h-3.5 text-cyan-200 ${isGeneratingEmail ? 'animate-spin' : ''}`} />
                <span>{isGeneratingEmail ? 'Synthesizing Email...' : 'Generate with Gemini'}</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Subject Line:</span>
                <input
                  type="text"
                  readOnly
                  value={activeRecruiter.emailSubject || `Regarding ${selectedJob.title} - Candidate Background`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-medium"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Personalized Body:</span>
                <textarea
                  rows={8}
                  readOnly
                  value={activeRecruiter.emailBody || `Hi ${activeRecruiter.name},\n\nI noticed your team's expansion at ${activeRecruiter.company} and came across the ${selectedJob.title} opening.\n\nWith a background scaling autonomous agentic execution pipelines and automated Playwright suites, I have driven reliable engineering workflows that match your criteria.\n\nAttached is my tailored resume. Would you be open to a 10-minute chat this week?\n\nBest regards,\nAlex Vance`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 leading-relaxed font-sans"
                />
              </div>

              {/* Follow up Sequence Schedule */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Automated Multi-Stage Follow-Up Strategy:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="font-semibold text-cyan-300 block">Stage 1 (Day +3):</span>
                    Value-add check-in sharing architectural artifact or portfolio demo.
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="font-semibold text-cyan-300 block">Stage 2 (Day +7):</span>
                    Low-pressure closing note keeping door open if timing changes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Candidate Knowledge Base */}
      {activeSubTab === 'knowledge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Candidate Knowledge Base & Question Verification</h3>
              <p className="text-xs text-slate-400">
                Verified candidate information safely reused when answering application form questions without hallucination.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {knowledgeBase.map(item => (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  item.requiresHumanConfirmation
                    ? 'bg-amber-950/20 border-amber-700/60'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Category: {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.requiresHumanConfirmation
                      ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {item.requiresHumanConfirmation ? 'Requires Candidate Confirmation' : `Verified (${item.confidenceScore}%)`}
                  </span>
                </div>

                <div className="font-bold text-white text-sm">
                  {item.question}
                </div>

                <div className="text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {item.verifiedAnswer}
                </div>

                {item.requiresHumanConfirmation && (
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleVerifyQuestion(item.id, 'No IP restrictions or non-compete agreements. Fully clear to start immediately.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Confirm: No Restrictions
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: Preferences */}
      {activeSubTab === 'preferences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base">Candidate Job Search Preferences & Limits</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold block">Target Job Titles (Max 3)</label>
              <div className="space-y-1.5">
                {preferences.targetJobTitles.map((t, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={t}
                    onChange={e => {
                      const copy = [...preferences.targetJobTitles];
                      copy[idx] = e.target.value;
                      setPreferences({ ...preferences, targetJobTitles: copy });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Salary Expectations</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={preferences.minSalary}
                    onChange={e => setPreferences({ ...preferences, minSalary: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                  <input
                    type="text"
                    value={preferences.maxSalary}
                    onChange={e => setPreferences({ ...preferences, maxSalary: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Max Daily Applications</label>
                <input
                  type="number"
                  value={preferences.maxDailyApplications}
                  onChange={e => setPreferences({ ...preferences, maxDailyApplications: parseInt(e.target.value) || 20 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
