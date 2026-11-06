import React from 'react';
import { ShieldCheck, AlertTriangle, Check, X, Bot, Sparkles } from 'lucide-react';

interface HumanApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingApprovals: {
    id: string;
    actionTitle: string;
    agent: string;
    risk: string;
    details: string;
    payload?: any;
  }[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  onClose,
  pendingApprovals,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Human Approval Gatekeeper</h3>
              <p className="text-xs text-slate-400">Approval Mode enforced &bull; 1-click confirmation required before submission</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xs font-bold p-1 rounded hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <Check className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-sm font-semibold text-slate-200">No actions pending approval</p>
            <p className="text-xs">All autonomous agent workflows are executing or completed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map(item => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{item.actionTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.agent}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Risk: {item.risk}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800 font-sans">
                  {item.details}
                </p>

                {item.payload && (
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900/50 p-2.5 rounded border border-slate-800/80 overflow-x-auto">
                    <span className="text-cyan-300 font-bold block mb-1">Payload Staged by Agent:</span>
                    <pre className="whitespace-pre-wrap">{typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload, null, 2)}</pre>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => onReject(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reject / Request Redraft</span>
                  </button>

                  <button
                    onClick={() => onApprove(item.id)}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-md shadow-emerald-700/20 flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Dispatch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
