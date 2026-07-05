export default function ProgressSteps({ selectedGoal, result }) {
    const steps = [
      { label: "Goal", complete: !!selectedGoal, current: !selectedGoal },
      {
        label: "Documentation",
        complete: !!result,
        current: !!selectedGoal && !result,
      },
      { label: "Pathway", complete: false, current: !!result },
    ];
  
    return (
      <div className="flex items-center px-7 pt-6 pb-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold flex-shrink-0
                  ${
                    step.complete
                      ? "bg-ink text-white"
                      : step.current
                      ? "bg-gold text-white"
                      : "bg-rule text-ink-soft/60"
                  }`}
              >
                {step.complete ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-medium tracking-wide hidden sm:inline
                  ${
                    step.complete || step.current
                      ? "text-ink"
                      : "text-ink-soft/60"
                  }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 ${
                  step.complete ? "bg-ink" : "bg-rule"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }