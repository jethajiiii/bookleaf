import { PRODUCTION_STAGES } from '../../lib/constants.js';
import { parseProductionStage } from '../../lib/formatters.js';

/**
 * ProductionStepper displays the lifecycle progression of an in-production book.
 * Highlights the parsed current stage and indicates completed vs upcoming milestones.
 *
 * @param {Object} props
 * @param {string} [props.stage] Explicit stage name
 * @param {string} [props.status] Status string like "In Production - Cover Design"
 */
export function ProductionStepper({ stage, status }) {
  const currentStageName = stage || parseProductionStage(status);
  const activeIndex = PRODUCTION_STAGES.findIndex(
    (s) => s.toLowerCase() === (currentStageName || '').toLowerCase()
  );
  // Default to 0 if not found
  const currentIdx = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between text-xs font-medium text-charcoal-light mb-2">
        <span>Production Progress</span>
        <span className="text-terracotta font-semibold">
          Stage {currentIdx + 1} of {PRODUCTION_STAGES.length}: {PRODUCTION_STAGES[currentIdx]}
        </span>
      </div>

      <div className="relative flex items-center justify-between w-full overflow-x-auto py-2">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-card-border -translate-y-1/2 z-0" />

        {/* Progress track line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-terracotta -translate-y-1/2 transition-all duration-300 z-0"
          style={{
            width: `${(currentIdx / (PRODUCTION_STAGES.length - 1)) * 100}%`,
          }}
        />

        {/* Stepper items */}
        {PRODUCTION_STAGES.map((s, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={s}
              className="relative z-10 flex flex-col items-center group cursor-default min-w-[58px]"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                  isCurrent
                    ? 'bg-terracotta text-white ring-4 ring-terracotta-light shadow-sm scale-110'
                    : isCompleted
                      ? 'bg-sage text-white'
                      : 'bg-card border-2 border-card-border text-charcoal-muted'
                }`}
                title={s}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1.5 text-center leading-tight line-clamp-1 max-w-[64px] ${
                  isCurrent
                    ? 'text-terracotta font-semibold'
                    : isCompleted
                      ? 'text-charcoal font-medium'
                      : 'text-charcoal-muted'
                }`}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductionStepper;
