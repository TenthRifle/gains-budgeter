export type Lang = "en" | "zu" | "af";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zu", label: "isiZulu" },
  { code: "af", label: "Afrikaans" },
];

export type Translations = {
  brandTagline: string;
  brandDesc: string;
  summaryIncome: string;
  summaryDependants: string;
  summaryLiving: string;
  notChosen: string;
  step1Label: string;
  step1Title: string;
  step1Intro: string;
  step2Label: string;
  step2Title: string;
  step2Intro: string;
  step3Label: string;
  step3Title: string;
  step3Intro: string;
  conditionDescTownship: string;
  conditionDescTown: string;
  conditionDescCity: string;
  loadingEyebrow: string;
  loadingTitle: string;
  loadingIntro: string;
  outputEyebrow: string;
  monthlyPlan: string;
  builtFor: string;
  dependantSingular: string;
  dependantPlural: string;
  inA: string;
  settingWord: string;
  foodLabel: string;
  housingLabel: string;
  transportLabel: string;
  adviceEyebrow: string;
  backButton: string;
  startOverButton: string;
  errorEyebrow: string;
  errorTitle: string;
  errorIntro: string;
  tryAgainButton: string;
  affordTitle: string;
  affordIncomeLabel: string;
  affordIncomePlaceholder: string;
  affordPurchaseLabel: string;
  affordPurchasePlaceholder: string;
  affordCategoryLabel: string;
  affordYes: string;
  affordTight: string;
  affordNo: string;
  affordBudgetIs: string;
  affordPerMonth: string;
  affordLeftAfter: string;
  affordOverBy: string;
  affordTightNote: string;
  trackerTitle: string;
  trackerIncomeLabel: string;
  trackerIncomePlaceholder: string;
  trackerSpentLabel: string;
  trackerBudgeted: string;
  trackerPlaceholder: string;
  trackerOver: string;
  trackerUnder: string;
  trackerOnBudget: string;
  trackerSummaryOver: string;
  trackerSummaryUnder: string;
  trackerSummaryExact: string;
};

export const TRANSLATIONS: Record<Lang, Translations> = {
  en: {
    brandTagline: "Build a monthly plan that fits real life.",
    brandDesc: "Choose your income, household support, and living situation to get a clear budget split with practical next steps.",
    summaryIncome: "Income",
    summaryDependants: "Dependants",
    summaryLiving: "Living condition",
    notChosen: "Not chosen",
    step1Label: "Step 1 of 3",
    step1Title: "How much do you earn each month?",
    step1Intro: "Choose the range closest to your monthly income.",
    step2Label: "Step 2 of 3",
    step2Title: "How many people do you support financially?",
    step2Intro: "Include people who rely on your income for food, transport, or bills.",
    step3Label: "Step 3 of 3",
    step3Title: "Where do you live?",
    step3Intro: "Pick the living condition that best matches your everyday costs.",
    conditionDescTownship: "Plan around local shops, shared transport, and home upgrades that improve daily comfort.",
    conditionDescTown: "Balance lower distances with steady household costs and regular essentials.",
    conditionDescCity: "Watch transport, rent, and convenience spending because costs can climb quickly.",
    loadingEyebrow: "Building budget",
    loadingTitle: "Your plan is being prepared.",
    loadingIntro: "The advice is being tailored to your household choices.",
    outputEyebrow: "Your gAIns budget",
    monthlyPlan: "monthly plan",
    builtFor: "Built for",
    dependantSingular: "dependant",
    dependantPlural: "dependants",
    inA: "in a",
    settingWord: "setting",
    foodLabel: "Food",
    housingLabel: "Housing & living",
    transportLabel: "Transport",
    adviceEyebrow: "Advice",
    backButton: "Back",
    startOverButton: "Start over",
    errorEyebrow: "Something needs attention",
    errorTitle: "We could not create the budget yet.",
    errorIntro: "Your choices are saved. Fix the issue below and try again.",
    tryAgainButton: "Try again",
    affordTitle: "Can I afford this?",
    affordIncomeLabel: "Your take-home this month (R)",
    affordIncomePlaceholder: "e.g. 7 500",
    affordPurchaseLabel: "How much does it cost? (R)",
    affordPurchasePlaceholder: "e.g. 850",
    affordCategoryLabel: "Which budget does this come from?",
    affordYes: "Yes — you can afford this.",
    affordTight: "Tight — this nearly maxes your budget.",
    affordNo: "No — this is over budget.",
    affordBudgetIs: "Your",
    affordPerMonth: "budget is",
    affordLeftAfter: "You'll have",
    affordOverBy: "This is",
    affordTightNote: "Consider cutting other spending in this category.",
    trackerTitle: "Month-end tracker",
    trackerIncomeLabel: "Your income this month (R)",
    trackerIncomePlaceholder: "e.g. 7 500",
    trackerSpentLabel: "What did you actually spend?",
    trackerBudgeted: "Budget",
    trackerPlaceholder: "e.g. 1 200",
    trackerOver: "Overspent",
    trackerUnder: "Saved",
    trackerOnBudget: "On budget",
    trackerSummaryOver: "You overspent by",
    trackerSummaryUnder: "You came in under budget by",
    trackerSummaryExact: "You hit your budget exactly. Well done.",
  },
  zu: {
    brandTagline: "Yakha uhlelo lwenyanga olufanele impilo yangempela.",
    brandDesc: "Khetha umholo wakho, abantu okubasekela, nezimo zokuhlala ukuze uthole ukwahlulwa kwesabelomali nezinyathelo ezizolandelwa.",
    summaryIncome: "Umholo",
    summaryDependants: "Abancikela",
    summaryLiving: "Isimo sokuhlala",
    notChosen: "Akukhethwanga",
    step1Label: "Isinyathelo 1 kuka-3",
    step1Title: "Umholo wakho wanyanga zonke ungakanani?",
    step1Intro: "Khetha ibanga elisondele kakhulu emholweni wakho wanyanga zonke.",
    step2Label: "Isinyathelo 2 kuka-3",
    step2Title: "Bangaki abantu osekela ngemali?",
    step2Intro: "Faka abantu abathembela emholweni wakho ukuze bathole ukudla, izokuthutha, noma amabhili.",
    step3Label: "Isinyathelo 3 kuka-3",
    step3Title: "Uhlala kuphi?",
    step3Intro: "Khetha isimo sokuhlala esifanele kakhulu izindleko zakho zansuku zonke.",
    conditionDescTownship: "Hlela ngezitolo zendawo, izinto zokuhamba ezibiyelwayo, nezinguquko zasekhaya ezithuthukisa inhlalakahle yansuku zonke.",
    conditionDescTown: "Lungisa ibanga elifishane nezindleko zekhaya ezihlala zikhona nezinto ezibalulekile.",
    conditionDescCity: "Qaphela izindleko zokuhamba, irenthi, nezinto ezikhishwa kalula ngoba izindleko zinganqamuka ngokushesha.",
    loadingEyebrow: "Sakhiwa isabelomali",
    loadingTitle: "Uhlelo lwakho lulungiswa.",
    loadingIntro: "Izeluleko zilungiswa ngezinqumo zakho zomndeni.",
    outputEyebrow: "Isabelomali sakho se-gAIns",
    monthlyPlan: "uhlelo lwanyanga zonke",
    builtFor: "Lwakhiwe ku-",
    dependantSingular: "oncikela",
    dependantPlural: "abancikela",
    inA: "e-",
    settingWord: "",
    foodLabel: "Ukudla",
    housingLabel: "Indlu nezinto zokuhlala",
    transportLabel: "Izokuthutha",
    adviceEyebrow: "Izeluleko",
    backButton: "Emuva",
    startOverButton: "Qala kabusha",
    errorEyebrow: "Kukhona okudingeka ukunakwa",
    errorTitle: "Asikwazanga ukwakha isabelomali.",
    errorIntro: "Izinqumo zakho zikhona. Lungisa inkinga engezansi bese uzama futhi.",
    tryAgainButton: "Zama futhi",
    affordTitle: "Ngingakwekhetha lokhu?",
    affordIncomeLabel: "Umholo wakho wale nyanga (R)",
    affordIncomePlaceholder: "isib. 7 500",
    affordPurchaseLabel: "Kubiza malini? (R)",
    affordPurchasePlaceholder: "isib. 850",
    affordCategoryLabel: "Ivela kuluphi uhlobo lwesabelomali?",
    affordYes: "Yebo — ungazikhulula lokhu.",
    affordTight: "Kuncane — lokhu kumthombo wakho ucishe ugcwale.",
    affordNo: "Cha — lokhu ngaphezulu kwesabelomali.",
    affordBudgetIs: "Isabelomali sakho",
    affordPerMonth: "sinyanga zonke",
    affordLeftAfter: "Uzosala no-",
    affordOverBy: "Lokhu kudlula nge-",
    affordTightNote: "Cabanga ukunciphisa ezinye izindleko kule ngxenye.",
    trackerTitle: "Ukulandelela ekupheleni kwenyanga",
    trackerIncomeLabel: "Umholo wakho wale nyanga (R)",
    trackerIncomePlaceholder: "isib. 7 500",
    trackerSpentLabel: "Wachitha malini ngempela?",
    trackerBudgeted: "Isabelomali",
    trackerPlaceholder: "isib. 1 200",
    trackerOver: "Wachitha ngokweqile",
    trackerUnder: "Wasindisa",
    trackerOnBudget: "Usesibelomanini",
    trackerSummaryOver: "Wachitha ngokweqile nge-",
    trackerSummaryUnder: "Wangaphansi kwesabelomali nge-",
    trackerSummaryExact: "Wafinyelela isabelomali sakho ngqo. Akekho!",
  },
  af: {
    brandTagline: "'n Maandelikse plan wat pas by die werklike lewe.",
    brandDesc: "Kies jou inkomste, huishoudelike ondersteuning en lewensituasie vir 'n duidelike begrotingsverdeling met praktiese stappe.",
    summaryIncome: "Inkomste",
    summaryDependants: "Afhanklikes",
    summaryLiving: "Lewensomstandighede",
    notChosen: "Nie gekies nie",
    step1Label: "Stap 1 van 3",
    step1Title: "Hoeveel verdien jy elke maand?",
    step1Intro: "Kies die reeks naaste aan jou maandelikse inkomste.",
    step2Label: "Stap 2 van 3",
    step2Title: "Hoeveel mense ondersteun jy finansieel?",
    step2Intro: "Sluit mense in wat op jou inkomste staatmaak vir kos, vervoer of rekeninge.",
    step3Label: "Stap 3 van 3",
    step3Title: "Waar woon jy?",
    step3Intro: "Kies die lewensomstandigheid wat die beste by jou alledaagse kostes pas.",
    conditionDescTownship: "Beplan rondom plaaslike winkels, gedeelde vervoer en huisverbeterings wat daaglikse gemak verbeter.",
    conditionDescTown: "Balanseer korter afstande met bestendige huishoudelike kostes en gereelde noodsaaklikhede.",
    conditionDescCity: "Let op vervoer, huur en geriefbesteding want kostes kan vinnig styg.",
    loadingEyebrow: "Begroting word gebou",
    loadingTitle: "Jou plan word voorberei.",
    loadingIntro: "Die raad word aangepas by jou huishoudelike keuses.",
    outputEyebrow: "Jou gAIns begroting",
    monthlyPlan: "maandelikse plan",
    builtFor: "Gebou vir",
    dependantSingular: "afhanklike",
    dependantPlural: "afhanklikes",
    inA: "in 'n",
    settingWord: "omgewing",
    foodLabel: "Kos",
    housingLabel: "Behuising en lewenskoste",
    transportLabel: "Vervoer",
    adviceEyebrow: "Raad",
    backButton: "Terug",
    startOverButton: "Begin oor",
    errorEyebrow: "Iets benodig aandag",
    errorTitle: "Ons kon nie die begroting skep nie.",
    errorIntro: "Jou keuses is gestoor. Stel die probleem hieronder reg en probeer weer.",
    tryAgainButton: "Probeer weer",
    affordTitle: "Kan ek dit bekostig?",
    affordIncomeLabel: "Jou netto inkomste hierdie maand (R)",
    affordIncomePlaceholder: "bv. 7 500",
    affordPurchaseLabel: "Hoeveel kos dit? (R)",
    affordPurchasePlaceholder: "bv. 850",
    affordCategoryLabel: "Uit watter begrotingskategorie kom dit?",
    affordYes: "Ja — jy kan dit bekostig.",
    affordTight: "Krap — dit gebruik byna jou hele begroting.",
    affordNo: "Nee — dit is bo begroting.",
    affordBudgetIs: "Jou",
    affordPerMonth: "begroting is",
    affordLeftAfter: "Jy sal",
    affordOverBy: "Dit is",
    affordTightNote: "Oorweeg om ander besteding in hierdie kategorie te sny.",
    trackerTitle: "Maandeinde-opsporing",
    trackerIncomeLabel: "Jou inkomste hierdie maand (R)",
    trackerIncomePlaceholder: "bv. 7 500",
    trackerSpentLabel: "Wat het jy werklik bestee?",
    trackerBudgeted: "Begroting",
    trackerPlaceholder: "bv. 1 200",
    trackerOver: "Oorbestee",
    trackerUnder: "Gespaar",
    trackerOnBudget: "Op begroting",
    trackerSummaryOver: "Jy het die begroting met",
    trackerSummaryUnder: "Jy het die begroting met",
    trackerSummaryExact: "Jy het jou begroting presies getref. Goed gedaan.",
  },
};
