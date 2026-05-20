const INCOME_RANGES = ["R4k-R10k", "R10k-R15k", "R15k-R30k"] as const;
const LIVING_CONDITIONS = ["Township", "Town", "City"] as const;
const DEPENDANTS = [1, 2, 3, 4, "5+"] as const;

type IncomeRange = (typeof INCOME_RANGES)[number];
type LivingCondition = (typeof LIVING_CONDITIONS)[number];
type Dependants = (typeof DEPENDANTS)[number];

export type BudgetEntry = {
  food_pct: number;
  housing_pct: number;
  transport_pct: number;
  advice: [string, string, string];
};

// Base food % per income × location. Transport is fixed per location.
// Each additional dependant shifts +3% from housing to food.
const BASE_FOOD: Record<IncomeRange, Record<LivingCondition, number>> = {
  "R4k-R10k":  { Township: 38, Town: 36, City: 33 },
  "R10k-R15k": { Township: 33, Town: 31, City: 28 },
  "R15k-R30k": { Township: 28, Town: 26, City: 23 },
};

const BASE_TRANSPORT: Record<LivingCondition, number> = {
  Township: 20,
  Town: 21,
  City: 24,
};

const DEPENDANT_SHIFT: Record<string, number> = {
  "1": 0, "2": 3, "3": 6, "4": 9, "5+": 12,
};

type AdviceEntry = {
  small: string; // dep 1–3
  large: string; // dep 4–5+
  tip2: string;
  tip3: string;
};

const ADVICE: Record<IncomeRange, Record<LivingCondition, AdviceEntry>> = {
  "R4k-R10k": {
    Township: {
      small: "Use local spaza shops and fresh produce markets — they cost 10–15% less than supermarkets for basics.",
      large: "Buy in bulk from a local wholesaler or food co-op — feeding 4 or more people makes bulk pricing essential.",
      tip2: "Put R200–R500 aside monthly toward one home improvement — better security or roofing adds real long-term value.",
      tip3: "Pursue better-paying work or SETA-funded training — even R500 extra per month changes this budget significantly.",
    },
    Town: {
      small: "Cook in bulk at the start of the week and freeze portions to keep daily food spending on track.",
      large: "Plan a weekly meal roster for the household and shop from a single list — unplanned grocery trips add 20–30% to the food bill.",
      tip2: "Walk or carpool for short trips — saving R100–R200 on transport each month frees up money for food.",
      tip3: "Pursue a better-paying job or SETA-funded skill — even a modest income increase makes a measurable difference at this level.",
    },
    City: {
      small: "Avoid convenience stores and fast food — meal-prepping on Sundays keeps you within budget through the week.",
      large: "With a large household in a city, a weekly meal plan and single bulk shop saves R500–R800 compared to daily buying.",
      tip2: "Use minibus taxis over Uber for daily commutes — the difference can be R400–R800 per month in most cities.",
      tip3: "Your income is stretched in a city — actively seek better-paying work or a side skill you can monetise on weekends.",
    },
  },
  "R10k-R15k": {
    Township: {
      small: "Set aside R500/month into savings before spending — paying yourself first builds a cushion for unexpected costs.",
      large: "With 4 or more people to support, a monthly household budget meeting helps everyone track shared expenses.",
      tip2: "Invest in a home upgrade each quarter — insulation, a solar geyser, or better security pays back in lower bills and higher value.",
      tip3: "Use township wholesale networks or buying clubs for bulk goods — you can save R300–R500 monthly compared to retail.",
    },
    Town: {
      small: "Set up a debit order for R500–R1,000 into savings on payday — automate it so you never skip it.",
      large: "Split costs on shared household items — cleaning products, cooking oil, bulk grains — with a trusted neighbour or family member.",
      tip2: "Review your transport arrangement — a monthly bus or train ticket usually costs less than daily taxi fares.",
      tip3: "Plan meals weekly and shop from a written list — unplanned shopping adds 20–30% to grocery bills.",
    },
    City: {
      small: "City rent is your biggest cost — sharing a space or moving slightly further from the CBD can free up R1,000–R1,500 monthly.",
      large: "With a larger household, tracking each spending category weekly prevents overspend — a simple spreadsheet or free app is enough.",
      tip2: "Use public transit or a monthly travel card for daily commuting instead of Uber — savings of R800–R1,200 per month are realistic.",
      tip3: "Budget for one irregular expense monthly (car service, school costs, appliance repair) — city life without a cushion is expensive.",
    },
  },
  "R15k-R30k": {
    Township: {
      small: "Open a tax-free savings account (TFSA) and automate R1,000/month — compound growth over 10 years makes a major difference.",
      large: "With a large household, write down all fixed costs at the start of each month before any flexible spending begins.",
      tip2: "Upgrade one significant home feature per quarter — security, roofing, or energy efficiency pays back in comfort and asset value.",
      tip3: "Use your buying power to purchase staples in bulk locally — you can save R400–R700/month versus buying small quantities.",
    },
    Town: {
      small: "Automate R1,500–R2,500/month into a TFSA — at this income, consistent saving builds real wealth over time.",
      large: "A household budget reviewed monthly keeps lifestyle creep in check — at this income level, small habitual spends add up fast.",
      tip2: "Resist lifestyle inflation — keeping non-essential spending below 10% of income is the difference between saving and not.",
      tip3: "Review insurance, data, and subscription contracts annually — most South Africans overpay by R300–R600/month on these.",
    },
    City: {
      small: "Negotiate your rent or consider a slightly cheaper suburb — saving R1,500 on housing compounds faster than any other change.",
      large: "Track spending weekly — lifestyle creep across a large household (takeaways, subscriptions, school extras) is the main budget risk at this income.",
      tip2: "A budgeting app that categorises spending automatically shows where money leaks — most people overspend on food and transport without realising.",
      tip3: "Invest the gap between what you earn and what you spend — a retirement annuity or TFSA makes more long-term difference than any salary increase.",
    },
  },
};

export function lookupBudget(
  income: IncomeRange,
  dependants: Dependants,
  condition: LivingCondition,
): BudgetEntry {
  const transport = BASE_TRANSPORT[condition];
  const shift = DEPENDANT_SHIFT[String(dependants)];
  const food = BASE_FOOD[income][condition] + shift;
  const housing = 100 - transport - food;

  const entry = ADVICE[income][condition];
  const isLarge = dependants === 4 || dependants === "5+";

  return {
    food_pct: food,
    housing_pct: housing,
    transport_pct: transport,
    advice: [isLarge ? entry.large : entry.small, entry.tip2, entry.tip3],
  };
}
