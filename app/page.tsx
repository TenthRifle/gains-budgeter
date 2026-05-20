"use client";

import { useMemo, useState } from "react";

const INCOME_RANGES = ["R4k-R10k", "R10k-R15k", "R15k-R30k"] as const;
const LIVING_CONDITIONS = ["Township", "Town", "City"] as const;
const DEPENDANTS = [1, 2, 3, 4, "5+"] as const;

type IncomeRange = (typeof INCOME_RANGES)[number];
type LivingCondition = (typeof LIVING_CONDITIONS)[number];
type Dependants = (typeof DEPENDANTS)[number];
type Step = 1 | 2 | 3 | 4;

type BudgetResult = {
  food_pct: number;
  housing_pct: number;
  transport_pct: number;
  advice: string[];
};

const conditionDetails: Record<LivingCondition, string> = {
  Township: "Plan around local shops, shared transport, and home upgrades that improve daily comfort.",
  Town: "Balance lower distances with steady household costs and regular essentials.",
  City: "Watch transport, rent, and convenience spending because costs can climb quickly.",
};

const budgetRows = [
  { key: "food_pct", label: "Food", color: "#9be67c" },
  { key: "housing_pct", label: "Housing & living", color: "#ffffff" },
  { key: "transport_pct", label: "Transport", color: "#5bc0eb" },
] as const;

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [income, setIncome] = useState<IncomeRange | null>(null);
  const [dependants, setDependants] = useState<Dependants | null>(null);
  const [livingCondition, setLivingCondition] = useState<LivingCondition | null>(null);
  const [budget, setBudget] = useState<BudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const progressStep = useMemo(() => Math.min(step, 3), [step]);

  async function requestBudget(condition: LivingCondition) {
    if (!income || !dependants) {
      return;
    }

    setLivingCondition(condition);
    setError(null);
    setBudget(null);
    setIsLoading(true);
    setStep(4);

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          income,
          dependants,
          living_condition: condition,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while creating your budget.");
      }

      setBudget(data);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong while creating your budget.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function startOver() {
    setStep(1);
    setIncome(null);
    setDependants(null);
    setLivingCondition(null);
    setBudget(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <section className="brand-panel" aria-label="gAIns overview">
          <div>
            <div className="brand-mark">
              <span className="brand-icon">R</span>
              <span>gAIns</span>
            </div>
            <div className="brand-copy">
              <h1>Build a monthly plan that fits real life.</h1>
              <p>
                Choose your income, household support, and living situation to get a
                clear budget split with practical next steps.
              </p>
            </div>
          </div>

          <div className="selected-summary" aria-label="Selected answers">
            <div className="summary-item">
              <span>Income</span>
              <strong>{income || "Not chosen"}</strong>
            </div>
            <div className="summary-item">
              <span>Dependants</span>
              <strong>{dependants || "Not chosen"}</strong>
            </div>
            <div className="summary-item">
              <span>Living condition</span>
              <strong>{livingCondition || "Not chosen"}</strong>
            </div>
          </div>
        </section>

        <section className="flow-panel" aria-label="Budget planner">
          <Progress current={progressStep} />
          {step === 1 && (
            <StepOne
              onSelect={(range) => {
                setIncome(range);
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <StepTwo
              onBack={() => setStep(1)}
              onSelect={(count) => {
                setDependants(count);
                setStep(3);
              }}
            />
          )}
          {step === 3 && <StepThree onBack={() => setStep(2)} onSelect={requestBudget} />}
          {step === 4 && (
            <>
              {isLoading && <LoadingState />}
              {!isLoading && budget && (
                <OutputScreen
                  budget={budget}
                  income={income}
                  dependants={dependants}
                  livingCondition={livingCondition}
                  onStartOver={startOver}
                />
              )}
              {!isLoading && error && (
                <div className="step">
                  <p className="eyebrow">Something needs attention</p>
                  <h2>We could not create the budget yet.</h2>
                  <p className="step-intro">
                    Your choices are saved. Fix the issue below and try again.
                  </p>
                  <div className="error-box">{error}</div>
                  <div className="back-row">
                    <button className="secondary-button" type="button" onClick={() => setStep(3)}>
                      Back
                    </button>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => livingCondition && requestBudget(livingCondition)}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Progress({ current }: { current: number }) {
  return (
    <div className="progress" aria-label={`Step ${current} of 3`}>
      {[1, 2, 3].map((item) => (
        <span className={item <= current ? "active" : ""} key={item} />
      ))}
    </div>
  );
}

function StepOne({ onSelect }: { onSelect: (income: IncomeRange) => void }) {
  return (
    <div className="step">
      <p className="eyebrow">Step 1 of 3</p>
      <h2>How much do you earn each month?</h2>
      <p className="step-intro">Choose the range closest to your monthly income.</p>
      <div className="button-grid">
        {INCOME_RANGES.map((range) => (
          <button className="select-button" key={range} type="button" onClick={() => onSelect(range)}>
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepTwo({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (dependants: Dependants) => void;
}) {
  return (
    <div className="step">
      <p className="eyebrow">Step 2 of 3</p>
      <h2>How many people do you support financially?</h2>
      <p className="step-intro">Include people who rely on your income for food, transport, or bills.</p>
      <div className="dependant-grid">
        {DEPENDANTS.map((count) => (
          <button
            className="dependant-button"
            key={count}
            type="button"
            onClick={() => onSelect(count)}
          >
            {count}
          </button>
        ))}
      </div>
      <div className="back-row">
        <button className="secondary-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}

function StepThree({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (condition: LivingCondition) => void;
}) {
  return (
    <div className="step">
      <p className="eyebrow">Step 3 of 3</p>
      <h2>Where do you live?</h2>
      <p className="step-intro">Pick the living condition that best matches your everyday costs.</p>
      <div className="condition-grid">
        {LIVING_CONDITIONS.map((condition) => (
          <button
            className="condition-card"
            key={condition}
            type="button"
            onClick={() => onSelect(condition)}
          >
            <strong>{condition}</strong>
            <span>{conditionDetails[condition]}</span>
          </button>
        ))}
      </div>
      <div className="back-row">
        <button className="secondary-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div>
        <div className="loading-ring" />
        <p className="eyebrow">Building budget</p>
        <h2>Your plan is being prepared.</h2>
        <p className="step-intro">The advice is being tailored to your household choices.</p>
      </div>
    </div>
  );
}

const INCOME_BOUNDS: Record<IncomeRange, [number, number]> = {
  "R4k-R10k": [4000, 10000],
  "R10k-R15k": [10000, 15000],
  "R15k-R30k": [15000, 30000],
};

function formatRand(amount: number) {
  return `R${Math.round(amount).toLocaleString("en-ZA")}`;
}

function OutputScreen({
  budget,
  income,
  dependants,
  livingCondition,
  onStartOver,
}: {
  budget: BudgetResult;
  income: IncomeRange | null;
  dependants: Dependants | null;
  livingCondition: LivingCondition | null;
  onStartOver: () => void;
}) {
  return (
    <div className="output">
      <p className="eyebrow">Your gAIns budget</p>
      <h2>{income} monthly plan</h2>
      <p className="output-intro">
        Built for {dependants} dependant{dependants === 1 ? "" : "s"} in a{" "}
        {livingCondition?.toLowerCase()} setting.
      </p>
      <BudgetBreakdown budget={budget} income={income} />
      <AdviceCards advice={budget.advice} />
      <div className="back-row">
        <button className="primary-button" type="button" onClick={onStartOver}>
          Start over
        </button>
      </div>
    </div>
  );
}

function BudgetBreakdown({ budget, income }: { budget: BudgetResult; income: IncomeRange | null }) {
  const bounds = income ? INCOME_BOUNDS[income] : null;

  return (
    <section aria-label="Budget breakdown">
      <div className="budget-list">
        {budgetRows.map((row) => {
          const pct = budget[row.key];
          const randRange = bounds
            ? `${formatRand((bounds[0] * pct) / 100)} – ${formatRand((bounds[1] * pct) / 100)}`
            : null;
          return (
            <div className="budget-row" key={row.key}>
              <div className="budget-label">
                <span>{row.label}</span>
                <span className="budget-label-right">
                  {randRange && <span className="rand-range">{randRange}</span>}
                  <span>{pct}%</span>
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: row.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AdviceCards({ advice }: { advice: string[] }) {
  return (
    <section aria-label="Personalised advice">
      <p className="eyebrow">Advice</p>
      <div className="advice-grid">
        {advice.map((tip, index) => (
          <div className="advice-card" key={`${tip}-${index}`}>
            {tip}
          </div>
        ))}
      </div>
    </section>
  );
}
