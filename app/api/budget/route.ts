import { NextResponse } from "next/server";
import { lookupBudget } from "./table";
import type { Lang } from "../../i18n";

const INCOME_RANGES = ["R4k-R10k", "R10k-R15k", "R15k-R30k"] as const;
const LIVING_CONDITIONS = ["Township", "Town", "City"] as const;
const DEPENDANTS = [1, 2, 3, 4, "5+"] as const;
const LANGS: Lang[] = ["en", "zu", "af"];

type IncomeRange = (typeof INCOME_RANGES)[number];
type LivingCondition = (typeof LIVING_CONDITIONS)[number];
type Dependants = (typeof DEPENDANTS)[number];

type BudgetRequest = {
  income: IncomeRange;
  dependants: Dependants;
  living_condition: LivingCondition;
  lang?: Lang;
};

function isBudgetRequest(value: unknown): value is BudgetRequest {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  return (
    INCOME_RANGES.includes(body.income as IncomeRange) &&
    DEPENDANTS.includes(body.dependants as Dependants) &&
    LIVING_CONDITIONS.includes(body.living_condition as LivingCondition)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send a valid budget request." }, { status: 400 });
  }

  if (!isBudgetRequest(body)) {
    return NextResponse.json(
      { error: "Choose a supported income range, dependant count, and living condition before requesting a budget." },
      { status: 400 },
    );
  }

  const lang: Lang = body.lang && LANGS.includes(body.lang) ? body.lang : "en";
  const budget = lookupBudget(body.income, body.dependants, body.living_condition, lang);
  return NextResponse.json(budget);
}
