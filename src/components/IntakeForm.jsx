import { getDocumentQuestions } from "../data/rulesEngine";

export default function IntakeForm({ goalId, answers, onAnswer, onSubmit, canSubmit, isGenerating }) {
  const questions = getDocumentQuestions(goalId);

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-1">
        Step 02
      </p>
      <h2 className="font-display text-xl font-semibold text-ink mb-4">
        Current documentation status
      </h2>
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="flex gap-4">
            <div className="flex-shrink-0 w-6 text-right">
              <span className="font-mono text-xs text-ink-soft/60" aria-hidden="true">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink mb-2.5" id={`question-${q.id}`}>
                {q.label}
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-labelledby={`question-${q.id}`}
              >
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onAnswer(q.id, opt.value)}
                      aria-pressed={isSelected}
                      className={`px-3 py-2 rounded-md text-sm border transition-all
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
                        ${
                          isSelected
                            ? "border-gold bg-gold-soft text-ink font-medium"
                            : "border-rule bg-white text-ink-soft hover:border-ink-soft"
                        }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={!canSubmit || isGenerating}
        aria-label={
          canSubmit
            ? "Generate pathway"
            : "Generate pathway (disabled — answer all questions above first)"
        }
        className={`mt-7 px-5 py-2.5 rounded-md font-medium text-sm tracking-wide transition-all
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
          ${
            canSubmit && !isGenerating
              ? "bg-ink text-white hover:bg-[#0f1730]"
              : "bg-rule text-ink-soft/60 cursor-not-allowed"
          }`}
      >
        {isGenerating ? "Generating…" : "Generate Pathway →"}
      </button>
    </div>
  );
}