"use JSX";
"use client";

import React, { useState } from "react";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import {
  Printer,
  Download,
  RotateCcw,
  Eye,
  Key,
  CheckCircle2,
} from "lucide-react";

export default function StepFourPreview() {
  const store = useAssignmentStore();
  const [activeTab, setActiveTab] = useState<"paper" | "answers">("paper");

  const paper = store.generatedPaper;

  if (!paper) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🛠️ Viewer Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4 print:hidden">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("paper")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "paper"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Eye className="h-4 w-4" /> Question Paper
          </button>
          <button
            onClick={() => setActiveTab("answers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "answers"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Key className="h-4 w-4" /> Answer Key
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => store.resetStore()}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Create New"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* 📄 Document Content Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden min-h-200 print:border-none print:shadow-none">
        {/* Paper Content */}
        {activeTab === "paper" ? (
          <div className="p-12 sm:p-16 max-w-4xl mx-auto space-y-8 font-serif text-slate-900">
            {/* Exam Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
              <h2 className="text-2xl font-black uppercase tracking-widest">
                Assessment Paper
              </h2>
              <div className="flex justify-between text-sm font-bold uppercase tracking-tight">
                <span>Subject: {paper.subject}</span>
                <span>Class: {paper.className}</span>
              </div>
              <div className="flex justify-between text-sm font-bold uppercase tracking-tight">
                <span>Max Marks: {paper.totalMarks}</span>
                <span>Time: {paper.totalQuestions * 2} Minutes</span>
              </div>
            </div>

            <p className="italic text-slate-600 text-sm py-4 border-b border-slate-100">
              {paper.aiIntroGreeting}
            </p>

            {/* Render Sections */}
            {paper.sections.map((section: any, sIdx: number) => (
              <div key={sIdx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <h3 className="font-black text-lg uppercase tracking-wider">
                    Section {section.sectionLetter}
                  </h3>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm font-bold italic text-slate-700 underline decoration-indigo-200 decoration-4">
                    Instructions: {section.instruction}
                  </p>
                </div>

                <div className="space-y-8 pl-4">
                  {section.questions.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="relative group space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-lg leading-relaxed flex-1">
                          <span className="font-bold mr-3">{qIdx + 1}.</span>{" "}
                          {q.text}
                        </p>
                        <span className="text-sm font-bold bg-slate-100 px-3 py-1 rounded text-slate-600 whitespace-nowrap">
                          [{q.marks} Marks]
                        </span>
                      </div>

                      {/* 💡 Dynamically render multiple choice options if they exist */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8 pt-1">
                          {q.options.map((option: string, oIdx: number) => (
                            <div
                              key={oIdx}
                              className="flex items-center gap-2 text-base text-slate-700"
                            >
                              <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-xs font-bold font-sans">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-1 flex gap-2 pl-8">
                        <span
                          className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-100 text-emerald-700"
                              : q.difficulty === "Moderate"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Answer Key Content */
          <div className="p-12 sm:p-16 max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2 border-b-2 border-emerald-500 pb-6">
              <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-700">
                Answer Key & Marking Scheme
              </h2>
              <p className="text-sm font-bold text-slate-500">
                Subject: {paper.subject} | Class: {paper.className}
              </p>
            </div>

            <div className="space-y-6">
              {paper.answerKey.map((ans: any, aIdx: number) => (
                <div
                  key={aIdx}
                  className="p-6 bg-slate-50/50 border border-slate-100 rounded-xl hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {ans.questionNumber}
                    </div>
                    <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">
                      Response Criteria
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {ans.answerText}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-bold text-emerald-900">Marking Advisory</h4>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  The generated answers reflect standard academic curricula. For
                  subjective short/long questions, consider awarding partial
                  marks for correct conceptual understanding even if exact
                  wording differs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="text-center pb-12 print:hidden">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Secured and Generated by VedaAI Assessment Architecture
        </p>
      </div>
    </div>
  );
}
