import { useState } from "react";
import { buildClientSmsText } from "../utils/generateClientSummary";

export default function ResultsChecklist({
  result,
  goalLabel,
  onGenerateLetter,
  onGenerateClientSummary,
}) {
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const isDeadlock = result.deadlock;

  const handleCopySms = async () => {
    const text = buildClientSmsText({ result, goalLabel });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail in insecure/non-browser contexts — fail silently,
      // the PDF download remains the reliable path.
    }
  };

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-1">
        Step 03
      </p>
      <div className="flex items-start justify-between gap-4 mb-5">
        <h2 className="font-display text-xl font-semibold text-ink">
          {result.summaryTitle}
        </h2>
        <div
          role="status"
          aria-live="polite"
          className={`stamp stamp-animate flex-shrink-0 text-xs ${
            isDeadlock ? "text-brick" : "text-teal"
          }`}
        >
          {isDeadlock ? "Deadlock Detected" : "Pathway Clear"}
        </div>
      </div>

      {isDeadlock && (
        <div className="mb-5 px-4 py-3 rounded-md bg-brick-soft border border-brick/30 text-sm text-ink">
          This client cannot obtain standard ID through the normal path — each
          required document depends on another they don't have. A workaround
          is identified below.
        </div>
      )}

      <ol className="relative border-l-2 border-rule ml-2.5 space-y-6">
        {result.steps.map((step, i) => (
          <li key={i} className="relative pl-6">
            <span
              className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-ink border-2 border-panel"
              aria-hidden="true"
            />
            <p className="font-medium text-ink text-sm">{step.title}</p>
            <p className="text-sm text-ink-soft mt-1 leading-relaxed">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>

      {result.citation && (
        <p className="font-mono text-[11px] text-ink-soft/70 mt-5 pt-4 border-t border-rule">
          Source — {result.citation}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {result.needsLetter && (
          <button
            onClick={onGenerateLetter}
            className="px-4 py-2.5 rounded-md bg-gold text-white text-sm font-medium tracking-wide hover:brightness-95 transition-all shadow-sm
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Generate Caseworker Letter
          </button>
        )}
        <button
          onClick={onGenerateClientSummary}
          className="px-4 py-2.5 rounded-md border border-rule text-ink-soft text-sm font-medium hover:border-ink-soft transition-all
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Download Client Pathway (PDF)
        </button>
        <button
          onClick={handleCopySms}
          aria-live="polite"
          className="px-4 py-2.5 rounded-md border border-rule text-ink-soft text-sm font-medium hover:border-ink-soft transition-all
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {copied ? "Copied ✓" : "Copy as Text Message"}
        </button>
      </div>
    </div>
  );
}