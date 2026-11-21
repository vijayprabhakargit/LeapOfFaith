// Expansion units for the Static Editorial curriculum.
//
// These are appended after each subject's existing units in config/staticSeries.ts.
// They deepen the first pass: once the survey is done, the series returns to the
// same subject with more detail, more debate and more exam-relevant depth.
//
// Keep IDs globally unique and stable. Progress refers to them.

import type { Reference, StaticLessonSubjectKey } from "../src/lib/types";
import type { SeriesLesson, SeriesUnit } from "./staticSeries";

function ref(label: string, href: string, kind: Reference["kind"] = "official"): Reference {
  return { label, href, kind };
}

function L(
  id: string,
  title: string,
  scope: string,
  figureIdeas: string[] = [],
  keyQuestions: string[] = [],
): SeriesLesson {
  return { id, title, scope, figureIdeas, keyQuestions };
}

const X = {
  ncertHub: ref("NCERT textbooks (official, free)", "https://ncert.nic.in/textbook.php"),
  ncertPhysical: ref(
    "NCERT Class XI — Fundamentals of Physical Geography",
    "https://ncert.nic.in/textbook/pdf/kegy101.pdf",
  ),
  ncertIndiaPhysical: ref(
    "NCERT Class XI — India: Physical Environment",
    "https://ncert.nic.in/textbook/pdf/kegy201.pdf",
  ),
  ncertHuman: ref(
    "NCERT Class XII — Fundamentals of Human Geography",
    "https://ncert.nic.in/textbook/pdf/legy101.pdf",
  ),
  ncertIndiaPeople: ref(
    "NCERT Class XII — India: People and Environment",
    "https://ncert.nic.in/textbook/pdf/legy201.pdf",
  ),
  imd: ref("India Meteorological Department", "https://mauser.imd.gov.in/"),
  moefcc: ref("Ministry of Environment, Forest and Climate Change", "https://moef.gov.in/"),
  unfccc: ref("UNFCCC", "https://unfccc.int/"),
  cbd: ref("Convention on Biological Diversity", "https://www.cbd.int/"),
  rbi: ref("Reserve Bank of India", "https://www.rbi.org.in/"),
  budget: ref("Union Budget", "https://www.indiabudget.gov.in/"),
  mospi: ref("Ministry of Statistics and Programme Implementation", "https://www.mospi.gov.in/"),
  census: ref("Census of India", "https://censusindia.gov.in/census.website/"),
  wto: ref("World Trade Organization", "https://www.wto.org/"),
  imf: ref("International Monetary Fund", "https://www.imf.org/"),
  worldBank: ref("World Bank", "https://www.worldbank.org/"),
  mea: ref("Ministry of External Affairs", "https://www.mea.gov.in/"),
  un: ref("United Nations", "https://www.un.org/"),
  isro: ref("ISRO", "https://www.isro.gov.in/"),
  dst: ref("Department of Science and Technology", "https://dst.gov.in/"),
  asi: ref("Archaeological Survey of India", "https://asi.nic.in/"),
  ignca: ref("Indira Gandhi National Centre for the Arts", "https://ignca.gov.in/"),
  sangeetNatak: ref("Sangeet Natak Akademi", "https://sangeetnatak.gov.in/"),
  sahitya: ref("Sahitya Akademi", "https://sahitya-akademi.gov.in/"),
  culture: ref("Ministry of Culture", "https://culture.gov.in/"),
  unesco: ref("UNESCO World Heritage Centre", "https://whc.unesco.org/"),
  mha: ref("Ministry of Home Affairs", "https://www.mha.gov.in/"),
  ndma: ref("National Disaster Management Authority", "https://ndma.gov.in/"),
  certIn: ref("CERT-In", "https://www.cert-in.org.in/"),
  pib: ref("Press Information Bureau", "https://www.pib.gov.in/"),
  prs: ref("PRS Legislative Research", "https://prsindia.org/", "report"),
  supremeCourt: ref("Supreme Court of India", "https://www.sci.gov.in/"),
  eci: ref("Election Commission of India", "https://eci.gov.in/"),
  financeCommission: ref("Finance Commission", "https://fincomindia.nic.in/"),
  cag: ref("Comptroller and Auditor General of India", "https://cag.gov.in/"),
  nhrc: ref("National Human Rights Commission", "https://nhrc.nic.in/"),
  cic: ref("Central Information Commission", "https://cic.gov.in/"),
  constitution: ref("Constitution of India", "https://legislative.gov.in/constitution-of-india/"),
  parliament: ref("Parliament of India", "https://sansad.in/"),
  niti: ref("NITI Aayog", "https://www.niti.gov.in/"),
  wikiClimate: ref("Climate", "https://en.wikipedia.org/wiki/Climate", "wiki"),
  wikiInsolation: ref("Solar irradiance", "https://en.wikipedia.org/wiki/Solar_irradiance", "wiki"),
  wikiAtmosphericCirculation: ref(
    "Atmospheric circulation",
    "https://en.wikipedia.org/wiki/Atmospheric_circulation",
    "wiki",
  ),
  wikiJetStream: ref("Jet stream", "https://en.wikipedia.org/wiki/Jet_stream", "wiki"),
  wikiENSO: ref(
    "El Niño–Southern Oscillation",
    "https://en.wikipedia.org/wiki/El_Ni%C3%B1o%E2%80%93Southern_Oscillation",
    "wiki",
  ),
  wikiIOD: ref("Indian Ocean Dipole", "https://en.wikipedia.org/wiki/Indian_Ocean_Dipole", "wiki"),
  wikiOceanFloor: ref("Ocean floor", "https://en.wikipedia.org/wiki/Ocean_floor", "wiki"),
  wikiSalinity: ref("Salinity", "https://en.wikipedia.org/wiki/Salinity", "wiki"),
  wikiTide: ref("Tide", "https://en.wikipedia.org/wiki/Tide", "wiki"),
  wikiCoralReef: ref("Coral reef", "https://en.wikipedia.org/wiki/Coral_reef", "wiki"),
  wikiBiome: ref("Biome", "https://en.wikipedia.org/wiki/Biome", "wiki"),
  wikiBiogeochemicalCycle: ref(
    "Biogeochemical cycle",
    "https://en.wikipedia.org/wiki/Biogeochemical_cycle",
    "wiki",
  ),
  wikiProtectedArea: ref("Protected area", "https://en.wikipedia.org/wiki/Protected_area", "wiki"),
  wikiForest: ref("Forest", "https://en.wikipedia.org/wiki/Forest", "wiki"),
  wikiDemographicTransition: ref(
    "Demographic transition",
    "https://en.wikipedia.org/wiki/Demographic_transition",
    "wiki",
  ),
  wikiMigration: ref("Human migration", "https://en.wikipedia.org/wiki/Human_migration", "wiki"),
  wikiAgriculture: ref("Agriculture", "https://en.wikipedia.org/wiki/Agriculture", "wiki"),
  wikiIndustrialisation: ref(
    "Industrialisation",
    "https://en.wikipedia.org/wiki/Industrialisation",
    "wiki",
  ),
  wikiConstituentAssembly: ref(
    "Constituent Assembly of India",
    "https://en.wikipedia.org/wiki/Constituent_Assembly_of_India",
    "wiki",
  ),
  wikiConstitutionalMorality: ref(
    "Constitutional morality",
    "https://en.wikipedia.org/wiki/Constitutional_morality",
    "wiki",
  ),
  wikiBasicStructure: ref(
    "Basic structure doctrine",
    "https://en.wikipedia.org/wiki/Basic_structure_doctrine",
    "wiki",
  ),
  wikiAmendment: ref(
    "Amendment of the Constitution of India",
    "https://en.wikipedia.org/wiki/Amendment_of_the_Constitution_of_India",
    "wiki",
  ),
  wikiParliamentaryCommittee: ref(
    "Parliamentary committee",
    "https://en.wikipedia.org/wiki/Parliamentary_committee",
    "wiki",
  ),
  wikiFinanceCommission: ref(
    "Finance Commission of India",
    "https://en.wikipedia.org/wiki/Finance_Commission_of_India",
    "wiki",
  ),
  wikiLocalGovernment: ref(
    "Local government in India",
    "https://en.wikipedia.org/wiki/Local_government_in_India",
    "wiki",
  ),
  wikiRTI: ref(
    "Right to Information Act, 2005",
    "https://en.wikipedia.org/wiki/Right_to_Information_Act,_2005",
    "wiki",
  ),
  wikiCivilService: ref(
    "Indian Civil Service",
    "https://en.wikipedia.org/wiki/Indian_Civil_Service",
    "wiki",
  ),
  wikiDemandSupply: ref("Supply and demand", "https://en.wikipedia.org/wiki/Supply_and_demand", "wiki"),
  wikiElasticity: ref("Elasticity (economics)", "https://en.wikipedia.org/wiki/Elasticity_(economics)", "wiki"),
  wikiMarketStructure: ref("Market structure", "https://en.wikipedia.org/wiki/Market_structure", "wiki"),
  wikiMarketFailure: ref("Market failure", "https://en.wikipedia.org/wiki/Market_failure", "wiki"),
  wikiNationalIncome: ref("National income", "https://en.wikipedia.org/wiki/National_income", "wiki"),
  wikiInflation: ref("Inflation", "https://en.wikipedia.org/wiki/Inflation", "wiki"),
  wikiBusinessCycle: ref("Business cycle", "https://en.wikipedia.org/wiki/Business_cycle", "wiki"),
  wikiMonetaryPolicy: ref("Monetary policy", "https://en.wikipedia.org/wiki/Monetary_policy", "wiki"),
  wikiBanking: ref("Banking in India", "https://en.wikipedia.org/wiki/Banking_in_India", "wiki"),
  wikiStockMarket: ref("Stock market", "https://en.wikipedia.org/wiki/Stock_market", "wiki"),
  wikiFintech: ref("Financial technology", "https://en.wikipedia.org/wiki/Financial_technology", "wiki"),
  wikiTax: ref("Tax", "https://en.wikipedia.org/wiki/Tax", "wiki"),
  wikiGST: ref("Goods and Services Tax (India)", "https://en.wikipedia.org/wiki/Goods_and_Services_Tax_(India)", "wiki"),
  wikiSubsidy: ref("Subsidy", "https://en.wikipedia.org/wiki/Subsidy", "wiki"),
  wikiFiscalPolicy: ref("Fiscal policy", "https://en.wikipedia.org/wiki/Fiscal_policy", "wiki"),
  wikiHarappa: ref("Indus Valley Civilisation", "https://en.wikipedia.org/wiki/Indus_Valley_Civilisation", "wiki"),
  wikiVedic: ref("Vedic period", "https://en.wikipedia.org/wiki/Vedic_period", "wiki"),
  wikiMaurya: ref("Maurya Empire", "https://en.wikipedia.org/wiki/Maurya_Empire", "wiki"),
  wikiGupta: ref("Gupta Empire", "https://en.wikipedia.org/wiki/Gupta_Empire", "wiki"),
  wikiDelhiSultanate: ref("Delhi Sultanate", "https://en.wikipedia.org/wiki/Delhi_Sultanate", "wiki"),
  wikiVijayanagara: ref("Vijayanagara Empire", "https://en.wikipedia.org/wiki/Vijayanagara_Empire", "wiki"),
  wikiMughal: ref("Mughal Empire", "https://en.wikipedia.org/wiki/Mughal_Empire", "wiki"),
  wikiBhakti: ref("Bhakti movement", "https://en.wikipedia.org/wiki/Bhakti_movement", "wiki"),
  wikiSufism: ref("Sufism", "https://en.wikipedia.org/wiki/Sufism", "wiki"),
  wikiBritishRaj: ref("British Raj", "https://en.wikipedia.org/wiki/British_Raj", "wiki"),
  wikiIndependence: ref(
    "Indian independence movement",
    "https://en.wikipedia.org/wiki/Indian_independence_movement",
    "wiki",
  ),
  wikiRenaissance: ref("Renaissance", "https://en.wikipedia.org/wiki/Renaissance", "wiki"),
  wikiReformation: ref("Reformation", "https://en.wikipedia.org/wiki/Reformation", "wiki"),
  wikiEnlightenment: ref("Age of Enlightenment", "https://en.wikipedia.org/wiki/Age_of_Enlightenment", "wiki"),
  wikiFrenchRevolution: ref("French Revolution", "https://en.wikipedia.org/wiki/French_Revolution", "wiki"),
  wikiIndustrialRevolution: ref(
    "Industrial Revolution",
    "https://en.wikipedia.org/wiki/Industrial_Revolution",
    "wiki",
  ),
  wikiWorldWarI: ref("World War I", "https://en.wikipedia.org/wiki/World_War_I", "wiki"),
  wikiWorldWarII: ref("World War II", "https://en.wikipedia.org/wiki/World_War_II", "wiki"),
  wikiColdWar: ref("Cold War", "https://en.wikipedia.org/wiki/Cold_War", "wiki"),
  wikiEcosystem: ref("Ecosystem", "https://en.wikipedia.org/wiki/Ecosystem", "wiki"),
  wikiFoodWeb: ref("Food web", "https://en.wikipedia.org/wiki/Food_web", "wiki"),
  wikiSuccession: ref("Ecological succession", "https://en.wikipedia.org/wiki/Ecological_succession", "wiki"),
  wikiKeystone: ref("Keystone species", "https://en.wikipedia.org/wiki/Keystone_species", "wiki"),
  wikiEcosystemServices: ref(
    "Ecosystem services",
    "https://en.wikipedia.org/wiki/Ecosystem_services",
    "wiki",
  ),
  wikiInvasive: ref("Invasive species", "https://en.wikipedia.org/wiki/Invasive_species", "wiki"),
  wikiRestoration: ref("Restoration ecology", "https://en.wikipedia.org/wiki/Restoration_ecology", "wiki"),
  wikiGreenhouse: ref("Greenhouse effect", "https://en.wikipedia.org/wiki/Greenhouse_effect", "wiki"),
  wikiCarbonCycle: ref("Carbon cycle", "https://en.wikipedia.org/wiki/Carbon_cycle", "wiki"),
  wikiMitigation: ref(
    "Climate change mitigation",
    "https://en.wikipedia.org/wiki/Climate_change_mitigation",
    "wiki",
  ),
  wikiAdaptation: ref(
    "Climate change adaptation",
    "https://en.wikipedia.org/wiki/Climate_change_adaptation",
    "wiki",
  ),
  wikiCarbonMarket: ref("Carbon market", "https://en.wikipedia.org/wiki/Carbon_market", "wiki"),
  wikiEnvironmentalLaw: ref("Environmental law", "https://en.wikipedia.org/wiki/Environmental_law", "wiki"),
  wikiForestRights: ref("Forest Rights Act", "https://en.wikipedia.org/wiki/Forest_Rights_Act", "wiki"),
  wikiRamsar: ref("Ramsar Convention", "https://en.wikipedia.org/wiki/Ramsar_Convention", "wiki"),
  wikiCITES: ref("CITES", "https://en.wikipedia.org/wiki/CITES", "wiki"),
  wikiMontreal: ref("Montreal Protocol", "https://en.wikipedia.org/wiki/Montreal_Protocol", "wiki"),
  wikiLaunchVehicle: ref("Launch vehicle", "https://en.wikipedia.org/wiki/Launch_vehicle", "wiki"),
  wikiSatellite: ref("Satellite", "https://en.wikipedia.org/wiki/Satellite", "wiki"),
  wikiGenetics: ref("Genetics", "https://en.wikipedia.org/wiki/Genetics", "wiki"),
  wikiGenome: ref("Genome", "https://en.wikipedia.org/wiki/Genome", "wiki"),
  wikiVaccine: ref("Vaccine", "https://en.wikipedia.org/wiki/Vaccine", "wiki"),
  wikiCRISPR: ref("CRISPR", "https://en.wikipedia.org/wiki/CRISPR", "wiki"),
  wikiBioethics: ref("Bioethics", "https://en.wikipedia.org/wiki/Bioethics", "wiki"),
  wikiSemiconductor: ref("Semiconductor", "https://en.wikipedia.org/wiki/Semiconductor", "wiki"),
  wikiMachineLearning: ref("Machine learning", "https://en.wikipedia.org/wiki/Machine_learning", "wiki"),
  wikiQuantum: ref("Quantum computing", "https://en.wikipedia.org/wiki/Quantum_computing", "wiki"),
  wikiCyber: ref("Cybercrime", "https://en.wikipedia.org/wiki/Cybercrime", "wiki"),
  wikiDPI: ref(
    "Digital public infrastructure",
    "https://en.wikipedia.org/wiki/Digital_public_infrastructure",
    "wiki",
  ),
  wikiFossilFuel: ref("Fossil fuel", "https://en.wikipedia.org/wiki/Fossil_fuel", "wiki"),
  wikiGrid: ref("Electrical grid", "https://en.wikipedia.org/wiki/Electrical_grid", "wiki"),
  wikiSolar: ref("Solar energy", "https://en.wikipedia.org/wiki/Solar_energy", "wiki"),
  wikiWind: ref("Wind power", "https://en.wikipedia.org/wiki/Wind_power", "wiki"),
  wikiNuclear: ref("Nuclear power", "https://en.wikipedia.org/wiki/Nuclear_power", "wiki"),
  wikiHydrogen: ref("Hydrogen economy", "https://en.wikipedia.org/wiki/Hydrogen_economy", "wiki"),
  wikiRockArt: ref("Rock art", "https://en.wikipedia.org/wiki/Rock_art", "wiki"),
  wikiBuddhistArt: ref("Buddhist art", "https://en.wikipedia.org/wiki/Buddhist_art", "wiki"),
  wikiJainArt: ref("Jain art", "https://en.wikipedia.org/wiki/Jain_art", "wiki"),
  wikiGuptaArt: ref("Gupta art", "https://en.wikipedia.org/wiki/Gupta_art", "wiki"),
  wikiIndoIslamic: ref(
    "Indo-Islamic architecture",
    "https://en.wikipedia.org/wiki/Indo-Islamic_architecture",
    "wiki",
  ),
  wikiTempleArchitecture: ref(
    "Hindu temple architecture",
    "https://en.wikipedia.org/wiki/Hindu_temple_architecture",
    "wiki",
  ),
  wikiColonialArchitecture: ref(
    "Colonial architecture",
    "https://en.wikipedia.org/wiki/Colonial_architecture",
    "wiki",
  ),
  wikiUNESCO: ref("World Heritage Site", "https://en.wikipedia.org/wiki/World_Heritage_Site", "wiki"),
  wikiClassicalDance: ref(
    "Indian classical dance",
    "https://en.wikipedia.org/wiki/Indian_classical_dance",
    "wiki",
  ),
  wikiHindustani: ref(
    "Hindustani classical music",
    "https://en.wikipedia.org/wiki/Hindustani_classical_music",
    "wiki",
  ),
  wikiCarnatic: ref("Carnatic music", "https://en.wikipedia.org/wiki/Carnatic_music", "wiki"),
  wikiTheatre: ref("Theatre of India", "https://en.wikipedia.org/wiki/Theatre_of_India", "wiki"),
  wikiPuppetry: ref("Puppetry of India", "https://en.wikipedia.org/wiki/Puppetry_of_India", "wiki"),
  wikiSanskritLit: ref("Sanskrit literature", "https://en.wikipedia.org/wiki/Sanskrit_literature", "wiki"),
  wikiTamilLit: ref("Tamil literature", "https://en.wikipedia.org/wiki/Tamil_literature", "wiki"),
  wikiUrduLit: ref("Urdu literature", "https://en.wikipedia.org/wiki/Urdu_literature", "wiki"),
  wikiIndianEnglishLit: ref(
    "Indian English literature",
    "https://en.wikipedia.org/wiki/Indian_English_literature",
    "wiki",
  ),
  wikiReligionIndia: ref("Religion in India", "https://en.wikipedia.org/wiki/Religion_in_India", "wiki"),
  wikiLanguagesIndia: ref("Languages of India", "https://en.wikipedia.org/wiki/Languages_of_India", "wiki"),
  wikiEthnicGroups: ref(
    "Ethnic groups in India",
    "https://en.wikipedia.org/wiki/Ethnic_groups_in_India",
    "wiki",
  ),
  wikiPatriarchy: ref("Patriarchy", "https://en.wikipedia.org/wiki/Patriarchy", "wiki"),
  wikiWomenIndia: ref("Women in India", "https://en.wikipedia.org/wiki/Women_in_India", "wiki"),
  wikiFeminism: ref("Feminism", "https://en.wikipedia.org/wiki/Feminism", "wiki"),
  wikiSlum: ref("Slum", "https://en.wikipedia.org/wiki/Slum", "wiki"),
  wikiUrbanisation: ref(
    "Urbanisation in India",
    "https://en.wikipedia.org/wiki/Urbanisation_in_India",
    "wiki",
  ),
  wikiSmartCity: ref("Smart city", "https://en.wikipedia.org/wiki/Smart_city", "wiki"),
  wikiAffirmativeAction: ref(
    "Affirmative action",
    "https://en.wikipedia.org/wiki/Affirmative_action",
    "wiki",
  ),
  wikiSocialJustice: ref("Social justice", "https://en.wikipedia.org/wiki/Social_justice", "wiki"),
  wikiStrategicAutonomy: ref(
    "Strategic autonomy",
    "https://en.wikipedia.org/wiki/Strategic_autonomy",
    "wiki",
  ),
  wikiNuclearDoctrine: ref(
    "India's nuclear programme",
    "https://en.wikipedia.org/wiki/India%27s_nuclear_programme",
    "wiki",
  ),
  wikiDiaspora: ref("Indian diaspora", "https://en.wikipedia.org/wiki/Indian_diaspora", "wiki"),
  wikiPakistan: ref("Pakistan", "https://en.wikipedia.org/wiki/Pakistan", "wiki"),
  wikiChina: ref("China", "https://en.wikipedia.org/wiki/China", "wiki"),
  wikiBangladesh: ref("Bangladesh", "https://en.wikipedia.org/wiki/Bangladesh", "wiki"),
  wikiNepal: ref("Nepal", "https://en.wikipedia.org/wiki/Nepal", "wiki"),
  wikiBhutan: ref("Bhutan", "https://en.wikipedia.org/wiki/Bhutan", "wiki"),
  wikiSriLanka: ref("Sri Lanka", "https://en.wikipedia.org/wiki/Sri_Lanka", "wiki"),
  wikiMyanmar: ref("Myanmar", "https://en.wikipedia.org/wiki/Myanmar", "wiki"),
  wikiIndoPacific: ref("Indo-Pacific", "https://en.wikipedia.org/wiki/Indo-Pacific", "wiki"),
  wikiUnitedStates: ref("United States", "https://en.wikipedia.org/wiki/United_States", "wiki"),
  wikiRussia: ref("Russia", "https://en.wikipedia.org/wiki/Russia", "wiki"),
  wikiEuropeanUnion: ref("European Union", "https://en.wikipedia.org/wiki/European_Union", "wiki"),
  wikiJapan: ref("Japan", "https://en.wikipedia.org/wiki/Japan", "wiki"),
  wikiBeltAndRoad: ref(
    "Belt and Road Initiative",
    "https://en.wikipedia.org/wiki/Belt_and_Road_Initiative",
    "wiki",
  ),
  wikiUNSC: ref(
    "United Nations Security Council",
    "https://en.wikipedia.org/wiki/United_Nations_Security_Council",
    "wiki",
  ),
  wikiBrettonWoods: ref("Bretton Woods system", "https://en.wikipedia.org/wiki/Bretton_Woods_system", "wiki"),
  wikiG20: ref("G20", "https://en.wikipedia.org/wiki/G20", "wiki"),
  wikiBRICS: ref("BRICS", "https://en.wikipedia.org/wiki/BRICS", "wiki"),
  wikiNAM: ref("Non-Aligned Movement", "https://en.wikipedia.org/wiki/Non-Aligned_Movement", "wiki"),
  wikiQuad: ref(
    "Quadrilateral Security Dialogue",
    "https://en.wikipedia.org/wiki/Quadrilateral_Security_Dialogue",
    "wiki",
  ),
  wikiSAARC: ref(
    "South Asian Association for Regional Cooperation",
    "https://en.wikipedia.org/wiki/South_Asian_Association_for_Regional_Cooperation",
    "wiki",
  ),
  wikiASEAN: ref("ASEAN", "https://en.wikipedia.org/wiki/ASEAN", "wiki"),
  wikiIORA: ref(
    "Indian Ocean Rim Association",
    "https://en.wikipedia.org/wiki/Indian_Ocean_Rim_Association",
    "wiki",
  ),
  wikiEthics: ref("Ethics", "https://en.wikipedia.org/wiki/Ethics", "wiki"),
  wikiEmotionalIntelligence: ref(
    "Emotional intelligence",
    "https://en.wikipedia.org/wiki/Emotional_intelligence",
    "wiki",
  ),
  wikiIntegrity: ref("Integrity", "https://en.wikipedia.org/wiki/Integrity", "wiki"),
  wikiWhistleblower: ref("Whistleblower", "https://en.wikipedia.org/wiki/Whistleblower", "wiki"),
  wikiUtilitarianism: ref("Utilitarianism", "https://en.wikipedia.org/wiki/Utilitarianism", "wiki"),
  wikiDeontology: ref("Deontology", "https://en.wikipedia.org/wiki/Deontology", "wiki"),
  wikiVirtueEthics: ref("Virtue ethics", "https://en.wikipedia.org/wiki/Virtue_ethics", "wiki"),
  wikiIndianEthics: ref("Indian ethics", "https://en.wikipedia.org/wiki/Indian_ethics", "wiki"),
  wikiAttitude: ref("Attitude (psychology)", "https://en.wikipedia.org/wiki/Attitude_(psychology)", "wiki"),
  wikiPublicServiceEthics: ref(
    "Public service ethics",
    "https://en.wikipedia.org/wiki/Public_service_ethics",
    "wiki",
  ),
  wikiConflictOfInterest: ref(
    "Conflict of interest",
    "https://en.wikipedia.org/wiki/Conflict_of_interest",
    "wiki",
  ),
  wikiCorporateGovernance: ref(
    "Corporate governance",
    "https://en.wikipedia.org/wiki/Corporate_governance",
    "wiki",
  ),
  wikiEnvironmentalEthics: ref(
    "Environmental ethics",
    "https://en.wikipedia.org/wiki/Environmental_ethics",
    "wiki",
  ),
  wikiTerrorism: ref("Terrorism", "https://en.wikipedia.org/wiki/Terrorism", "wiki"),
  wikiInsurgency: ref("Insurgency", "https://en.wikipedia.org/wiki/Insurgency", "wiki"),
  wikiMaoist: ref(
    "Naxalite–Maoist insurgency",
    "https://en.wikipedia.org/wiki/Naxalite%E2%80%93Maoist_insurgency",
    "wiki",
  ),
  wikiCommunalViolence: ref(
    "Communal violence in India",
    "https://en.wikipedia.org/wiki/Communal_violence_in_India",
    "wiki",
  ),
  wikiOrganisedCrime: ref("Organized crime", "https://en.wikipedia.org/wiki/Organized_crime", "wiki"),
  wikiMoneyLaundering: ref("Money laundering", "https://en.wikipedia.org/wiki/Money_laundering", "wiki"),
  wikiBorderManagement: ref("Border management", "https://en.wikipedia.org/wiki/Border_management", "wiki"),
  wikiCoastalSecurity: ref(
    "Indian Coast Guard",
    "https://en.wikipedia.org/wiki/Indian_Coast_Guard",
    "wiki",
  ),
  wikiImmigration: ref("Immigration", "https://en.wikipedia.org/wiki/Immigration", "wiki"),
  wikiCyberWarfare: ref("Cyberwarfare", "https://en.wikipedia.org/wiki/Cyberwarfare", "wiki"),
  wikiDataProtection: ref("Data protection", "https://en.wikipedia.org/wiki/Data_protection", "wiki"),
  wikiHumanTrafficking: ref("Human trafficking", "https://en.wikipedia.org/wiki/Human_trafficking", "wiki"),
  wikiDrugTrafficking: ref("Illegal drug trade", "https://en.wikipedia.org/wiki/Illegal_drug_trade", "wiki"),
  wikiIntelligence: ref("Intelligence agency", "https://en.wikipedia.org/wiki/Intelligence_agency", "wiki"),
  wikiPoliceReform: ref("Police reform in India", "https://en.wikipedia.org/wiki/Police_reform_in_India", "wiki"),
  wikiDefence: ref("Indian Armed Forces", "https://en.wikipedia.org/wiki/Indian_Armed_Forces", "wiki"),
  wikiNuclearDoctrineIndia: ref(
    "India's nuclear programme",
    "https://en.wikipedia.org/wiki/India%27s_nuclear_programme",
    "wiki",
  ),
};

export const EXPANSION_UNITS: Record<StaticLessonSubjectKey, SeriesUnit[]> = {
  geography: [
    {
      id: "geo-climate-systems",
      subjectKey: "geography",
      subject: "Geography",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Geography — Atmosphere, climate systems and global teleconnections",
      title: "The Climate Machine: Energy, Winds and Teleconnections",
      blurb:
        "Weather is local; climate is a machine. This unit follows energy from the Sun to the monsoon, then traces the planetary winds, jet streams and ocean-atmosphere oscillations that decide whether a season is kind or cruel.",
      sources: [
        "NCERT Class XI — Fundamentals of Physical Geography, chapters on solar radiation, pressure and winds",
        "IMD climate and monsoon notes",
        "IPCC assessment reports, physical science basis",
      ],
      references: [X.ncertPhysical, X.imd, X.wikiAtmosphericCirculation, X.wikiENSO],
      lessons: [
        L(
          "geo-climate-1",
          "Insolation and the Heat Budget",
          "Solar radiation, latitude and the heat budget; why the tropics are hot and the poles cold; albedo, sensible and latent heat; the greenhouse effect; seasons and the migration of the Sun; energy balance and climate sensitivity.",
          [
            "A diagram of the Earth's annual energy budget.",
            "A map of global insolation and albedo.",
          ],
          [
            "Why is the equator hotter than the poles?",
            "What is the heat budget?",
            "How does albedo change with ice cover?",
            "Why do seasons occur?",
          ],
        ),
        L(
          "geo-climate-2",
          "Pressure Belts, Winds and the General Circulation",
          "Global pressure belts; Hadley, Ferrel and polar cells; trade winds, westerlies and polar easterlies; land-sea thermal contrast; monsoons as a regional circulation; the Coriolis effect and geostrophic balance.",
          [
            "A three-cell general circulation diagram.",
            "A map of pressure belts and planetary winds.",
          ],
          [
            "Why are the trade winds reliable?",
            "How does the Coriolis effect shape winds?",
            "Why is the monsoon a seasonal reversal?",
            "What are the doldrums?",
          ],
        ),
        L(
          "geo-climate-3",
          "Jet Streams and the Upper-Air Steering",
          "Polar and subtropical jet streams; Rossby waves; the tropopause; upper-air troughs and ridges; western disturbances; tropical easterly jets; how upper-air flow steers cyclones and monsoon breaks.",
          [
            "A schematic of the polar and subtropical jets.",
            "A Rossby-wave diagram linking upper air to surface weather.",
          ],
          [
            "What is a jet stream?",
            "How do western disturbances bring winter rain?",
            "Why do jet streams matter for aviation?",
            "What is a monsoon break?",
          ],
        ),
        L(
          "geo-climate-4",
          "ENSO, the Indian Ocean Dipole and Teleconnections",
          "El Niño and La Niña; the Southern Oscillation; Walker circulation; the Indian Ocean Dipole; Madden–Julian Oscillation; teleconnections to Indian rainfall, heatwaves and cyclones; forecasting and uncertainty.",
          [
            "A map of the Walker circulation in normal and El Niño years.",
            "A timeline of ENSO, IOD and monsoon outcomes.",
          ],
          [
            "How does El Niño affect the Indian monsoon?",
            "What is the Indian Ocean Dipole?",
            "Why is the MJO important for rainfall?",
            "Can teleconnections be predicted?",
          ],
        ),
      ],
    },
    {
      id: "geo-ocean-depth",
      subjectKey: "geography",
      subject: "Geography",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Geography — Ocean relief, temperature, salinity, tides and marine resources",
      title: "The Ocean's Hidden Architecture",
      blurb:
        "The ocean is a planet inside the planet. Its floor has mountains and trenches, its water moves in slow rivers, and its chemistry shapes weather, fisheries and the carbon cycle.",
      sources: [
        "NCERT Class XI — Fundamentals of Physical Geography, oceanography chapters",
        "NCERT Class XI — India: Physical Environment, coastal and marine sections",
        "Ministry of Earth Sciences and INCOIS material",
      ],
      references: [X.ncertPhysical, X.wikiOceanFloor, X.wikiTide, X.wikiCoralReef],
      lessons: [
        L(
          "geo-ocean-1",
          "Ocean Relief and the Tectonic Floor",
          "Continental shelf, slope and rise; abyssal plains; mid-ocean ridges; trenches; seamounts; island arcs; the relation between plate tectonics and ocean floor; mapping the seafloor.",
          [
            "A labelled ocean-floor profile.",
            "A map of major ridges and trenches.",
          ],
          [
            "Why is the continental shelf important?",
            "How do trenches form?",
            "What is seafloor spreading?",
            "Why is the ocean floor poorly mapped?",
          ],
        ),
        L(
          "geo-ocean-2",
          "Temperature, Salinity and the Great Conveyor",
          "Vertical structure of the ocean; thermocline and halocline; salinity patterns; density-driven circulation; the global thermohaline conveyor; upwelling and downwelling; ocean heat storage.",
          [
            "A temperature-salinity-depth diagram.",
            "A simplified global conveyor-belt map.",
          ],
          [
            "Why is the ocean stratified?",
            "What drives the thermohaline circulation?",
            "How does upwelling support fisheries?",
            "Why does the ocean store so much heat?",
          ],
        ),
        L(
          "geo-ocean-3",
          "Waves, Tides and Coastal Processes",
          "Wave generation and breaking; swash and backwash; longshore drift; tides and their astronomical causes; spring and neap tides; storm surges; coastal erosion and deposition; deltas, estuaries and lagoons.",
          [
            "A diagram of wave refraction and longshore drift.",
            "A tide chart linking Sun, Moon and Earth.",
          ],
          [
            "What causes tides?",
            "Why are some coasts eroding?",
            "How does longshore drift build beaches?",
            "What is a storm surge?",
          ],
        ),
        L(
          "geo-ocean-4",
          "Coral Reefs, Fisheries and the Blue Economy",
          "Coral reef ecology; bleaching and ocean acidification; mangroves and seagrasses; fisheries and food security; marine protected areas; India's EEZ and blue economy; marine pollution.",
          [
            "A reef zonation diagram.",
            "A map of India's coastal and marine protected areas.",
          ],
          [
            "Why are coral reefs called rainforests of the sea?",
            "What is coral bleaching?",
            "How does the blue economy differ from marine exploitation?",
            "Why are mangroves important?",
          ],
        ),
      ],
    },
    {
      id: "geo-biogeography",
      subjectKey: "geography",
      subject: "Geography",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Geography — Biomes, soils, biogeochemical cycles and biodiversity",
      title: "Life on the Land: Biomes, Soils and Cycles",
      blurb:
        "Land is not a passive stage. Soil, plants and animals recycle water and carbon, build fertility and create the conditions for agriculture. This unit reads the land as a living system.",
      sources: [
        "NCERT Class XI — Fundamentals of Physical Geography, soil and biosphere chapters",
        "NCERT Class XII — Fundamentals of Human Geography, resource and environment chapters",
        "CBD and IPCC technical summaries",
      ],
      references: [X.ncertPhysical, X.cbd, X.wikiBiome, X.wikiBiogeochemicalCycle],
      lessons: [
        L(
          "geo-bio-1",
          "Biomes and the Biosphere",
          "Major biomes: tropical rainforest, savanna, desert, temperate forest, grassland, taiga and tundra; climate controls on vegetation; vertical zonation; India's forest types; biome boundaries and transitions.",
          [
            "A world biome map.",
            "A climate-vegetation correlation diagram.",
          ],
          [
            "What defines a biome?",
            "Why do rainforests have high biodiversity?",
            "How does altitude create vegetation zones?",
            "Which biomes are most threatened?",
          ],
        ),
        L(
          "geo-bio-2",
          "Soils and Biogeochemical Cycles",
          "Soil formation; parent rock, climate, organisms, relief and time; soil profiles; nitrogen, carbon, phosphorus and water cycles; soil fertility and degradation; the role of microbes; soil carbon and climate.",
          [
            "A soil-profile diagram.",
            "A simplified nitrogen cycle.",
          ],
          [
            "How does soil form?",
            "Why is nitrogen fixation important?",
            "How does soil store carbon?",
            "What is soil degradation?",
          ],
        ),
        L(
          "geo-bio-3",
          "Biodiversity and Protected Areas",
          "Levels of biodiversity; hotspots; endemism; protected area categories; wildlife corridors; sacred groves; community reserves; India's national parks and tiger reserves; conservation conflicts.",
          [
            "A map of global biodiversity hotspots.",
            "A protected-area network diagram.",
          ],
          [
            "What is a biodiversity hotspot?",
            "Why are corridors important?",
            "What is a sacred grove?",
            "How do protected areas affect local communities?",
          ],
        ),
        L(
          "geo-bio-4",
          "Forests, Grasslands and Land Use",
          "Forest types and canopy structure; grassland ecology; fire and grazing; deforestation and afforestation; plantations versus natural forests; land-use change; forest carbon and REDD+; India's forest cover assessments.",
          [
            "A forest-profile diagram.",
            "A land-use change chart.",
          ],
          [
            "Why are grasslands often mistaken for wasteland?",
            "What is the difference between plantations and forests?",
            "How does land-use change affect carbon?",
            "What is REDD+?",
          ],
        ),
      ],
    },
    {
      id: "geo-human-world",
      subjectKey: "geography",
      subject: "Geography",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Geography — Population, migration, agriculture, industry and urbanisation",
      title: "The Human World: People, Fields and Cities",
      blurb:
        "Geography is not only physical. People move, farm, build and trade, and their choices leave patterns on the land. This unit maps the human world and the forces that reshape it.",
      sources: [
        "NCERT Class XII — Fundamentals of Human Geography",
        "NCERT Class XII — India: People and Economy",
        "Census of India and World Bank data",
      ],
      references: [X.ncertHuman, X.census, X.wikiDemographicTransition, X.wikiMigration],
      lessons: [
        L(
          "geo-human-1",
          "Population, Density and the Demographic Transition",
          "Population distribution and density; birth and death rates; the demographic transition; age structure; population pyramids; India's demographic dividend; ageing and dependency ratios.",
          [
            "A demographic transition diagram.",
            "Population pyramids for India and a developed country.",
          ],
          [
            "What is the demographic dividend?",
            "Why does population density vary?",
            "How does age structure affect policy?",
            "What happens when a population ages?",
          ],
        ),
        L(
          "geo-human-2",
          "Migration and the Making of Places",
          "Push and pull factors; rural-urban migration; international migration; remittances; refugees and displacement; diaspora; migration corridors; the politics of migration.",
          [
            "A migration-flow map.",
            "A push-pull factor diagram.",
          ],
          [
            "Why do people migrate?",
            "What are remittances?",
            "How does migration change source and destination places?",
            "What is the difference between a refugee and an economic migrant?",
          ],
        ),
        L(
          "geo-human-3",
          "Agriculture and the Shape of the Land",
          "Subsistence and commercial farming; intensive and extensive agriculture; plantation, mixed and dairy farming; Green Revolution; irrigation; cropping patterns; food security; agri-ecological zones.",
          [
            "A world agricultural systems map.",
            "A diagram of cropping intensity and irrigation.",
          ],
          [
            "Why did the Green Revolution matter?",
            "What is intensive subsistence farming?",
            "How does irrigation change land use?",
            "What are agri-ecological zones?",
          ],
        ),
        L(
          "geo-human-4",
          "Industry, Transport and the Urban World",
          "Industrial location factors; primary, secondary and tertiary activities; transport networks; ports and corridors; urbanisation and primate cities; smart cities; land-use models; the geography of inequality.",
          [
            "A map of major industrial regions and corridors.",
            "A diagram of urban land-use models.",
          ],
          [
            "Why do industries cluster?",
            "How do transport corridors shape growth?",
            "What is a primate city?",
            "Why are cities expanding faster than planning?",
          ],
        ),
      ],
    },
  ],
  polity: [
    {
      id: "pol-constitution-deep",
      subjectKey: "polity",
      subject: "Polity",
      paper: "Prelims GS-I · Mains GS-II",
      syllabusNode: "Polity — Constituent Assembly, borrowed features, constitutional morality and the basic structure",
      title: "The Constitution's Deep Structure",
      blurb:
        "The Constitution is a text, but also a settlement. This unit reads the debates behind the text: what was borrowed, what was adapted, and why the basic structure doctrine became the republic's quiet safeguard.",
      sources: [
        "NCERT Class XI — Indian Constitution at Work",
        "Constituent Assembly Debates (selected)",
        "M. Laxmikanth — Indian Polity, constitutional framework chapters",
      ],
      references: [X.parliament, X.wikiConstituentAssembly, X.wikiConstitutionalMorality, X.wikiBasicStructure],
      lessons: [
        L(
          "pol-const-1",
          "The Constituent Assembly and the Art of Compromise",
          "The Constituent Assembly's composition and committees; the Objective Resolution; federal versus unitary debates; minority rights; the language question; how consensus was built; the costs of compromise.",
          [
            "A timeline from the Cabinet Mission to the first Republic Day.",
            "A diagram of the major Assembly committees.",
          ],
          [
            "Why was the Constituent Assembly not directly elected?",
            "What was the Objective Resolution?",
            "How were minority rights negotiated?",
            "What compromises shaped the Constitution?",
          ],
        ),
        L(
          "pol-const-2",
          "Borrowed Features and Indian Adaptations",
          "Sources of the Constitution: British parliamentary government, American federalism and rights, Irish directive principles, Canadian federation, Australian concurrent list; what was borrowed and what was changed; the myth of a patchwork constitution.",
          [
            "A table mapping borrowed features to their source countries.",
            "A diagram of the constitutional tree.",
          ],
          [
            "Which features came from Britain?",
            "Why did India adopt a parliamentary system?",
            "How are Directive Principles different from Fundamental Rights?",
            "What makes the Indian Constitution distinctive?",
          ],
        ),
        L(
          "pol-const-3",
          "Constitutional Morality and the Preamble",
          "The Preamble's values; justice, liberty, equality and fraternity; constitutional morality as a governing idea; the tension between popular will and constitutional limits; secularism and the basic structure; the preamble as an interpretive key.",
          [
            "A visual map of the Preamble's values.",
            "A diagram of the tension between majority will and constitutional limits.",
          ],
          [
            "What is constitutional morality?",
            "Is the Preamble enforceable?",
            "How does fraternity differ from equality?",
            "Can the Preamble be amended?",
          ],
        ),
        L(
          "pol-const-4",
          "Amendment, Basic Structure and Constitutional Change",
          "Article 368; amendment procedures; the Kesavananda Bharati case; the basic structure doctrine; judicial review of amendments; the emergency amendments; the politics of constitutional change; comparative amendment rigidity.",
          [
            "A flowchart of the amendment process.",
            "A timeline of landmark amendment cases.",
          ],
          [
            "What is the basic structure doctrine?",
            "Can Parliament amend Fundamental Rights?",
            "Why is the amendment process partly rigid?",
            "What was the significance of Kesavananda Bharati?",
          ],
        ),
      ],
    },
    {
      id: "pol-parliament-depth",
      subjectKey: "polity",
      subject: "Polity",
      paper: "Prelims GS-I · Mains GS-II",
      syllabusNode: "Polity — Parliamentary procedure, financial control and committees",
      title: "Parliament in Practice",
      blurb:
        "Parliament is not only a debating chamber. It is a law factory, a money controller and a scrutiniser of government. This unit follows a bill from drafting to assent and asks why committees matter more than headlines suggest.",
      sources: [
        "NCERT Class XI — Indian Constitution at Work",
        "PRS Legislative Research primers",
        "Parliamentary Standing Committee reports",
      ],
      references: [X.parliament, X.prs, X.wikiParliamentaryCommittee, X.supremeCourt],
      lessons: [
        L(
          "pol-parl-1",
          "Lawmaking: From Bill to Act",
          "Types of bills; ordinary, money and constitutional amendment bills; first, second and third readings; committee stage; joint sittings; presidential assent; ordinance-making; delegated legislation; private members' bills.",
          [
            "A flowchart of how a bill becomes an act.",
            "A comparison table of bill types.",
          ],
          [
            "What is the difference between a money bill and a financial bill?",
            "When is a joint sitting used?",
            "Can the President refuse assent?",
            "What is delegated legislation?",
          ],
        ),
        L(
          "pol-parl-2",
          "Money, Budget and Financial Control",
          "The annual budget; demands for grants; appropriation and finance bills; cut motions; the Public Accounts Committee; the Comptroller and Auditor General; off-budget borrowing; fiscal accountability.",
          [
            "A diagram of the budget cycle.",
            "A flowchart of parliamentary financial control.",
          ],
          [
            "Why is the budget an annual exercise?",
            "What is a cut motion?",
            "What does the CAG audit?",
            "How does Parliament scrutinise spending?",
          ],
        ),
        L(
          "pol-parl-3",
          "Committees and the Real Work of Scrutiny",
          "Standing and select committees; departmental committees; the Public Accounts, Estimates and Public Undertakings committees; committee reports; evidence and witnesses; why committees are called mini-parliaments; reform proposals.",
          [
            "A diagram of the committee system.",
            "A sample committee-report structure.",
          ],
          [
            "Why are committees important?",
            "What is a standing committee?",
            "How do committees improve legislation?",
            "Why do committees sometimes fail?",
          ],
        ),
        L(
          "pol-parl-4",
          "Privileges, Motions and Confidence",
          "Parliamentary privileges; question hour; zero hour; adjournment and no-confidence motions; censure; confidence votes; anti-defection; whips; the decline of deliberation and the rise of disruption.",
          [
            "A table of parliamentary motions and their effects.",
            "A diagram of the anti-defection framework.",
          ],
          [
            "What are parliamentary privileges?",
            "What is a no-confidence motion?",
            "How does the anti-defection law work?",
            "Why has question hour declined?",
          ],
        ),
      ],
    },
    {
      id: "pol-federalism-depth",
      subjectKey: "polity",
      subject: "Polity",
      paper: "Prelims GS-I · Mains GS-II",
      syllabusNode: "Polity — Centre-State relations, fiscal federalism and asymmetric federalism",
      title: "The Federal Bargain",
      blurb:
        "India is a federation with a strong centre. The bargain is renegotiated every time taxes are shared, a river is disputed or a state asks for special treatment. This unit maps the bargain.",
      sources: [
        "NCERT Class XI — Indian Constitution at Work",
        "Finance Commission reports",
        "Sarkaria and Punchhi Commission summaries",
      ],
      references: [X.financeCommission, X.wikiFinanceCommission, X.parliament, X.supremeCourt],
      lessons: [
        L(
          "pol-fed-1",
          "Legislative and Administrative Relations",
          "Union, state and concurrent lists; residuary powers; repugnancy; Article 356; governors and central control; administrative relations; inter-state coordination; the shift from cooperative to bargaining federalism.",
          [
            "A diagram of the three lists and residuary powers.",
            "A map of India's states and union territories.",
          ],
          [
            "What is the concurrent list?",
            "How does Article 356 work?",
            "What is cooperative federalism?",
            "Why do states complain about central agencies?",
          ],
        ),
        L(
          "pol-fed-2",
          "Fiscal Federalism and the Finance Commission",
          "Tax devolution; the Finance Commission's terms of reference; horizontal and vertical distribution; GST Council; cess and surcharge; fiscal space of states; conditional transfers; the politics of resource sharing.",
          [
            "A diagram of the federal fiscal transfer system.",
            "A chart of tax devolution shares over time.",
          ],
          [
            "What does the Finance Commission do?",
            "Why are cess and surcharge contested?",
            "How does the GST Council decide?",
            "What is vertical and horizontal devolution?",
          ],
        ),
        L(
          "pol-fed-3",
          "Inter-State Councils and River Disputes",
          "Inter-State Council; zonal councils; inter-state river water disputes; tribunals; the Cauvery and Krishna disputes; federal coordination; river basin authorities; the role of the Supreme Court.",
          [
            "A diagram of inter-state dispute-resolution bodies.",
            "A map of major inter-state river disputes.",
          ],
          [
            "What is the Inter-State Council?",
            "How are river disputes adjudicated?",
            "Why are water disputes so persistent?",
            "Can states refuse to share water?",
          ],
        ),
        L(
          "pol-fed-4",
          "Asymmetry: Special Provisions and Union Territories",
          "Article 370 and its abrogation; special provisions for north-eastern states; union territories; Delhi and Puducherry; asymmetric federalism; the balance between national unity and regional identity.",
          [
            "A map of states with special constitutional provisions.",
            "A table of union territories and their governance.",
          ],
          [
            "What is asymmetric federalism?",
            "Why did Article 370 exist?",
            "How are union territories governed?",
            "What is the status of Delhi?",
          ],
        ),
      ],
    },
    {
      id: "pol-governance-depth",
      subjectKey: "polity",
      subject: "Polity",
      paper: "Prelims GS-I · Mains GS-II",
      syllabusNode: "Polity — Civil services, transparency, e-governance and local government",
      title: "Governance and Accountability",
      blurb:
        "The Constitution creates institutions; governance is what happens when they meet citizens. This unit looks at the administrative state, the right to information, digital delivery and the local bodies closest to daily life.",
      sources: [
        "NCERT Class XI — Indian Constitution at Work",
        "Second Administrative Reforms Commission reports",
        "RTI Act and 73rd/74th Amendment texts",
      ],
      references: [X.wikiRTI, X.cic, X.wikiCivilService, X.wikiLocalGovernment],
      lessons: [
        L(
          "pol-govd-1",
          "Civil Services and the Administrative State",
          "The civil service's role; generalists and specialists; All India Services; recruitment and training; neutrality and responsiveness; administrative ethics; the steel frame and its critics; reform proposals.",
          [
            "A diagram of the civil-service structure.",
            "A table of All India, central and state services.",
          ],
          [
            "Why does India need All India Services?",
            "What is administrative neutrality?",
            "How are civil servants trained?",
            "What are the main criticisms of the civil service?",
          ],
        ),
        L(
          "pol-govd-2",
          "RTI, Transparency and Social Audit",
          "The Right to Information Act; information commissions; exemptions; proactive disclosure; social audit; citizen charters; whistleblower protection; transparency versus privacy; the RTI amendment controversy.",
          [
            "A flowchart of an RTI request.",
            "A diagram of the information-commission structure.",
          ],
          [
            "What is the RTI Act?",
            "Which information is exempt?",
            "What is social audit?",
            "Why is RTI important for accountability?",
          ],
        ),
        L(
          "pol-govd-3",
          "E-Governance and Digital Public Services",
          "Digital India; Aadhaar; DigiLocker; UMANG; direct benefit transfer; digital exclusion; data protection; service delivery; platform governance; the promise and limits of e-governance.",
          [
            "A diagram of a digital service-delivery stack.",
            "A map of digital public infrastructure components.",
          ],
          [
            "What is digital public infrastructure?",
            "How does Aadhaar change service delivery?",
            "What is digital exclusion?",
            "Why does data protection matter?",
          ],
        ),
        L(
          "pol-govd-4",
          "Local Government: Panchayats and Municipalities",
          "73rd and 74th Amendments; three-tier panchayati raj; gram sabha; municipal bodies; reservation; state finance commissions; local planning; fiscal weakness; the gap between devolution and practice.",
          [
            "A diagram of the panchayati raj structure.",
            "A table of rural and urban local bodies.",
          ],
          [
            "What did the 73rd Amendment change?",
            "What is the gram sabha?",
            "Why are local bodies fiscally weak?",
            "How do municipalities raise revenue?",
          ],
        ),
      ],
    },
  ],
  economy: [
    {
      id: "eco-micro",
      subjectKey: "economy",
      subject: "Economy",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Economy — Microeconomic foundations, markets and market failure",
      title: "Microeconomics for Policy",
      blurb:
        "Before aggregates, there are choices. This unit builds the microeconomic lens: how households and firms decide, how markets coordinate, and why markets sometimes fail in ways that demand public policy.",
      sources: [
        "NCERT Class XII — Introductory Microeconomics",
        "Standard microeconomics primers",
        "Government economic surveys",
      ],
      references: [X.wikiDemandSupply, X.wikiElasticity, X.wikiMarketStructure, X.wikiMarketFailure],
      lessons: [
        L(
          "eco-micro-1",
          "Demand, Supply and Elasticity",
          "Demand curves; supply curves; equilibrium; shifts versus movements; price elasticity; income and cross elasticity; applications to taxation, subsidies and price controls; why elasticity matters for policy.",
          [
            "A demand-supply equilibrium diagram.",
            "An elasticity and revenue chart.",
          ],
          [
            "What is price elasticity of demand?",
            "Why does the government tax cigarettes?",
            "What happens when a price ceiling is imposed?",
            "How do supply shocks affect prices?",
          ],
        ),
        L(
          "eco-micro-2",
          "Consumer Choice and Producer Behaviour",
          "Utility and preferences; budget constraints; indifference curves; production functions; costs in the short and long run; economies of scale; profit maximisation; behavioural economics and bounded rationality.",
          [
            "An indifference-curve diagram.",
            "A short-run cost-curve diagram.",
          ],
          [
            "What is marginal utility?",
            "Why do average costs fall and then rise?",
            "What are economies of scale?",
            "How does behavioural economics challenge rational choice?",
          ],
        ),
        L(
          "eco-micro-3",
          "Market Structures and Competition",
          "Perfect competition; monopoly; monopolistic competition; oligopoly; barriers to entry; price discrimination; cartels; competition law; network effects and digital markets.",
          [
            "A spectrum of market structures.",
            "A diagram of monopoly pricing.",
          ],
          [
            "Why is perfect competition rare?",
            "How does a monopoly set price?",
            "What is an oligopoly?",
            "Why do digital markets tend to concentrate?",
          ],
        ),
        L(
          "eco-micro-4",
          "Market Failure, Externalities and Public Goods",
          "Externalities; public goods; common-pool resources; information asymmetry; moral hazard; adverse selection; Pigouvian taxes; regulation; the Coase theorem; when markets should not be left alone.",
          [
            "A diagram of a negative externality.",
            "A table of public goods and common-pool resources.",
          ],
          [
            "What is a negative externality?",
            "Why are public goods underprovided?",
            "What is information asymmetry?",
            "How can policy correct market failure?",
          ],
        ),
      ],
    },
    {
      id: "eco-macro",
      subjectKey: "economy",
      subject: "Economy",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Economy — National income, inflation, unemployment and growth",
      title: "Macroeconomic Foundations",
      blurb:
        "The economy is a system of flows. This unit follows income, spending, prices and jobs through the circular flow, then asks why economies grow, stumble and sometimes spiral.",
      sources: [
        "NCERT Class XII — Introductory Macroeconomics",
        "Economic Survey chapters on growth and inflation",
        "MoSPI national accounts",
      ],
      references: [X.mospi, X.rbi, X.wikiNationalIncome, X.wikiInflation],
      lessons: [
        L(
          "eco-macro-1",
          "National Income and the Circular Flow",
          "GDP, GNP and NNP; factor cost versus market price; nominal and real GDP; the circular flow of income; consumption, investment, government and net exports; national accounts; what GDP misses.",
          [
            "A circular-flow diagram.",
            "A chart of India's GDP components.",
          ],
          [
            "What is the difference between GDP and GNP?",
            "Why is real GDP used for growth?",
            "What does GDP not measure?",
            "How is national income calculated?",
          ],
        ),
        L(
          "eco-macro-2",
          "Inflation, Unemployment and the Phillips Curve",
          "Types of inflation; demand-pull and cost-push; inflation expectations; the Phillips curve; stagflation; unemployment types; the natural rate; India's inflation dynamics; monetary policy responses.",
          [
            "A Phillips-curve diagram.",
            "A chart of CPI and WPI inflation.",
          ],
          [
            "What causes inflation?",
            "What is stagflation?",
            "Why is unemployment hard to measure?",
            "How does the RBI respond to inflation?",
          ],
        ),
        L(
          "eco-macro-3",
          "Business Cycles and Stabilisation",
          "Expansion, peak, contraction and trough; demand and supply shocks; fiscal and monetary stabilisers; automatic stabilisers; output gaps; recessions and depressions; policy lags.",
          [
            "A business-cycle diagram.",
            "A chart of fiscal and monetary responses.",
          ],
          [
            "What is a business cycle?",
            "How does fiscal policy stabilise demand?",
            "What are automatic stabilisers?",
            "Why do policy responses lag?",
          ],
        ),
        L(
          "eco-macro-4",
          "Growth, Productivity and Structural Change",
          "Sources of growth; capital, labour and total factor productivity; structural transformation; Lewis turning point; convergence; middle-income trap; India's growth story; inequality and growth.",
          [
            "A growth-accounting diagram.",
            "A chart of sectoral shares in GDP and employment.",
          ],
          [
            "What is total factor productivity?",
            "Why does structural change matter?",
            "What is the middle-income trap?",
            "Is India's growth inclusive?",
          ],
        ),
      ],
    },
    {
      id: "<｜begin▁of▁sentence｜>eco-finance-depth",
      subjectKey: "economy",
      subject: "Economy",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Economy — Money, banking, financial markets and inclusion",
      title: "Money, Banking and Markets",
      blurb:
        "Finance is the economy's plumbing. This unit traces money from the RBI to banks, markets and fintech platforms, and asks how stability, access and innovation can be balanced.",
      sources: [
        "RBI reports and monetary policy statements",
        "SEBI and financial-sector reports",
        "Economic Survey chapters on financial markets",
      ],
      references: [X.rbi, X.wikiMonetaryPolicy, X.wikiBanking, X.wikiStockMarket],
      lessons: [
        L(
          "eco-fin-1",
          "The RBI and Monetary Policy",
          "The RBI's mandate; repo, reverse repo and liquidity; CRR and SLR; the monetary policy committee; transmission; inflation targeting; open market operations; exchange-rate management.",
          [
            "A diagram of the monetary-policy toolkit.",
            "A chart of the policy rate and inflation.",
          ],
          [
            "What is the repo rate?",
            "How does the MPC decide rates?",
            "Why is monetary transmission slow?",
            "What is inflation targeting?",
          ],
        ),
        L(
          "eco-fin-2",
          "Banks, NPAs and Financial Stability",
          "Bank balance sheets; credit creation; non-performing assets; Basel norms; resolution and recapitalisation; shadow banking; cooperative banks; deposit insurance; financial stability.",
          [
            "A bank balance-sheet diagram.",
            "A chart of NPA cycles.",
          ],
          [
            "How do banks create credit?",
            "What is an NPA?",
            "Why do bank crises spread?",
            "What is Basel III?",
          ],
        ),
        L(
          "eco-fin-3",
          "Stock Markets, Bonds and Derivatives",
          "Primary and secondary markets; SEBI; equity and debt; bond yields and prices; derivatives; hedging and speculation; market bubbles; retail participation; financial literacy.",
          [
            "A diagram of the financial-market ecosystem.",
            "A chart of the bond-yield/price relationship.",
          ],
          [
            "What is the difference between equity and debt?",
            "Why do bond yields rise when prices fall?",
            "What are derivatives?",
            "How does SEBI protect investors?",
          ],
        ),
        L(
          "eco-fin-4",
          "Fintech, Digital Payments and Financial Inclusion",
          "UPI and digital payments; fintech lending; peer-to-peer platforms; digital banking; financial inclusion; credit access; consumer protection; data privacy; the risks of rapid innovation.",
          [
            "A diagram of the digital-payments stack.",
            "A chart of financial-inclusion indicators.",
          ],
          [
            "How does UPI work?",
            "What is financial inclusion?",
            "What risks do fintech lenders create?",
            "How should digital finance be regulated?",
          ],
        ),
      ],
    },
    {
      id: "eco-public-finance",
      subjectKey: "economy",
      subject: "Economy",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Economy — Taxation, subsidies, deficits and fiscal consolidation",
      title: "Taxation and Public Finance",
      blurb:
        "The budget is a moral document as much as an accounting one. This unit examines who pays, who benefits and how governments borrow, spend and stabilise.",
      sources: [
        "Union Budget documents",
        "Economic Survey chapters on fiscal policy",
        "FRBM Review Committee report",
      ],
      references: [X.budget, X.wikiTax, X.wikiGST, X.wikiFiscalPolicy],
      lessons: [
        L(
          "eco-pf-1",
          "Taxation: Principles and Incidence",
          "Direct and indirect taxes; progressive, proportional and regressive taxation; tax incidence; deadweight loss; tax evasion and avoidance; base erosion; the equity-efficiency trade-off.",
          [
            "A diagram of tax incidence.",
            "A table of direct and indirect taxes.",
          ],
          [
            "What is tax incidence?",
            "Why are indirect taxes regressive?",
            "What is the equity-efficiency trade-off?",
            "How can tax avoidance be curbed?",
          ],
        ),
        L(
          "eco-pf-2",
          "GST and Indirect Taxes",
          "The GST design; CGST, SGST and IGST; the GST Council; slabs and exemptions; input tax credit; compensation; revenue buoyancy; GST and federalism; reform debates.",
          [
            "A diagram of the GST flow.",
            "A table of GST rates and slabs.",
          ],
          [
            "What is input tax credit?",
            "How does the GST Council work?",
            "Why are some goods exempt?",
            "How has GST changed federalism?",
          ],
        ),
        L(
          "eco-pf-3",
          "Subsidies, Expenditure and Deficit Financing",
          "Types of subsidies; food, fertiliser and fuel subsidies; targeting; leakages; expenditure classification; revenue and fiscal deficits; primary deficit; debt sustainability; crowding out.",
          [
            "A diagram of the deficit concepts.",
            "A chart of subsidy expenditure.",
          ],
          [
            "What is a fiscal deficit?",
            "Why do subsidies persist?",
            "What is crowding out?",
            "How can subsidies be better targeted?",
          ],
        ),
        L(
          "eco-pf-4",
          "FRBM, Fiscal Consolidation and Debt",
          "The Fiscal Responsibility and Budget Management Act; fiscal rules; escape clauses; debt-to-GDP; state finances; off-budget liabilities; fiscal councils; credibility and flexibility.",
          [
            "A chart of deficit and debt trajectories.",
            "A diagram of the fiscal-rule framework.",
          ],
          [
            "What is the FRBM Act?",
            "Why do fiscal rules need escape clauses?",
            "What is a sustainable debt level?",
            "How can fiscal credibility be improved?",
          ],
        ),
      ],
    },
  ],
  history: [
    {
      id: "his-ancient-depth",
      subjectKey: "history",
      subject: "History",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "History — Ancient India: prehistory, Harappa, Vedic age, Mauryas and the classical age",
      title: "Ancient India in Depth",
      blurb:
        "Ancient India is not a single story. It is a series of transitions: from hunter-gatherers to cities, from cities to kingdoms, from kingdoms to empires, and from empire to a classical culture that still shapes the subcontinent.",
      sources: [
        "NCERT Class XI — Themes in Indian History",
        "R. S. Sharma — India's Ancient Past",
        "Upinder Singh — A History of Ancient and Early Medieval India",
      ],
      references: [X.wikiHarappa, X.wikiVedic, X.wikiMaurya, X.wikiGupta],
      lessons: [
        L(
          "his-anc-1",
          "Prehistory, Harappa and the First Cities",
          "Palaeolithic, Mesolithic and Neolithic transitions; hunter-gatherers; early farming; Harappan urbanism; town planning, drainage, seals and trade; the script; decline and debate; the late Harappan transition.",
          [
            "A timeline from prehistory to the Harappan cities.",
            "A map of Harappan sites and trade routes.",
          ],
          [
            "What made the Harappan cities urban?",
            "Why is the Harappan script undeciphered?",
            "How did agriculture change society?",
            "What caused the decline of Harappan cities?",
          ],
        ),
        L(
          "his-anc-2",
          "The Vedic Age and the Rise of Kingdoms",
          "The Rigveda and Vedic society; pastoralism and agriculture; the sabha and samiti; varna and jati; the later Vedic period; iron and the Ganges valley; mahajanapadas; the rise of Magadha; early states and taxation.",
          [
            "A map of the Vedic heartland and mahajanapadas.",
            "A diagram of Vedic social and political institutions.",
          ],
          [
            "What does the Rigveda tell us about Vedic society?",
            "How did iron change agriculture?",
            "Why did Magadha become powerful?",
            "What is the difference between varna and jati?",
          ],
        ),
        L(
          "his-anc-3",
          "Mauryan Empire and the Art of Administration",
          "Chandragupta, Chanakya and the Arthashastra; Ashoka and dhamma; provincial administration; taxation and spies; the edicts; trade and roads; the empire's limits; the Mauryan legacy.",
          [
            "A map of the Mauryan Empire.",
            "A diagram of Mauryan administrative structure.",
          ],
          [
            "What does the Arthashastra teach about statecraft?",
            "Why did Ashoka adopt dhamma?",
            "How was the Mauryan Empire administered?",
            "What happened after Ashoka?",
          ],
        ),
        L(
          "his-anc-4",
          "Post-Mauryan, Gupta and the Classical Age",
          "Indo-Greeks, Shakas and Kushanas; Satavahanas; trade with Rome; Buddhism and Jainism; the Gupta empire; Kalidasa and classical literature; temple beginnings; science and mathematics; the classical synthesis.",
          [
            "A timeline from the Mauryas to the Guptas.",
            "A map of trade routes and cultural centres.",
          ],
          [
            "How did the Silk Road shape Indian history?",
            "What was the Gupta golden age?",
            "How did Buddhism and Jainism spread?",
            "What changed in the post-Mauryan economy?",
          ],
        ),
      ],
    },
    {
      id: "his-medieval-depth",
      subjectKey: "history",
      subject: "History",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "History — Medieval India: Delhi Sultanate, Vijayanagara, Mughals and composite culture",
      title: "Medieval India: Sultans, Sultans and Syncretism",
      blurb:
        "Medieval India was not a gap between empires. It was a period of new states, new networks and new cultural mixtures. This unit follows the Delhi Sultanate, the Deccan kingdoms and the Mughals into the age of composite culture.",
      sources: [
        "NCERT Class XII — Themes in Indian History, parts II–III",
        "Satish Chandra — Medieval India",
        "Selected Persian chronicles and travel accounts",
      ],
      references: [X.wikiDelhiSultanate, X.wikiVijayanagara, X.wikiMughal, X.wikiBhakti],
      lessons: [
        L(
          "his-med-1",
          "The Delhi Sultanate",
          "Ghaznavid and Ghurid invasions; the Slave, Khalji, Tughlaq, Sayyid and Lodi dynasties; military organisation; iqta and revenue; market reforms; Mongol pressure; Timur's invasion; the Sultanate's legacy.",
          [
            "A timeline of the five Delhi Sultanate dynasties.",
            "A map of the Sultanate at its height.",
          ],
          [
            "How did the Delhi Sultanate raise revenue?",
            "What were Alauddin Khalji's market reforms?",
            "Why did the Tughlaqs move the capital?",
            "How did Mongol invasions shape the Sultanate?",
          ],
        ),
        L(
          "his-med-2",
          "Vijayanagara, Bahmani and the Deccan",
          "The rise of Vijayanagara; Krishnadevaraya; the Bahmani Sultanate; the Deccan wars; trade and temples; the Vijayanagara economy; the battle of Talikota; the Deccan's cultural synthesis.",
          [
            "A map of Vijayanagara and the Bahmani Sultanate.",
            "A diagram of Deccan trade networks.",
          ],
          [
            "Why was Vijayanagara important?",
            "What was the Bahmani Sultanate?",
            "How did Deccan trade connect India to the world?",
            "What happened at Talikota?",
          ],
        ),
        L(
          "his-med-3",
          "The Mughal Empire and Its Administration",
          "Babur to Aurangzeb; mansabdari and jagirdari; revenue administration; the Rajputs and Mughal alliances; the Deccan campaigns; art and architecture; the Mughal economy; decline and debate.",
          [
            "A timeline of the Mughal emperors.",
            "A diagram of Mughal administrative structure.",
          ],
          [
            "What was the mansabdari system?",
            "How did the Mughals manage religious diversity?",
            "Why did the Mughal Empire decline?",
            "What was the Mughal revenue system?",
          ],
        ),
        L(
          "his-med-4",
          "Bhakti, Sufi and the Making of Composite Culture",
          "Bhakti saints and movements; Kabir, Mirabai, Nanak and Tulsidas; Sufi orders and shrines; the Chishti tradition; language and literature; music and painting; syncretism and its limits.",
          [
            "A map of Bhakti and Sufi centres.",
            "A diagram of devotional networks.",
          ],
          [
            "What did Bhakti challenge?",
            "How did Sufism spread in India?",
            "What is composite culture?",
            "Why did devotional movements matter politically?",
          ],
        ),
      ],
    },
    {
      id: "his-colonial-depth",
      subjectKey: "history",
      subject: "History",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "History — Colonial India: conquest, economy, society and reform",
      title: "Colonial India: Economy and Society",
      blurb:
        "Colonialism was not only a political event. It reorganised land, labour, trade and knowledge. This unit follows the British conquest and asks how colonial rule reshaped India's economy and society.",
      sources: [
        "NCERT Class XII — Themes in Indian History, part III",
        "Bipan Chandra — India's Struggle for Independence",
        "Economic and social history readers",
      ],
      references: [X.wikiBritishRaj, X.wikiIndependence, X.wikiIndustrialRevolution, X.wikiIndependence],
      lessons: [
        L(
          "his-col-1",
          "European Expansion and the British Conquest",
          "Portuguese, Dutch, French and British trading companies; the Battle of Plassey; expansion through treaties and war; the Doctrine of Lapse; 1857 and its aftermath; the Crown takes over; the making of British India.",
          [
            "A map of European trading posts in India.",
            "A timeline from Plassey to the Crown Raj.",
          ],
          [
            "Why did the British succeed in India?",
            "What happened at Plassey?",
            "What was the Doctrine of Lapse?",
            "How did 1857 change colonial rule?",
          ],
        ),
        L(
          "his-col-2",
          "Land, Revenue and the Agrarian Economy",
          "Permanent Settlement; Ryotwari and Mahalwari systems; land revenue and intermediaries; commercialisation of agriculture; indigo and cash crops; famines; rural indebtedness; the agrarian structure.",
          [
            "A map of land-revenue systems in colonial India.",
            "A diagram of the agrarian economy.",
          ],
          [
            "What was the Permanent Settlement?",
            "How did revenue systems differ?",
            "Why did famines recur?",
            "What was the impact of commercialisation?",
          ],
        ),
        L(
          "his-col-3",
          "Deindustrialisation and the Colonial Economy",
          "Decline of Indian handicrafts; textile competition; railways and integration; drain of wealth; colonial trade; banking and finance; the rise of a money economy; the debate on deindustrialisation.",
          [
            "A chart of India's trade and craft decline.",
            "A map of railways and ports.",
          ],
          [
            "What was the drain of wealth?",
            "Did colonialism deindustrialise India?",
            "How did railways change the economy?",
            "What was the role of Indian capital?",
          ],
        ),
        L(
          "his-col-4",
          "Education, Social Reform and the Public Sphere",
          "Macaulay's Minute; English education; missionaries; social reform movements; sati, widow remarriage and caste; the press; women's education; the emergence of a public sphere; reform and revival.",
          [
            "A timeline of colonial education and reform.",
            "A diagram of the emerging public sphere.",
          ],
          [
            "What did Macaulay's Minute do?",
            "How did reformers challenge social practices?",
            "What role did the press play?",
            "Was colonial education emancipatory or controlling?",
          ],
        ),
      ],
    },
    {
      id: "his-world-depth",
      subjectKey: "history",
      subject: "History",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "History — World history: Renaissance to the Cold War",
      title: "The Modern World in Depth",
      blurb:
        "The modern world was made by ideas, revolutions and wars. This unit follows the intellectual and industrial transformations that produced the world India inherited, and the conflicts that shaped the twentieth century.",
      sources: [
        "NCERT Class XI — Themes in World History",
        "Standard world-history surveys",
        "Selected primary documents",
      ],
      references: [X.wikiRenaissance, X.wikiFrenchRevolution, X.wikiWorldWarII, X.wikiColdWar],
      lessons: [
        L(
          "his-worldd-1",
          "Renaissance, Reformation and the Enlightenment",
          "Humanism and the Renaissance; printing and the spread of ideas; the Reformation; the Scientific Revolution; the Enlightenment; reason, rights and the public sphere; the intellectual foundations of modernity.",
          [
            "A timeline from the Renaissance to the Enlightenment.",
            "A map of the printing and Reformation networks.",
          ],
          [
            "What was humanism?",
            "How did printing change Europe?",
            "What did the Reformation challenge?",
            "What ideas did the Enlightenment contribute?",
          ],
        ),
        L(
          "his-worldd-2",
          "Revolutions: France and Industrial Britain",
          "The French Revolution; liberty, equality and fraternity; the Napoleonic aftermath; the Industrial Revolution; steam, factories and railways; capitalism and labour; the social consequences of industrialisation.",
          [
            "A timeline of the French and Industrial revolutions.",
            "A diagram of the industrial economy.",
          ],
          [
            "What caused the French Revolution?",
            "How did the Industrial Revolution begin?",
            "What were the social costs of industrialisation?",
            "How did revolutions spread?",
          ],
        ),
        L(
          "his-worldd-3",
          "World Wars and the Interwar Crisis",
          "The First World War; the peace settlement; the League of Nations; the interwar economy; fascism and Nazism; the Second World War; the Holocaust; the wartime alliances; the foundations of the postwar order.",
          [
            "A map of the two world wars.",
            "A timeline from 1914 to 1945.",
          ],
          [
            "What caused the First World War?",
            "Why did the League of Nations fail?",
            "How did the interwar economy collapse?",
            "What were the consequences of the Second World War?",
          ],
        ),
        L(
          "his-worldd-4",
          "Decolonisation and the Cold War",
          "The Cold War; the United States and the Soviet Union; nuclear deterrence; the Non-Aligned Movement; decolonisation in Asia and Africa; the Vietnam War; the end of the Cold War; the unipolar moment.",
          [
            "A map of the Cold War blocs.",
            "A timeline of decolonisation.",
          ],
          [
            "What was the Cold War?",
            "How did decolonisation unfold?",
            "What was the Non-Aligned Movement?",
            "Why did the Soviet Union collapse?",
          ],
        ),
      ],
    },
  ],
  environment: [
    {
      id: "env-ecology-depth",
      subjectKey: "environment",
      subject: "Environment",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Environment — Ecosystems, energy flow, nutrient cycles and resilience",
      title: "Ecology in Depth",
      blurb:
        "Ecology is the study of connections. This unit follows energy and matter through ecosystems, examines why some systems bounce back and others collapse, and explains why biodiversity is infrastructure.",
      sources: [
        "NCERT Class XII — Biology, ecology chapters",
        "Standard ecology textbooks",
        "IPBES and CBD assessments",
      ],
      references: [X.cbd, X.wikiKeystone, X.wikiSuccession, X.wikiBiogeochemicalCycle],
      lessons: [
        L(
          "env-ecod-1",
          "Ecosystems, Energy Flow and Trophic Cascades",
          "Producers, consumers and decomposers; food chains and webs; trophic levels; the ten-percent rule; primary productivity; energy pyramids; keystone species; trophic cascades.",
          [
            "A food-web diagram.",
            "An energy-pyramid diagram.",
          ],
          [
            "What is a trophic level?",
            "Why is energy lost between levels?",
            "What is a keystone species?",
            "How do trophic cascades work?",
          ],
        ),
        L(
          "env-ecod-2",
          "Nutrient Cycles and Biogeochemistry",
          "The carbon, nitrogen, phosphorus and water cycles; reservoirs and fluxes; human interference; eutrophication; acidification; the nitrogen cascade; nutrient budgets.",
          [
            "A carbon-cycle diagram.",
            "A nitrogen-cycle diagram.",
          ],
          [
            "Why is phosphorus a limiting nutrient?",
            "How does human activity alter the nitrogen cycle?",
            "What is eutrophication?",
            "How does the carbon cycle regulate climate?",
          ],
        ),
        L(
          "env-ecod-3",
          "Succession, Resilience and Tipping Points",
          "Primary and secondary succession; climax communities; resilience; regime shifts; tipping points; disturbance regimes; fire and grazing; climate change and ecosystem collapse.",
          [
            "A succession diagram from bare rock to forest.",
            "A resilience and tipping-point schematic.",
          ],
          [
            "What is ecological succession?",
            "Why are some ecosystems more resilient?",
            "What is a tipping point?",
            "How does disturbance shape ecosystems?",
          ],
        ),
        L(
          "env-ecod-4",
          "Ecosystem Services and Natural Capital",
          "Provisioning, regulating, cultural and supporting services; natural capital accounting; pollination; water purification; carbon sequestration; valuation; payment for ecosystem services; the limits of pricing nature.",
          [
            "A diagram of ecosystem services.",
            "A table linking services to beneficiaries.",
          ],
          [
            "What are ecosystem services?",
            "Why is pollination an economic service?",
            "Can nature be priced?",
            "What is payment for ecosystem services?",
          ],
        ),
      ],
    },
    {
      id: "env-biodiversity-depth",
      subjectKey: "environment",
      subject: "Environment",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Environment — Biodiversity conservation, protected areas and restoration",
      title: "Conserving Life",
      blurb:
        "Conservation is a set of choices about land, law and people. This unit examines how India protects biodiversity, why human-wildlife conflict is rising, and what restoration actually requires.",
      sources: [
        "Wildlife Protection Act and rules",
        "National Biodiversity Authority material",
        "IUCN and CBD reports",
      ],
      references: [X.cbd, X.moefcc, X.wikiRamsar, X.wikiCITES],
      lessons: [
        L(
          "env-bio-1",
          "Biodiversity: Genes, Species and Ecosystems",
          "Genetic, species and ecosystem diversity; endemism; hotspots; alpha, beta and gamma diversity; measuring biodiversity; India's biogeographic zones; the IUCN Red List.",
          [
            "A map of global biodiversity hotspots.",
            "A diagram of biodiversity levels.",
          ],
          [
            "What are the levels of biodiversity?",
            "Why is endemism important?",
            "How is biodiversity measured?",
            "Which regions are biodiversity hotspots?",
          ],
        ),
        L(
          "env-bio-2",
          "Protected Areas and Wildlife Law",
          "National parks, sanctuaries, conservation reserves and community reserves; the Wildlife Protection Act; critical tiger habitats; eco-sensitive zones; forest rights; protected-area management; the law's evolution.",
          [
            "A map of India's protected-area network.",
            "A diagram of the protected-area categories.",
          ],
          [
            "What is the difference between a national park and a sanctuary?",
            "What does the Wildlife Protection Act regulate?",
            "What is an eco-sensitive zone?",
            "How do forest rights interact with conservation?",
          ],
        ),
        L(
          "env-bio-3",
          "Species Programmes and Human-Wildlife Conflict",
          "Tiger and elephant conservation; Project Tiger; cheetah reintroduction; vultures; snow leopard; conflict over crops, livestock and lives; compensation; corridors; community-based conservation.",
          [
            "A map of tiger reserves and elephant corridors.",
            "A diagram of human-wildlife conflict pathways.",
          ],
          [
            "Why do tigers need large landscapes?",
            "What causes human-wildlife conflict?",
            "How can conflict be reduced?",
            "What is community-based conservation?",
          ],
        ),
        L(
          "env-bio-4",
          "Invasive Species and Restoration Ecology",
          "Invasive alien species; pathways and impacts; Lantana and water hyacinth; island extinctions; restoration ecology; rewilding; native species planting; monitoring and adaptive management.",
          [
            "A map of invasive-species spread.",
            "A restoration timeline.",
          ],
          [
            "Why are invasive species harmful?",
            "How do species invasions spread?",
            "What is ecological restoration?",
            "What are the limits of rewilding?",
          ],
        ),
      ],
    },
    {
      id: "env-climate-depth",
      subjectKey: "environment",
      subject: "Environment",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Environment — Climate change science, mitigation, adaptation and finance",
      title: "Climate Change in Depth",
      blurb:
        "Climate change is a physical process with economic and moral consequences. This unit moves from the greenhouse effect to mitigation, adaptation, loss and damage, and the contested arithmetic of carbon markets.",
      sources: [
        "IPCC assessment reports",
        "UNFCCC and COP decisions",
        "Economic Survey climate chapters",
      ],
      references: [X.unfccc, X.moefcc, X.wikiCarbonCycle, X.wikiAdaptation],
      lessons: [
        L(
          "env-clim-1",
          "The Greenhouse Effect and the Carbon Budget",
          "Greenhouse gases; radiative forcing; the enhanced greenhouse effect; carbon sources and sinks; the remaining carbon budget; tipping points; attribution science; why 1.5°C matters.",
          [
            "A greenhouse-effect diagram.",
            "A carbon-budget chart.",
          ],
          [
            "What is the greenhouse effect?",
            "Which gases contribute most to warming?",
            "What is the remaining carbon budget?",
            "Why is 1.5°C a policy target?",
          ],
        ),
        L(
          "env-clim-2",
          "Mitigation: Energy, Industry and Land",
          "Decarbonising electricity; renewables and storage; industrial emissions; transport; buildings; agriculture and land use; carbon capture; demand-side change; the mitigation gap.",
          [
            "A chart of global emissions by sector.",
            "A mitigation-lever diagram.",
          ],
          [
            "Which sectors emit the most?",
            "How can industry decarbonise?",
            "What is carbon capture?",
            "Why is demand-side change important?",
          ],
        ),
        L(
          "env-clim-3",
          "Adaptation, Loss and Damage",
          "Climate risk; vulnerability; adaptation options; heat action plans; flood management; climate-resilient agriculture; migration; loss and damage finance; the adaptation gap.",
          [
            "A climate-risk framework diagram.",
            "A map of India's climate vulnerability.",
          ],
          [
            "What is adaptation?",
            "Why is adaptation uneven?",
            "What is loss and damage?",
            "How can cities adapt to heat?",
          ],
        ),
        L(
          "env-clim-4",
          "Carbon Markets and Climate Finance",
          "Emissions trading; carbon taxes; the EU carbon border adjustment; Article 6; voluntary markets; green bonds; blended finance; climate finance gaps; equity and historical responsibility.",
          [
            "A diagram of carbon-market mechanisms.",
            "A chart of climate-finance flows.",
          ],
          [
            "How does emissions trading work?",
            "What is a carbon border tax?",
            "What is Article 6?",
            "Why is climate finance contested?",
          ],
        ),
      ],
    },
    {
      id: "env-governance-depth",
      subjectKey: "environment",
      subject: "Environment",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Environment — Environmental law, institutions, movements and justice",
      title: "Environmental Law and Governance",
      blurb:
        "Environmental governance is where ecology meets law and politics. This unit follows environmental impact assessment, forest rights, international regimes and the movements that have reshaped India's environmental politics.",
      sources: [
        "Environmental Protection Act and EIA notifications",
        "Forest Rights Act",
        "National Green Tribunal judgments",
      ],
      references: [X.moefcc, X.wikiEnvironmentalLaw, X.wikiForestRights, X.wikiRamsar],
      lessons: [
        L(
          "env-gov-1",
          "EIA, Pollution Control and the Courts",
          "Environmental Impact Assessment; clearance processes; pollution control boards; the National Green Tribunal; public interest litigation; the polluter-pays principle; environmental federalism.",
          [
            "A flowchart of the EIA process.",
            "A diagram of environmental institutions.",
          ],
          [
            "What is environmental impact assessment?",
            "How does the NGT work?",
            "What is the polluter-pays principle?",
            "Why is environmental clearance controversial?",
          ],
        ),
        L(
          "env-gov-2",
          "Forest Rights and Community Conservation",
          "The Forest Rights Act; individual and community rights; gram sabha consent; protected areas and rights; community forest resource management; joint forest management; conservation and livelihood.",
          [
            "A diagram of forest-rights processes.",
            "A map of community forest resource areas.",
          ],
          [
            "What does the Forest Rights Act recognise?",
            "How does gram sabha consent work?",
            "Can conservation and rights coexist?",
            "What is joint forest management?",
          ],
        ),
        L(
          "env-gov-3",
          "International Environmental Regimes",
          "UNFCCC; CBD; Ramsar; CITES; Montreal Protocol; Basel and Stockholm conventions; compliance and enforcement; treaty negotiation; India's positions.",
          [
            "A timeline of major environmental treaties.",
            "A table of treaty objectives.",
          ],
          [
            "What does the Ramsar Convention protect?",
            "How does CITES regulate trade?",
            "Why was the Montreal Protocol successful?",
            "What are India's priorities in environmental negotiations?",
          ],
        ),
        L(
          "env-gov-4",
          "Environmental Movements and Justice",
          "Chipko; Narmada; Silent Valley; pollution movements; environmental racism; climate justice; youth movements; the right to a clean environment; the future of environmental politics.",
          [
            "A map of major environmental movements.",
            "A timeline of environmental justice milestones.",
          ],
          [
            "What did the Chipko movement achieve?",
            "What is environmental justice?",
            "Why are poor communities more exposed to pollution?",
            "How do movements change policy?",
          ],
        ),
      ],
    },
  ],
  science: [
    {
      id: "sci-space-depth",
      subjectKey: "science",
      subject: "Science & Technology",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Science — Space technology, satellites, missions and the space economy",
      title: "Space and India",
      blurb:
        "Space is no longer a distant frontier. It is weather forecasting, navigation, rural broadband and strategic warning. This unit follows India's space programme from sounding rockets to a commercial space economy.",
      sources: [
        "ISRO annual reports and mission pages",
        "Department of Space material",
        "IN-SPACe and space-sector reforms",
      ],
      references: [X.isro, X.dst, X.wikiLaunchVehicle, X.wikiSatellite],
      lessons: [
        L(
          "sci-spaced-1",
          "Launch Vehicles and Orbits",
          "Rocket physics; staging; payload fraction; geostationary and sun-synchronous orbits; polar orbits; launch windows; India's PSLV, GSLV and LVM3; reusable launch; small-satellite launchers.",
          [
            "A diagram of a multi-stage rocket.",
            "A comparison of orbit types.",
          ],
          [
            "Why do rockets have stages?",
            "What is a sun-synchronous orbit?",
            "Why is geostationary orbit useful?",
            "How does India's launch-vehicle family differ?",
          ],
        ),
        L(
          "sci-spaced-2",
          "Satellites and Applications",
          "Remote sensing; communication; navigation; weather; earth observation; NavIC; GIS; disaster warning; precision agriculture; satellite internet; spectrum and orbits.",
          [
            "A diagram of satellite applications.",
            "A map of NavIC coverage.",
          ],
          [
            "How does remote sensing work?",
            "What is NavIC?",
            "How do satellites help disaster management?",
            "What is the role of spectrum allocation?",
          ],
        ),
        L(
          "sci-spaced-3",
          "India's Space Missions",
          "Chandrayaan; Mangalyaan; Aditya-L1; Gaganyaan; AstroSat; space science; international cooperation; mission architecture; cost-effective engineering; the next mission pipeline.",
          [
            "A timeline of India's major space missions.",
            "A diagram of a lunar mission profile.",
          ],
          [
            "What did Chandrayaan achieve?",
            "Why was Mangalyaan inexpensive?",
            "What is Gaganyaan?",
            "What does Aditya-L1 study?",
          ],
        ),
        L(
          "sci-spaced-4",
          "The Space Economy and Private Space",
          "IN-SPACe; private launch companies; satellite services; space debris; orbital congestion; space law; insurance; defence space; the economics of space.",
          [
            "A diagram of the space-value chain.",
            "A chart of global space-economy growth.",
          ],
          [
            "What is IN-SPACe?",
            "Why is space debris a problem?",
            "How can private firms participate in space?",
            "What is the strategic value of space?",
          ],
        ),
      ],
    },
    {
      id: "sci-biotech-depth",
      subjectKey: "science",
      subject: "Science & Technology",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Science — Biotechnology, genomics, vaccines and bioethics",
      title: "Biotechnology in Depth",
      blurb:
        "Biotechnology is the engineering of life. This unit moves from the double helix to gene editing, vaccines and agricultural biotechnology, and asks the ethical questions that come with the power to rewrite genomes.",
      sources: [
        "NCERT Class XII — Biology, biotechnology chapters",
        "Department of Biotechnology material",
        "WHO and ICMR guidance",
      ],
      references: [X.wikiGenetics, X.wikiGenome, X.wikiVaccine, X.wikiCRISPR],
      lessons: [
        L(
          "sci-bio-1",
          "Genes, Genomes and Gene Editing",
          "DNA structure; transcription and translation; the human genome; sequencing; CRISPR-Cas9; gene therapy; synthetic biology; personalized medicine; the ethics of editing.",
          [
            "A diagram of the central dogma.",
            "A CRISPR editing schematic.",
          ],
          [
            "What is the central dogma?",
            "How does CRISPR work?",
            "What is gene therapy?",
            "What are the ethical limits of gene editing?",
          ],
        ),
        L(
          "sci-bio-2",
          "Vaccines and the Immune System",
          "Innate and adaptive immunity; antibodies; vaccine platforms; mRNA vaccines; clinical trials; herd immunity; vaccine hesitancy; pandemic preparedness; India's vaccine industry.",
          [
            "A diagram of immune response.",
            "A vaccine-platform comparison.",
          ],
          [
            "How do vaccines work?",
            "What is herd immunity?",
            "How were mRNA vaccines developed so quickly?",
            "Why is vaccine equity important?",
          ],
        ),
        L(
          "sci-bio-3",
          "Agricultural Biotechnology",
          "GM crops; Bt cotton; crop improvement; biofortification; tissue culture; biopesticides; regulation; biosafety; farmer choice; the political economy of GM technology.",
          [
            "A diagram of genetic modification.",
            "A map of GM crop adoption.",
          ],
          [
            "What is a GM crop?",
            "How is Bt cotton regulated in India?",
            "What is biofortification?",
            "Why is GM technology contested?",
          ],
        ),
        L(
          "sci-bio-4",
          "Bioethics and Regulation",
          "Informed consent; clinical trials; stem-cell research; biobanking; data privacy; dual-use research; biosafety; the role of ethics committees; regulation of emerging biotechnologies.",
          [
            "A diagram of the bioethics review process.",
            "A table of ethical principles.",
          ],
          [
            "What is informed consent?",
            "Why is dual-use research risky?",
            "How should gene editing be regulated?",
            "What is biobanking?",
          ],
        ),
      ],
    },
    {
      id: "sci-digital-depth",
      subjectKey: "science",
      subject: "Science & Technology",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Science — Computing, artificial intelligence, quantum technology and cybersecurity",
      title: "Computing, AI and the Digital Frontier",
      blurb:
        "Computing is now infrastructure. This unit follows the chip, the algorithm and the network into artificial intelligence, quantum technology and the security dilemmas of a digital economy.",
      sources: [
        "MeitY and NITI Aayog reports",
        "Semiconductor Mission material",
        "Standard AI and cybersecurity primers",
      ],
      references: [X.wikiSemiconductor, X.wikiMachineLearning, X.wikiQuantum, X.wikiCyber],
      lessons: [
        L(
          "sci-dig-1",
          "Semiconductors and Computing",
          "Transistors; integrated circuits; Moore's law; chip design and fabrication; semiconductor supply chains; India's semiconductor mission; packaging; computing architectures; the limits of scaling.",
          [
            "A diagram of a transistor and chip.",
            "A semiconductor value-chain map.",
          ],
          [
            "What is a semiconductor?",
            "Why is chip fabrication concentrated?",
            "What is Moore's law?",
            "What is India's semiconductor strategy?",
          ],
        ),
        L(
          "sci-dig-2",
          "Artificial Intelligence and Machine Learning",
          "Machine learning; neural networks; deep learning; large language models; training data; compute; bias; explainability; AI governance; applications in governance and industry.",
          [
            "A diagram of a neural network.",
            "An AI-governance framework.",
          ],
          [
            "What is machine learning?",
            "Why do large language models need huge data?",
            "What is algorithmic bias?",
            "How should AI be governed?",
          ],
        ),
        L(
          "sci-dig-3",
          "Quantum Technology",
          "Quantum superposition and entanglement; quantum computing; qubits; quantum communication; quantum sensing; post-quantum cryptography; India's quantum mission; timelines and hype.",
          [
            "A qubit and entanglement schematic.",
            "A quantum-technology roadmap.",
          ],
          [
            "What is a qubit?",
            "How does quantum computing differ from classical computing?",
            "What is quantum communication?",
            "Why is post-quantum cryptography important?",
          ],
        ),
        L(
          "sci-dig-4",
          "Cybersecurity and Digital Public Infrastructure",
          "Cyber threats; malware and ransomware; critical infrastructure; CERT-In; data protection; digital public infrastructure; Aadhaar and UPI; identity and privacy; cyber diplomacy.",
          [
            "A threat-landscape diagram.",
            "A DPI stack diagram.",
          ],
          [
            "What is critical infrastructure?",
            "How does CERT-In respond to cyber incidents?",
            "What is digital public infrastructure?",
            "How can privacy be protected in DPI?",
          ],
        ),
      ],
    },
    {
      id: "sci-energy-depth",
      subjectKey: "science",
      subject: "Science & Technology",
      paper: "Prelims GS-I · Mains GS-III",
      syllabusNode: "Science — Energy systems, renewables, nuclear and the energy transition",
      title: "Energy Transitions",
      blurb:
        "Energy is the master resource. This unit follows electricity from fuel to grid, examines renewables and storage, and asks what a just transition means for a country that still depends on coal.",
      sources: [
        "Ministry of Power and MNRE material",
        "IEA and IRENA reports",
        "Economic Survey energy chapters",
      ],
      references: [X.wikiFossilFuel, X.wikiGrid, X.wikiSolar, X.wikiNuclear],
      lessons: [
        L(
          "sci-energyd-1",
          "Fossil Fuels and the Grid",
          "Coal, oil and gas; combustion; thermal power plants; transmission and distribution; base load and peak load; grid stability; losses; electrification; the carbon intensity of the grid.",
          [
            "A diagram of the electricity grid.",
            "A chart of India's energy mix.",
          ],
          [
            "How does a thermal power plant work?",
            "Why is grid stability difficult with renewables?",
            "What is base load?",
            "How much electricity is lost in transmission?",
          ],
        ),
        L(
          "sci-energyd-2",
          "Solar, Wind and Storage",
          "Photovoltaics; solar thermal; wind turbines; capacity factors; intermittency; batteries; pumped hydro; green hydrogen; grid integration; distributed generation.",
          [
            "A solar PV and wind system diagram.",
            "A storage-duration comparison.",
          ],
          [
            "How does a solar cell work?",
            "Why is wind intermittent?",
            "What is the role of storage?",
            "What is green hydrogen?",
          ],
        ),
        L(
          "sci-energyd-3",
          "Nuclear and Hydrogen",
          "Nuclear fission; reactors; fuel cycle; safety; waste; small modular reactors; fusion; hydrogen production; fuel cells; industrial decarbonisation; the economics of nuclear power.",
          [
            "A nuclear fuel-cycle diagram.",
            "A hydrogen value-chain diagram.",
          ],
          [
            "How does a nuclear reactor work?",
            "What is the nuclear fuel cycle?",
            "What are small modular reactors?",
            "How can hydrogen decarbonise industry?",
          ],
        ),
        L(
          "sci-energyd-4",
          "The Just Transition",
          "Energy poverty; coal-dependent districts; reskilling; land use; mineral supply chains; critical minerals; energy security; climate commitments; the politics of transition.",
          [
            "A just-transition framework.",
            "A map of coal-dependent regions.",
          ],
          [
            "What is a just transition?",
            "Why are critical minerals important?",
            "How can coal-dependent regions diversify?",
            "What is energy security?",
          ],
        ),
      ],
    },
  ],
  culture: [
    {
      id: "art-ancient-depth",
      subjectKey: "culture",
      subject: "Art & Culture",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Art & Culture — Ancient art, Buddhist and Jain art, temple architecture and classical aesthetics",
      title: "Ancient and Classical Art",
      blurb:
        "Indian art begins before written history. This unit follows the hand on the rock, the stupa on the trade route and the temple on the hill, and asks what each form was trying to say.",
      sources: [
        "NCERT Class XI — An Introduction to Indian Art",
        "ASI site monographs",
        "IGNCA and museum catalogues",
      ],
      references: [X.asi, X.ignca, X.wikiBuddhistArt, X.wikiTempleArchitecture],
      lessons: [
        L(
          "art-anc-1",
          "Rock Art and Harappan Craft",
          "Prehistoric rock paintings; Bhimbetka; Harappan seals, pottery, bronzes and jewellery; urban craft; the dancing girl; terracotta; the aesthetic of the first cities.",
          [
            "A map of prehistoric rock-art sites.",
            "A Harappan seal and artefact plate.",
          ],
          [
            "What do Bhimbetka paintings show?",
            "What makes Harappan seals distinctive?",
            "What crafts did Harappan cities produce?",
            "What can art tell us about everyday life?",
          ],
        ),
        L(
          "art-anc-2",
          "Buddhist and Jain Art",
          "Stupas; Sanchi; Bharhut; Amaravati; Gandhara and Mathura schools; Buddha images; cave paintings at Ajanta; Jain temples and manuscripts; narrative art and devotion.",
          [
            "A stupa architecture diagram.",
            "A map of Buddhist and Jain art sites.",
          ],
          [
            "What is a stupa?",
            "How did Buddha images evolve?",
            "What is the difference between Gandhara and Mathura art?",
            "What do Ajanta paintings depict?",
          ],
        ),
        L(
          "art-anc-3",
          "Temple Architecture: Nagara, Dravida and Vesara",
          "Temple layout; garbhagriha, mandapa and shikhara; Nagara, Dravida and Vesara styles; Khajuraho, Konark, Thanjavur and Hampi; rock-cut temples; temple patronage and economy.",
          [
            "A labelled temple plan.",
            "A map of major temple styles.",
          ],
          [
            "What are the main temple styles?",
            "How does a Nagara temple differ from a Dravida temple?",
            "What was the role of temple patronage?",
            "Why are temples important economic centres?",
          ],
        ),
        L(
          "art-anc-4",
          "Gupta Art and Classical Aesthetics",
          "Gupta sculpture; Sarnath Buddha; Ajanta and Ellora; classical Sanskrit literature; the aesthetic of restraint; the transition from ancient to medieval art; the classical canon.",
          [
            "A timeline of Gupta art.",
            "A comparison of Gupta and later sculpture.",
          ],
          [
            "What defines Gupta art?",
            "Why is the Gupta period called classical?",
            "What is the significance of Ellora?",
            "How did classical aesthetics shape later art?",
          ],
        ),
      ],
    },
    {
      id: "art-architecture-depth",
      subjectKey: "culture",
      subject: "Art & Culture",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Art & Culture — Indo-Islamic, colonial, modern architecture and heritage conservation",
      title: "Architecture Through the Ages",
      blurb:
        "Architecture is politics in stone. This unit follows the arch, the dome and the colonial city, and examines how India conserves — or fails to conserve — its built heritage.",
      sources: [
        "NCERT Class XI — An Introduction to Indian Art",
        "ASI and UNESCO site dossiers",
        "Architectural history surveys",
      ],
      references: [X.asi, X.unesco, X.wikiIndoIslamic, X.wikiColonialArchitecture],
      lessons: [
        L(
          "art-arc-1",
          "Indo-Islamic Architecture",
          "Delhi Sultanate architecture; arches, domes and minarets; Mughal architecture; Fatehpur Sikri; Taj Mahal; gardens; provincial styles; syncretic decoration.",
          [
            "A diagram of Indo-Islamic architectural elements.",
            "A map of major Indo-Islamic monuments.",
          ],
          [
            "What defines Indo-Islamic architecture?",
            "How did Mughal architecture evolve?",
            "What is the significance of Fatehpur Sikri?",
            "How did local styles blend with Islamic forms?",
          ],
        ),
        L(
          "art-arc-2",
          "Colonial and Modern Architecture",
          "Portuguese, Dutch, French and British colonial architecture; Gothic Revival; Indo-Saracenic; Lutyens' Delhi; post-independence modernism; Chandigarh; sustainable architecture.",
          [
            "A map of colonial architectural styles.",
            "A comparison of Gothic Revival and Indo-Saracenic.",
          ],
          [
            "What is Indo-Saracenic architecture?",
            "How did Lutyens design New Delhi?",
            "Who was Le Corbusier?",
            "What is modern Indian architecture?",
          ],
        ),
        L(
          "art-arc-3",
          "Forts, Palaces and Civic Buildings",
          "Fort architecture; hill forts; Rajput and Maratha forts; palaces; stepwells; civic buildings; colonial public architecture; adaptive reuse; the politics of preservation.",
          [
            "A fort-plan diagram.",
            "A map of major forts and stepwells.",
          ],
          [
            "How were hill forts designed?",
            "What is a stepwell?",
            "Why are forts important for heritage tourism?",
            "How can old buildings be reused?",
          ],
        ),
        L(
          "art-arc-4",
          "Heritage Conservation and UNESCO",
          "UNESCO World Heritage sites; tentative lists; criteria; conservation ethics; ASI protection; urban heritage; intangible heritage; tourism and heritage; the economics of conservation.",
          [
            "A map of India's World Heritage sites.",
            "A conservation-process diagram.",
          ],
          [
            "What makes a site a World Heritage site?",
            "How does ASI protect monuments?",
            "What is intangible heritage?",
            "Can tourism fund conservation?",
          ],
        ),
      ],
    },
    {
      id: "art-performing-depth",
      subjectKey: "culture",
      subject: "Art & Culture",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Art & Culture — Classical dance, music, theatre, crafts and living traditions",
      title: "The Performing Arts",
      blurb:
        "The performing arts are living archives. This unit follows the dancer, the musician and the craftsman, and examines how traditions survive, adapt and become cultural commodities.",
      sources: [
        "Sangeet Natak Akademi material",
        "NCERT Class XI — An Introduction to Indian Art",
        "Ministry of Culture scheme documents",
      ],
      references: [X.sangeetNatak, X.culture, X.wikiClassicalDance, X.wikiHindustani],
      lessons: [
        L(
          "art-perf2-1",
          "Classical Dance Traditions",
          "Bharatanatyam, Kathak, Kathakali, Kuchipudi, Odissi, Manipuri and Mohiniyattam; rasa and bhava; mudras; costume and music; temple origins; revival and globalisation.",
          [
            "A map of classical dance traditions.",
            "A diagram of abhinaya and mudras.",
          ],
          [
            "What are the classical dance forms of India?",
            "What is rasa theory?",
            "How did dance move from temple to stage?",
            "What is the difference between Kathak and Bharatanatyam?",
          ],
        ),
        L(
          "art-perf2-2",
          "Music: Hindustani and Carnatic",
          "Raga and tala; Hindustani and Carnatic traditions; instruments; gharanas; composers; devotional music; film music; fusion; the economics of performance.",
          [
            "A raga structure diagram.",
            "A map of music traditions.",
          ],
          [
            "What is a raga?",
            "How do Hindustani and Carnatic music differ?",
            "What is a gharana?",
            "How has film music changed classical traditions?",
          ],
        ),
        L(
          "art-perf2-3",
          "Theatre, Puppetry and Folk Performance",
          "Sanskrit theatre; Kutiyattam; Yakshagana; Tamasha; Nautanki; puppetry traditions; folk theatre; street theatre; ritual performance; the survival of oral traditions.",
          [
            "A map of folk theatre forms.",
            "A puppetry-type diagram.",
          ],
          [
            "What is Kutiyattam?",
            "How does folk theatre differ from classical theatre?",
            "What are the main puppetry traditions?",
            "Why are oral traditions fragile?",
          ],
        ),
        L(
          "art-perf2-4",
          "Crafts, GI Tags and Cultural Economies",
          "Handlooms; handicrafts; GI tags; artisan clusters; craft and tourism; e-commerce; design innovation; cultural exports; the economics of handmade.",
          [
            "A map of craft clusters.",
            "A GI-tag value-chain diagram.",
          ],
          [
            "What is a GI tag?",
            "Why are handlooms economically fragile?",
            "How can crafts reach global markets?",
            "What is the role of design in craft revival?",
          ],
        ),
      ],
    },
    {
      id: "art-literature-depth",
      subjectKey: "culture",
      subject: "Art & Culture",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Art & Culture — Literature, languages, translation and the literary public sphere",
      title: "Literature and Language",
      blurb:
        "Literature is the memory of a civilisation. This unit moves from the Sanskrit epic to the modern novel, and examines how languages, scripts and translation hold India together.",
      sources: [
        "Sahitya Akademi material",
        "NCERT literature anthologies",
        "Classical and modern literary surveys",
      ],
      references: [X.sahitya, X.culture, X.wikiSanskritLit, X.wikiTamilLit],
      lessons: [
        L(
          "art-lit-1",
          "Ancient and Classical Literature",
          "Vedas; Upanishads; Ramayana and Mahabharata; Sanskrit drama; Kalidasa; Tamil Sangam literature; Buddhist and Jain texts; the classical canon.",
          [
            "A timeline of ancient Indian literature.",
            "A map of classical literary centres.",
          ],
          [
            "What is the Sangam corpus?",
            "Who was Kalidasa?",
            "How did oral epics become written texts?",
            "What is the difference between Shruti and Smriti?",
          ],
        ),
        L(
          "art-lit-2",
          "Medieval and Bhakti Literature",
          "Bhakti poetry; Kabir; Mirabai; Tulsidas; Surdas; Sufi literature; Urdu ghazal; regional literatures; the devotional public sphere.",
          [
            "A map of Bhakti and Sufi literary centres.",
            "A timeline of medieval literature.",
          ],
          [
            "What is Bhakti literature?",
            "How did Kabir challenge orthodoxy?",
            "What is a ghazal?",
            "Why did regional languages flourish in the medieval period?",
          ],
        ),
        L(
          "art-lit-3",
          "Modern Indian Literature",
          "Colonial-era prose; the novel; Rabindranath Tagore; Premchand; Partition literature; Dalit literature; feminist writing; regional modernisms; the literary public sphere.",
          [
            "A timeline of modern Indian literature.",
            "A map of literary movements.",
          ],
          [
            "How did the novel change Indian literature?",
            "What is Partition literature?",
            "What is Dalit literature?",
            "How did women writers reshape the canon?",
          ],
        ),
        L(
          "art-lit-4",
          "Languages, Scripts and Translation",
            "Language families; scheduled languages; scripts; multilingualism; translation; language politics; endangered languages; digital archives; the politics of the linguistic state.",
          [
            "A map of Indian language families.",
            "A script-comparison chart.",
          ],
          [
            "How many language families does India have?",
            "Why is translation important?",
            "What is the Eighth Schedule?",
            "How are endangered languages protected?",
          ],
        ),
      ],
    },
  ],
  society: [
    {
      id: "soc-diversity-depth",
      subjectKey: "society",
      subject: "Indian Society",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Society — Diversity, religion, language, ethnicity, caste and class",
      title: "The Fabric of Diversity",
      blurb:
        "India is not one society but many, held together by a constitution and a marketplace. This unit examines the identities that shape everyday life and the tensions that diversity produces.",
      sources: [
        "NCERT Class XII — Indian Society",
        "Census of India",
        "Sociological surveys of modern India",
      ],
      references: [X.census, X.wikiReligionIndia, X.wikiLanguagesIndia, X.wikiEthnicGroups],
      lessons: [
        L(
          "soc-divd-1",
          "Religion, Region and Language",
          "Religious plurality; regional identities; language families; linguistic states; Hindi and English; mother tongue and education; the politics of language; secularism and pluralism.",
          [
            "A map of religious and linguistic diversity.",
            "A chart of language families.",
          ],
          [
            "How many language families does India have?",
            "Why were linguistic states created?",
            "What is Indian secularism?",
            "How does language shape identity?",
          ],
        ),
        L(
          "soc-divd-2",
          "Ethnicity, Tribe and Identity",
          "Tribal communities; scheduled tribes; ethnicity; customary law; land and forests; assimilation and autonomy; tribal movements; the politics of recognition.",
          [
            "A map of major tribal regions.",
            "A timeline of tribal policy.",
          ],
          [
            "Who are the Scheduled Tribes?",
            "How does tribal identity differ from caste?",
            "What is the Fifth Schedule?",
            "Why are tribal land rights contested?",
          ],
        ),
        L(
          "soc-divd-3",
          "Caste and Social Stratification",
          "Varna and jati; untouchability; caste and occupation; caste in urban India; reservation; caste politics; mobility and discrimination; the persistence of caste.",
          [
            "A diagram of varna and jati.",
            "A chart of caste and inequality indicators.",
          ],
          [
            "What is the difference between varna and jati?",
            "How has caste changed in cities?",
            "What is the constitutional approach to caste?",
            "Does reservation reduce inequality?",
          ],
        ),
        L(
          "soc-divd-4",
          "Class, Mobility and Aspiration",
          "Class formation; income and wealth inequality; middle class; informal labour; social mobility; education and aspiration; consumption; the new Indian class structure.",
          [
            "A class-structure diagram.",
            "A chart of income inequality.",
          ],
          [
            "What is the Indian middle class?",
            "How does class differ from caste?",
            "What is social mobility?",
            "Why is informal labour important?",
          ],
        ),
      ],
    },
    {
      id: "soc-gender-depth",
      subjectKey: "society",
      subject: "Indian Society",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Society — Gender, patriarchy, women's movement, work and violence",
      title: "Gender and Society",
      blurb:
        "Gender is a structure of power, not a private matter. This unit examines how patriarchy works in family, work and politics, and how the women's movement has changed law and public life.",
      sources: [
        "NCERT Class XII — Indian Society",
        "National Family Health Survey",
        "Women's movement histories",
      ],
      references: [X.wikiWomenIndia, X.wikiFeminism, X.census, X.wikiSocialJustice],
      lessons: [
        L(
          "soc-gender-1",
          "Gender Roles and Patriarchy",
          "Sex and gender; social construction; patriarchy; family and kinship; son preference; gendered division of labour; honour and control; intersectionality.",
          [
            "A diagram of patriarchy in institutions.",
            "A chart of gender gaps.",
          ],
          [
            "What is patriarchy?",
            "How is gender socially constructed?",
            "What is intersectionality?",
            "How does son preference persist?",
          ],
        ),
        L(
          "soc-gender-2",
          "Women's Movement and Law",
          "Social reform; nationalist movement; women's organisations; feminist movements; legal reform; rape law; domestic violence; inheritance; political representation.",
          [
            "A timeline of women's rights in India.",
            "A table of key laws.",
          ],
          [
            "How did the women's movement emerge?",
            "What changed after the 2012 Delhi case?",
            "What is the Domestic Violence Act?",
            "Why is women's representation low?",
          ],
        ),
        L(
          "soc-gender-3",
          "Work, Care and the Economy",
          "Female labour-force participation; unpaid care; informal work; wage gaps; occupational segregation; maternity benefits; childcare; the care economy.",
          [
            "A chart of female labour-force participation.",
            "A diagram of the care economy.",
          ],
          [
            "Why is female labour-force participation low?",
            "What is unpaid care work?",
            "How does the wage gap persist?",
            "What policies support working women?",
          ],
        ),
        L(
          "soc-gender-4",
          "Violence, Safety and Representation",
          "Domestic violence; sexual violence; harassment at work; trafficking; safety in public space; law enforcement; shelters; representation in politics and media; the role of social norms.",
          [
            "A map of crime against women.",
            "A representation chart.",
          ],
          [
            "What is the POSH Act?",
            "Why is reporting violence difficult?",
            "How can public space be made safer?",
            "What is substantive representation?",
          ],
        ),
      ],
    },
    {
      id: "soc-urban-depth",
      subjectKey: "society",
      subject: "Indian Society",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Society — Urbanisation, migration, housing, urban governance and sustainable cities",
      title: "Urban India",
      blurb:
        "India is urbanising at a scale that tests every institution. This unit examines the city as a site of opportunity, inequality and governance, and asks what a sustainable urban future requires.",
      sources: [
        "Census of India",
        "Ministry of Housing and Urban Affairs",
        "Urban planning and governance literature",
      ],
      references: [X.census, X.wikiSlum, X.wikiSmartCity, X.wikiUrbanisation],
      lessons: [
        L(
          "soc-urban-1",
          "Urbanisation and Migration",
          "Urban growth; rural-urban migration; push and pull; peri-urban areas; megacities; urban agglomerations; migration and informal work; the shape of Indian cities.",
          [
            "A map of urban agglomerations.",
            "A migration-flow diagram.",
          ],
          [
            "Why are Indian cities growing?",
            "What drives rural-urban migration?",
            "What is a peri-urban area?",
            "How does migration affect source regions?",
          ],
        ),
        L(
          "soc-urban-2",
          "Slums, Housing and Basic Services",
          "Slum formation; informal settlements; housing shortage; rental markets; water, sanitation and electricity; tenure; eviction; affordable housing; basic services.",
          [
            "A map of slum populations.",
            "A diagram of urban service delivery.",
          ],
          [
            "What is a slum?",
            "Why is affordable housing scarce?",
            "How do informal settlements access services?",
            "What is tenure security?",
          ],
        ),
        L(
          "soc-urban-3",
          "Urban Governance and Finance",
          "74th Amendment; municipal bodies; mayors and commissioners; property tax; municipal bonds; devolution; parastatals; metropolitan planning; the capacity gap.",
          [
            "A diagram of urban governance.",
            "A municipal finance chart.",
          ],
          [
            "What did the 74th Amendment do?",
            "Why are municipalities fiscally weak?",
            "What is the role of a mayor?",
            "How can cities raise revenue?",
          ],
        ),
        L(
          "soc-urban-4",
          "Smart Cities and Sustainable Urbanism",
          "Smart city mission; digital services; transport-oriented development; walkability; green buildings; urban heat; waste management; climate-resilient cities; participation.",
          [
            "A smart-city framework diagram.",
            "A sustainable-mobility chart.",
          ],
          [
            "What is a smart city?",
            "How can cities become climate-resilient?",
            "What is transit-oriented development?",
            "Why is public participation important?",
          ],
        ),
      ],
    },
    {
      id: "soc-justice-depth",
      subjectKey: "society",
      subject: "Indian Society",
      paper: "Prelims GS-I · Mains GS-I",
      syllabusNode: "Society — Social justice, affirmative action, vulnerable groups and social movements",
      title: "Social Justice in Practice",
      blurb:
        "Social justice is easy to declare and hard to deliver. This unit examines affirmative action, welfare institutions and the movements that push the state to keep its promises.",
      sources: [
        "NCERT Class XII — Indian Society",
        "Ministry of Social Justice and Empowerment",
        "NITI Aayog and NFHS reports",
      ],
      references: [X.wikiAffirmativeAction, X.wikiSocialJustice, X.nhrc, X.census],
      lessons: [
        L(
          "soc-justice-1",
          "Affirmative Action and Reservation",
          "Equality and affirmative action; reservation in education and employment; Scheduled Castes and Scheduled Tribes; OBC reservations; creamy layer; merit and equity; the debate over quotas.",
          [
            "A timeline of reservation policy.",
            "A chart of representation.",
          ],
          [
            "Why does the Constitution permit reservation?",
            "What is the creamy layer?",
            "How does reservation affect merit?",
            "What is the difference between equality and equity?",
          ],
        ),
        L(
          "soc-justice-2",
          "Poverty, Hunger and Welfare",
          "Poverty measurement; multidimensional poverty; hunger; food security; MGNREGA; public distribution; direct benefit transfer; welfare architecture; universal basic income debates.",
          [
            "A poverty-trend chart.",
            "A welfare-scheme map.",
          ],
          [
            "How is poverty measured?",
            "What is multidimensional poverty?",
            "How does the PDS work?",
            "What is the case for basic income?",
          ],
        ),
        L(
          "soc-justice-3",
          "Vulnerable Groups: Children, Elderly, Disabled",
          "Child rights; child labour; education; nutrition; elderly care; pensions; disability rights; accessibility; social security; the rights-based approach.",
          [
            "A diagram of vulnerable-group entitlements.",
            "A demographic chart.",
          ],
          [
            "What is the Rights of Persons with Disabilities Act?",
            "How does child malnutrition persist?",
            "What supports the elderly?",
            "What is a rights-based approach?",
          ],
        ),
        L(
          "soc-justice-4",
          "Social Movements and the State",
          "Dalit movements; tribal movements; women's movements; environmental movements; farmer movements; civil society; NGOs; protest and democratic change.",
          [
            "A timeline of social movements.",
            "A map of movement regions.",
          ],
          [
            "How do social movements change policy?",
            "What is civil society?",
            "Why do movements face repression?",
            "What is the role of NGOs?",
          ],
        ),
      ],
    },
  ],
  ir: [
    {
      id: "ir-doctrine-depth",
      subjectKey: "ir",
      subject: "International Relations",
      paper: "Mains GS-II",
      syllabusNode: "IR — India's foreign policy, strategic autonomy, nuclear doctrine and soft power",
      title: "India's Foreign Policy in Depth",
      blurb:
        "India's foreign policy is a balancing act between autonomy and engagement. This unit examines the ideas, instruments and dilemmas that shape how India behaves in the world.",
      sources: [
        "Ministry of External Affairs annual reports",
        "MEA speeches and policy documents",
        "Standard IR texts on Indian foreign policy",
      ],
      references: [X.mea, X.wikiStrategicAutonomy, X.wikiNuclearDoctrine, X.wikiDiaspora],
      lessons: [
        L(
          "ir-doc-1",
          "Non-Alignment to Strategic Autonomy",
          "Origins of non-alignment; Nehru's foreign policy; Cold War balancing; post-Cold War adjustment; strategic autonomy; multi-alignment; issue-based coalitions; the continuity and change in Indian foreign policy.",
          [
            "A timeline of Indian foreign policy.",
            "A diagram of multi-alignment.",
          ],
          [
            "What was non-alignment?",
            "What is strategic autonomy?",
            "How has India's foreign policy changed since 1991?",
            "What is multi-alignment?",
          ],
        ),
        L(
          "ir-doc-2",
          "Instruments of Foreign Policy",
          "Diplomacy; defence; trade; aid; cultural diplomacy; diaspora; multilateral engagement; sanctions; intelligence; the machinery of foreign policy.",
          [
            "An instruments-of-statecraft diagram.",
            "A map of Indian diplomatic missions.",
          ],
          [
            "What are the instruments of foreign policy?",
            "How does India use development aid?",
            "What is cultural diplomacy?",
            "How does the diaspora influence policy?",
          ],
        ),
        L(
          "ir-doc-3",
          "Nuclear Doctrine and Strategic Culture",
          "India's nuclear programme; no-first-use; credible minimum deterrence; triad; nuclear command; arms control; strategic culture; the nuclear dilemma.",
          [
            "A nuclear-doctrine schematic.",
            "A timeline of India's nuclear programme.",
          ],
          [
            "What is credible minimum deterrence?",
            "What is India's no-first-use policy?",
            "How does the nuclear triad work?",
            "What is strategic culture?",
          ],
        ),
        L(
          "ir-doc-4",
          "Diaspora and Soft Power",
          "Indian diaspora; remittances; diaspora diplomacy; soft power; Bollywood; yoga; education; cultural influence; the limits of soft power.",
          [
            "A map of the Indian diaspora.",
            "A soft-power assets diagram.",
          ],
          [
            "How large is the Indian diaspora?",
            "What is diaspora diplomacy?",
            "What are India's soft-power strengths?",
            "What are the limits of soft power?",
          ],
        ),
      ],
    },
    {
      id: "ir-neighbourhood-depth",
      subjectKey: "ir",
      subject: "International Relations",
      paper: "Mains GS-II",
      syllabusNode: "IR — India's neighbourhood, bilateral relations and regional security",
      title: "The Neighbourhood",
      blurb:
        "India's immediate neighbourhood is both a buffer and a battleground. This unit examines the bilateral relationships that shape South Asia and the Indian Ocean.",
      sources: [
        "MEA bilateral briefs",
        "Standard texts on South Asian politics",
        "Think-tank reports on the neighbourhood",
      ],
      references: [X.mea, X.wikiPakistan, X.wikiChina, X.wikiBangladesh],
      lessons: [
        L(
          "ir-neigh-1",
          "Pakistan and the Western Frontier",
          "Partition; Kashmir; wars; nuclearisation; composite dialogue; cross-border terrorism; Indus Waters Treaty; trade and people-to-people contacts; the future of the relationship.",
          [
            "A map of India-Pakistan borders.",
            "A timeline of bilateral relations.",
          ],
          [
            "What are the disputes with Pakistan?",
            "What is the Indus Waters Treaty?",
            "Why has dialogue failed?",
            "What is the cost of hostility?",
          ],
        ),
        L(
          "ir-neigh-2",
          "China and the Himalayan Frontier",
          "Border dispute; 1962 war; border management; Doklam; Galwan; trade dependence; China's Belt and Road; the India-China-US triangle; diplomatic and military options.",
          [
            "A map of the Line of Actual Control.",
            "A trade-dependence chart.",
          ],
          [
            "What is the Line of Actual Control?",
            "What happened at Galwan?",
            "How dependent is India on Chinese trade?",
            "What is China's Belt and Road?",
          ],
        ),
        L(
          "ir-neigh-3",
          "Bangladesh, Nepal and Bhutan",
          "Bangladesh liberation; land boundary; trade and connectivity; Rohingya; Nepal's political transitions; hydropower; Bhutan and Doklam; India's neighbourhood-first policy.",
          [
            "A map of eastern neighbours.",
            "A connectivity-corridor map.",
          ],
          [
            "What is the India-Bangladesh land boundary agreement?",
            "Why is Nepal important to India?",
            "What is India's neighbourhood-first policy?",
            "How does Bhutan balance India and China?",
          ],
        ),
        L(
          "ir-neigh-4",
          "Sri Lanka, Myanmar and the Indian Ocean",
          "Sri Lanka's ethnic conflict; Tamil issue; Chinese presence; Myanmar's coup and refugees; Indian Ocean security; sea lanes; island diplomacy; maritime neighbourhood.",
          [
            "A map of the Indian Ocean region.",
            "A sea-lane and port map.",
          ],
          [
            "What is India's role in Sri Lanka?",
            "How has Myanmar's crisis affected India?",
            "Why is the Indian Ocean strategic?",
            "What is India's island diplomacy?",
          ],
        ),
      ],
    },
    {
      id: "ir-great-powers",
      subjectKey: "ir",
      subject: "International Relations",
      paper: "Mains GS-II",
      syllabusNode: "IR — Great powers, Indo-Pacific, Europe and the Quad",
      title: "The Great Powers",
      blurb:
        "The global order is being renegotiated by great powers. This unit examines how India manages its relationships with the United States, Russia, China, Europe and Japan.",
      sources: [
        "MEA and think-tank reports",
        "Standard texts on great-power politics",
        "Indo-Pacific strategy documents",
      ],
      references: [X.mea, X.wikiUnitedStates, X.wikiRussia, X.wikiIndoPacific],
      lessons: [
        L(
          "ir-gp-1",
          "The United States and the Indo-Pacific",
          "India-US relations; civil nuclear deal; defence ties; trade disputes; Indo-Pacific strategy; Quad; technology and semiconductors; democracy and values; the China factor.",
          [
            "A map of the Indo-Pacific.",
            "A timeline of India-US relations.",
          ],
          [
            "What is the Indo-Pacific strategy?",
            "What is the Quad?",
            "How close are India and the US?",
            "What are the trade disputes?",
          ],
        ),
        L(
          "ir-gp-2",
          "Russia and the Eurasian Space",
          "India-Russia relations; defence dependence; energy; Ukraine war; sanctions; Central Asia; Shanghai Cooperation Organisation; the balancing act.",
          [
            "A map of Eurasia.",
            "A defence-import chart.",
          ],
          [
            "Why is Russia important to India?",
            "How has the Ukraine war affected India?",
            "What is the SCO?",
            "What is India's balancing strategy?",
          ],
        ),
        L(
          "ir-gp-3",
          "China's Belt and Road and the Regional Order",
          "Belt and Road Initiative; debt diplomacy; connectivity; Pakistan and Sri Lanka; Chinese assertiveness; India's counter-initiatives; the QUAD and supply-chain realignment.",
          [
            "A map of Belt and Road projects.",
            "A debt-commitment chart.",
          ],
          [
            "What is the Belt and Road Initiative?",
            "How does debt diplomacy work?",
            "Why does India oppose BRI?",
            "What are India's connectivity alternatives?",
          ],
        ),
        L(
          "ir-gp-4",
          "Europe, Japan and the Quad",
          "India-EU relations; trade and investment; Japan's partnership; Quad agenda; technology; maritime security; climate; the future of the Indo-Pacific order.",
          [
            "A map of Quad members.",
            "A trade and investment chart.",
          ],
          [
            "What is the India-EU partnership?",
            "Why is Japan important to India?",
            "What is the Quad's agenda?",
            "What are the limits of the Quad?",
          ],
        ),
      ],
    },
    {
      id: "ir-multilateral-depth",
      subjectKey: "ir",
      subject: "International Relations",
      paper: "Mains GS-II",
      syllabusNode: "IR — United Nations, Bretton Woods institutions, G20, BRICS and regional organisations",
      title: "Multilateral Institutions",
      blurb:
        "Multilateralism is under strain, but it still shapes trade, finance, security and climate. This unit examines the institutions India works with and the reforms it demands.",
      sources: [
        "UN and Bretton Woods documents",
        "G20 and BRICS summit declarations",
        "MEA multilateral briefs",
      ],
      references: [X.un, X.wikiUNSC, X.wikiBrettonWoods, X.wikiG20],
      lessons: [
        L(
          "ir-multi-1",
          "The United Nations and UNSC Reform",
          "UN charter; General Assembly; Security Council; peacekeeping; specialised agencies; India's campaign for permanent membership; veto; multilateralism under stress.",
          [
            "A UN system chart.",
            "A UNSC membership map.",
          ],
          [
            "What does the UNSC do?",
            "Why does India want permanent membership?",
            "What is the veto?",
            "How does India contribute to peacekeeping?",
          ],
        ),
        L(
          "ir-multi-2",
          "IMF, World Bank and WTO",
          "Bretton Woods institutions; IMF surveillance; World Bank lending; WTO rules; dispute settlement; trade negotiations; reform of global economic governance; India's role.",
          [
            "A Bretton Woods institutions chart.",
            "A trade-dispute flow.",
          ],
          [
            "What does the IMF do?",
            "How does the World Bank lend?",
            "What is the WTO dispute settlement?",
            "Why is quota reform important?",
          ],
        ),
        L(
          "ir-multi-3",
          "G20, BRICS and the Global South",
          "G20 agenda; India's presidency; BRICS expansion; New Development Bank; South-South cooperation; debt relief; climate finance; the voice of the Global South.",
          [
            "A G20 and BRICS membership map.",
            "A South-South cooperation diagram.",
          ],
          [
            "What is the G20?",
            "What did India achieve at the G20?",
            "What is BRICS?",
            "What is the Global South?",
          ],
        ),
        L(
          "ir-multi-4",
          "Regional Organisations",
          "SAARC; BIMSTEC; ASEAN; East Asia Summit; IORA; Shanghai Cooperation Organisation; regional trade; connectivity; the future of regionalism in South Asia.",
          [
            "A map of regional organisations.",
            "A comparison table.",
          ],
          [
            "Why is SAARC ineffective?",
            "What is BIMSTEC?",
            "What is the East Asia Summit?",
            "What is IORA?",
          ],
        ),
      ],
    },
  ],
  ethics: [
    {
      id: "eth-theory",
      subjectKey: "ethics",
      subject: "Ethics",
      paper: "Mains GS-IV",
      syllabusNode: "Ethics — Ethical theory, consequentialism, deontology, virtue ethics and Indian traditions",
      title: "Ethical Thought",
      blurb:
        "Ethics is not a list of rules; it is a set of arguments about how to live. This unit introduces the major traditions of ethical thought and shows how they illuminate public decisions.",
      sources: [
        "NCERT Class XI — Political Theory, ethics chapters",
        "Standard ethics primers",
        "Selected primary texts",
      ],
      references: [X.wikiEthics, X.wikiUtilitarianism, X.wikiDeontology, X.wikiVirtueEthics],
      lessons: [
        L(
          "eth-th-1",
          "Consequentialism and Utilitarianism",
          "Consequentialism; utilitarianism; Bentham and Mill; greatest happiness; cost-benefit analysis; act and rule utilitarianism; objections; public policy applications.",
          [
            "A consequentialist decision tree.",
            "A utility and harm comparison.",
          ],
          [
            "What is utilitarianism?",
            "What are the objections to consequentialism?",
            "How is cost-benefit analysis utilitarian?",
            "What is the difference between act and rule utilitarianism?",
          ],
        ),
        L(
          "eth-th-2",
          "Deontology and Kant",
          "Duty-based ethics; Kant's categorical imperative; means and ends; rights and dignity; universalizability; deontology in public service; critiques.",
          [
            "A deontological decision framework.",
            "A rights and duties diagram.",
          ],
          [
            "What is the categorical imperative?",
            "Why does Kant oppose using people as means?",
            "How does deontology differ from utilitarianism?",
            "What are the limits of duty-based ethics?",
          ],
        ),
        L(
          "eth-th-3",
          "Virtue Ethics and Character",
          "Aristotle; virtues; eudaimonia; practical wisdom; character formation; role ethics; virtue in public life; the revival of virtue ethics.",
          [
            "A virtue-ethics framework.",
            "A character and action diagram.",
          ],
          [
            "What is virtue ethics?",
            "What is practical wisdom?",
            "How does character shape public conduct?",
            "What are the criticisms of virtue ethics?",
          ],
        ),
        L(
          "eth-th-4",
          "Indian Ethical Traditions",
          "Dharma; karma; ahimsa; Bhagavad Gita; Buddhist ethics; Jain ethics; Gandhi's ethics; Indian conceptions of duty and justice; the relevance to public service.",
          [
            "A map of Indian ethical concepts.",
            "A Gandhi and dharma framework.",
          ],
          [
            "What is dharma?",
            "What is ahimsa?",
            "How does the Gita frame duty?",
            "What is Gandhi's contribution to ethics?",
          ],
        ),
      ],
    },
    {
      id: "eth-values",
      subjectKey: "ethics",
      subject: "Ethics",
      paper: "Mains GS-IV",
      syllabusNode: "Ethics — Values, attitude, emotional intelligence and integrity",
      title: "Values and Attitude",
      blurb:
        "Values are the deep grammar of behaviour. This unit examines how values, attitudes and emotional intelligence shape decisions in public life.",
      sources: [
        "NCERT and standard ethics texts",
        "Psychology primers on attitude and emotion",
        "Case studies from public administration",
      ],
      references: [X.wikiAttitude, X.wikiEmotionalIntelligence, X.wikiIntegrity, X.wikiEthics],
      lessons: [
        L(
          "eth-val-1",
          "Values and Beliefs",
          "Terminal and instrumental values; personal and social values; value conflicts; moral development; socialisation; values in organisations; the value of public service.",
          [
            "A values hierarchy diagram.",
            "A value-conflict matrix.",
          ],
          [
            "What are terminal and instrumental values?",
            "How do values develop?",
            "What is a value conflict?",
            "What values should a civil servant hold?",
          ],
        ),
        L(
          "eth-val-2",
          "Attitude and Behaviour",
          "Attitude formation; cognitive, affective and behavioural components; prejudice; persuasion; cognitive dissonance; attitude and action; changing attitudes in organisations.",
          [
            "An attitude-components diagram.",
            "A persuasion model.",
          ],
          [
            "What are the components of attitude?",
            "How does cognitive dissonance work?",
            "Can attitudes be changed?",
            "How does prejudice affect policy?",
          ],
        ),
        L(
          "eth-val-3",
          "Emotional Intelligence and Empathy",
          "Emotional intelligence; self-awareness; self-regulation; motivation; empathy; social skills; empathy in administration; burnout; emotional labour.",
          [
            "An emotional-intelligence framework.",
            "An empathy and decision-making diagram.",
          ],
          [
            "What is emotional intelligence?",
            "Why is empathy important in public service?",
            "How can emotional intelligence be developed?",
            "What is emotional labour?",
          ],
        ),
        L(
          "eth-val-4",
          "Integrity and Moral Courage",
          "Integrity; honesty; consistency; moral courage; ethical leadership; speaking truth to power; whistleblowing; the costs of integrity; building integrity systems.",
          [
            "An integrity framework.",
            "A moral-courage decision tree.",
          ],
          [
            "What is integrity?",
            "What is moral courage?",
            "When should a civil servant blow the whistle?",
            "How can integrity be institutionalised?",
          ],
        ),
      ],
    },
    {
      id: "eth-public-service",
      subjectKey: "ethics",
      subject: "Ethics",
      paper: "Mains GS-IV",
      syllabusNode: "Ethics — Civil service values, accountability, conflict of interest and probity",
      title: "Ethics in Public Service",
      blurb:
        "Public service ethics is about power held in trust. This unit examines the values, codes and dilemmas that govern the conduct of civil servants.",
      sources: [
        "Civil Services Conduct Rules",
        "Second Administrative Reforms Commission reports",
        "CVC and CAG guidance",
      ],
      references: [X.wikiPublicServiceEthics, X.wikiConflictOfInterest, X.wikiWhistleblower, X.wikiCivilService],
      lessons: [
        L(
          "eth-pub-1",
          "Civil Service Values and Code of Conduct",
          "Neutrality; impartiality; anonymity; integrity; accountability; responsiveness; the conduct rules; the code of ethics; the tension between neutrality and responsiveness.",
          [
            "A civil-service values framework.",
            "A code-of-conduct checklist.",
          ],
          [
            "What are the core civil-service values?",
            "What is the difference between neutrality and impartiality?",
            "Why is anonymity important?",
            "What is the code of conduct?",
          ],
        ),
        L(
          "eth-pub-2",
          "Accountability and Responsiveness",
          "Accountability; answerability; enforcement; parliamentary oversight; citizen charters; grievance redress; social audit; the balance between rules and discretion.",
          [
            "An accountability chain diagram.",
            "A grievance-redress flow.",
          ],
          [
            "What is accountability?",
            "How does parliamentary oversight work?",
            "What is a citizen charter?",
            "How can discretion be balanced with rules?",
          ],
        ),
        L(
          "eth-pub-3",
          "Conflict of Interest and Gifts",
          "Conflict of interest; actual, potential and perceived; gifts and hospitality; revolving doors; lobbying; asset declarations; recusal; integrity in procurement.",
          [
            "A conflict-of-interest matrix.",
            "A gift-and-hospitality decision tree.",
          ],
          [
            "What is a conflict of interest?",
            "Why are gifts a problem?",
            "What is the revolving-door problem?",
            "How should a civil servant handle a conflict?",
          ],
        ),
        L(
          "eth-pub-4",
          "Probity, Anti-Corruption and Whistleblowing",
          "Corruption; petty and grand corruption; prevention of corruption law; Lokpal; CVC; whistleblower protection; asset recovery; the costs of corruption; integrity systems.",
          [
            "A corruption-risk map.",
            "A whistleblower-protection flow.",
          ],
          [
            "What is probity?",
            "How does the Lokpal work?",
            "What protections exist for whistleblowers?",
            "How can corruption be reduced?",
          ],
        ),
      ],
    },
    {
      id: "eth-case-studies",
      subjectKey: "ethics",
      subject: "Ethics",
      paper: "Mains GS-IV",
      syllabusNode: "Ethics — Case studies in administration, business, environment and technology",
      title: "Case Studies and Dilemmas",
      blurb:
        "Ethics becomes real in a dilemma. This unit works through cases in administration, business, environment and technology, and practises the reasoning that GS-IV answers require.",
      sources: [
        "UPSC GS-IV case studies",
        "Administrative ethics casebooks",
        "Business and environmental ethics readers",
      ],
      references: [X.wikiEthics, X.wikiCorporateGovernance, X.wikiEnvironmentalEthics, X.wikiBioethics],
      lessons: [
        L(
          "eth-case-1",
          "Administrative Dilemmas",
          "Case method; stakeholder analysis; competing duties; discretion; political pressure; public interest; writing a GS-IV answer; common mistakes.",
          [
            "A case-analysis framework.",
            "A stakeholder map.",
          ],
          [
            "How should an administrative dilemma be analysed?",
            "What is stakeholder analysis?",
            "How do you balance competing duties?",
            "What makes a good GS-IV answer?",
          ],
        ),
        L(
          "eth-case-2",
          "Corporate Governance and Business Ethics",
          "Corporate governance; shareholder and stakeholder models; board independence; insider trading; CSR; supply-chain ethics; corporate misconduct; regulation.",
          [
            "A corporate-governance structure.",
            "A stakeholder-interest matrix.",
          ],
          [
            "What is corporate governance?",
            "What is the stakeholder model?",
            "How does CSR work in India?",
            "What are the ethical risks in supply chains?",
          ],
        ),
        L(
          "eth-case-3",
          "Environmental Ethics",
          "Anthropocentrism; biocentrism; ecocentrism; intergenerational equity; climate justice; development and environment; the ethics of conservation; case studies.",
          [
            "An environmental-ethics spectrum.",
            "A climate-justice framework.",
          ],
          [
            "What is anthropocentrism?",
            "What is intergenerational equity?",
            "How should conservation balance livelihoods?",
            "What is climate justice?",
          ],
        ),
        L(
          "eth-case-4",
          "Technology and Bioethics",
          "AI ethics; bias; privacy; surveillance; gene editing; clinical trials; informed consent; dual-use research; the precautionary principle; governing emerging technology.",
          [
            "An AI-ethics framework.",
            "A bioethics decision tree.",
          ],
          [
            "What are the ethical risks of AI?",
            "What is informed consent?",
            "Should gene editing be allowed?",
            "What is the precautionary principle?",
          ],
        ),
      ],
    },
  ],
  security: [
    {
      id: "sec-extremism-depth",
      subjectKey: "security",
      subject: "Internal Security",
      paper: "Mains GS-III",
      syllabusNode: "Security — Extremism, insurgency, left-wing extremism and communal violence",
      title: "The Long War Within: Extremism and Insurgency",
      blurb:
        "India's internal security challenges are old, local and layered. This unit looks at the ideas, geography and economics that sustain insurgencies — and at what actually reduces violence.",
      sources: [
        "Ministry of Home Affairs annual reports",
        "Naxalite–Maoist insurgency literature",
        "Internal security chapters of standard GS-III texts",
      ],
      references: [X.wikiMaoist, X.wikiInsurgency, X.wikiTerrorism, X.wikiCommunalViolence],
      lessons: [
        L(
          "sec-ext-1",
          "Left-Wing Extremism: Geography and Grievance",
          "The Maoist belt; the Red Corridor; land, forest and displacement; tribal marginalisation; the Naxalbari lineage; the 2004 merger; the 'people's war' model; why the movement weakened; the development-security debate.",
          [
            "A map of the Red Corridor across central and eastern India.",
            "A timeline from Naxalbari to the present.",
          ],
          [
            "Where is the Red Corridor?",
            "What grievances sustain Maoist insurgency?",
            "Why has left-wing extremism declined?",
            "Can development replace security operations?",
          ],
        ),
        L(
          "sec-ext-2",
          "Insurgencies of the Northeast",
          "Colonial frontier legacy; the six sisters; Naga insurgency; Mizo accord; Assam and the ULFA; Bodo movement; Manipur's many conflicts; the Inner Line Permit; AFSPA; peace accords and their limits.",
          [
            "A map of the Northeast's insurgency theatres.",
            "A timeline of accords and peace processes.",
          ],
          [
            "Why is the Northeast so diverse?",
            "What did the Mizo Accord achieve?",
            "What is AFSPA?",
            "Why do peace accords often stall?",
          ],
        ),
        L(
          "sec-ext-3",
          "Terrorism and Communal Violence",
          "Terrorism's definitions and forms; jihadist networks; the 2008 Mumbai attacks; communal violence; riots and polarisation; the role of the state; prevention, policing and prosecution; the ethics of counter-terrorism.",
          [
            "A typology of terrorism by motive and scale.",
            "A timeline of major terror attacks in India.",
          ],
          [
            "What is terrorism?",
            "How did the 2008 attacks change Indian security?",
            "What causes communal violence?",
            "What are the risks of harsh counter-terror laws?",
          ],
        ),
        L(
          "sec-ext-4",
          "What Actually Reduces Violence?",
          "Security operations; intelligence-led policing; development spending; land rights; local governance; reintegration; amnesty; the 'hearts and minds' debate; measuring success; the limits of force.",
          [
            "A framework linking security, development and legitimacy.",
            "A comparison of hard and soft approaches.",
          ],
          [
            "What works against insurgency?",
            "Why is intelligence-led policing important?",
            "How can ex-combatants be reintegrated?",
            "What are the limits of military force?",
          ],
        ),
      ],
    },
    {
      id: "sec-terror-finance",
      subjectKey: "security",
      subject: "Internal Security",
      paper: "Mains GS-III",
      syllabusNode: "Security — Money laundering, organised crime, terror finance and drug trafficking",
      title: "Follow the Money: Crime, Finance and Terror",
      blurb:
        "Terrorism and organised crime run on money. This unit follows the financial trail — through hawala, shell companies, drug routes and the institutions built to stop them.",
      sources: [
        "FATF guidance and mutual evaluation reports",
        "PMLA and Enforcement Directorate materials",
        "UNODC reports on organised crime",
      ],
      references: [X.wikiMoneyLaundering, X.wikiOrganisedCrime, X.wikiDrugTrafficking, X.wikiHumanTrafficking],
      lessons: [
        L(
          "sec-fin-1",
          "Money Laundering and Terror Finance",
          "Placement, layering and integration; shell companies; benami property; hawala; trade-based laundering; terror finance; FATF; the grey list; India's PMLA regime; the Enforcement Directorate.",
          [
            "A three-stage money-laundering diagram.",
            "A map of hawala and trade routes.",
          ],
          [
            "What is money laundering?",
            "What is hawala?",
            "What does the FATF do?",
            "Why is the grey list a problem?",
          ],
        ),
        L(
          "sec-fin-2",
          "Organised Crime and the Illegal Economy",
          "Gangs and syndicates; extortion; contract crime; illegal mining; sand mafias; counterfeit goods; wildlife trafficking; the interface between crime and politics; the economics of protection.",
          [
            "A diagram of an organised-crime network.",
            "A map of major illegal-economy routes.",
          ],
          [
            "What is organised crime?",
            "Why do illegal economies persist?",
            "How does crime connect to politics?",
            "What is the role of local police?",
          ],
        ),
        L(
          "sec-fin-3",
          "Drug Trafficking and Human Trafficking",
          "The Golden Crescent and the Golden Triangle; heroin routes; synthetic drugs; trafficking in persons; forced labour; sexual exploitation; the Palermo Protocol; India's anti-trafficking law; victim protection.",
          [
            "A map of drug trafficking routes into India.",
            "A trafficking-victim protection flow.",
          ],
          [
            "What are the Golden Crescent and Golden Triangle?",
            "How does human trafficking work?",
            "What is the Palermo Protocol?",
            "Why are victims often treated as criminals?",
          ],
        ),
        L(
          "sec-fin-4",
          "Institutions and the Financial War",
          "FIU-IND; ED; CBI; NIA; customs and narcotics bureaus; financial intelligence; suspicious transaction reports; asset seizure; international cooperation; extradition; the limits of the financial war.",
          [
            "A diagram of India's financial-intelligence architecture.",
            "A mutual-legal-assistance flow.",
          ],
          [
            "What is the FIU?",
            "How does the ED investigate?",
            "What is a suspicious transaction report?",
            "Why is extradition difficult?",
          ],
        ),
      ],
    },
    {
      id: "sec-border-maritime",
      subjectKey: "security",
      subject: "Internal Security",
      paper: "Mains GS-III",
      syllabusNode: "Security — Border management, coastal security and immigration",
      title: "Borders, Coasts and the Blue Frontier",
      blurb:
        "India has a long land border and a longer coastline. This unit examines how the state guards both — and why borders are as much about people and livelihoods as about troops.",
      sources: [
        "Ministry of Home Affairs border management reports",
        "Indian Coast Guard and Navy doctrines",
        "Border Area Development Programme materials",
      ],
      references: [X.wikiBorderManagement, X.wikiCoastalSecurity, X.wikiImmigration, X.wikiDefence],
      lessons: [
        L(
          "sec-bor-1",
          "Land Borders: Lines, Fences and Lives",
          "The Radcliffe Line; the McMahon Line; the Line of Control; the Line of Actual Control; border fencing; border roads; Border Area Development; border trade; the human cost of borders.",
          [
            "A map of India's land borders and disputed lines.",
            "A cross-section of a border-fencing regime.",
          ],
          [
            "What is the difference between the LoC and the LAC?",
            "Why is the McMahon Line disputed?",
            "What is the Border Area Development Programme?",
            "How do borders affect local livelihoods?",
          ],
        ),
        L(
          "sec-bor-2",
          "Coastal Security and the Sea Frontier",
          "The 26/11 lesson; the coastline's length; the Indian Coast Guard; coastal police; the fishing community as sensor; ports and customs; the Sagar setu; maritime domain awareness; the blue economy.",
          [
            "A map of India's coast and major ports.",
            "A layered coastal-security diagram.",
          ],
          [
            "Why was 26/11 a coastal-security failure?",
            "What does the Coast Guard do?",
            "How can fishing communities help?",
            "What is maritime domain awareness?",
          ],
        ),
        L(
          "sec-bor-3",
          "Immigration, Refugees and Citizenship",
          "Immigration law; visas; the Citizenship Act; the CAA debate; refugees; the Rohingya; statelessness; deportation; the Assam NRC; the politics of belonging.",
          [
            "A diagram of India's immigration and citizenship regime.",
            "A timeline of the NRC and CAA.",
          ],
          [
            "What is the difference between a refugee and an immigrant?",
            "What did the CAA change?",
            "Why is the NRC controversial?",
            "How does India treat stateless people?",
          ],
        ),
        L(
          "sec-bor-4",
          "Border Infrastructure and Strategy",
          "Border roads; tunnels; strategic railways; the China border infrastructure race; dual-use infrastructure; connectivity to the Northeast; the Andaman and Nicobar Islands; the Indo-Pacific.",
          [
            "A map of strategic border infrastructure.",
            "A connectivity corridor diagram.",
          ],
          [
            "Why is border infrastructure strategic?",
            "What is the role of the Andaman and Nicobar Islands?",
            "How does connectivity shape the Northeast?",
            "What is the Indo-Pacific?",
          ],
        ),
      ],
    },
    {
      id: "sec-defence-depth",
      subjectKey: "security",
      subject: "Internal Security",
      paper: "Mains GS-III",
      syllabusNode: "Security — Defence, deterrence, nuclear doctrine and civil-military relations",
      title: "Defence, Deterrence and the Nuclear Question",
      blurb:
        "India's security is shaped by its armed forces, its nuclear doctrine and its strategic culture. This unit explains how deterrence works — and what it costs.",
      sources: [
        "Ministry of Defence annual reports",
        "India's nuclear doctrine statements",
        "Standard strategic-affairs texts",
      ],
      references: [X.wikiDefence, X.wikiNuclearDoctrineIndia, X.wikiNuclearDoctrine, X.wikiTerrorism],
      lessons: [
        L(
          "sec-def-1",
          "The Armed Forces and Civil-Military Relations",
          "The Army, Navy and Air Force; the integrated theatre commands debate; the CDS; the defence budget; indigenisation; the DRDO; civil-military relations; the soldier and the state.",
          [
            "A diagram of India's defence organisation.",
            "A chart of the defence budget's components.",
          ],
          [
            "What is the CDS?",
            "Why are theatre commands debated?",
            "How is the defence budget spent?",
            "What is civil-military relations?",
          ],
        ),
        L(
          "sec-def-2",
          "Nuclear Doctrine and Deterrence",
          "The 1998 tests; no first use; credible minimum deterrence; the nuclear triad; the NFU debate; the 2019 space test; the NPT and NSG; the logic of deterrence; the risks of accidental escalation.",
          [
            "A diagram of the nuclear triad.",
            "A timeline from Pokhran-II to the present.",
          ],
          [
            "What is credible minimum deterrence?",
            "What is no first use?",
            "Why is the nuclear triad important?",
            "What are the risks of deterrence?",
          ],
        ),
        L(
          "sec-def-3",
          "Defence Procurement and Indigenisation",
          "The procurement cycle; offsets; DAP 2020; emergency purchases; the Ordnance Factory Board reform; private defence industry; exports; technology transfer; the cost of imports.",
          [
            "A defence-procurement flow diagram.",
            "A chart of India's defence exports.",
          ],
          [
            "What is an offset?",
            "Why does procurement take so long?",
            "What was the OFB reform?",
            "Can India become a defence exporter?",
          ],
        ),
        L(
          "sec-def-4",
          "Strategic Culture and the Future of War",
          "Strategic culture; the Kautilya tradition; the nuclear age; space and cyber; drones; AI in warfare; hybrid warfare; the changing character of conflict; India's strategic choices.",
          [
            "A spectrum of old and new warfare.",
            "A diagram of hybrid warfare.",
          ],
          [
            "What is strategic culture?",
            "How is war changing?",
            "What is hybrid warfare?",
            "What should India's strategy be?",
          ],
        ),
      ],
    },
  ],
};
