// The static-syllabus brain of The Daily Brief.
//
// Everything here is *grounding*: it is fed to the language model so its
// "Static Link" panels stay accurate and syllabus-shaped instead of generic.
// Edit freely — add policies, institutions, geography facts and history you
// find yourself revising, and they will show up in the brief.

export interface KnowledgeCard {
  id: string;
  title: string;
  keywords: string[];
  paper: string;
  syllabusNode: string;
  whatIsIt: string;
  background: string;
  geography?: string;
  socioEconomic?: string;
  keyTerms: string[];
  prelimsPointers: string[];
  mainsAngle: string;
}

export const GS_PAPERS = {
  "GS-I": "History, Art & Culture, Geography, Society",
  "GS-II": "Polity, Constitution, Governance, Social Justice, IR",
  "GS-III": "Economy, Agriculture, Environment, Science & Tech, Security",
  "GS-IV": "Ethics, Integrity & Aptitude",
  Essay: "Essay",
} as const;

export interface Category {
  key: string;
  label: string;
  blurb: string;
}

// Editorial sections of the paper. `key` is used in data + filters.
export const CATEGORIES: Category[] = [
  { key: "polity", label: "Polity & Governance", blurb: "Constitution, institutions, legislation" },
  { key: "economy", label: "Economy", blurb: "Fiscal, monetary, markets, trade" },
  { key: "ir", label: "International Relations", blurb: "Diplomacy, conflicts, groupings" },
  { key: "security", label: "Internal & External Security", blurb: "Defence, terror, cyber" },
  { key: "environment", label: "Environment & Ecology", blurb: "Climate, biodiversity, pollution" },
  { key: "scitech", label: "Science & Technology", blurb: "Space, health, frontier tech" },
  { key: "society", label: "Society & Social Justice", blurb: "Caste, gender, welfare, education" },
  { key: "culture", label: "Culture & History", blurb: "Heritage, art, commemoration" },
  { key: "geography", label: "Geography & Resources", blurb: "Physical, resources, disasters" },
  { key: "agriculture", label: "Agriculture & Rural", blurb: "Farming, food security, rural economy" },
];

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

// ---- Static knowledge base -------------------------------------------------
// High-frequency UPSC themes. Keep entries tight and exam-oriented.
export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: "rbi-monetary-policy",
    title: "Reserve Bank of India & Monetary Policy",
    keywords: ["rbi", "repo rate", "inflation", "monetary policy", "mpc", "crr", "slr", "interest rate"],
    paper: "GS-III",
    syllabusNode: "Indian Economy — Banking & Monetary Policy",
    whatIsIt: "India's central bank, established in 1935 (nationalised 1949) under the RBI Act, 1934. It conducts monetary policy through the six-member Monetary Policy Committee (MPC), instituted in 2016 with an inflation-targeting mandate of 4% CPI (±2%).",
    background: "The MPC framework came from the Urjit Patel Committee (2014) and a 2016 RBI Act amendment. Tools: repo/reverse repo, Marginal Standing Facility, Cash Reserve Ratio (CRR), Statutory Liquidity Ratio (SLR), and Open Market Operations. The RBI also regulates banks, manages forex reserves, and acts as banker to government.",
    keyTerms: ["Repo rate", "Reverse repo", "CRR", "SLR", "OMOs", "CPI vs WPI", "Inflation targeting", "Liquidity Adjustment Facility"],
    prelimsPointers: [
      "Repo = rate at which RBI lends to banks against securities; reverse repo is the absorbing rate.",
      "MPC has 6 members: 3 RBI (incl. Governor as chair) + 3 external; Governor has casting vote.",
      "Inflation target: 4% CPI, band 2–6%, reviewed every 5 years.",
    ],
    mainsAngle: "Balance growth support with price stability; examine transmission of rate cuts to borrowers (MCLR/EBLR) and the role of fiscal-monetary coordination.",
  },
  {
    id: "fiscal-policy",
    title: "Fiscal Policy, Budget & FRBM",
    keywords: ["fiscal deficit", "budget", "frbm", "tax", "gst", "disinvestment", "capex", "revenue deficit"],
    paper: "GS-III",
    syllabusNode: "Indian Economy — Government Budgeting",
    whatIsIt: "Fiscal policy is the government's use of taxation and spending to steer the economy, presented annually via the Union Budget (Article 112). Fiscal prudence is anchored by the FRBM Act, 2003.",
    background: "The FRBM Act targets fiscal-deficit reduction; the N.K. Singh Committee (2017) recommended a debt-to-GDP anchor of 60% (general government). The GST Council (Article 279A) is the constitutional body for indirect-tax harmonisation (GST launched 2017).",
    keyTerms: ["Fiscal deficit", "Revenue vs capital expenditure", "FRBM Act 2003", "GST Council", "Devolution (Finance Commission)", "Off-budget borrowing"],
    prelimsPointers: [
      "Fiscal deficit = total expenditure − total receipts (excluding borrowings).",
      "Finance Commission (Art. 280) recommends tax devolution; 15th FC set 41% share to states.",
      "Defence, interest payments and subsidies dominate committed expenditure.",
    ],
    mainsAngle: "Debate counter-cyclical capex versus consolidation; examine quality of spending and states' fiscal space.",
  },
  {
    id: "parliament-legislation",
    title: "Parliament, Legislation & Bills",
    keywords: ["bill", "parliament", "act", "lok sabha", "rajya sabha", "ordinance", "committee"],
    paper: "GS-II",
    syllabusNode: "Polity — Parliament & Legislative Process",
    whatIsIt: "Parliament (Article 79) consists of the President, Lok Sabha and Rajya Sabha. A Bill becomes law after passage by both Houses and Presidential assent (Article 111).",
    background: "Money Bills (Art. 110) originate only in Lok Sabha; Rajya Sabha can delay but not amend them on the money provisions. Ordinances (Art. 123) can be promulgated when Parliament is not in session and must be approved within six weeks of reassembly. Departmentally Related Standing Committees scrutinise Bills.",
    keyTerms: ["Money Bill", "Ordinance", "Private Member's Bill", "Joint sitting (Art. 108)", "Guillotine", "Zero Hour", "Prorogation"],
    prelimsPointers: [
      "No-confidence motion — Lok Sabha only. Adjournment vs prorogation vs dissolution differ in effect on pending Bills.",
      "A Bill pending in Rajya Sabha lapses on Lok Sabha dissolution only if not yet passed by LS.",
    ],
    mainsAngle: "Assess declining legislative scrutiny and committee referrals; parliamentary productivity as a governance indicator.",
  },
  {
    id: "judiciary",
    title: "Supreme Court, High Courts & Judicial Review",
    keywords: ["supreme court", "high court", "judiciary", "judicial review", "pil", "collegium", "verdict"],
    paper: "GS-II",
    syllabusNode: "Polity — Judiciary",
    whatIsIt: "The Supreme Court (Art. 124) is the apex court and guardian of the Constitution; High Courts (Art. 214) are at the state level. Judicial review is the power to test laws against the Constitution.",
    background: "The collegium system evolved through the Three Judges Cases (1981, 1993, 1998). Kesavananda Bharati (1973) established the basic-structure doctrine. PILs expanded access to justice from the late 1970s. Article 32 (SC) and 226 (HC) provide writ jurisdiction.",
    keyTerms: ["Basic structure", "Collegium", "Writ (habeas corpus, mandamus, certiorari)", "PIL", "Judicial activism vs restraint", "Article 142"],
    prelimsPointers: [
      "Original jurisdiction: disputes between Centre and states (Art. 131).",
      "Advisory jurisdiction under Article 143.",
    ],
    mainsAngle: "Examine judicial backlog, vacancies and pendency; the balance between judicial independence and accountability.",
  },
  {
    id: "federalism",
    title: "Federalism & Centre-State Relations",
    keywords: ["federalism", "state", "governor", "centre-state", "devolution", "subject", "concurrent list"],
    paper: "GS-II",
    syllabusNode: "Polity — Federalism & Devolution",
    whatIsIt: "India is a quasi-federal union: powers are divided between the Union and States via the Union, State and Concurrent Lists (Seventh Schedule), with residuary powers with the Union (Art. 248).",
    background: "Sarkaria (1983) and Punchhi (2007) Commissions examined Centre-State balance. The Governor (Art. 153) is the Centre's constitutional representative and a flashpoint over assent to Bills (Art. 200) and reservation of Bills for the President (Art. 201).",
    keyTerms: ["Seventh Schedule", "Article 356", "Governor's assent", "GST Council", "NITI Aayog", "Cooperative & competitive federalism"],
    prelimsPointers: [
      "Concurrent List: union law prevails on repugnancy unless state law reserved for President's assent (Art. 254).",
      "Inter-State Council (Art. 263) is a recommendatory dispute-resolution body.",
    ],
    mainsAngle: "Recent spats over Governor's assent and fiscal devolution — assess cooperative federalism in practice.",
  },
  {
    id: "un-reform",
    title: "United Nations & Multilateral Reform",
    keywords: ["united nations", "unsc", "un", "security council", "un general assembly", "multilateral", "reform"],
    paper: "GS-II",
    syllabusNode: "International Relations — Global Governance",
    whatIsIt: "The UN (1945) has six principal organs; the Security Council has five permanent veto-wielding members (P5) and ten elected members. India has long sought permanent UNSC membership.",
    background: "India is a founding UN member and one of the largest troop contributors to peacekeeping. The G4 (India, Brazil, Germany, Japan) campaigns for expansion. Intergovernmental Negotiations (IGN) on Security Council reform remain inconclusive.",
    keyTerms: ["P5 veto", "G4", "UNGA", "Peacekeeping", "Responsibility to Protect", "ECOSOC"],
    prelimsPointers: [
      "UNSC has 15 members: 5 permanent + 10 elected for 2-year terms.",
      "ICY (International Court of Justice) in The Hague; UN HQ in New York.",
    ],
    mainsAngle: "India's claim rests on representativeness, its population and contributions; assess obstacles (veto politics, Africa's Ezulwini Consensus).",
  },
  {
    id: "india-foreign-policy",
    title: "India's Foreign Policy & Strategic Autonomy",
    keywords: ["foreign policy", "diplomacy", "quad", "brics", "sco", "g20", "nam", "strategic autonomy", "neighbourhood"],
    paper: "GS-II",
    syllabusNode: "International Relations — India & the World",
    whatIsIt: "India's foreign policy combines strategic autonomy, multi-alignment, and the Neighbourhood First and Act East outlooks. It engages across the Quad, BRICS, SCO, G20 and IBSA simultaneously.",
    background: "Rooted in NAM (1961) and Panchsheel (1954). Post-1991 liberalisation and the 1998 nuclear tests reshaped ties with the US. The Indo-Pacific concept and Quad (with US, Japan, Australia) gained salience after 2017.",
    keyTerms: ["Strategic autonomy", "Multi-alignment", "Quad", "BRICS", "SCO", "Act East", "Neighbourhood First", "Vishwabandhu"],
    prelimsPointers: [
      "India assumed G20 presidency in 2022–23; African Union admitted as permanent G20 member in 2023.",
      "SCO: India and Pakistan joined in 2017.",
    ],
    mainsAngle: "Balancing ties with the West, Russia and the Global South; India as a 'Voice of the Global South' and bridging power.",
  },
  {
    id: "climate-regime",
    title: "Climate Change Regime & India's Commitments",
    keywords: ["climate", "cop", "unfccc", "paris agreement", "net zero", "emissions", "ndc", "carbon", "cop28", "cop29"],
    paper: "GS-III",
    syllabusNode: "Environment — Climate Change",
    whatIsIt: "The UNFCCC (1992) is the parent treaty; the Kyoto Protocol (1997) and Paris Agreement (2015) operationalise it. India targets net-zero by 2070 and 50% installed non-fossil capacity by 2030.",
    background: "Common But Differentiated Responsibilities (CBDR-RC) is the core equity principle. Paris uses NDCs and a ratchet mechanism. Loss & Damage fund was operationalised at COP28 (2023). India leads the International Solar Alliance (2015) and LiFE mission.",
    keyTerms: ["NDC", "CBDR-RC", "Loss & Damage", "Net zero", "Global Stocktake", "Article 6 carbon markets", "Green Credit"],
    prelimsPointers: [
      "India's updated NDC: cut emissions intensity of GDP by 45% from 2005 by 2030.",
      "Paris Agreement goal: keep warming well below 2°C, ideally 1.5°C.",
    ],
    mainsAngle: "Climate finance and technology transfer gaps; examine equity in the Global Stocktake and just transition.",
  },
  {
    id: "biodiversity",
    title: "Biodiversity, Wetlands & Conservation",
    keywords: ["biodiversity", "ramsar", "wetland", "species", "tiger", "wildlife", "cbd", "kunal", "forest", "ecosystem", "coral"],
    paper: "GS-III",
    syllabusNode: "Environment — Biodiversity & Conservation",
    whatIsIt: "India is one of 17 megadiverse countries. Key instruments: Wildlife (Protection) Act 1972, Biological Diversity Act 2002, Forest Conservation Act 1980, and the CBD (1992) with its Kunming-Montreal Global Biodiversity Framework (2022).",
    background: "Ramsar Convention (1971) protects wetlands; India has 80+ Ramsar sites. Project Tiger (1973) and Project Elephant (1992) anchor species conservation. The 30x30 target aims to protect 30% of land and sea by 2030.",
    keyTerms: ["Ramsar site", "30x30", "Biodiversity hotspots", "CITES", "Invasive species", "Ecosystem services", "Biosphere reserve"],
    prelimsPointers: [
      "India's biodiversity hotspots: Himalaya, Indo-Burma, Western Ghats-Sri Lanka, Sundaland/Nicobar.",
      "World Wetlands Day: 2 February.",
    ],
    mainsAngle: "Balancing conservation with development and community rights (FRA); human-wildlife conflict management.",
  },
  {
    id: "monsoon-geography",
    title: "Indian Monsoon & Physical Geography",
    keywords: ["monsoon", "rainfall", "el nino", "la nina", "cyclone", "himalaya", "river", "drought", "flood"],
    paper: "GS-I",
    syllabusNode: "Geography — Physical Geography of India",
    whatIsIt: "The Indian monsoon is a seasonal reversal of winds driven by differential heating, the ITCZ shift, and the Tibetan Plateau's heat pump. It delivers ~75% of annual rainfall during June–September.",
    background: "El Niño usually weakens the monsoon; La Niña strengthens it; the Indian Ocean Dipole (IOD) modulates it too. The Western Ghats and Himalayan rivers (Indus, Ganga, Brahmaputra) define drainage; peninsular rivers are rain-fed.",
    keyTerms: ["ITCZ", "El Niño/La Niña", "IOD", "Jet stream", "Western disturbances", "Rain shadow", "Tropical cyclone"],
    prelimsPointers: [
      "Himalayan rivers are perennial (snow-fed); peninsular rivers are seasonal.",
      "Western Ghats lie west of the Deccan; highest peak Anamudi (Kerala).",
    ],
    mainsAngle: "Monsoon variability and climate change; disaster preparedness for floods/cyclones.",
  },
  {
    id: "agriculture-msp",
    title: "Agriculture, MSP & Food Security",
    keywords: ["agriculture", "msp", "farmer", "food security", "pm kisan", "fertiliser", "crop", "procurement", "wheat", "rice"],
    paper: "GS-III",
    syllabusNode: "Economy — Agriculture & Food Security",
    whatIsIt: "Minimum Support Price (MSP) is announced by the government (CACP recommendations) for 22 mandated crops. Food security is backed by the National Food Security Act, 2013, and the PM Garib Kalyan Anna Yojana grain distribution.",
    background: "Green Revolution (1960s) made India food-sufficient. Shanta Kumar Committee (2015) reviewed FCI operations. PM-KISAN gives ₹6,000/year income support. The three 2020 farm laws were repealed in 2021.",
    keyTerms: ["MSP", "CACP", "PDS", "NFSA 2013", "FCI", "e-NAM", "Soil Health Card", "PM-KISAN"],
    prelimsPointers: [
      "MSP is a price assurance, not a legal right; procurement is concentrated in wheat/paddy.",
      "NFSA covers up to 75% rural and 50% urban population.",
    ],
    mainsAngle: "Reforming MSP and procurement while raising farmer incomes; water-fertiliser sustainability.",
  },
  {
    id: "urban-local-gov",
    title: "Urbanisation & Local Governance",
    keywords: ["urban", "municipal", "panchayat", "local government", "smart city", "amrut", "73rd", "74th", "decentralisation"],
    paper: "GS-II",
    syllabusNode: "Polity & Governance — Local Self-Government",
    whatIsIt: "The 73rd and 74th Constitutional Amendments (1992) gave constitutional status to panchayats and municipalities, with mandated elections, reservations and State Finance Commissions.",
    background: "Lord Ripon's Resolution (1882) is the foundation of local self-government. The Eleventh and Twelfth Schedules list 29 and 18 subjects. Schemes: Smart Cities Mission, AMRUT, Swachh Bharat, PMAY.",
    keyTerms: ["73rd/74th Amendment", "State Finance Commission", "Gram Sabha", "Ward Committee", "Urban agglomeration", "12th Schedule"],
    prelimsPointers: [
      "Three types of municipalities: Nagar Panchayat, Municipal Council, Municipal Corporation.",
      "PESA Act 1996 extends panchayat provisions to Fifth Schedule areas.",
    ],
    mainsAngle: "Weak fiscal devolution and capacity gaps hamper local governance; examine municipal finance reform.",
  },
  {
    id: "space-programme",
    title: "India's Space Programme (ISRO)",
    keywords: ["isro", "space", "satellite", "chandrayaan", "gaganyaan", "pslv", "gslv", "launch", "ina"],
    paper: "GS-III",
    syllabusNode: "Science & Technology — Space",
    whatIsIt: "ISRO (1969) runs India's space programme for communication, remote sensing, navigation (NavIC) and exploration, under the Department of Space. IN-SPACe (2020) and NSIL now promote private participation.",
    background: "Aryabhata (1975) was India's first satellite. Chandrayaan-3 soft-landed near the lunar south pole in 2023. Mangalyaan (2013) reached Mars orbit on its first attempt. Gaganyaan is India's first crewed mission.",
    keyTerms: ["PSLV/GSLV/LVM3", "NavIC", "IN-SPACe", "NSIL", "Chandrayaan", "Gaganyaan", "Aditya-L1"],
    prelimsPointers: [
      "PSLV is the workhorse launcher; GSLV Mk-III can carry heavier geosynchronous payloads.",
      "India is a founder of the Outer Space Treaty framework; UN COPUOS governs space law.",
    ],
    mainsAngle: "Commercialisation of space, space debris and India's role in space governance.",
  },
  {
    id: "digital-india",
    title: "Digital Public Infrastructure & Data Governance",
    keywords: ["upi", "aadhaar", "digital", "data protection", "dpdp", "cyber", "internet", "digital public infrastructure", "dpi"],
    paper: "GS-II",
    syllabusNode: "Governance — e-Governance & Data",
    whatIsIt: "India's Digital Public Infrastructure — Aadhaar, UPI and DigiLocker — is a layered, interoperable stack. The Digital Personal Data Protection Act, 2023 governs personal data processing.",
    background: "Aadhaar (UIDAI, 2009) is the world's largest biometric ID. UPI (NPCI, 2016) processes billions of monthly transactions. The DPDP Act introduces a Data Protection Board and consent-based processing.",
    keyTerms: ["Aadhaar", "UPI", "DigiLocker", "DPDP Act 2023", "Data Protection Board", "Account Aggregator", "ONDC"],
    prelimsPointers: [
      "NPCI operates UPI, RuPay, IMPS, NACH.",
      "DPDP Act provides for consent, data-principal rights, and significant data fiduciaries.",
    ],
    mainsAngle: "Balance innovation with privacy and state surveillance; examine DPI as a global export model.",
  },
  {
    id: "welfare-schemes",
    title: "Welfare Architecture & Social Justice",
    keywords: ["welfare", "scheme", "poverty", "health", "ayushman", "mgnrega", "nutrition", "pension", "subsidy", "caste", "reservation"],
    paper: "GS-II",
    syllabusNode: "Social Justice — Welfare & Rights",
    whatIsIt: "India's welfare model blends rights-based laws (MGNREGA 2005, RTE 2009, NFSA 2013) with DBT-enabled schemes and a JAM (Jan Dhan–Aadhaar–Mobile) delivery backbone.",
    background: "Ayushman Bharat (2018) has a health-insurance arm (PM-JAY) and Health & Wellness Centres. POSHAN Abhiyaan targets malnutrition. Article 15/16 and Indra Sawhney (1992) frame reservation policy.",
    keyTerms: ["DBT", "JAM trinity", "MGNREGA", "PM-JAY", "POSHAN", "Article 15/16", "OBC/SC/ST", "Social security codes"],
    prelimsPointers: [
      "MGNREGA guarantees 100 days of unskilled wage employment per rural household per year.",
      "Four labour codes consolidate 29 labour laws.",
    ],
    mainsAngle: "Welfare exclusion errors, urban poverty, and the shift from entitlement to capability.",
  },
  {
    id: "internal-security",
    title: "Internal Security, Left-Wing Extremism & Cyber",
    keywords: ["internal security", "naxal", "terror", "insurgency", "cyber", "left wing extremism", "border", "militancy"],
    paper: "GS-III",
    syllabusNode: "Security — Internal Security",
    whatIsIt: "Internal security covers terrorism, left-wing extremism (LWE), insurgency in the Northeast, and cyber/economic security, handled via the MHA, IB, NIA and state police.",
    background: "Naxalism peaked in the 'Red Corridor'; SAMADHAN doctrine guides counter-LWE. AFSPA applies to disturbed areas. The Integrated Command and Control Centres and NATGRID support cyber security.",
    keyTerms: ["LWE", "AFSPA", "NIA", "SAMADHAN", "Red Corridor", "NATGRID", "CERT-In"],
    prelimsPointers: [
      "NIA (2008) investigates terror offences under the NIA Act.",
      "CERT-In is the national nodal agency for cyber-incident response.",
    ],
    mainsAngle: "Development-versus-security approach; examine the cyber-threat landscape for critical infrastructure.",
  },
  {
    id: "poverty-inequality",
    title: "Poverty, Inequality & Employment",
    keywords: ["poverty", "inequality", "employment", "unemployment", "jobs", "gini", "mspi", "labour", "plfs"],
    paper: "GS-III",
    syllabusNode: "Economy — Inclusive Growth & Employment",
    whatIsIt: "Poverty is measured by NITI Aayog's Multidimensional Poverty Index (MPI) and by consumption surveys; employment by the Periodic Labour Force Survey (PLFS).",
    background: "NITI Aayog's National MPI (2021) uses 12 indicators across health, education and living standards. PLFS (since 2017) reports quarterly urban and annual all-India data. India became the world's most populous country in 2023.",
    keyTerms: ["Multidimensional Poverty Index", "PLFS", "LFPR", "Gini coefficient", "Demographic dividend", "Informal sector"],
    prelimsPointers: [
      "MPI dimensions: health, education, standard of living (3 dimensions, 12 indicators).",
      "Unemployment Rate = unemployed / labour force.",
    ],
    mainsAngle: "Quality of employment, structural transformation and the skills gap.",
  },
  {
    id: "indian-history-freedom",
    title: "Modern Indian History & Freedom Struggle",
    keywords: ["freedom", "independence", "gandhi", "nehru", "congress", "1947", "quit india", "movement", "colonial", "partition"],
    paper: "GS-I",
    syllabusNode: "History — Modern India & Freedom Struggle",
    whatIsIt: "The freedom struggle spans the Revolt of 1857, the rise of the Congress (1885), Gandhian mass movements, and the Quit India Movement (1942) to Independence and Partition (1947).",
    background: "Key milestones: Partition of Bengal and Swadeshi (1905), Non-Cooperation (1920), Civil Disobedience and Dandi March (1930), Government of India Act 1935, Quit India (1942), Cabinet Mission (1946), Mountbatten Plan and the Indian Independence Act 1947.",
    keyTerms: ["INC 1885", "Swadeshi", "Non-Cooperation", "Dandi March", "Quit India", "Cabinet Mission", "Mountbatten Plan"],
    prelimsPointers: [
      "Indian National Congress founded by A.O. Hume in 1885.",
      "The Indian Independence Act 1947 created India and Pakistan as dominions.",
    ],
    mainsAngle: "Nature of mass mobilisation and the role of marginalised voices; colonial legacies in institutions.",
  },
  {
    id: "art-culture",
    title: "Art, Culture & Heritage",
    keywords: ["culture", "heritage", "temple", "unesco", "dance", "music", "festival", "monument", "asi"],
    paper: "GS-I",
    syllabusNode: "Art & Culture",
    whatIsIt: "India's cultural heritage includes classical dance forms (Bharatanatyam, Kathak, Kathakali, etc.), Hindustani and Carnatic music, temple architecture styles (Nagara, Dravida, Vesara) and UNESCO listings.",
    background: "ASI protects monuments under the AMASR Act 1958. India has 40+ UNESCO World Heritage Sites. The eight classical dances were codified by the Sangeet Natak Akademi.",
    keyTerms: ["Nagara/Dravida/Vesara", "UNESCO WHS", "ASI", "GI tag", "Intangible heritage", "Sangeet Natak Akademi"],
    prelimsPointers: [
      "Dravida style: gopuram, vimana, shikhara over sanctum.",
      "Nagara: curvilinear shikhara; Odisha, Khajuraho, Solanki are sub-styles.",
    ],
    mainsAngle: "Heritage conservation vs urbanisation; cultural diplomacy and soft power.",
  },
];

// Quick keyword lookup used by the generator to pre-match cards to a story.
export function matchKnowledgeCards(text: string, limit = 4): KnowledgeCard[] {
  const hay = text.toLowerCase();
  const scored = KNOWLEDGE_CARDS.map((card) => {
    let score = 0;
    for (const kw of card.keywords) {
      if (hay.includes(kw.toLowerCase())) score += kw.includes(" ") ? 2 : 1;
    }
    return { card, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.card);
}
