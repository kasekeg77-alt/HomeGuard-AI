import { GoogleGenAI } from "@google/genai";
import { NetworkLog, AnalysisReport } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTrafficLogs = async (logs: NetworkLog[]): Promise<AnalysisReport> => {
  try {
    const ai = initGenAI();
    
    // Convert logs to a string format for the model
    const logString = logs.map(l => 
      `[${l.timestamp}] SRC:${l.source} DEST:${l.destination} PROTO:${l.protocol} SEVERITY:${l.severity} PAYLOAD:${l.payload}`
    ).join('\n');

    const prompt = `
      Act as a Cyber Security Forensic Analyst. 
      Analyze the following IoT network traffic logs from a Smart Home system.
      
      Identify:
      1. Potential intrusions or anomalies (Look for SQL injection, buffer overflows, unauthorized access attempts).
      2. The severity of the threats.
      3. Specific recommendations for mitigation.

      Format the output as a clean Markdown report with sections: 'Executive Summary', 'Threat Analysis', and 'Mitigation Steps'.

      Logs to analyze:
      ${logString}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep thinking for this prototype
      }
    });

    const text = response.text || "No analysis could be generated.";

    return {
      timestamp: new Date().toISOString(),
      threatLevel: text.toLowerCase().includes('critical') ? 'HIGH' : 'MODERATE',
      summary: "Analysis Complete. See detailed report.",
      recommendations: [], // Extracted in UI from markdown
      rawAnalysis: text
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      timestamp: new Date().toISOString(),
      threatLevel: 'UNKNOWN',
      summary: "Error connecting to AI Analysis Engine.",
      recommendations: ["Check network connection", "Verify API Key"],
      rawAnalysis: `Failed to generate report: ${(error as Error).message}`
    };
  }
};
