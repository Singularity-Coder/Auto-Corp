
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { BusinessEntity } from '../types';
import { Bot, X, Send, Cpu } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  activeEntity: BusinessEntity | null;
  currentStep: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEntity: (updates: Partial<BusinessEntity>) => void;
  onUpdateStep: (step: number) => void;
}

const updateEntityFunctionDeclaration: FunctionDeclaration = {
  name: 'updateEntityDetails',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates the corporate formation details for the current entity.',
    properties: {
      name: { type: Type.STRING, description: 'The name of the business.' },
      industry: { type: Type.STRING, description: 'The market sector.' },
      jurisdiction: { type: Type.STRING, description: 'The legal jurisdiction.' },
    },
  },
};

const moveToStepFunctionDeclaration: FunctionDeclaration = {
  name: 'moveToStep',
  parameters: {
    type: Type.OBJECT,
    description: 'Advances the construction stepper to the next logical phase.',
    properties: {
      stepId: { type: Type.NUMBER, description: 'The ID of the phase to move to (1-5).' },
    },
    required: ['stepId'],
  },
};

const ChatInterface: React.FC<Props> = ({ activeEntity, currentStep, isOpen, onClose, onUpdateEntity, onUpdateStep }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Orchestrator online. I am ready to guide you through the 5-phase corporate manifestation protocol. Phase 1: Ideation. Please describe your business vision, including a name and target jurisdiction.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contextPrompt = activeEntity 
        ? `ENTITY CONTEXT:
           Name: ${activeEntity.name || 'NOT SET'}
           Industry: ${activeEntity.industry || 'NOT SET'}
           Jurisdiction: ${activeEntity.jurisdiction || 'Delaware, USA'}
           CURRENT PHASE: ${currentStep || 1}`
        : "CONTEXT: Initializing first entity creation.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `${contextPrompt}\n\nUSER INPUT: ${userMessage}` }] }
        ],
        config: {
          systemInstruction: `You are the Auto-Corp AI Orchestrator. You MUST follow a strict linear progression through the 5 phases of business construction.
          PROTOCOL:
          1. PAUSE & ASK: Do not move to the next phase until the requirements of the current phase are satisfied.
          2. STEP 1 (Ideation): Need Name, Industry, and Jurisdiction. When you have them, call 'updateEntityDetails' AND then ask the user if they are ready to proceed to Phase 2.
          3. STEP 2 (Formalization): Requires user agreement to document generation. Once they confirm, call 'moveToStep' with stepId: 2.
          Current Goal: Help the user finish the current Phase (${currentStep || 1}).`,
          tools: [{ functionDeclarations: [updateEntityFunctionDeclaration, moveToStepFunctionDeclaration] }],
        }
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        let confirmationText = "";
        for (const call of response.functionCalls) {
          if (call.name === 'updateEntityDetails') {
            onUpdateEntity(call.args as Partial<BusinessEntity>);
            confirmationText += `System parameters updated. `;
          }
          if (call.name === 'moveToStep') {
            onUpdateStep((call.args as any).stepId);
            confirmationText += `Transitioning to Phase ${(call.args as any).stepId}. `;
          }
        }
        setMessages(prev => [...prev, { role: 'model', text: response.text || (confirmationText + "How would you like to proceed?") }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: response.text || "Orchestrator standing by." }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Logic error in orchestration loop." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-white border-l border-slate-100 shadow-2xl transition-all duration-500 ease-in-out z-50 flex flex-col ${
        isOpen ? 'w-[400px] translate-x-0' : 'w-0 translate-x-full'
      }`}
    >
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-900 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Bot size={20} /></div>
          <div>
            <h3 className="font-bold text-sm tracking-tight uppercase">Orchestrator</h3>
            <p className="text-[9px] text-blue-300 font-black uppercase tracking-widest">Procedural Agent</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FDFDFF] custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 text-sm leading-relaxed whitespace-pre-wrap rounded-3xl ${
                msg.role === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl rounded-tl-none">
              <div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-50 bg-white shrink-0">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={`Control Phase ${currentStep || 1}...`}
            className="w-full bg-slate-50 border-none rounded-3xl p-5 pr-14 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none h-28"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-4 bottom-4 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-6 flex items-center justify-between px-1">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Cpu size={12} /> Creation Node
           </span>
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Step {currentStep || 1} / 5</span>
        </div>
        <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(currentStep || 1) * 20}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
