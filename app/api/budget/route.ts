import OpenAI from "openai";
import { NextResponse } from "next/server";

const INCOME_RANGES = ["R4k-R10k", "R10k-R15k", "R15k-R30k"] as const;
const LIVING_CONDITIONS = ["Township", "Town", "City"] as const;
const DEPENDANTS = [1, 2, 3, 4, "5+"] as const;

type IncomeRange = (typeof INCOME_RANGES)[number];
type LivingCondition = (typeof LIVING_CONDITIONS)[number];
type Dependants = (typeof DEPENDANTS)[number];

type BudgetRequest = {
  income: IncomeRange;
  dependants: Dependants;
  living_condition: LivingCondition;
};

type BudgetResponse = {
  food_pct: number;
  housing_pct: number;
  transport_pct: number;
  advice: string[];
};

type ModelBudgetResponse = BudgetResponse & {
  savings_pct: number;
};

const modelBudgetSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    food_pct: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    housing_pct: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    transport_pct: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    savings_pct: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    advice: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "string",
      },
    },
  },
  required: ["food_pct", "housing_pct", "transport_pct", "savings_pct", "advice"],
} as const;

function isBudgetRequest(value: unknown): value is BudgetRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    INCOME_RANGES.includes(body.income as IncomeRange) &&
    DEPENDANTS.includes(body.dependants as Dependants) &&
    LIVING_CONDITIONS.includes(body.living_condition as LivingCondition)
  );
}

function isBudgetResponse(value: unknown): value is BudgetResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const budget = value as BudgetResponse;
  const percentages = [
    budget.food_pct,
    budget.housing_pct,
    budget.transport_pct,
  ];
  const total = percentages.reduce((sum, pct) => sum + pct, 0);

  return (
    percentages.every((pct) => typeof pct === "number" && pct >= 0 && pct <= 100) &&
    Math.round(total) === 100 &&
    Array.isArray(budget.advice) &&
    budget.advice.length === 3 &&
    budget.advice.every((tip) => typeof tip === "string" && tip.trim().length > 0)
  );
}

function normaliseBudgetResponse(value: unknown, income: IncomeRange): BudgetResponse | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const budget = value as ModelBudgetResponse;
  const percentages = [
    Number(budget.food_pct),
    Number(budget.housing_pct),
    Number(budget.transport_pct),
    Number(budget.savings_pct),
  ];

  if (
    percentages.some((pct) => !Number.isFinite(pct) || pct < 0 || pct > 100) ||
    !Array.isArray(budget.advice) ||
    budget.advice.length !== 3 ||
    budget.advice.some((tip) => typeof tip !== "string" || tip.trim().length === 0)
  ) {
    return null;
  }

  const rounded = percentages.map((pct) => Math.round(pct));
  const total = rounded.reduce((sum, pct) => sum + pct, 0);
  rounded[1] += 100 - total;

  const lowIncomeFoodShift = income === "R4k-R10k" ? Math.min(5, rounded[1]) : 0;

  const normalised = {
    food_pct: rounded[0] + rounded[3] + lowIncomeFoodShift,
    housing_pct: rounded[1] - lowIncomeFoodShift,
    transport_pct: rounded[2],
    advice: budget.advice.map((tip) => tip.trim()),
  };

  return isBudgetResponse(normalised) ? normalised : null;
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
      {
        error:
          "Choose a supported income range, dependant count, and living condition before requesting a budget.",
      },
      { status: 400 },
    );
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!openRouterApiKey) {
    return NextResponse.json(
      {
        error:
          "OpenRouter is not configured yet. Add OPENROUTER_API_KEY to .env.local, then restart the dev server.",
      },
      { status: 500 },
    );
  }

  if (!openRouterApiKey.startsWith("sk-or-")) {
    return NextResponse.json(
      {
        error:
          "The key in OPENROUTER_API_KEY does not look like an OpenRouter key. It should start with sk-or-.",
      },
      { status: 500 },
    );
  }

  const client = new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      Authorization: `Bearer ${openRouterApiKey}`,
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://127.0.0.1:3000",
      "X-Title": "gAIns",
    },
  });

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a practical South African budgeting assistant for lower-LSM households. Return realistic monthly percentage allocations only. Keep advice direct, respectful, and action-focused. Do not provide investment, credit, or legal advice. For low-income South African households, food can reasonably take a larger share of the budget because Stats SA has reported poor households spending about a third of expenditure on food, and South African transport research commonly places transport near the mid-teens. When the user is in the R4k-R10k income range, one of the three advice strings must explicitly say they should work toward better income through a better-paying job, training, a practical skill, or safe extra work.",
        },
        {
          role: "user",
          content: `Create a monthly draft budget for income ${body.income}, ${body.dependants} people financially supported, and living condition ${body.living_condition}. The four draft percentages must add to exactly 100. Keep savings_pct low because the app will reallocate savings into food for this audience. Return exactly 3 advice strings. For Township users, include advice to spend less on food where possible, put more focus on improving living conditions, and use township-specific cost-saving ideas. If income is R4k-R10k, one advice string must include the words "better-paying job" or "better income".`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "budget_breakdown",
          strict: true,
          schema: modelBudgetSchema,
        },
      },
    });

    const content = completion.choices[0]?.message?.content;
    const parsed = content ? JSON.parse(content) : null;
    const budget = normaliseBudgetResponse(parsed, body.income);

    if (!budget) {
      return NextResponse.json(
        {
          error:
            "The budget advice came back in an unexpected format. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Budget API error", error);

    return NextResponse.json(
      {
        error:
          "We could not create your budget right now. Check your OpenRouter setup and try again.",
      },
      { status: 500 },
    );
  }
}
