import React, { useState } from 'react';
import { FileText, Bot, Download, Loader2, AlertOctagon } from 'lucide-react';
import { generateRandomLog } from '../services/mockData';
import { analyzeTrafficLogs } from '../services/geminiService';
import { NetworkLog, AnalysisReport } from '../types';
import ReactMarkdown from 'react-markdown';

const Forensics: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [logsToAnalyze, setLogsToAnalyze] = useState<NetworkLog[]>([]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport(null);
    
    // 1. Simulate fetching a batch of "suspicious" logs from a database
    const mockBatch: NetworkLog[] = [];
    for(let i=0; i<15; i++) {
        mockBatch.push(await generateRandomLog());
    }
    setLogsToAnalyze(mockBatch);

    // 2. Call Gemini Service
    const aiReport = await analyzeTrafficLogs(mockBatch);
    setReport(aiReport);
    setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 pb-6">
       <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">AI Forensics Lab</h1>
          <p className="text-sm md:text-base text-slate-400">Deep packet inspection and threat analysis.</p>
       </div>

       <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 overflow-y-auto lg:overflow-hidden">
          {/* Controls & Log Preview */}
          <div className="lg:w-1/3 flex flex-col gap-6 shrink-0">
             <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bot className="text-purple-400" /> Analyst Control
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mb-6">
                  Initiate a forensic scan on recent network traffic. The system will aggregate the last 15 packets, identify patterns, and generate a mitigation strategy.
                </p>
                
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 md:py-4 px-6 rounded-lg transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" /> Analyzing Traffic...
                    </>
                  ) : (
                    <>
                      <FileText /> Generate Forensic Report
                    </>
                  )}
                </button>
             </div>

             {/* Log Source Preview - Hidden on small mobile to save space unless report is not generated */}
             {(logsToAnalyze.length > 0) && (
               <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[200px] lg:min-h-0">
                  <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Source Dataset ({logsToAnalyze.length} entries)
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
                    {logsToAnalyze.map(log => (
                      <div key={log.id} className="text-[10px] font-mono text-slate-500 p-1 hover:bg-slate-800 rounded truncate">
                        <span className={log.severity === 'CRITICAL' ? 'text-red-400' : 'text-slate-400'}>
                          [{log.severity}]
                        </span> {log.protocol} : {log.payload}
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>

          {/* Report Viewer */}
          <div className="lg:w-2/3 bg-slate-50 border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden relative min-h-[500px] lg:min-h-0">
            {report ? (
              <>
                 <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900">Security Assessment Report</h2>
                      <div className="text-xs md:text-sm text-slate-500 mt-1">Generated: {new Date(report.timestamp).toLocaleString()}</div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm border whitespace-nowrap ${
                      report.threatLevel === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      THREAT LEVEL: {report.threatLevel}
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-4 md:p-8 prose prose-sm md:prose-base prose-slate max-w-none">
                    {/* Render Markdown from Gemini */}
                    <ReactMarkdown>{report.rawAnalysis}</ReactMarkdown>
                 </div>

                 <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                       <Download size={16} /> Export PDF
                    </button>
                 </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                <AlertOctagon size={48} className="mb-4 opacity-20" />
                <p className="text-base md:text-lg font-medium">No report generated</p>
                <p className="text-xs md:text-sm opacity-60">Run analysis to view findings</p>
              </div>
            )}
          </div>
       </div>
    </div>
  );
};

export default Forensics;