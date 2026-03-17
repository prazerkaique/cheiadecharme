"use client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProgressStepperProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
  labels: string[]; // e.g. ["Identificação", "Serviço", "Confirmação", "Concluído"]
}

// ---------------------------------------------------------------------------
// CheckmarkIcon — inline SVG, no external dependency
// ---------------------------------------------------------------------------

function CheckmarkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-white"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// StepCircle
// ---------------------------------------------------------------------------

type StepState = "completed" | "active" | "future";

interface StepCircleProps {
  state: StepState;
  stepNumber: number; // 1-indexed display number
}

function StepCircle({ state, stepNumber }: StepCircleProps) {
  const isFilledGradient = state === "completed" || state === "active";

  return (
    <div
      className={[
        "relative flex items-center justify-center shrink-0",
        "w-10 h-10 rounded-full",
        // Outline-only for future steps
        state === "future"
          ? "border-2 border-brand-border"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        isFilledGradient
          ? { background: "linear-gradient(135deg, #C2185B, #D94B8C)" }
          : undefined
      }
      aria-hidden="true"
    >
      {state === "completed" ? (
        <CheckmarkIcon />
      ) : (
        <span
          className={[
            "font-body font-semibold leading-none select-none",
            "text-[22px]",
            state === "active" ? "text-white" : "text-brand-text-muted",
          ].join(" ")}
        >
          {stepNumber}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConnectorLine — rendered between two step circles
// ---------------------------------------------------------------------------

interface ConnectorLineProps {
  completed: boolean;
}

function ConnectorLine({ completed }: ConnectorLineProps) {
  return (
    <div
      className="shrink-0 h-[3px] w-[60px] rounded-full"
      style={
        completed
          ? { background: "linear-gradient(to right, #C2185B, #D94B8C)" }
          : { background: "var(--color-brand-border)" }
      }
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// ProgressStepper
// ---------------------------------------------------------------------------

export default function ProgressStepper({
  currentStep,
  totalSteps,
  labels,
}: ProgressStepperProps) {
  const stepsCount = Math.min(totalSteps, labels.length);

  function getStepState(index: number): StepState {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "future";
  }

  return (
    <div
      className="flex flex-row items-start justify-center"
      role="list"
      aria-label="Progresso do atendimento"
    >
      {Array.from({ length: stepsCount }, (_, i) => {
        const state = getStepState(i);
        const label = labels[i] ?? `Passo ${i + 1}`;
        const isLast = i === stepsCount - 1;

        return (
          <div
            key={i}
            className="flex flex-row items-center"
            role="listitem"
            aria-current={state === "active" ? "step" : undefined}
          >
            {/* Step column: circle + label stacked vertically */}
            <div className="flex flex-col items-center gap-2">
              {/* Circle */}
              <StepCircle state={state} stepNumber={i + 1} />

              {/* Label */}
              <span
                className={[
                  "font-body text-[24px] leading-tight text-center whitespace-nowrap",
                  state === "active"
                    ? "text-primary font-semibold"
                    : state === "completed"
                    ? "text-brand-text-muted/70"
                    : "text-brand-border",
                ].join(" ")}
              >
                {label}
              </span>
            </div>

            {/* Connector line between circles, aligned vertically to center of circle */}
            {!isLast && (
              <div className="flex items-start pt-5">
                <ConnectorLine completed={i < currentStep} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
