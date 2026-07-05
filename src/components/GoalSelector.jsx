import { GOALS } from "../data/rulesEngine";

const ICONS = {
  shelter: "🏚",
  bank: "🏦",
  school: "🏫",
  housing: "🔑",
};

export default function GoalSelector({ selectedGoal, onSelect }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-1">
        Step 01
      </p>
      <h2 className="font-display text-xl font-semibold text-ink mb-4">
        What is the client trying to accomplish?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((goal) => {
          const isSelected = selectedGoal === goal.id;
          return (
            <button
              key={goal.id}
              disabled={!goal.available}
              onClick={() => goal.available && onSelect(goal.id)}
              className={`relative text-left px-4 py-3.5 rounded-md border transition-all
                ${
                  isSelected
                    ? "border-ink bg-ink text-white shadow-md"
                    : goal.available
                    ? "border-rule bg-white hover:border-gold hover:shadow-sm"
                    : "border-rule/60 bg-paper text-ink-soft/50 cursor-not-allowed"
                }`}
            >
              {isSelected && (
                <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1 bg-gold text-ink text-[10px] font-mono font-semibold tracking-wide px-1.5 py-0.5 rounded-sm uppercase">
                  Active
                </span>
              )}
              <div className="flex items-center gap-2.5">
                <span className="text-lg opacity-80" aria-hidden="true">
                  {ICONS[goal.id]}
                </span>
                <div>
                  <div className="font-medium text-sm">{goal.label}</div>
                  {!goal.available && (
                    <div className="text-[11px] mt-0.5 italic font-mono">
                      Coming soon
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
