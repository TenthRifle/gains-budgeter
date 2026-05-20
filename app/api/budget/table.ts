import type { Lang } from "../../i18n";

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

type T = Record<Lang, string>;

type AdviceEntry = {
  small: T;
  large: T;
  tip2: T;
  tip3: T;
};

const ADVICE: Record<IncomeRange, Record<LivingCondition, AdviceEntry>> = {
  "R4k-R10k": {
    Township: {
      small: {
        en: "Use local spaza shops and fresh produce markets — they cost 10–15% less than supermarkets for basics.",
        zu: "Sebenzisa izitolo zespaza zendawo nezimakethe zamathelo — zikhesha nge-10–15% ngaphansi kwezitolo ezinkulu izinto eziyisisekelo.",
        af: "Gebruik plaaslike spazawinkels en varsprodukte-markte — hulle is 10–15% goedkoper as supermarkte vir basiese kos.",
      },
      large: {
        en: "Buy in bulk from a local wholesaler or food co-op — feeding 4 or more people makes bulk pricing essential.",
        zu: "Thenga ngokwengeziwe kusomshophi wendawo — ukondla abantu abayi-4 nangaphezulu kwenza imimizo yezimakethe ibaluleke kakhulu.",
        af: "Koop in grootmaat by 'n plaaslike groothandelaar — om 4 of meer mense te voed maak grootmaatpryse noodsaaklik.",
      },
      tip2: {
        en: "Put R200–R500 aside monthly toward one home improvement — better security or roofing adds real long-term value.",
        zu: "Bekelela uR200–R500 inyanga zonke ukuze uthuthukise ikhaya — ukuphepha okuncanyana noma uphahla olusha kunezinzuzo zangempela.",
        af: "Sit R200–R500 opsy maandeliks vir een huisverbetering — beter sekuriteit of dakwerk voeg werklike langtermynwaarde toe.",
      },
      tip3: {
        en: "Pursue better-paying work or SETA-funded training — even R500 extra per month changes this budget significantly.",
        zu: "Funa umsebenzi okhokha kangcono noma uqeqeshwa okukhokhelwa yi-SETA — noma uR500 ngaphezulu inyanga zonke kuyashintsha isabelomali.",
        af: "Soek beter besoldigde werk of SETA-befondse opleiding — selfs R500 ekstra per maand verander hierdie begroting beduidend.",
      },
    },
    Town: {
      small: {
        en: "Cook in bulk at the start of the week and freeze portions to keep daily food spending on track.",
        zu: "Pheka kakhulu ekuqaleni kweviki bese ubeka izingxenye ezipholile ukuze ugcine izindleko zansuku zonke.",
        af: "Kook in grootmaat aan die begin van die week en vries porsies om daaglikse voedselbesteding op koers te hou.",
      },
      large: {
        en: "Plan a weekly meal roster for the household and shop from a single list — unplanned grocery trips add 20–30% to the food bill.",
        zu: "Hlela ukudlela kweviki yonke yomndeni futhi uthenga kuluhlu olulodwa — ukuthenga ngaphandle kohlelo kwengezelela i-20–30% esikhwameni sokudla.",
        af: "Beplan 'n weeklikse maaltydrooster vir die huishouding en koop van 'n enkele lys — ongeplande kruidenierstogte voeg 20–30% by die voedselrekening.",
      },
      tip2: {
        en: "Walk or carpool for short trips — saving R100–R200 on transport each month frees up money for food.",
        zu: "Hamba ngezinyawo noma wabelane ngezimoto ezindleleni ezimfushane — ukonga uR100–R200 ezinhambweni inyanga zonke kukhulula imali yokudla.",
        af: "Stap of deel 'n motor vir kort ritte — besparing van R100–R200 op vervoer elke maand bevry geld vir kos.",
      },
      tip3: {
        en: "Pursue a better-paying job or SETA-funded skill — even a modest income increase makes a measurable difference at this level.",
        zu: "Funa umsebenzi okhokha kangcono noma ikhono eliholwa yi-SETA — noma ukukhuphuka kwemali kancane kwenza umehluko omkhulu kuleli zinga.",
        af: "Soek 'n beter besoldigde werk of SETA-befondse vaardigheid — selfs 'n beskeie inkomsteverhoging maak 'n meetbare verskil op hierdie vlak.",
      },
    },
    City: {
      small: {
        en: "Avoid convenience stores and fast food — meal-prepping on Sundays keeps you within budget through the week.",
        zu: "Gwema izitolo ezikhululekile nezakudla okukhiqizwa masinyane — ukulungisa ukudla ngeSonto kukugcina ngaphansi kwesabelomali.",
        af: "Vermy geriefswinkels en kitskos — maaltydvoorbereiding op Sondae hou jou binne begroting deur die week.",
      },
      large: {
        en: "With a large household in a city, a weekly meal plan and single bulk shop saves R500–R800 compared to daily buying.",
        zu: "Nomndeni omkhulu edolobheni, uhlelo lokudla lweviki nokuthenga ngokwengeziwe kuyonga uR500–R800 uma kuqhathaniswa nokuthenga nsuku zonke.",
        af: "Met 'n groot huishouding in 'n stad spaar 'n weeklikse maaltydplan en enkele grootmaataankope R500–R800 vergeleke met daaglikse aankope.",
      },
      tip2: {
        en: "Use minibus taxis over Uber for daily commutes — the difference can be R400–R800 per month in most cities.",
        zu: "Sebenzisa amatekisi ngaphezu kwe-Uber ezinhambweni zansuku zonke — umehluko ungaba uR400–R800 inyanga zonke emadolobheni amaningi.",
        af: "Gebruik minibustaxis bo Uber vir daaglikse pendel — die verskil kan R400–R800 per maand wees in die meeste stede.",
      },
      tip3: {
        en: "Your income is stretched in a city — actively seek better-paying work or a side skill you can monetise on weekends.",
        zu: "Imali yakho icindezelekile edolobheni — funa ngokusebenzayo umsebenzi okhokha kangcono noma ikhono ongazenzelela ngalo ngamasonto.",
        af: "Jou inkomste is gerek in 'n stad — soek aktief beter besoldigde werk of 'n newevaardighede wat jy naweke kan benut.",
      },
    },
  },

  "R10k-R15k": {
    Township: {
      small: {
        en: "Set aside R500/month into savings before spending — paying yourself first builds a cushion for unexpected costs.",
        zu: "Bekelela uR500 inyanga zonke emgcinimali ngaphambi kokuchithekelwa — ukukhokha okokuqala kunakho ukwakha isikhoselo sezindleko ezingalindelekile.",
        af: "Sit R500/maand in spaargeld voor besteding — om jouself eerste te betaal bou 'n kussing vir onverwagte kostes.",
      },
      large: {
        en: "With 4 or more people to support, a monthly household budget meeting helps everyone track shared expenses and avoid surprises.",
        zu: "Nabantu abayi-4 nangaphezulu okudingekile ukubasekela, umhlangano wenyanga zonke wesabelomali womndeni usiza wonke umuntu ukulandela izindleko ezibiyelwe.",
        af: "Met 4 of meer mense om te ondersteun help 'n maandelikse huishoudelike begrotingsvergadering almal om gedeelde uitgawes na te spoor.",
      },
      tip2: {
        en: "Invest in a home upgrade each quarter — insulation, a solar geyser, or better security pays back in lower bills and higher value.",
        zu: "Tshalela ukuthuthukiswa kwekhaya ngekota ngayinye — i-insulation, igeyisha elimhlophe, noma ukuphepha okuncanyana kuyabuyisa ngezindleko eziphansi nenani eliphezulu.",
        af: "Belê in 'n huisopgradering elke kwartaal — isolasie, 'n sonkraggeiser of beter sekuriteit betaal terug in laer rekeninge en hoër waarde.",
      },
      tip3: {
        en: "Use township wholesale networks or buying clubs for bulk goods — you can save R300–R500 monthly compared to retail.",
        zu: "Sebenzisa amanetha omthengisi asetownshipi noma amaklabhu okuthenga izimpahla ezinkulu — ungonga uR300–R500 inyanga zonke uma uqhathanisa nezitolo.",
        af: "Gebruik township-groothandelnetwerke of koopklubs vir bulkgoedere — jy kan R300–R500 maandeliks spaar vergeleke met kleinhandel.",
      },
    },
    Town: {
      small: {
        en: "Set up a debit order for R500–R1,000 into savings on payday — automate it so you never skip it.",
        zu: "Setha i-debit order ye-R500–R1,000 emgcinimali ngosuku lomholo — yenza ngokuzenzakalelayo ukuze ungayibaleki.",
        af: "Stel 'n debietorder van R500–R1,000 in spaargeld op betaaldag op — outomatiseer dit sodat jy dit nooit oorslaan nie.",
      },
      large: {
        en: "Split costs on shared household items — cleaning products, cooking oil, bulk grains — with a trusted neighbour or family member.",
        zu: "Yabelana ngezindleko zezinto ezisetshenziswa endlini — imikhiqizo yokusula, amafutha okupheka, amabele enkulu — nomakhelwane noma ilungu lomndeni othenjwayo.",
        af: "Verdeel kostes op gedeelde huishoudelike items — skoonmaakmiddels, kookolie, grootmaatgraan — met 'n betroubare buurman of familielid.",
      },
      tip2: {
        en: "Review your transport arrangement — a monthly bus or train ticket usually costs less than daily taxi fares.",
        zu: "Hlola izinhlelo zakho zezokuthutha — ithikithi lebhasi noma lesitimela inyanga zonke livame ukubiza kancane kunezindleko zamanje zamatekisi.",
        af: "Hersien jou vervoerreëling — 'n maandelikse bus- of treinkaartjie kos gewoonlik minder as daaglikse taxikoste.",
      },
      tip3: {
        en: "Plan meals weekly and shop from a written list — unplanned shopping adds 20–30% to grocery bills.",
        zu: "Hlela ukudla ngeviki bese uthenga kuluhlu olubhaliwe — ukuthenga ngaphandle kohlelo kwengezelela i-20–30% ezindlekweni zekrokari.",
        af: "Beplan maaltye weekliks en koop van 'n geskrewe lys — ongeplande inkopies voeg 20–30% by kruideniersrekeninge.",
      },
    },
    City: {
      small: {
        en: "City rent is your biggest cost — sharing a space or moving slightly further from the CBD can free up R1,000–R1,500 monthly.",
        zu: "Irenthi ledolobha inkulu kakhulu — ukwabelana indawo noma ukuhambela kancane kude ne-CBD ingakhulula uR1,000–R1,500 inyanga zonke.",
        af: "Stadshuur is jou grootste koste — om 'n ruimte te deel of effens verder van die SSP te trek kan R1,000–R1,500 maandeliks vrystel.",
      },
      large: {
        en: "With a larger household, tracking each spending category weekly prevents overspend — a simple spreadsheet or free app is enough.",
        zu: "Nomndeni omkhulu, ukulandela isigaba ngasinye sezindleko ngeviki kunqanda ukuchitha kakhulu — ispredshiti elilula noma uhlelo lwekhompyutha lwamahhala lanele.",
        af: "Met 'n groter huishouding voorkom weeklikse navolging van elke bestedingskategorie oorbesteding — 'n eenvoudige sigblad of gratis toepassing is genoeg.",
      },
      tip2: {
        en: "Use public transit or a monthly travel card for daily commuting instead of Uber — savings of R800–R1,200 per month are realistic.",
        zu: "Sebenzisa ezokuthutha zomphakathi noma ikhadi lezokuthutha inyanga zonke esikhundleni se-Uber — ukonga uR800–R1,200 inyanga zonke kuyenzeka.",
        af: "Gebruik openbare vervoer of 'n maandelikse reiskaart vir daaglikse pendel in plaas van Uber — besparings van R800–R1,200 per maand is realisties.",
      },
      tip3: {
        en: "Budget for one irregular expense monthly (car service, school costs, appliance repair) — city life without a cushion is expensive.",
        zu: "Hlela indleko eyodwa engaqondakali inyanga zonke (insevisi yemoto, izindleko zesikole, ukuphasiswa kwezinto) — ukuphila edolobheni ngaphandle kwesikhoselo kuyabiza.",
        af: "Beplan vir een onreëlmatige uitgawe maandeliks (motoronderhoud, skoolkoste, toestelreparasie) — stadslewe sonder 'n kussing is duur.",
      },
    },
  },

  "R15k-R30k": {
    Township: {
      small: {
        en: "Open a tax-free savings account (TFSA) and automate R1,000/month — compound growth over 10 years makes a major difference.",
        zu: "Vula i-akhawunti yokonga engenamthelo (TFSA) futhi uzenzele ngokuzenzakalelayo uR1,000 inyanga zonke — ukukhula kwengeziwe eminyakeni eyi-10 kwenza umehluko omkhulu.",
        af: "Maak 'n belastingvrye spaarrekening (TFSA) oop en outomatiseer R1,000/maand — samegestelde groei oor 10 jaar maak 'n groot verskil.",
      },
      large: {
        en: "With a large household, write down all fixed costs at the start of each month before any flexible spending begins.",
        zu: "Nomndeni omkhulu, bhala phansi zonke izindleko eziqinile ekuqaleni kwanyanga zonke ngaphambi kokuqala kwezindleko ezikhululekile.",
        af: "Met 'n groot huishouding, skryf alle vaste kostes aan die begin van elke maand neer voordat enige buigsame besteding begin.",
      },
      tip2: {
        en: "Upgrade one significant home feature per quarter — security, roofing, or energy efficiency pays back in comfort and asset value.",
        zu: "Thuthukisa into ebalulekile yekhaya ngekota ngayinye — ukuphepha, uphahla, noma ukusebenzisa amandla ngokuphumelelayo kubuyisa ngenhlalakahle nenani.",
        af: "Opgradeer een beduidende huiskenmerk per kwartaal — sekuriteit, dakwerk of energie-doeltreffendheid betaal terug in gemak en batewaarde.",
      },
      tip3: {
        en: "Use your buying power to purchase staples in bulk locally — you can save R400–R700/month versus buying small quantities.",
        zu: "Sebenzisa amandla akho okuthenga ukuze uthenga izinto eziyisisekelo enkulu endaweni — ungonga uR400–R700 inyanga zonke uma uqhathanisa nokuthenga izingxenye ezincane.",
        af: "Gebruik jou koopkrag om stapelvoedsel in grootmaat plaaslik te koop — jy kan R400–R700/maand spaar teenoor die koop van klein hoeveelhede.",
      },
    },
    Town: {
      small: {
        en: "Automate R1,500–R2,500/month into a TFSA — at this income, consistent saving builds real wealth over time.",
        zu: "Zenzele ngokuzenzakalelayo uR1,500–R2,500 inyanga zonke kwi-TFSA — kuleli zinga lemali, ukonga okuqhubekayo kwakha ingcebo yangempela ngokuhamba kwesikhathi.",
        af: "Outomatiseer R1,500–R2,500/maand in 'n TFSA — by hierdie inkomste bou konsekwente spaar werklike rykdom oor tyd.",
      },
      large: {
        en: "A household budget reviewed monthly keeps lifestyle creep in check — at this income level, small habitual spends add up fast.",
        zu: "Isabelomali somndeni esibuyekezwa inyanga zonke sigcina ukuphila ekukhuleni — kuleli zinga lemali, izindleko ezincane zansuku zonke zihlangana ngokushesha.",
        af: "'n Huishoudelike begroting wat maandeliks hersien word hou lewenstylkruip in toom — op hierdie inkomstevlak tel klein gewoontebesteding vinnig op.",
      },
      tip2: {
        en: "Resist lifestyle inflation — keeping non-essential spending below 10% of income is the difference between saving and not.",
        zu: "Phikisa ukunyuswa kwempilo — ukugcina izindleko ezingadingekile ngaphansi kwengu-10% yemali imahluko phakathi kokonga nangokungakwenzi.",
        af: "Weerstaan lewenstylinflas ie — om nie-noodsaaklike besteding onder 10% van inkomste te hou is die verskil tussen spaar en nie.",
      },
      tip3: {
        en: "Review insurance, data, and subscription contracts annually — most South Africans overpay by R300–R600/month on these.",
        zu: "Hlola izivumelwano zomshwalense, idatha, nezinkontrakhti zokubhalisa minyaka yonke — abaningi baseFrika Baseningizimu bakhokha ngokweqile nge-R300–R600 inyanga zonke kule.",
        af: "Hersien versekering-, data- en intekenkontrakte jaarliks — die meeste Suid-Afrikaners oorbetaal R300–R600/maand op hierdie.",
      },
    },
    City: {
      small: {
        en: "Negotiate your rent or consider a slightly cheaper suburb — saving R1,500 on housing compounds faster than any other change.",
        zu: "Xoxisana ngerenthi yakho noma cabanga ngendawo engabizi kancane — ukonga uR1,500 kwezokuhlala kuyakhula ngokushesha kunoma yisiphi esinye isinguquko.",
        af: "Onderhandel jou huur of oorweeg 'n effens goedkoper voorstad — besparing van R1,500 op behuising groei vinniger saam as enige ander verandering.",
      },
      large: {
        en: "Track spending weekly — lifestyle creep across a large household (takeaways, subscriptions, school extras) is the main budget risk at this income.",
        zu: "Landela izindleko ngeviki — ukuphila okukhulayo emndeni omkhulu (ukuthumela ukudla, izinkontrakhti, izithothobala zesikole) yingozi enkulu yesabelomali kuleli zinga lemali.",
        af: "Volg besteding weekliks — lewenstylkruip oor 'n groot huishouding (wegkrynos, intekens, skoolekstras) is die hoofbegrotingsrisiko by hierdie inkomste.",
      },
      tip2: {
        en: "A budgeting app that categorises spending automatically shows where money leaks — most people overspend on food and transport without realising.",
        zu: "Uhlelo lwekhompyutha lokuhlela oluhlukanisa izindleko ngokuzenzakalelayo luveza lapho imali iphuma khona — abaningi bachitha kakhulu ekudleni nasezinhambweni ngaphandle kokuzwa.",
        af: "'n Begrotingsprogram wat besteding outomaties kategoriseer wys waar geld lek — die meeste mense oorspandeer op kos en vervoer sonder om dit te besef.",
      },
      tip3: {
        en: "Invest the gap between what you earn and what you spend — a retirement annuity or TFSA makes more long-term difference than any salary increase.",
        zu: "Tshalela umehluko phakathi kwalokho okuthola nalokho ochitha — i-annuity yokukhokha noma i-TFSA yenza umehluko omkhulu esikhathini eside kunoma yikuphi ukukhuphuka komholo.",
        af: "Belê die verskil tussen wat jy verdien en wat jy bestee — 'n aftreelyfrentekaart of TFSA maak meer langtermynverskil as enige salarisverhoging.",
      },
    },
  },
};

export function lookupBudget(
  income: IncomeRange,
  dependants: Dependants,
  condition: LivingCondition,
  lang: Lang = "en",
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
    advice: [
      isLarge ? entry.large[lang] : entry.small[lang],
      entry.tip2[lang],
      entry.tip3[lang],
    ],
  };
}
