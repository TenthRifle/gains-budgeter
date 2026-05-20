"use client";

import { useMemo, useState } from "react";
import { LANGUAGES, TRANSLATIONS, type Lang } from "./i18n";

const INCOME_RANGES = ["R4k-R10k", "R10k-R15k", "R15k-R30k"] as const;
const LIVING_CONDITIONS = ["Township", "Town", "City"] as const;
const DEPENDANTS = [1, 2, 3, 4, "5+"] as const;

type IncomeRange = (typeof INCOME_RANGES)[number];
type LivingCondition = (typeof LIVING_CONDITIONS)[number];
type Dependants = (typeof DEPENDANTS)[number];
type Step = 1 | 2 | 3 | 4;
type AffordCategory = "food_pct" | "housing_pct" | "transport_pct";

type BudgetResult = {
  food_pct: number;
  housing_pct: number;
  transport_pct: number;
  advice: string[];
};

const INCOME_BOUNDS: Record<IncomeRange, [number, number]> = {
  "R4k-R10k": [4000, 10000],
  "R10k-R15k": [10000, 15000],
  "R15k-R30k": [15000, 30000],
};

function formatRand(amount: number) {
  return `R${Math.round(amount).toLocaleString("en-ZA")}`;
}

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [income, setIncome] = useState<IncomeRange | null>(null);
  const [dependants, setDependants] = useState<Dependants | null>(null);
  const [livingCondition, setLivingCondition] = useState<LivingCondition | null>(null);
  const [budget, setBudget] = useState<BudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const t = TRANSLATIONS[lang];
  const progressStep = useMemo(() => Math.min(step, 3), [step]);

  const conditionDetails: Record<LivingCondition, string> = {
    Township: t.conditionDescTownship,
    Town: t.conditionDescTown,
    City: t.conditionDescCity,
  };

  const budgetRows = [
    { key: "food_pct" as const, label: t.foodLabel, color: "#9be67c" },
    { key: "housing_pct" as const, label: t.housingLabel, color: "#ffffff" },
    { key: "transport_pct" as const, label: t.transportLabel, color: "#5bc0eb" },
  ];

  async function requestBudget(condition: LivingCondition) {
    if (!income || !dependants) return;

    setLivingCondition(condition);
    setError(null);
    setBudget(null);
    setIsLoading(true);
    setStep(4);

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income, dependants, living_condition: condition, lang }),
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

  function buildOutputIntro(dep: Dependants | null, cond: LivingCondition | null) {
    if (!dep || !cond) return "";
    const depWord = dep === 1 ? t.dependantSingular : t.dependantPlural;
    if (lang === "zu") return `${t.builtFor}${dep} ${depWord} ${t.inA}${cond}.`;
    return `${t.builtFor} ${dep} ${depWord} ${t.inA} ${cond} ${t.settingWord}.`.replace(/\s+\.$/, ".");
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <section className="brand-panel" aria-label="gAIns overview">
          <div>
            <div className="brand-panel-top">
              <div className="brand-mark">
                <span className="brand-icon">R</span>
                <span>gAIns</span>
              </div>
              <div className="lang-toggle" role="group" aria-label="Language">
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    className={`lang-btn${lang === code ? " lang-btn--active" : ""}`}
                    type="button"
                    onClick={() => setLang(code)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="brand-copy">
              <h1>{t.brandTagline}</h1>
              <p>{t.brandDesc}</p>
            </div>
          </div>

          <div className="selected-summary" aria-label="Selected answers">
            <div className="summary-item">
              <span>{t.summaryIncome}</span>
              <strong>{income || t.notChosen}</strong>
            </div>
            <div className="summary-item">
              <span>{t.summaryDependants}</span>
              <strong>{dependants ?? t.notChosen}</strong>
            </div>
            <div className="summary-item">
              <span>{t.summaryLiving}</span>
              <strong>{livingCondition || t.notChosen}</strong>
            </div>
          </div>
        </section>

        <section className="flow-panel" aria-label="Budget planner">
          <Progress current={progressStep} />
          {step === 1 && (
            <StepOne
              t={t}
              onSelect={(range) => { setIncome(range); setStep(2); }}
            />
          )}
          {step === 2 && (
            <StepTwo
              t={t}
              onBack={() => setStep(1)}
              onSelect={(count) => { setDependants(count); setStep(3); }}
            />
          )}
          {step === 3 && (
            <StepThree
              t={t}
              conditionDetails={conditionDetails}
              onBack={() => setStep(2)}
              onSelect={requestBudget}
            />
          )}
          {step === 4 && (
            <>
              {isLoading && <LoadingState t={t} />}
              {!isLoading && budget && (
                <OutputScreen
                  t={t}
                  budget={budget}
                  income={income}
                  outputIntro={buildOutputIntro(dependants, livingCondition)}
                  budgetRows={budgetRows}
                  onStartOver={startOver}
                />
              )}
              {!isLoading && error && (
                <div className="step">
                  <p className="eyebrow">{t.errorEyebrow}</p>
                  <h2>{t.errorTitle}</h2>
                  <p className="step-intro">{t.errorIntro}</p>
                  <div className="error-box">{error}</div>
                  <div className="back-row">
                    <button className="secondary-button" type="button" onClick={() => setStep(3)}>
                      {t.backButton}
                    </button>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => livingCondition && requestBudget(livingCondition)}
                    >
                      {t.tryAgainButton}
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

function StepOne({
  t,
  onSelect,
}: {
  t: typeof TRANSLATIONS.en;
  onSelect: (income: IncomeRange) => void;
}) {
  return (
    <div className="step">
      <p className="eyebrow">{t.step1Label}</p>
      <h2>{t.step1Title}</h2>
      <p className="step-intro">{t.step1Intro}</p>
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
  t,
  onBack,
  onSelect,
}: {
  t: typeof TRANSLATIONS.en;
  onBack: () => void;
  onSelect: (dependants: Dependants) => void;
}) {
  return (
    <div className="step">
      <p className="eyebrow">{t.step2Label}</p>
      <h2>{t.step2Title}</h2>
      <p className="step-intro">{t.step2Intro}</p>
      <div className="dependant-grid">
        {DEPENDANTS.map((count) => (
          <button className="dependant-button" key={count} type="button" onClick={() => onSelect(count)}>
            {count}
          </button>
        ))}
      </div>
      <div className="back-row">
        <button className="secondary-button" type="button" onClick={onBack}>
          {t.backButton}
        </button>
      </div>
    </div>
  );
}

function StepThree({
  t,
  conditionDetails,
  onBack,
  onSelect,
}: {
  t: typeof TRANSLATIONS.en;
  conditionDetails: Record<LivingCondition, string>;
  onBack: () => void;
  onSelect: (condition: LivingCondition) => void;
}) {
  return (
    <div className="step">
      <p className="eyebrow">{t.step3Label}</p>
      <h2>{t.step3Title}</h2>
      <p className="step-intro">{t.step3Intro}</p>
      <div className="condition-grid">
        {LIVING_CONDITIONS.map((condition) => (
          <button className="condition-card" key={condition} type="button" onClick={() => onSelect(condition)}>
            <strong>{condition}</strong>
            <span>{conditionDetails[condition]}</span>
          </button>
        ))}
      </div>
      <div className="back-row">
        <button className="secondary-button" type="button" onClick={onBack}>
          {t.backButton}
        </button>
      </div>
    </div>
  );
}

function LoadingState({ t }: { t: typeof TRANSLATIONS.en }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div>
        <div className="loading-ring" />
        <p className="eyebrow">{t.loadingEyebrow}</p>
        <h2>{t.loadingTitle}</h2>
        <p className="step-intro">{t.loadingIntro}</p>
      </div>
    </div>
  );
}

function OutputScreen({
  t,
  budget,
  income,
  outputIntro,
  budgetRows,
  onStartOver,
}: {
  t: typeof TRANSLATIONS.en;
  budget: BudgetResult;
  income: IncomeRange | null;
  outputIntro: string;
  budgetRows: { key: keyof BudgetResult; label: string; color: string }[];
  onStartOver: () => void;
}) {
  return (
    <div className="output">
      <p className="eyebrow">{t.outputEyebrow}</p>
      <h2>{income} {t.monthlyPlan}</h2>
      <p className="output-intro">{outputIntro}</p>
      <BudgetBreakdown budget={budget} income={income} budgetRows={budgetRows} />
      <AdviceCards advice={budget.advice} eyebrow={t.adviceEyebrow} />
      <AffordabilityChecker t={t} budget={budget} budgetRows={budgetRows} />
      <MonthEndTracker t={t} budget={budget} budgetRows={budgetRows} />
      <div className="back-row">
        <button className="primary-button" type="button" onClick={onStartOver}>
          {t.startOverButton}
        </button>
      </div>
    </div>
  );
}

function BudgetBreakdown({
  budget,
  income,
  budgetRows,
}: {
  budget: BudgetResult;
  income: IncomeRange | null;
  budgetRows: { key: keyof BudgetResult; label: string; color: string }[];
}) {
  const bounds = income ? INCOME_BOUNDS[income] : null;

  return (
    <section aria-label="Budget breakdown">
      <div className="budget-list">
        {budgetRows.map((row) => {
          const pct = budget[row.key] as number;
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
                <div className="bar-fill" style={{ width: `${pct}%`, backgroundColor: row.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AdviceCards({ advice, eyebrow }: { advice: string[]; eyebrow: string }) {
  return (
    <section aria-label="Personalised advice">
      <p className="eyebrow">{eyebrow}</p>
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

function AffordabilityChecker({
  t,
  budget,
  budgetRows,
}: {
  t: typeof TRANSLATIONS.en;
  budget: BudgetResult;
  budgetRows: { key: keyof BudgetResult; label: string; color: string }[];
}) {
  const [actualIncome, setActualIncome] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [category, setCategory] = useState<AffordCategory | null>(null);

  const income = parseFloat(actualIncome.replace(/\s/g, ""));
  const purchase = parseFloat(purchaseAmount.replace(/\s/g, ""));
  const ready = income > 0 && purchase > 0 && category !== null;

  const result = useMemo(() => {
    if (!ready || !category) return null;
    const ceiling = (income * (budget[category] as number)) / 100;
    const ratio = purchase / ceiling;
    const difference = Math.abs(ceiling - purchase);
    const verdict: "yes" | "tight" | "no" =
      ratio <= 0.75 ? "yes" : ratio <= 1.0 ? "tight" : "no";
    return { verdict, ceiling, difference, ratio };
  }, [ready, income, purchase, category, budget]);

  const activeRow = category ? budgetRows.find((r) => r.key === category) : null;

  function renderResult() {
    if (!result || !activeRow) return null;
    const { verdict, ceiling, difference } = result;
    const label = activeRow.label.toLowerCase();
    const perMonth = `${formatRand(ceiling)}/month`;

    let cls = "afford-result ";
    let title = "";
    let detail = "";

    if (verdict === "yes") {
      cls += "afford-result--yes";
      title = t.affordYes;
      detail = `${t.affordBudgetIs} ${label} ${t.affordPerMonth} ${perMonth}. ${t.affordLeftAfter} ${formatRand(difference)} left.`;
    } else if (verdict === "tight") {
      cls += "afford-result--warn";
      title = t.affordTight;
      detail = `${t.affordBudgetIs} ${label} ${t.affordPerMonth} ${perMonth}. ${t.affordTightNote}`;
    } else {
      cls += "afford-result--no";
      title = t.affordNo;
      detail = `${t.affordBudgetIs} ${label} ${t.affordPerMonth} ${perMonth}. ${t.affordOverBy} ${formatRand(difference)} over.`;
    }

    return (
      <div className={cls}>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    );
  }

  return (
    <section className="afford-section" aria-label={t.affordTitle}>
      <p className="eyebrow">{t.affordTitle}</p>
      <div className="afford-inputs">
        <div className="afford-input-group">
          <label htmlFor="actual-income">{t.affordIncomeLabel}</label>
          <input
            id="actual-income"
            className="afford-input"
            type="number"
            min="0"
            placeholder={t.affordIncomePlaceholder}
            value={actualIncome}
            onChange={(e) => setActualIncome(e.target.value)}
          />
        </div>
        <div className="afford-input-group">
          <label htmlFor="purchase-amount">{t.affordPurchaseLabel}</label>
          <input
            id="purchase-amount"
            className="afford-input"
            type="number"
            min="0"
            placeholder={t.affordPurchasePlaceholder}
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
          />
        </div>
      </div>
      <p className="afford-cat-label">{t.affordCategoryLabel}</p>
      <div className="afford-cat-grid">
        {budgetRows.map((row) => (
          <button
            key={row.key}
            type="button"
            className={`afford-cat-btn${category === row.key ? " afford-cat-btn--active" : ""}`}
            style={category === row.key ? { borderColor: row.color, color: row.color } : {}}
            onClick={() => setCategory(row.key as AffordCategory)}
          >
            {row.label}
            <span className="afford-cat-pct">{budget[row.key as AffordCategory]}%</span>
          </button>
        ))}
      </div>
      {renderResult()}
    </section>
  );
}

function MonthEndTracker({
  t,
  budget,
  budgetRows,
}: {
  t: typeof TRANSLATIONS.en;
  budget: BudgetResult;
  budgetRows: { key: keyof BudgetResult; label: string; color: string }[];
}) {
  const [income, setIncome] = useState("");
  const [spent, setSpent] = useState<Record<string, string>>({});

  const parsedIncome = parseFloat(income.replace(/\s/g, ""));
  const hasIncome = parsedIncome > 0;

  const rows = budgetRows.map((row) => {
    const budgeted = hasIncome ? (parsedIncome * (budget[row.key] as number)) / 100 : null;
    const raw = spent[row.key] ?? "";
    const actual = raw === "" ? null : parseFloat(raw.replace(/\s/g, ""));
    const diff = budgeted !== null && actual !== null && !isNaN(actual) ? actual - budgeted : null;
    return { ...row, budgeted, actual, diff };
  });

  const filledRows = rows.filter((r) => r.diff !== null);
  const totalDiff = filledRows.length > 0
    ? filledRows.reduce((sum, r) => sum + (r.diff ?? 0), 0)
    : null;

  return (
    <section className="afford-section" aria-label={t.trackerTitle}>
      <p className="eyebrow">{t.trackerTitle}</p>
      <div className="afford-inputs">
        <div className="afford-input-group">
          <label htmlFor="tracker-income">{t.trackerIncomeLabel}</label>
          <input
            id="tracker-income"
            className="afford-input"
            type="number"
            min="0"
            placeholder={t.trackerIncomePlaceholder}
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
      </div>

      {hasIncome && (
        <>
          <p className="afford-cat-label">{t.trackerSpentLabel}</p>
          <div className="tracker-grid">
            {rows.map((row) => (
              <div key={row.key} className="tracker-row">
                <div className="tracker-cat">
                  <span className="tracker-dot" style={{ backgroundColor: row.color }} />
                  <span className="tracker-cat-name">{row.label}</span>
                  {row.budgeted !== null && (
                    <span className="tracker-budgeted">
                      {t.trackerBudgeted}: {formatRand(row.budgeted)}
                    </span>
                  )}
                </div>
                <div className="tracker-input-wrap">
                  <input
                    className="afford-input"
                    type="number"
                    min="0"
                    placeholder={t.trackerPlaceholder}
                    value={spent[row.key] ?? ""}
                    onChange={(e) =>
                      setSpent((prev) => ({ ...prev, [row.key]: e.target.value }))
                    }
                  />
                </div>
                {row.diff !== null && (
                  <div
                    className={`tracker-badge ${
                      row.diff > 0
                        ? "tracker-badge--over"
                        : row.diff < 0
                        ? "tracker-badge--under"
                        : "tracker-badge--even"
                    }`}
                  >
                    {row.diff > 0
                      ? `▲ ${formatRand(row.diff)}`
                      : row.diff < 0
                      ? `▼ ${formatRand(Math.abs(row.diff))}`
                      : "✓"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalDiff !== null && (
            <div
              className={`afford-result ${
                totalDiff > 0
                  ? "afford-result--no"
                  : totalDiff < 0
                  ? "afford-result--yes"
                  : "tracker-summary--exact"
              }`}
            >
              <strong>
                {totalDiff === 0
                  ? t.trackerSummaryExact
                  : totalDiff > 0
                  ? `${t.trackerSummaryOver} ${formatRand(totalDiff)} this month.`
                  : `${t.trackerSummaryUnder} ${formatRand(Math.abs(totalDiff))} this month.`}
              </strong>
            </div>
          )}
        </>
      )}
    </section>
  );
}
