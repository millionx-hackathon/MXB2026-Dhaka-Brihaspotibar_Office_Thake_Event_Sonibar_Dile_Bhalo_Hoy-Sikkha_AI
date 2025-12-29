"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Calculator, Upload, Scan, RotateCcw, Play, Pause,
  Lightbulb, CheckCircle2, Split, FunctionSquare,
  ChevronDown, ChevronUp, Search, Info, TrendingUp, Layers, BadgeHelp,
  Camera, Type, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Types
type SolveMethod = 'factorization' | 'formula';
type ViewMode = 'steps' | 'graph' | 'concepts';
type ProcessingStage = 'idle' | 'ocr' | 'analyzing' | 'computing' | 'completed' | 'error';
type InputMode = 'demo' | 'text' | 'upload';

interface MathStep {
  id: number;
  latex: string;
  title: string;
  explanation: string;
  deepDive?: string;
  rule?: string;
  highlight?: string;
}

interface SolutionMethod {
  name: string;
  name_bn: string;
  steps: MathStep[];
}

interface MathSolution {
  equation: string;
  equationType: string;
  equationType_bn: string;
  variables?: {
    a?: number | string;
    b?: number | string;
    c?: number | string;
  };
  methods: SolutionMethod[];
  finalAnswer: string;
}

export default function MathSolverPage() {
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('demo');
  const [textInput, setTextInput] = useState('');
  const [activeMethod, setActiveMethod] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('steps');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo image path
  const demoImagePath = '/math/image.png';

  // Handle demo image click
  const handleDemoClick = async () => {
    setStage('ocr');
    setError(null);
    setLogs([]);
    setSolution(null);

    addLog("📷 Demo image detected...", 0);
    addLog("🔍 Initializing OCR Engine...", 500);
    addLog("📝 Extracting equation from image...", 1000);

    try {
      const response = await fetch('/api/math-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: 'math/image.png' }),
      });

      setTimeout(() => {
        addLog("🧮 Analyzing equation structure...", 0);
        setStage('analyzing');
      }, 1500);

      const data = await response.json();

      setTimeout(() => {
        addLog("⚙️ Computing solution steps...", 0);
        setStage('computing');
      }, 2500);

      setTimeout(() => {
        if (data.success) {
          addLog("✅ Solution generated successfully!", 0);
          setSolution(data);
          setActiveMethod(data.methods?.[0]?.name || 'factorization');
          setStage('completed');
        } else {
          setError(data.error || 'Failed to solve equation');
          setStage('error');
        }
      }, 3500);

    } catch (err) {
      console.error('API Error:', err);
      setError('সার্ভারে সংযোগ করতে সমস্যা হয়েছে');
      setStage('error');
    }
  };

  // Handle text input submission
  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setStage('ocr');
    setError(null);
    setLogs([]);
    setSolution(null);

    addLog(`📝 Equation received: ${textInput}`, 0);
    addLog("🔍 Parsing mathematical expression...", 500);

    try {
      const response = await fetch('/api/math-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equation: textInput }),
      });

      setTimeout(() => {
        addLog("🧮 Identifying equation type...", 0);
        setStage('analyzing');
      }, 1000);

      const data = await response.json();

      setTimeout(() => {
        addLog("⚙️ Generating step-by-step solution...", 0);
        setStage('computing');
      }, 2000);

      setTimeout(() => {
        if (data.success) {
          addLog("✅ Solution ready!", 0);
          setSolution(data);
          setActiveMethod(data.methods?.[0]?.name || 'factorization');
          setStage('completed');
        } else {
          setError(data.error || 'Failed to solve equation');
          setStage('error');
        }
      }, 3000);

    } catch (err) {
      console.error('API Error:', err);
      setError('সার্ভারে সংযোগ করতে সমস্যা হয়েছে');
      setStage('error');
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(',')[1];
      setUploadedImage(base64);

      setStage('ocr');
      setError(null);
      setLogs([]);
      setSolution(null);

      addLog("📷 Image uploaded successfully!", 0);
      addLog("🔍 Running OCR on image...", 500);

      try {
        const response = await fetch('/api/math-solver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Data }),
        });

        setTimeout(() => {
          addLog("🧮 Extracting equations...", 0);
          setStage('analyzing');
        }, 1500);

        const data = await response.json();

        setTimeout(() => {
          addLog("⚙️ Solving with AI...", 0);
          setStage('computing');
        }, 2500);

        setTimeout(() => {
          if (data.success) {
            addLog("✅ Done!", 0);
            setSolution(data);
            setActiveMethod(data.methods?.[0]?.name || 'factorization');
            setStage('completed');
          } else {
            setError(data.error || 'Failed to solve');
            setStage('error');
          }
        }, 3500);

      } catch (err) {
        console.error('API Error:', err);
        setError('সার্ভারে সমস্যা');
        setStage('error');
      }
    };
    reader.readAsDataURL(file);
  };

  const addLog = (msg: string, delay: number) => {
    setTimeout(() => {
      setLogs(prev => [...prev, `> ${msg}`]);
    }, delay);
  };

  const resetSolver = () => {
    setStage('idle');
    setSolution(null);
    setError(null);
    setLogs([]);
    setTextInput('');
    setUploadedImage(null);
    setExpandedStep(null);
  };

  // Get current method steps
  const currentMethodSteps = solution?.methods?.find(m => m.name === activeMethod)?.steps || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Calculator className="w-6 h-6" />
            </div>
            Math Solver <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold tracking-wider">AI</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Powered by Shikkha AI • Gemini</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* VIEW 1: IDLE / INPUT OPTIONS */}
        {stage === 'idle' && (
          <div className="space-y-6">

            {/* Input Mode Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex w-full max-w-md mx-auto">
              {[
                { id: 'demo', label: 'Demo', icon: Sparkles },
                { id: 'text', label: 'Type Equation', icon: Type },
                { id: 'upload', label: 'Upload Image', icon: Camera },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setInputMode(tab.id as InputMode)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    inputMode === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Demo Mode - Show demo image */}
            {inputMode === 'demo' && (
              <div
                onClick={handleDemoClick}
                className="group relative overflow-hidden border-2 border-dashed border-slate-300 rounded-[2rem] bg-white p-8 text-center cursor-pointer transition-all hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100"
              >
                <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 space-y-6">
                  <div className="relative mx-auto w-full max-w-md">
                    <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 group-hover:border-indigo-300 transition-colors">
                      <Image
                        src={demoImagePath}
                        alt="Demo Math Equation"
                        width={400}
                        height={200}
                        className="rounded-xl mx-auto"
                        priority
                      />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Demo
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Click to Solve This Equation</h2>
                    <p className="text-slate-500">
                      AI will extract the equation from the image and solve it step-by-step
                    </p>
                  </div>

                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors group-hover:scale-105">
                    <Scan className="w-5 h-5" />
                    Solve with AI
                  </button>
                </div>
              </div>
            )}

            {/* Text Input Mode */}
            {inputMode === 'text' && (
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Type Your Equation</h2>
                    <p className="text-slate-500 text-sm">Enter any math equation and AI will solve it step-by-step</p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                      placeholder="e.g., x^2 - 5x + 6 = 0"
                      className="w-full px-6 py-4 text-xl font-mono border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {['x^2 - 5x + 6 = 0', '2x + 5 = 13', 'x^2 + 4x + 4 = 0', '3x - 7 = 2x + 5'].map((example) => (
                      <button
                        key={example}
                        onClick={() => setTextInput(example)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 text-sm font-mono rounded-lg transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Solve Equation
                  </button>
                </div>
              </div>
            )}

            {/* Upload Mode */}
            {inputMode === 'upload' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative overflow-hidden border-2 border-dashed border-slate-300 rounded-[2rem] bg-white p-16 text-center cursor-pointer transition-all hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 space-y-6">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                    <Upload className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Drop Equation Image Here</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Supports handwritten math, printed equations, and photos of textbooks
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center gap-4 text-sm text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> JPG, PNG</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Handwritten</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Printed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PROCESSING */}
        {(stage === 'ocr' || stage === 'analyzing' || stage === 'computing') && (
          <div className="bg-slate-950 rounded-[2rem] overflow-hidden shadow-2xl relative h-[500px] flex flex-col font-mono">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-slate-400 text-xs">shikkha-ai-math-solver — processing</span>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-8 text-green-400 space-y-2 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="opacity-50 mr-3">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              <div className="w-3 h-5 bg-green-400 animate-pulse inline-block mt-2"></div>
            </div>

            {/* Progress Status */}
            <div className="bg-slate-900 p-6 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">
                <span>Status: {stage}</span>
                <span>{stage === 'ocr' ? '30%' : stage === 'analyzing' ? '60%' : '90%'}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  style={{ width: stage === 'ocr' ? '30%' : stage === 'analyzing' ? '60%' : '95%' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ERROR */}
        {stage === 'error' && (
          <div className="bg-white rounded-[2rem] p-12 border border-red-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">সমস্যা হয়েছে</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <button
              onClick={resetSolver}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* VIEW 4: RESULT DASHBOARD */}
        {stage === 'completed' && solution && (
          <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Sidebar: Equation Info */}
            <div className="col-span-12 md:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Input Equation</p>
                <div className="text-2xl font-mono font-bold text-slate-800 py-4 border-b border-slate-100 mb-4">
                  {solution.equation}
                </div>
                <p className="text-sm text-indigo-600 font-medium mb-4">{solution.equationType_bn}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={resetSolver} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-colors">
                    <RotateCcw className="w-4 h-4" /> New Scan
                  </button>
                </div>
              </div>

              {/* Variables Display */}
              {solution.variables && (
                <div className="bg-slate-900 rounded-3xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4 opacity-70 border-b border-slate-700 pb-2">
                    <FunctionSquare className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Variables</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {Object.entries(solution.variables).map(([key, value]) => (
                      <div key={key} className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-400 font-bold mb-1">{key.toUpperCase()}</p>
                        <p className="text-xl font-mono font-bold text-green-400">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Answer */}
              <div className="bg-green-500 text-white p-6 rounded-3xl shadow-lg shadow-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-bold">উত্তর</span>
                </div>
                <div className="text-2xl font-mono font-bold">{solution.finalAnswer}</div>
              </div>

              {/* Related Concepts */}
              <div className="bg-indigo-900 rounded-3xl p-6 text-white">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5" /> Related Concepts
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Quadratic Formula', slug: 'quadratic-formula' },
                    { label: 'Parabolas', slug: 'parabolas' },
                    { label: 'Factorization', slug: 'factorization' }
                  ].map((item) => (
                    <a
                      key={item.slug}
                      href={`/dashboard/math-solver/concepts/${item.slug}`}
                      className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 cursor-pointer transition-colors group"
                    >
                      <span className="text-sm font-medium group-hover:pl-2 transition-all">{item.label}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content: Steps and Explanations */}
            <div className="col-span-12 md:col-span-8 space-y-6">

              {/* Method Tabs */}
              {solution.methods.length > 1 && (
                <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex w-full mb-2">
                  {solution.methods.map((method) => (
                    <button
                      key={method.name}
                      onClick={() => setActiveMethod(method.name)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeMethod === method.name
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {method.name_bn}
                    </button>
                  ))}
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-4">
                {currentMethodSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                      expandedStep === step.id
                        ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-100'
                        : 'border-slate-200 shadow-sm hover:border-indigo-300'
                    }`}
                  >
                    {/* Header */}
                    <div
                      onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                      className="p-6 cursor-pointer flex items-start gap-4"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-1 transition-colors ${
                        expandedStep === step.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{step.title}</h4>
                          {step.rule && <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">{step.rule}</span>}
                        </div>
                        <div className="text-xl font-mono font-bold text-slate-800">
                          {step.latex}
                        </div>
                      </div>
                      <button className="text-slate-400">
                        {expandedStep === step.id ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {expandedStep === step.id && (
                      <div className="bg-indigo-50/50 p-6 border-t border-indigo-100 animate-in slide-in-from-top-2">
                        <div className="flex gap-4">
                          <div className="shrink-0 mt-1">
                            <Lightbulb className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-slate-700 font-medium leading-relaxed bengali-text">
                              {step.explanation}
                            </p>
                            {step.deepDive && (
                              <div className="bg-white p-4 rounded-xl border border-indigo-100 text-sm text-slate-600 leading-relaxed shadow-sm">
                                <span className="font-bold text-indigo-600 block mb-1">যুক্তি (Reasoning):</span>
                                <span className="bengali-text">{step.deepDive}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Success Banner */}
                <div className="bg-green-500 text-white p-6 rounded-3xl flex items-center justify-between shadow-lg shadow-green-200 mt-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Solution Verified ✓</h3>
                      <p className="text-green-100 text-sm">AI-generated step-by-step solution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
