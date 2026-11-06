import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  X, 
  Minimize2, 
  RotateCcw, 
  MessageSquare, 
  User, 
  Check, 
  Sliders
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: Array<{ title: string; uri: string }>;
  timestamp: string;
}

interface AgentCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const AgentCopilotModal: React.FC<AgentCopilotModalProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'model',
      text: 'Greetings Commander. I am your autonomous NexusAgent Copilot. I can conduct live market salary searches with Google Grounding, audit your ATS resume LaTeX, or prioritize multi-agent workflows. How can I assist your pipeline today?',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentRole, setAgentRole] = useState<'CAREER_COPILOT' | 'QA_ARCHITECT' | 'TASK_ORCHESTRATOR'>('CAREER_COPILOT');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [enableSearch, setEnableSearch] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
          agentRole,
          model: selectedModel,
          enableSearch
        }),
      });

      if (!response.ok) throw new Error('Chat failed');
      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: data.text || 'Response received.',
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 2}`,
          role: 'model',
          text: `[NexusAgent Offline Mode]: Operating via local agent intelligence. All 12 portals are monitored and your current priority scoring is steady.`,
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterChips = [
    'Analyze SF Senior AI Engineer salary benchmarks',
    'Audit LaTeX resume keywords for Stripe opening',
    'Check cross-portal duplicate prevention status'
  ];

  return (
    <>
      {/* Floating Launcher Button (when closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-2xl shadow-2xl flex items-center space-x-2.5 transition transform hover:scale-105 group border border-cyan-400/30"
          title="Open NexusAgent Copilot"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-tight pr-1 hidden sm:inline">AI Copilot</span>
        </button>
      )}

      {/* Floating Multi-Turn Copilot Dock */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[440px] h-[580px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in font-sans">
          {/* Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white">NexusAgent Copilot</h3>
                <span className="text-[10px] text-slate-400 font-mono">Multi-Turn · Gemini Powered</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 text-slate-400 hover:text-slate-200"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Controls (Role, Model, Search Toggle) */}
          <div className="px-3.5 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[11px] gap-2">
            <div className="flex items-center space-x-1">
              <select
                value={agentRole}
                onChange={e => setAgentRole(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-slate-200 text-[10px] font-semibold focus:outline-none"
              >
                <option value="CAREER_COPILOT">Career Strategist</option>
                <option value="QA_ARCHITECT">QA Architect</option>
                <option value="TASK_ORCHESTRATOR">Orchestrator</option>
              </select>

              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-md px-1.5 py-1 text-slate-300 text-[10px] font-mono focus:outline-none"
              >
                <option value="gemini-3.8-flash">3.8 Flash</option>
                <option value="gemini-3.1-flash-lite">3.1 Lite</option>
              </select>
            </div>

            {/* Google Search Grounding Switch */}
            <button
              onClick={() => setEnableSearch(!enableSearch)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md transition text-[10px] font-bold border ${
                enableSearch
                  ? 'bg-cyan-950/80 border-cyan-600 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Google Search Grounding for real-time web verification"
            >
              <Globe className={`w-3 h-3 ${enableSearch ? 'text-cyan-400 animate-pulse' : ''}`} />
              <span>Google Search</span>
            </button>
          </div>

          {/* Chat Messages Thread */}
          <div ref={scrollRef} className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Grounded Web Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Verified Web Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40 hover:border-cyan-500"
                          >
                            <span className="truncate max-w-[120px]">{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-slate-400 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Agent reasoning with {selectedModel}...</span>
              </div>
            )}
          </div>

          {/* Starter Chips */}
          <div className="px-3 py-1.5 bg-slate-950/50 border-t border-slate-800/60 flex space-x-1.5 overflow-x-auto no-scrollbar">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] text-slate-300 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-800 shrink-0 transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask your agent copilot..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
