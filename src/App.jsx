import { useState } from "react";
import GoalSelector from "./components/GoalSelector";
import IntakeForm from "./components/IntakeForm";
import ResultsChecklist from "./components/ResultsChecklist";
import { evaluateShelterPath, evaluateBankPath, evaluateSchoolPath, getDocumentQuestions, GOALS } from "./data/rulesEngine";
import { generateCaseworkerLetter } from "./utils/generateLetter";
import { generateClientSummary } from "./utils/generateClientSummary";

function generateCaseNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `${y}-${m}${day}-CA-${rand}`;
}

function App() {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [caseNumber, setCaseNumber] = useState(() => generateCaseNumber());

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setResult(null);
  };

  const handleSelectGoal = (goalId) => {
    setSelectedGoal(goalId);
    setAnswers({});
    setResult(null);
  };

  const handleStartNewCase = () => {
    setSelectedGoal(null);
    setAnswers({});
    setResult(null);
    setCaseNumber(generateCaseNumber());
  };

  const canSubmit =
    selectedGoal &&
    getDocumentQuestions(selectedGoal).every((q) => answers[q.id]);

  const handleSubmit = () => {
    if (selectedGoal === "shelter") {
      setResult(evaluateShelterPath(answers));
    } else if (selectedGoal === "bank") {
      setResult(evaluateBankPath(answers));
    } else if (selectedGoal === "school") {
      setResult(evaluateSchoolPath(answers));
    }
  };

  const goalLabel =
    GOALS.find((g) => g.id === selectedGoal)?.label ?? "";

  const handleGenerateLetter = () => {
    generateCaseworkerLetter({ purpose: selectedGoal });
  };

  const handleGenerateClientSummary = () => {
    if (result) generateClientSummary({ result, goalLabel });
  };

  return (
    <div className="min-h-screen bg-paper font-body">
      <header className="bg-ink text-white">
        <div className="max-w-3xl mx-auto px-6 py-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-xs tracking-widest text-white/50 uppercase mb-2">
                Case File No. {caseNumber}
              </p>
              <h1 className="font-display text-3xl font-semibold tracking-tight">
                Documentation Pathway Navigator
              </h1>
              <p className="text-sm text-white/65 mt-2 max-w-xl leading-relaxed">
                A caseworker tool to unblock the documentation deadlocks that keep
                clients from housing, banking, and basic services.
              </p>
            </div>
            {selectedGoal && (
              <button
                onClick={handleStartNewCase}
                className="flex-shrink-0 px-3 py-1.5 rounded-md border border-white/30 text-white/75 text-xs font-medium tracking-wide hover:border-white/50 hover:text-white transition-all"
              >
                Start New Case
              </button>
            )}
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-gold via-gold to-transparent" />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-panel rounded-md border border-rule shadow-sm">
          <div className="p-7">
            <div className="mb-6">
              <h2 className="font-display text-base font-medium text-ink mb-1.5">
                For caseworkers &amp; legal aid staff
              </h2>
              <p className="text-sm text-ink-soft leading-relaxed max-w-xl">
                Walk through your client&apos;s documentation gaps to find a
                step-by-step pathway out of common missing-ID deadlocks — then
                generate ready-to-use caseworker letters and client summaries.
              </p>
            </div>
            <GoalSelector selectedGoal={selectedGoal} onSelect={handleSelectGoal} />
          </div>

          {selectedGoal && (
            <div className="border-t border-rule p-7">
              <IntakeForm
                goalId={selectedGoal}
                answers={answers}
                onAnswer={handleAnswer}
                onSubmit={handleSubmit}
                canSubmit={canSubmit}
              />
            </div>
          )}

          {result && (
            <div className="border-t border-rule p-7">
              <ResultsChecklist
                result={result}
                goalLabel={goalLabel}
                onGenerateLetter={handleGenerateLetter}
                onGenerateClientSummary={handleGenerateClientSummary}
              />
            </div>
          )}
        </div>

        <footer className="text-center text-xs text-ink-soft/70 mt-8 font-mono tracking-wide">
          Built for the Young Coders' Sphere "Code for Community" Challenge —
          SDG 16.9 · 16.3 · 11.1
        </footer>
      </main>
    </div>
  );
}

export default App;
