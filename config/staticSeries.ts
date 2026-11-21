// The Static Editorial curriculum — the long, sequential walk through the
// common UPSC General Studies syllabus.
//
// This file is the *plan*: what we will teach, in what order, and from which
// standard sources. Progress lives separately in
// data/static-series/progress.json, so this file stays a stable curriculum that
// a human can read and edit. Each lesson is one day's long-form article.
//
// Rules of the series (see docs/static-series-plan.md):
//   - Common GS only: Prelims GS-I + Mains GS I–IV. No CSAT, no optionals.
//   - One coherent chunk per day; split a big topic into numbered lessons.
//   - Geography first, then polity, economy, history, and the rest.
//   - References are curated here, never invented by the model.
//
// To add a lesson, append an `L(...)` entry to the right unit. To add a unit,
// append a unit object to CURRICULUM. IDs must be globally unique and stable:
// progress refers to them.

import type { Reference, StaticLessonSubjectKey } from "../src/lib/types";
import { EXPANSION_UNITS } from "./staticSeriesExpansion";

export interface SeriesLesson {
  id: string;
  title: string;
  // What the lesson must cover. This is the contract with the generator.
  scope: string;
  // Suggested visuals. The generator may draw simple, original SVG diagrams.
  figureIdeas: string[];
  // Questions the lesson should leave the student able to answer.
  keyQuestions: string[];
}

export interface SeriesUnit {
  id: string;
  subjectKey: StaticLessonSubjectKey;
  subject: string;
  // e.g. "Prelims GS-I · Mains GS-I"
  paper: string;
  syllabusNode: string;
  title: string;
  blurb: string;
  // Standard textbooks / chapters. These are named for the model, not linked.
  sources: string[];
  references: Reference[];
  lessons: SeriesLesson[];
}

export interface SeriesSubject {
  key: StaticLessonSubjectKey;
  title: string;
  blurb: string;
  papers: string[];
}

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

// ---- Shared, verified references -------------------------------------------
// Every href is a real official page, textbook PDF or encyclopaedia article.
// The model never emits URLs; it only chooses which curated references a
// section cites.
const R = {
  ncertHub: ref("NCERT textbooks (official, free)", "https://ncert.nic.in/textbook.php"),
  ncertPhysical: ref(
    "NCERT Class XI — Fundamentals of Physical Geography",
    "https://ncert.nic.in/textbook/pdf/kegy101.pdf",
  ),
  ncertIndiaPhysical: ref(
    "NCERT Class XI — India: Physical Environment",
    "https://ncert.nic.in/textbook/pdf/kegy301.pdf",
  ),
  ncertHuman: ref(
    "NCERT Class XII — Fundamentals of Human Geography",
    "https://ncert.nic.in/textbook/pdf/legy101.pdf",
  ),
  ncertIndiaPeople: ref(
    "NCERT Class XII — India: People and Economy",
    "https://ncert.nic.in/textbook/pdf/legy301.pdf",
  ),
  imd: ref("India Meteorological Department", "https://mausam.imd.gov.in/"),
  survey: ref("Survey of India", "https://surveyofindia.gov.in/"),
  earthObservatory: ref("NASA Earth Observatory", "https://earthobservatory.nasa.gov/"),
  nasaEarth: ref("NASA — Earth Fact Sheet", "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"),
  usgsPlate: ref("USGS — Plate Tectonics", "https://www.usgs.gov/programs/earthquake-hazards/plate-tectonics"),
  wikiEarth: ref("Earth", "https://en.wikipedia.org/wiki/Earth", "wiki"),
  wikiSolar: ref("Solar System", "https://en.wikipedia.org/wiki/Solar_System", "wiki"),
  wikiCoords: ref("Geographic coordinate system", "https://en.wikipedia.org/wiki/Geographic_coordinate_system", "wiki"),
  wikiMapProjection: ref("Map projection", "https://en.wikipedia.org/wiki/Map_projection", "wiki"),
  wikiTectonics: ref("Plate tectonics", "https://en.wikipedia.org/wiki/Plate_tectonics", "wiki"),
  wikiEarthquake: ref("Earthquake", "https://en.wikipedia.org/wiki/Earthquake", "wiki"),
  wikiVolcano: ref("Volcano", "https://en.wikipedia.org/wiki/Volcano", "wiki"),
  wikiRockCycle: ref("Rock cycle", "https://en.wikipedia.org/wiki/Rock_cycle", "wiki"),
  wikiWeathering: ref("Weathering", "https://en.wikipedia.org/wiki/Weathering", "wiki"),
  wikiRiver: ref("River", "https://en.wikipedia.org/wiki/River", "wiki"),
  wikiGlacier: ref("Glacier", "https://en.wikipedia.org/wiki/Glacier", "wiki"),
  wikiAeolian: ref("Aeolian processes", "https://en.wikipedia.org/wiki/Aeolian_processes", "wiki"),
  wikiCoast: ref("Coast", "https://en.wikipedia.org/wiki/Coast", "wiki"),
  wikiKarst: ref("Karst", "https://en.wikipedia.org/wiki/Karst", "wiki"),
  wikiAtmosphere: ref("Atmosphere of Earth", "https://en.wikipedia.org/wiki/Atmosphere_of_Earth", "wiki"),
  wikiMonsoon: ref("Monsoon", "https://en.wikipedia.org/wiki/Monsoon", "wiki"),
  wikiOceanCurrent: ref("Ocean current", "https://en.wikipedia.org/wiki/Ocean_current", "wiki"),
  wikiHimalaya: ref("Himalayas", "https://en.wikipedia.org/wiki/Himalayas", "wiki"),
  wikiGanges: ref("Ganges", "https://en.wikipedia.org/wiki/Ganges", "wiki"),
  wikiDeccan: ref("Deccan Plateau", "https://en.wikipedia.org/wiki/Deccan_Plateau", "wiki"),
  wikiSoil: ref("Soil", "https://en.wikipedia.org/wiki/Soil", "wiki"),
  wikiAgricultureIndia: ref("Agriculture in India", "https://en.wikipedia.org/wiki/Agriculture_in_India", "wiki"),
  wikiDemographicsIndia: ref("Demographics of India", "https://en.wikipedia.org/wiki/Demographics_of_India", "wiki"),
  wikiWorldMap: ref("World map", "https://en.wikipedia.org/wiki/World_map", "wiki"),
  wikiStrait: ref("Strait", "https://en.wikipedia.org/wiki/Strait", "wiki"),

  constitution: ref("Constitution of India", "https://legislative.gov.in/constitution-of-india/"),
  parliament: ref("Parliament of India — Sansad", "https://sansad.in/"),
  prs: ref("PRS Legislative Research", "https://prsindia.org/", "report"),
  supremeCourt: ref("Supreme Court of India", "https://www.sci.gov.in/"),
  eci: ref("Election Commission of India", "https://eci.gov.in/"),
  pib: ref("Press Information Bureau", "https://www.pib.gov.in/"),
  upsc: ref("Union Public Service Commission", "https://upsc.gov.in/"),
  financeCommission: ref("Finance Commission", "https://fincomindia.nic.in/"),
  cag: ref("Comptroller and Auditor General of India", "https://cag.gov.in/"),
  nhrc: ref("National Human Rights Commission", "https://nhrc.nic.in/"),
  cic: ref("Central Information Commission", "https://cic.gov.in/"),
  wikiConstitution: ref("Constitution of India", "https://en.wikipedia.org/wiki/Constitution_of_India", "wiki"),
  wikiParliament: ref("Parliament of India", "https://en.wikipedia.org/wiki/Parliament_of_India", "wiki"),
  wikiFederalism: ref("Federalism in India", "https://en.wikipedia.org/wiki/Federalism_in_India", "wiki"),
  wikiJudiciary: ref("Judiciary of India", "https://en.wikipedia.org/wiki/Judiciary_of_India", "wiki"),
  wikiPanchayat: ref("Panchayati raj in India", "https://en.wikipedia.org/wiki/Panchayati_raj_in_India", "wiki"),

  budget: ref("Union Budget", "https://www.indiabudget.gov.in/"),
  rbi: ref("Reserve Bank of India", "https://www.rbi.org.in/"),
  niti: ref("NITI Aayog", "https://niti.gov.in/"),
  mospi: ref("Ministry of Statistics and Programme Implementation", "https://www.mospi.gov.in/"),
  census: ref("Census of India", "https://censusindia.gov.in/census.website/"),
  wto: ref("World Trade Organization", "https://www.wto.org/"),
  imf: ref("International Monetary Fund", "https://www.imf.org/"),
  worldBank: ref("World Bank", "https://www.worldbank.org/"),
  wikiEconomyIndia: ref("Economy of India", "https://en.wikipedia.org/wiki/Economy_of_India", "wiki"),
  wikiBudget: ref("Union budget of India", "https://en.wikipedia.org/wiki/Union_budget_of_India", "wiki"),
  wikiGST: ref("Goods and Services Tax (India)", "https://en.wikipedia.org/wiki/Goods_and_Services_Tax_(India)", "wiki"),
  wikiMSP: ref("Minimum support price", "https://en.wikipedia.org/wiki/Minimum_support_price", "wiki"),

  mea: ref("Ministry of External Affairs", "https://www.mea.gov.in/"),
  un: ref("United Nations", "https://www.un.org/"),
  wikiUNSC: ref("United Nations Security Council", "https://en.wikipedia.org/wiki/United_Nations_Security_Council", "wiki"),
  wikiNAM: ref("Non-Aligned Movement", "https://en.wikipedia.org/wiki/Non-Aligned_Movement", "wiki"),
  wikiQuad: ref("Quadrilateral Security Dialogue", "https://en.wikipedia.org/wiki/Quadrilateral_Security_Dialogue", "wiki"),

  moefcc: ref("Ministry of Environment, Forest and Climate Change", "https://moef.gov.in/"),
  unfccc: ref("UNFCCC", "https://unfccc.int/"),
  cbd: ref("Convention on Biological Diversity", "https://www.cbd.int/"),
  ramsar: ref("Ramsar Convention", "https://www.ramsar.org/"),
  wikiEcology: ref("Ecology", "https://en.wikipedia.org/wiki/Ecology", "wiki"),
  wikiBiodiversity: ref("Biodiversity", "https://en.wikipedia.org/wiki/Biodiversity", "wiki"),
  wikiClimateChange: ref("Climate change", "https://en.wikipedia.org/wiki/Climate_change", "wiki"),
  wikiPollution: ref("Pollution", "https://en.wikipedia.org/wiki/Pollution", "wiki"),
  wikiEIA: ref("Environmental impact assessment", "https://en.wikipedia.org/wiki/Environmental_impact_assessment", "wiki"),

  isro: ref("ISRO", "https://www.isro.gov.in/"),
  dst: ref("Department of Science and Technology", "https://dst.gov.in/"),
  wikiSpace: ref("Space exploration", "https://en.wikipedia.org/wiki/Space_exploration", "wiki"),
  wikiBiotech: ref("Biotechnology", "https://en.wikipedia.org/wiki/Biotechnology", "wiki"),
  wikiAI: ref("Artificial intelligence", "https://en.wikipedia.org/wiki/Artificial_intelligence", "wiki"),
  wikiNuclear: ref("Nuclear technology", "https://en.wikipedia.org/wiki/Nuclear_technology", "wiki"),

  asi: ref("Archaeological Survey of India", "https://asi.nic.in/"),
  ignca: ref("Indira Gandhi National Centre for the Arts", "https://ignca.gov.in/"),
  sangeetNatak: ref("Sangeet Natak Akademi", "https://sangeetnatak.gov.in/"),
  sahitya: ref("Sahitya Akademi", "https://sahitya-akademi.gov.in/"),
  culture: ref("Ministry of Culture", "https://culture.gov.in/"),
  unescoIndia: ref("UNESCO — India", "https://www.unesco.org/en/countries/in"),
  wikiIndianCulture: ref("Culture of India", "https://en.wikipedia.org/wiki/Culture_of_India", "wiki"),
  wikiTempleArchitecture: ref(
    "Hindu temple architecture",
    "https://en.wikipedia.org/wiki/Hindu_temple_architecture",
    "wiki",
  ),

  wikiIndianSociety: ref("Culture of India", "https://en.wikipedia.org/wiki/Culture_of_India", "wiki"),
  wikiCaste: ref("Caste system in India", "https://en.wikipedia.org/wiki/Caste_system_in_India", "wiki"),
  wikiUrbanisation: ref("Urbanisation in India", "https://en.wikipedia.org/wiki/Urbanisation_in_India", "wiki"),

  wikiEthics: ref("Ethics", "https://en.wikipedia.org/wiki/Ethics", "wiki"),
  wikiEmotionalIntelligence: ref(
    "Emotional intelligence",
    "https://en.wikipedia.org/wiki/Emotional_intelligence",
    "wiki",
  ),
  wikiIntegrity: ref("Integrity", "https://en.wikipedia.org/wiki/Integrity", "wiki"),

  mha: ref("Ministry of Home Affairs", "https://www.mha.gov.in/"),
  ndma: ref("National Disaster Management Authority", "https://ndma.gov.in/"),
  certIn: ref("CERT-In", "https://www.cert-in.org.in/"),
  wikiInternalSecurity: ref(
    "Internal security",
    "https://en.wikipedia.org/wiki/Internal_security",
    "wiki",
  ),
  wikiDisasterManagement: ref(
    "Disaster management in India",
    "https://en.wikipedia.org/wiki/Disaster_management_in_India",
    "wiki",
  ),
  wikiCyberSecurity: ref("Computer security", "https://en.wikipedia.org/wiki/Computer_security", "wiki"),
};

export const SERIES_SUBJECTS: SeriesSubject[] = [
  {
    key: "geography",
    title: "Geography",
    blurb: "The stage on which history, economy and strategy are played out — physical, human and Indian.",
    papers: ["Prelims GS-I", "Mains GS-I"],
  },
  {
    key: "polity",
    title: "Polity, Constitution & Governance",
    blurb: "How India is governed: the Constitution, institutions, federalism, rights and accountability.",
    papers: ["Prelims GS-I", "Mains GS-II"],
  },
  {
    key: "economy",
    title: "Economy & Development",
    blurb: "Money, budgets, markets, agriculture and the question of inclusive growth.",
    papers: ["Prelims GS-I", "Mains GS-III"],
  },
  {
    key: "history",
    title: "History, Freedom Struggle & World History",
    blurb: "From the first cities to the Republic — the long arc of India and the modern world.",
    papers: ["Prelims GS-I", "Mains GS-I"],
  },
  {
    key: "environment",
    title: "Environment, Ecology & Climate",
    blurb: "The living systems we depend on, the laws that protect them, and the climate transition.",
    papers: ["Prelims GS-I", "Mains GS-III"],
  },
  {
    key: "science",
    title: "Science & Technology",
    blurb: "Space, biotech, computing, health, energy and the frontier technologies reshaping policy.",
    papers: ["Prelims GS-I", "Mains GS-III"],
  },
  {
    key: "culture",
    title: "Art, Culture & Heritage",
    blurb: "Architecture, sculpture, painting, dance, music, literature and the living heritage of India.",
    papers: ["Prelims GS-I", "Mains GS-I"],
  },
  {
    key: "society",
    title: "Indian Society & Social Justice",
    blurb: "Diversity, caste, gender, family, urbanisation, globalisation and the quest for equity.",
    papers: ["Prelims GS-I", "Mains GS-I", "Mains GS-II"],
  },
  {
    key: "ir",
    title: "International Relations",
    blurb: "India's neighbourhood, the great powers, multilateral institutions and the Global South.",
    papers: ["Mains GS-II"],
  },
  {
    key: "ethics",
    title: "Ethics, Integrity & Aptitude",
    blurb: "The inner compass of public service — values, dilemmas, thinkers and case studies.",
    papers: ["Mains GS-IV"],
  },
  {
    key: "security",
    title: "Internal Security & Disaster Management",
    blurb: "Terrorism, extremism, cyber threats, borders, and how India prepares for disasters.",
    papers: ["Mains GS-III"],
  },
];

const BASE_CURRICULUM: SeriesUnit[] = [
  // ==========================================================================
  // GEOGRAPHY — the first subject. A deliberate walk from the whole Earth to
  // India, then out to the world.
  // ==========================================================================
  {
    id: "geo-foundations",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Foundations of the discipline; Earth in the solar system",
    title: "Foundations: How Geography Sees the World",
    blurb:
      "Before maps, plate tectonics or monsoons, geography asks a simpler question: where are we, and why does that location matter? This unit builds the toolkit.",
    sources: [
      "NCERT Class XI, Fundamentals of Physical Geography, ch. 1–3",
      "NCERT Class VI, The Earth: Our Habitat, ch. 1–3",
      "GC Leong, Certificate Physical and Human Geography, opening chapters",
    ],
    references: [R.ncertPhysical, R.ncertHub, R.wikiEarth, R.wikiSolar, R.nasaEarth],
    lessons: [
      L(
        "geo-foundations-1",
        "The World Before the Map: Geography as a Way of Seeing",
        "What geography is and is not; the discipline's two parents (physical and human); geography as a spatial, systems science; the Earth's place in the solar system; the shape and size of the Earth; why location is the first fact of every UPSC subject.",
        [
          "A clean solar-system schematic (Sun, terrestrial planets, asteroid belt, gas and ice giants), clearly labelled 'not to scale'.",
          "A comparison of a perfect sphere and an exaggerated oblate spheroid, marking equatorial bulge and polar flattening.",
          "Eratosthenes' shadow experiment: parallel sun rays, Syene's well, Alexandria's obelisk, the 7.2° angle and the circumference formula.",
        ],
        [
          "Why is geography described as a spatial science?",
          "What makes Earth habitable within the solar system?",
          "How did Eratosthenes estimate the Earth's circumference?",
          "Why is the Earth an oblate spheroid rather than a perfect sphere?",
        ],
      ),
      L(
        "geo-foundations-2",
        "The Grid We Live By: Latitude, Longitude and Time",
        "Latitude and longitude; parallels and meridians; great and small circles; the Equator, tropics, Arctic/Antarctic circles; longitude and time; local vs standard time; time zones; the International Date Line; India's 82°30′E standard meridian; why the grid matters for maps, climate and strategy.",
        [
          "A globe with labelled latitude belts and the five major circles.",
          "A time-zone strip showing how 15° of longitude equals one hour, with the IDL zig-zag.",
        ],
        [
          "Why does 15° of longitude equal one hour?",
          "Why is the International Date Line not a straight line?",
          "Why does India need a single standard meridian?",
          "How do latitude and longitude determine climate and day length?",
        ],
      ),
      L(
        "geo-foundations-3",
        "Reading the Earth: Maps, Scale and Projections",
        "Map scale (statement, representative fraction, graphical); large vs small-scale maps; map projections and their distortions; Mercator, conic and azimuthal projections; topographic sheets; contours and conventional signs; remote sensing and GIS as modern map-making; why every map is an argument.",
        [
          "Three small panels showing the same world in Mercator, conic and azimuthal projections.",
          "A contour diagram with a hill, a valley and a cliff, annotated with interval and slope.",
        ],
        [
          "Why can no flat map preserve area, shape, distance and direction simultaneously?",
          "What is the difference between large-scale and small-scale maps?",
          "How do you read a contour map?",
          "What is the difference between remote sensing and GIS?",
        ],
      ),
      L(
        "geo-foundations-4",
        "The Earth in Motion: Rotation, Revolution and the Seasons",
        "Rotation and revolution; axial tilt; circumpolar stars; apparent motion of the Sun; solstices and equinoxes; equinox vs solstice; day length and seasons; the analemma; why the tropics have different seasonality; the Coriolis effect preview.",
        [
          "A four-position revolution diagram (March equinox, June solstice, September equinox, December solstice) with the tilted axis and direct sunlight.",
          "A day-length graph for a tropical, mid-latitude and polar location across the year.",
        ],
        [
          "Why are seasons caused by tilt, not distance from the Sun?",
          "What happens at the Arctic Circle on the June solstice?",
          "Why is the Earth's perihelion in January?",
          "How does the Coriolis effect shape winds and currents?",
        ],
      ),
      L(
        "geo-foundations-5",
        "Inside the Earth: Layers, Seismic Waves and the Geoid",
        "Earth's internal structure; crust, mantle, outer and inner core; composition and state; seismic waves (P, S, L); shadow zones; Mohorovičić and Gutenberg discontinuities; lithosphere vs asthenosphere; isostasy; the geoid; how we know the inside without seeing it.",
        [
          "A cut-away Earth showing crust, mantle, outer core, inner core and the two discontinuities.",
          "A seismic-wave diagram showing P and S shadow zones and what they reveal about the liquid outer core.",
        ],
        [
          "How do P and S waves reveal the Earth's interior?",
          "Why is the outer core liquid but the inner core solid?",
          "What is the difference between lithosphere and asthenosphere?",
          "What is isostasy?",
        ],
      ),
    ],
  },
  {
    id: "geo-tectonics",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Plate tectonics, earthquakes, volcanoes and mountain building",
    title: "The Restless Earth: Tectonics and Its Consequences",
    blurb:
      "The Earth's surface is a mosaic of moving plates. That single idea explains mountains, oceans, earthquakes, volcanoes — and why India keeps colliding with Asia.",
    sources: [
      "NCERT Class XI, Fundamentals of Physical Geography, ch. 3–4",
      "NCERT Class XI, India: Physical Environment, ch. 2",
      "GC Leong, Certificate Physical and Human Geography, tectonic chapters",
    ],
    references: [R.ncertPhysical, R.usgsPlate, R.wikiTectonics, R.wikiEarthquake, R.wikiVolcano],
    lessons: [
      L(
        "geo-tectonics-1",
        "Continental Drift to Plate Tectonics: A Theory That Changed Everything",
        "Wegener's continental drift and its evidence (jigsaw fit, fossils, rocks, palaeoclimate); why drift was rejected; sea-floor spreading and magnetic striping; Harry Hess and the 1960s revolution; plate boundaries (divergent, convergent, transform); mantle convection; hotspots.",
        [
          "A three-panel sequence: Pangaea, continental drift evidence, and present-day plate boundaries.",
          "A cross-section of a divergent boundary, a subduction zone and a transform fault.",
        ],
        [
          "What evidence did Wegener use for continental drift?",
          "How did sea-floor spreading revive the drift idea?",
          "What are the three types of plate boundary?",
          "Why do most earthquakes and volcanoes occur at plate margins?",
        ],
      ),
      L(
        "geo-tectonics-2",
        "Earthquakes: When the Crust Snaps",
        "Focus and epicentre; elastic-rebound theory; seismic waves; magnitude vs intensity; Richter and moment magnitude scales; seismographs; distribution of earthquakes; shallow, intermediate and deep-focus quakes; tsunamis; India's seismic zones; Bhuj, Latur, Nepal and the Himalayan risk.",
        [
          "A fault-block diagram showing focus, epicentre, fault plane and wave paths.",
          "A map of India's seismic zones II–V with major past earthquakes marked.",
        ],
        [
          "What is the difference between magnitude and intensity?",
          "Why are shallow earthquakes often more destructive?",
          "Why is the Himalayan belt so earthquake-prone?",
          "How does an undersea earthquake generate a tsunami?",
        ],
      ),
      L(
        "geo-tectonics-3",
        "Volcanoes: Mountains That Breathe",
        "Magma, lava, viscosity and gas content; shield, composite and cinder-cone volcanoes; calderas; fissure eruptions; pyroclastic flows and lahars; the Ring of Fire; hotspot volcanism (Hawaii, Yellowstone); volcanic landforms and soils; India's volcanic legacy (Deccan Traps, Barren Island); volcanic hazards and benefits.",
        [
          "A comparison of shield, composite and cinder-cone volcano profiles.",
          "A world map of the Ring of Fire and major hotspots.",
        ],
        [
          "Why do some volcanoes erupt gently and others explosively?",
          "What is the Ring of Fire?",
          "How are hotspot volcanoes different from subduction-zone volcanoes?",
          "What is the Deccan Traps and why does it matter?",
        ],
      ),
      L(
        "geo-tectonics-4",
        "Mountain Building and the Rock Cycle",
        "Orogeny and mountain types (fold, fault-block, volcanic, residual); fold structures (anticline, syncline, nappe); faulting and rift valleys; the Himalayas as a collision mountain; isostasy and mountain roots; the rock cycle linking igneous, sedimentary and metamorphic rocks; why the rock cycle is a system.",
        [
          "A fold-and-fault diagram with anticline, syncline, thrust fault and rift valley.",
          "A circular rock-cycle diagram with heat, pressure, weathering and deposition.",
        ],
        [
          "How are fold mountains different from block mountains?",
          "Why does the Himalayas have a deep crustal root?",
          "What is the rock cycle?",
          "How can a sedimentary rock become metamorphic and then igneous?",
        ],
      ),
    ],
  },
  {
    id: "geo-rocks-weathering",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Minerals, rocks, weathering, mass wasting and soil formation",
    title: "Stone, Rain and Time: The Making of the Land",
    blurb:
      "Mountains do not become plains by magic. Weathering, erosion and mass movement slowly dismantle the crust and create the soil that feeds us.",
    sources: [
      "NCERT Class XI, Fundamentals of Physical Geography, ch. 5–6",
      "NCERT Class XI, India: Physical Environment, ch. 3",
      "GC Leong, Certificate Physical and Human Geography, weathering and soils",
    ],
    references: [R.ncertPhysical, R.ncertIndiaPhysical, R.wikiRockCycle, R.wikiWeathering, R.wikiSoil],
    lessons: [
      L(
        "geo-rocks-1",
        "Minerals and Rocks: The Crust's Alphabet",
        "What a mineral is; silicate and non-silicate minerals; physical properties used for identification; the three rock families; igneous textures (intrusive vs extrusive); sedimentary structures and fossils; metamorphism and foliation; economic minerals; India's major mineral belts.",
        [
          "A rock-cycle diagram with named examples (granite, basalt, sandstone, limestone, marble, slate).",
          "A simple mineral-identification table: hardness, cleavage, lustre, colour.",
        ],
        [
          "What is the difference between a mineral and a rock?",
          "Why do intrusive and extrusive igneous rocks have different textures?",
          "How does metamorphism change a rock?",
          "Which rocks are associated with coal and petroleum?",
        ],
      ),
      L(
        "geo-rocks-2",
        "Weathering and Mass Wasting: The Slow Demolition",
        "Physical weathering (frost, salt, exfoliation, thermal); chemical weathering (solution, oxidation, hydrolysis, carbonation); biological weathering; the role of climate; regolith and saprolite; mass wasting (creep, slump, landslide, mudflow, rockfall); angle of repose; triggers and mitigation; landslides in the Himalaya and Western Ghats.",
        [
          "A weathering-process diagram showing frost wedging, hydrolysis and root action.",
          "A slope-failure diagram comparing creep, slump, landslide and rockfall.",
        ],
        [
          "Which type of weathering dominates in hot, wet climates?",
          "What is the difference between weathering and erosion?",
          "What triggers a landslide?",
          "Why are Himalayan slopes so landslide-prone?",
        ],
      ),
      L(
        "geo-rocks-3",
        "Soil: The Thin Skin That Sustains Civilisations",
        "Soil-forming factors (parent rock, climate, organisms, relief, time); soil profile and horizons; soil texture and structure; humus; leaching and calcification; soil erosion and conservation; soil degradation; the Green Revolution's soil legacy; India's soil types preview.",
        [
          "A soil-profile diagram with O, A, B, C and R horizons.",
          "A slope-and-terrace diagram showing how contour bunding and terracing reduce erosion.",
        ],
        [
          "What are the five soil-forming factors?",
          "Why do tropical soils often have thin humus despite dense forests?",
          "What is leaching?",
          "How does soil erosion threaten food security?",
        ],
      ),
    ],
  },
  {
    id: "geo-landforms",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Geomorphic processes and landforms",
    title: "Landforms: The Signature of Water, Ice, Wind and Sea",
    blurb:
      "Every landform is a sentence written by an agent of erosion. Learn to read valleys, moraines, dunes, cliffs and caves as evidence of what happened there.",
    sources: [
      "NCERT Class XI, Fundamentals of Physical Geography, ch. 7",
      "GC Leong, Certificate Physical and Human Geography, landform chapters",
      "Oxford School Atlas for map examples",
    ],
    references: [R.ncertPhysical, R.wikiRiver, R.wikiGlacier, R.wikiAeolian, R.wikiCoast, R.wikiKarst],
    lessons: [
      L(
        "geo-landforms-1",
        "Rivers at Work: Fluvial Landforms",
        "The hydrological cycle and river discharge; erosion, transport and deposition; V-shaped valleys, gorges, waterfalls, potholes, meanders, oxbow lakes, floodplains, levees, deltas, alluvial fans and cones; base level; graded profile; river capture; floods and river management; Indian examples (Ganga, Brahmaputra, Godavari).",
        [
          "A river's long profile from source to mouth with landforms marked.",
          "A meander belt diagram showing cut bank, point bar and oxbow-lake formation.",
        ],
        [
          "Why do rivers deposit sediment where they do?",
          "How does an oxbow lake form?",
          "Why do deltas form at some river mouths but not others?",
          "What is a graded river profile?",
        ],
      ),
      L(
        "geo-landforms-2",
        "Ice at Work: Glacial Landforms",
        "Glaciers as systems; accumulation and ablation; erosion (plucking, abrasion); cirques, arêtes, horns, U-shaped valleys, hanging valleys, fjords; moraines, drumlins, eskers, kames, outwash plains; glacial lakes; past glaciation and climate evidence; Himalayan glaciers and GLOFs.",
        [
          "An alpine-glacier diagram with cirque, arête, horn, U-valley and moraine.",
          "A before-and-after valley cross-section showing a river V-valley and a glacial U-valley.",
        ],
        [
          "How does a glacial valley differ from a river valley?",
          "What are the different types of moraine?",
          "What is a GLOF and why is it a growing hazard?",
          "What can glacial landforms tell us about past climate?",
        ],
      ),
      L(
        "geo-landforms-3",
        "Wind at Work: Desert and Aeolian Landforms",
        "Desert conditions and exhumation; deflation, abrasion and attrition; pediments, inselbergs, yardangs, ventifacts; barchans, seif dunes, star dunes, transverse and longitudinal dunes; loess; desertification; sand encroachment; Indian deserts (Thar, Rann) and the role of the monsoon.",
        [
          "A dune-morphology diagram showing barchan, seif and star dunes with wind direction.",
          "A desert-landscape sketch with pediment, inselberg, playa and alluvial fan.",
        ],
        [
          "How does wind erode rock?",
          "What determines dune shape?",
          "What is loess and where is it found?",
          "Why is the Thar Desert expanding and contracting?",
        ],
      ),
      L(
        "geo-landforms-4",
        "The Sea at Work: Coastal Landforms",
        "Waves, tides and currents; erosion (hydraulic action, abrasion, attrition, solution); cliffs, wave-cut platforms, sea caves, arches, stacks; deposition (beaches, spits, bars, tombolos, lagoons); coastal classification (submergent vs emergent); coral reefs and atolls; mangroves; coastal erosion and India's coastline.",
        [
          "A coastal-process diagram showing cliff retreat, wave-cut platform, cave, arch and stack.",
          "A depositional-coast diagram with spit, bar, lagoon and tombolo.",
        ],
        [
          "How does a sea arch become a stack?",
          "What is the difference between a spit and a bar?",
          "Why are mangroves important for coasts?",
          "How do coral atolls form?",
        ],
      ),
      L(
        "geo-landforms-5",
        "Water Underground: Karst Topography",
        "Limestone and dolomite; carbonation and solution; sinkholes, dolines, uvalas, poljes; caves, stalactites, stalagmites, pillars; disappearing streams; karst springs; tower karst; karst hazards; India's karst regions (Borra, Belum, Meghalaya).",
        [
          "A karst cross-section with sinkhole, cave, stalactite, stalagmite and underground stream.",
          "A tower-karst landscape sketch (Guilin-style) with a note on tropical karst.",
        ],
        [
          "Why does karst develop mainly in limestone?",
          "How do stalactites and stalagmites form?",
          "What is a disappearing stream?",
          "Why is karst groundwater vulnerable to pollution?",
        ],
      ),
    ],
  },
  {
    id: "geo-atmosphere",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Atmosphere, weather, climate and geophysical phenomena",
    title: "The Ocean of Air: Weather, Climate and Storms",
    blurb:
      "The atmosphere is a heat engine. Uneven heating sets air in motion, carries moisture, and builds the storms that shape agriculture, aviation and disaster policy.",
    sources: [
      "NCERT Class XI, Fundamentals of Physical Geography, ch. 8–12",
      "NCERT Class XI, India: Physical Environment, ch. 4",
      "IMD climate and monsoon publications",
    ],
    references: [R.ncertPhysical, R.imd, R.wikiAtmosphere, R.wikiMonsoon, R.earthObservatory],
    lessons: [
      L(
        "geo-atmosphere-1",
        "The Atmosphere: Composition, Structure and Temperature",
        "Composition (nitrogen, oxygen, argon, CO2, water vapour, aerosols); vertical structure (troposphere, stratosphere, mesosphere, thermosphere, exosphere); lapse rate; temperature inversion; insolation and the heat budget; albedo; land-sea heating differences; urban heat islands.",
        [
          "A layered atmosphere diagram with temperature profile and key features (ozone layer, tropopause).",
          "A simplified Earth energy-budget diagram: incoming solar, reflected, absorbed, outgoing longwave.",
        ],
        [
          "Why does temperature decrease with altitude in the troposphere?",
          "What is a temperature inversion and why is it a pollution trap?",
          "What is albedo?",
          "Why is the tropopause higher over the Equator?",
        ],
      ),
      L(
        "geo-atmosphere-2",
        "Pressure, Winds and the Great Circulation",
        "Atmospheric pressure and its measurement; pressure belts; Coriolis effect; geostrophic and gradient winds; trade winds, westerlies, polar easterlies; jet streams; Hadley, Ferrel and Polar cells; ITCZ; Walker circulation; El Niño, La Niña and the Indian Ocean Dipole; why the monsoon is a planetary-scale phenomenon.",
        [
          "A global pressure-belt and wind diagram with the three circulation cells.",
          "An El Niño/La Niña schematic showing changes in the Walker circulation and upwelling.",
        ],
        [
          "Why are the trade winds deflected westward?",
          "What is the ITCZ and how does it move?",
          "How does El Niño affect the Indian monsoon?",
          "What is the Indian Ocean Dipole?",
        ],
      ),
      L(
        "geo-atmosphere-3",
        "Moisture, Clouds and Rain",
        "Evaporation and transpiration; absolute and relative humidity; dew point; condensation and cloud formation; cloud types (cirrus, cumulus, stratus, nimbus); fog; precipitation types (convectional, orographic, cyclonic/frontal); rain-shadow; monsoon rainfall; acid rain; cloud seeding.",
        [
          "A cloud-family diagram with altitude bands and the main cloud genera.",
          "An orographic-rain diagram with windward rain and leeward rain-shadow.",
        ],
        [
          "Why does relative humidity change with temperature?",
          "What causes orographic rainfall?",
          "Why is the leeward side of a mountain often dry?",
          "How do clouds form?",
        ],
      ),
      L(
        "geo-atmosphere-4",
        "Storms: Cyclones, Thunderstorms and Tornadoes",
        "Tropical and extra-tropical cyclones; formation conditions; eye and eyewall; storm surge; cyclone naming and categories; thunderstorm life cycle; lightning; hail; tornadoes; waterspouts; western disturbances; Nor'westers (Kalbaisakhi); cyclone preparedness in India.",
        [
          "A tropical-cyclone cross-section with eye, eyewall, rain bands and storm surge.",
          "A thunderstorm life-cycle diagram: cumulus, mature, dissipating stages.",
        ],
        [
          "Why do tropical cyclones not form at the Equator?",
          "What is storm surge and why is it deadly?",
          "How do western disturbances affect north India?",
          "What is the difference between a tornado and a cyclone?",
        ],
      ),
      L(
        "geo-atmosphere-5",
        "Climate Classification and the World's Biomes",
        "Köppen climate classification; climate controls (latitude, altitude, distance from sea, winds, ocean currents, relief); tropical, dry, temperate, continental and polar climates; world biomes (rainforest, savanna, desert, Mediterranean, temperate forest, taiga, tundra); climate change and biome shifts.",
        [
          "A simplified world climate-map with major Köppen groups.",
          "A biome-precipitation-temperature chart placing rainforest, savanna, desert, Mediterranean and tundra.",
        ],
        [
          "What are the main controls of climate?",
          "Why are Mediterranean climates dry in summer?",
          "What is the difference between climate and weather?",
          "How is climate change shifting biomes?",
        ],
      ),
    ],
  },
  {
    id: "geo-oceans",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Oceanography and ocean-atmosphere interaction",
    title: "The Blue Machine: Oceans and Their Movements",
    blurb:
      "The ocean stores and moves the planet's heat. Currents, tides and upwelling explain fisheries, rainfall, navigation and the climate of continents.",
    sources: [
      "NCERT Class XI, Fundamentals of Physical Geography, ch. 14",
      "GC Leong, Certificate Physical and Human Geography, oceanography chapters",
      "NASA Earth Observatory ocean resources",
    ],
    references: [R.ncertPhysical, R.wikiOceanCurrent, R.earthObservatory, R.wikiEarth],
    lessons: [
      L(
        "geo-oceans-1",
        "Ocean Relief, Temperature and Salinity",
        "Continental shelf, slope, rise, abyssal plain, trenches, ridges; ocean floor mapping; temperature distribution (latitude, depth, currents); thermocline; salinity and its controls; density; sea ice; ocean acidification; the ocean as a carbon sink.",
        [
          "An ocean-floor relief profile from continent to mid-ocean ridge and trench.",
          "A depth-temperature-salinity graph for low and high latitudes.",
        ],
        [
          "Why is the continental shelf important for fisheries?",
          "Why does salinity vary across the oceans?",
          "What is the thermocline?",
          "How does ocean acidification threaten marine life?",
        ],
      ),
      L(
        "geo-oceans-2",
        "Currents, Tides and Upwelling",
        "Surface currents and gyres; warm and cold currents; Coriolis and wind driving; the Gulf Stream, Kuroshio, Humboldt, Labrador and Agulhas currents; upwelling and fisheries; tides (spring and neap); tidal range; tsunami vs tide; ocean currents and climate (Western Europe, El Niño); India's coastal currents.",
        [
          "A world surface-current map with warm and cold currents and major gyres.",
          "A tidal diagram showing spring and neap tides relative to Sun-Moon alignment.",
        ],
        [
          "How do ocean currents affect coastal climate?",
          "Why is upwelling associated with rich fisheries?",
          "What causes spring and neap tides?",
          "Why is a tsunami not a tide?",
        ],
      ),
    ],
  },
  {
    id: "geo-india-physiography",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — India: location, physiography and drainage",
    title: "India: The Land We Inherited",
    blurb:
      "India is a continent dressed as a country. Its mountains, plains, plateau and coasts explain where people live, what they grow and how they trade.",
    sources: [
      "NCERT Class XI, India: Physical Environment, ch. 1–3",
      "NCERT Class IX, Contemporary India I, ch. 2",
      "Oxford School Atlas — India physical plates",
    ],
    references: [R.ncertIndiaPhysical, R.survey, R.wikiHimalaya, R.wikiDeccan, R.wikiGanges],
    lessons: [
      L(
        "geo-india-1",
        "India: Location, Extent and Neighbourhood",
        "Latitudinal and longitudinal extent; the 82°30′E standard meridian; land frontiers and maritime boundaries; neighbours; the Indian Ocean and strategic location; the Andaman and Nicobar and Lakshadweep; exclusive economic zone; India's position on global sea routes; the significance of the Indian peninsula.",
        [
          "An India outline map with latitudes, longitudes, neighbours and maritime boundaries.",
          "A map of Indian Ocean sea lanes, chokepoints and India's island territories.",
        ],
        [
          "Why is India's peninsular location strategically important?",
          "What is India's standard meridian and why was it chosen?",
          "How many countries share a land border with India?",
          "Why do the Andaman and Nicobar Islands matter?",
        ],
      ),
      L(
        "geo-india-2",
        "The Himalayas: The Youngest, Highest Wall",
        "Formation by India-Eurasia collision; divisions (Trans-Himalaya, Greater, Lesser, Shiwaliks); ranges (Karakoram, Ladakh, Zanskar, Pir Panjal, Dhauladhar); passes; syntaxial bends; Karewas; glacial and fluvial features; Himalayan climate; ecological and strategic significance; earthquakes and landslides.",
        [
          "A north-south Himalayan cross-section from the Trans-Himalaya to the Shiwaliks.",
          "A map of major Himalayan passes and rivers.",
        ],
        [
          "How were the Himalayas formed?",
          "What is the difference between the Greater Himalaya and the Shiwaliks?",
          "Why are Himalayan passes strategically important?",
          "What are Karewas?",
        ],
      ),
      L(
        "geo-india-3",
        "The Plains and the Plateau: India's Two Engines",
        "Indo-Gangetic-Brahmaputra plain: formation, divisions (Bhabar, Terai, Bangar, Khadar); doabs; Peninsular Plateau: Deccan Trap, Central Highlands, Deccan Plateau, Chota Nagpur; Eastern and Western Ghats; hill ranges (Aravalli, Vindhya, Satpura, Ajanta, etc.); mineral wealth; why the plain is India's granary.",
        [
          "A simplified physiographic-divisions map of India.",
          "A plain cross-section: Bhabar, Terai, Bangar and Khadar.",
        ],
        [
          "How was the Indo-Gangetic Plain formed?",
          "What is the difference between Bangar and Khadar?",
          "Why is the Chota Nagpur Plateau called a mineral storehouse?",
          "How do the Western and Eastern Ghats differ?",
        ],
      ),
      L(
        "geo-india-4",
        "Coasts and Islands: India's Maritime Edge",
        "Western and Eastern coastal plains; Malabar, Konkan, Kanara; Coromandel, Northern Circars; deltas (Mahanadi, Godavari, Krishna, Kaveri); lagoons (Chilika, Pulicat); estuaries vs deltas; Andaman and Nicobar; Lakshadweep; coral reefs; mangroves; coastal erosion and cyclones.",
        [
          "An India coastal-map with major ports, deltas, lagoons and islands.",
          "A delta-estuary comparison diagram.",
        ],
        [
          "Why are the Eastern Coastal Plains wider than the Western?",
          "What is the difference between a delta and an estuary?",
          "Why are the Andaman and Nicobar Islands tectonically active?",
          "Why are mangroves important for India's coasts?",
        ],
      ),
      L(
        "geo-india-5",
        "India's Rivers: Himalayan and Peninsular",
        "Drainage basins; Himalayan rivers (Indus, Ganga, Brahmaputra) and their systems; peninsular rivers (Godavari, Krishna, Kaveri, Narmada, Tapti, Mahanadi); perennial vs seasonal; antecedent and consequent drainage; water divides; river regimes; interlinking proposals; floods and sediment; Indus Waters Treaty preview.",
        [
          "A map of India's major river basins and water divides.",
          "A comparison table/diagram of Himalayan and peninsular river regimes.",
        ],
        [
          "Why are Himalayan rivers perennial?",
          "Why do peninsular rivers have smaller basins?",
          "What is an antecedent river?",
          "Why is the Brahmaputra so flood-prone?",
        ],
      ),
    ],
  },
  {
    id: "geo-india-climate",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Indian monsoon, climate regions and climate hazards",
    title: "The Monsoon: India's Annual Gamble",
    blurb:
      "One seasonal wind reversal feeds a civilisation. Understand the monsoon and you understand Indian agriculture, water politics, inflation and disaster policy.",
    sources: [
      "NCERT Class XI, India: Physical Environment, ch. 4",
      "NCERT Class IX, Contemporary India I, ch. 4",
      "IMD monsoon reports and glossary",
    ],
    references: [R.ncertIndiaPhysical, R.imd, R.wikiMonsoon, R.earthObservatory],
    lessons: [
      L(
        "geo-india-1-monsoon",
        "The Monsoon Mechanism: Why the Wind Reverses",
        "Classical and modern explanations; differential heating; ITCZ migration; Tibetan Plateau heat pump; jet streams; Somali jet; Mascarene High; Bay of Bengal and Arabian Sea branches; onset and withdrawal; monsoon trough; break monsoon; active and weak phases; ENSO and IOD links.",
        [
          "A monsoon-circulation map: summer and winter wind directions, ITCZ, Somali jet and Tibetan Plateau.",
          "A timeline of monsoon onset and withdrawal across India.",
        ],
        [
          "Why does the monsoon wind reverse between summer and winter?",
          "What is the role of the Tibetan Plateau?",
          "What is a break monsoon?",
          "How do El Niño and the IOD affect monsoon rainfall?",
        ],
      ),
      L(
        "geo-india-2-monsoon",
        "Indian Climate Regions and Rainfall Variability",
        "Seasons (winter, pre-monsoon, monsoon, post-monsoon); climate regions (Thar, Himalayan, Assam, Gangetic, Malabar, Tamil Nadu, etc.); rainfall distribution and variability; coefficient of variation; droughts and floods; western disturbances; Nor'westers; Tamil Nadu's retreating monsoon; climate change and the monsoon.",
        [
          "An India rainfall map (isohyets) with wet and dry regions.",
          "A diagram of the four seasons and their dominant weather systems.",
        ],
        [
          "Why does Tamil Nadu get most rain in the post-monsoon season?",
          "What is the coefficient of rainfall variability?",
          "How do western disturbances bring winter rain to north India?",
          "Is the monsoon becoming more erratic?",
        ],
      ),
      L(
        "geo-india-3-monsoon",
        "Droughts, Floods and Climate Hazards",
        "Meteorological, hydrological and agricultural drought; flood types (river, flash, coastal, urban); drought-prone and flood-prone regions; monsoon failure and famine history; reservoir and dam management; flood forecasting; cyclone risk; heat waves; cold waves; disaster risk reduction; climate adaptation.",
        [
          "A map of India's drought-prone and flood-prone regions.",
          "A flood hydrograph showing how a catchment responds to rainfall.",
        ],
        [
          "What is the difference between meteorological and agricultural drought?",
          "Why do urban floods happen even in normal rainfall years?",
          "Which regions of India are most drought-prone?",
          "How does flood forecasting work?",
        ],
      ),
    ],
  },
  {
    id: "geo-india-resources",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I · Mains GS-III",
    syllabusNode: "Geography — Soils, vegetation, water, minerals and energy resources of India",
    title: "India's Natural Ledger: Soil, Forest, Water, Minerals",
    blurb:
      "Resources are not just what lies underground; they are what a society can use sustainably. This unit reads India's natural balance sheet.",
    sources: [
      "NCERT Class XI, India: Physical Environment, ch. 5–7",
      "NCERT Class XII, India: People and Economy, resource chapters",
      "Indian Bureau of Mines and Ministry of Mines data",
    ],
    references: [R.ncertIndiaPhysical, R.ncertIndiaPeople, R.moefcc, R.wikiSoil, R.survey],
    lessons: [
      L(
        "geo-india-res-1",
        "Soils of India: A Living Resource",
        "Soil types (alluvial, black, red, laterite, arid, forest, mountain, saline/alkaline, peaty); distribution; characteristics; crop suitability; soil degradation; salinity and alkalinity; soil conservation; soil health cards; organic farming; desertification; land-use change.",
        [
          "A map of India's major soil types.",
          "A soil-degradation cycle diagram: erosion, salinity, nutrient loss, compaction.",
        ],
        [
          "Why is black soil good for cotton?",
          "How does laterite soil form?",
          "What is soil salinity and how is it reclaimed?",
          "Why is soil health important for nutrition?",
        ],
      ),
      L(
        "geo-india-res-2",
        "Forests and Vegetation: The Green Cover",
        "Forest types (tropical evergreen, deciduous, thorn, montane, mangrove, alpine); distribution and climate controls; forest cover assessment; sacred groves; biodiversity hotspots; deforestation and afforestation; Joint Forest Management; Forest Rights Act; invasive species; forest fires.",
        [
          "A map of India's forest types and biodiversity hotspots.",
          "A forest-profile diagram from tropical evergreen to alpine vegetation.",
        ],
        [
          "Why do tropical evergreen forests occur on the Western Ghats?",
          "What is a sacred grove?",
          "How is forest cover measured?",
          "What is the Forest Rights Act?",
        ],
      ),
      L(
        "geo-india-res-3",
        "Water Resources and Irrigation",
        "Water availability and demand; precipitation and river basins; groundwater and aquifers; irrigation types (canal, tank, well, drip, sprinkler); major irrigation projects; inter-basin transfer debates; dam impacts; water quality; rainwater harvesting; watershed management; water-use efficiency; India's water crisis.",
        [
          "A map of India's major river basins and irrigation regions.",
          "A groundwater aquifer diagram showing recharge, withdrawal and depletion.",
        ],
        [
          "Why is groundwater depletion severe in north-west India?",
          "What is the difference between canal and tank irrigation?",
          "How does drip irrigation save water?",
          "What are the arguments for and against interlinking rivers?",
        ],
      ),
      L(
        "geo-india-res-4",
        "Minerals and Energy: The Resource Base",
        "Mineral distribution (iron ore, coal, bauxite, manganese, copper, mica, limestone); mineral belts; extraction and environmental impacts; conventional energy (coal, oil, gas, hydro, nuclear); renewable energy (solar, wind, small hydro, biomass); energy transition; critical minerals; India's import dependence.",
        [
          "A map of India's major mineral belts and energy resources.",
          "An energy-mix chart for India with a note on the transition.",
        ],
        [
          "Where are India's iron-ore and coal belts?",
          "Why is India dependent on imported crude oil?",
          "What are critical minerals and why do they matter?",
          "What are the main renewable-energy options for India?",
        ],
      ),
    ],
  },
  {
    id: "geo-india-human",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — Agriculture, industry, population, settlement, transport and trade",
    title: "The Human Mosaic: Agriculture, Industry and People",
    blurb:
      "Physical geography sets the stage; human geography writes the play. Here India's crops, factories, cities and trade routes come into focus.",
    sources: [
      "NCERT Class XII, India: People and Economy, ch. 1–7",
      "NCERT Class XII, Fundamentals of Human Geography",
      "Economic Survey and Census materials",
    ],
    references: [R.ncertIndiaPeople, R.ncertHuman, R.census, R.wikiAgricultureIndia, R.wikiDemographicsIndia],
    lessons: [
      L(
        "geo-india-human-1",
        "Agriculture and Cropping Patterns",
        "Agro-climatic zones; cropping seasons (kharif, rabi, zaid); major crops (rice, wheat, maize, pulses, oilseeds, cotton, sugarcane, tea, coffee); crop regions; irrigation and cropping intensity; Green Revolution; cropping patterns and government policy; horticulture; animal husbandry; fisheries.",
        [
          "A map of India's major crop regions.",
          "A cropping-calendar chart for kharif, rabi and zaid seasons.",
        ],
        [
          "Why is rice grown in the east and wheat in the north-west?",
          "What is cropping intensity?",
          "How did the Green Revolution change Indian agriculture?",
          "What are the main agro-climatic zones?",
        ],
      ),
      L(
        "geo-india-human-2",
        "Industry and the Logic of Location",
        "Industrial location factors (raw material, power, transport, labour, market, capital, agglomeration); industrial regions; iron and steel, cotton, jute, sugar, cement, petrochemicals, software; industrial policy; special economic zones; industrial corridors; pollution and industrial siting.",
        [
          "A map of India's major industrial regions and corridors.",
          "A location-factor diagram weighing raw material, market, transport and labour.",
        ],
        [
          "Why did iron and steel develop in Chota Nagpur?",
          "Why is the cotton textile industry spread across western India?",
          "What are industrial corridors?",
          "How does industrial location affect pollution?",
        ],
      ),
      L(
        "geo-india-human-3",
        "Population, Migration and Settlements",
        "Population distribution and density; growth and demographic transition; sex ratio, literacy, urbanisation; migration types and causes; rural-urban migration; settlements (compact, dispersed, linear, circular); urban agglomerations; slums; urban planning; population policy.",
        [
          "A population-density map of India.",
          "A demographic-transition diagram with India's position marked.",
        ],
        [
          "Why is India's population concentrated in the plains?",
          "What is demographic dividend?",
          "What are the push and pull factors of migration?",
          "What is an urban agglomeration?",
        ],
      ),
      L(
        "geo-india-human-4",
        "Transport, Communication and Trade",
        "Roads (national highways, expressways), railways (zones, gauges, freight corridors), ports (major and minor), airports, inland waterways; pipelines; communication networks; trade routes and India's foreign trade; transport and regional development; logistics; maritime security.",
        [
          "A map of India's major transport corridors, ports and waterways.",
          "A diagram of India's trade flows by major partner and commodity group.",
        ],
        [
          "Why are ports critical to India's trade?",
          "What are dedicated freight corridors?",
          "How do national waterways reduce logistics costs?",
          "What are India's major trading partners?",
        ],
      ),
    ],
  },
  {
    id: "geo-world",
    subjectKey: "geography",
    subject: "Geography",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Geography — World physical geography, resources and map reading",
    title: "The Wider World: Continents, Chokepoints and Resources",
    blurb:
      "UPSC expects you to place a news headline on a mental world map. This unit builds that map: landforms, rivers, resources, straits and the logic of location.",
    sources: [
      "NCERT Class XI, Fundamentals of Physical Geography, world chapters",
      "NCERT Class XII, Fundamentals of Human Geography",
      "Oxford School Atlas — world plates",
    ],
    references: [R.ncertHuman, R.wikiWorldMap, R.wikiStrait, R.earthObservatory, R.survey],
    lessons: [
      L(
        "geo-world-1",
        "The World's Physical Frame",
        "Continents and oceans; major mountain systems (Andes, Rockies, Alps, Atlas, Urals, Great Dividing Range); major rivers (Amazon, Nile, Yangtze, Mississippi, Congo, Danube); lakes; deserts; plate boundaries; world climate belts; the physical basis of civilisation.",
        [
          "A simplified world physical map with major mountain ranges, rivers and deserts.",
          "A world plate-boundary map with the Ring of Fire.",
        ],
        [
          "Which are the world's major mountain systems and where are they?",
          "Why do the Andes and the Himalayas have different climates?",
          "Which rivers carry the most water?",
          "How do physical features shape settlement?",
        ],
      ),
      L(
        "geo-world-2",
        "Straits, Canals and Chokepoints",
        "Major straits (Malacca, Hormuz, Bab-el-Mandeb, Gibraltar, Bosphorus, Dover, Taiwan, Sunda, Lombok); canals (Suez, Panama); chokepoints and maritime trade; islands and archipelagos; exclusive economic zones; the geopolitics of sea lanes; India's maritime neighbourhood.",
        [
          "A world map of major straits, canals and chokepoints.",
          "A close-up diagram of the Malacca and Hormuz chokepoints with alternative routes.",
        ],
        [
          "Why is the Strait of Malacca strategically vital?",
          "How did the Suez Canal change world trade?",
          "What is an exclusive economic zone?",
          "Why are chokepoints a source of geopolitical risk?",
        ],
      ),
      L(
        "geo-world-3",
        "Resources and the Location of Industry",
        "Distribution of key natural resources (iron ore, coal, oil, gas, bauxite, copper, rare earths); agricultural resources; factors of industrial location; primary, secondary and tertiary sectors; world industrial regions; global supply chains; resource curse; strategic resources and conflicts.",
        [
          "A world map of major oil, gas, iron-ore and rare-earth regions.",
          "A supply-chain diagram from extraction to consumer.",
        ],
        [
          "Which regions dominate global oil and gas production?",
          "Why are rare earths strategically important?",
          "What is the resource curse?",
          "How do supply chains shape industrial location?",
        ],
      ),
      L(
        "geo-world-4",
        "Map Reading and Atlas Practice",
        "Reading physical, political and thematic maps; latitude-longitude recall; locating places in the news; map symbols; scale; directions; identifying countries, capitals, rivers and borders; practice with Indian and world outline maps; how to build a mental atlas.",
        [
          "A blank world outline with latitude/longitude grid for practice.",
          "A sample thematic map (population density or rainfall) with a legend to interpret.",
        ],
        [
          "How do you locate a place from its coordinates?",
          "How can you remember the map of Africa or Southeast Asia?",
          "What is a thematic map?",
          "How do you revise maps efficiently for Prelims?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // POLITY, CONSTITUTION & GOVERNANCE
  // ==========================================================================
  {
    id: "pol-foundations",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Historical underpinnings, evolution, features and basic structure",
    title: "The Republic's Blueprint",
    blurb:
      "The Constitution is not a rulebook dropped from the sky. It is a settlement between competing visions of India, drafted in the shadow of Partition and colonial rule.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 1–2",
      "M. Laxmikanth, Indian Polity, opening chapters",
      "Constituent Assembly Debates (selected)",
    ],
    references: [R.constitution, R.wikiConstitution, R.parliament, R.prs],
    lessons: [
      L(
        "pol-foundations-1",
        "From Company Rule to the Constituent Assembly",
        "Regulating Act 1773; Pitts India Act 1784; Charter Acts; Government of India Acts 1858, 1919, 1935; Morley-Minto and Montagu-Chelmsford reforms; the Cabinet Mission; the Constituent Assembly; drafting committees; the Preamble; borrowed features and Indian adaptations.",
        [
          "A timeline from 1773 to 1950 with the key constitutional milestones.",
          "A diagram of the Constituent Assembly's major committees and their chairs.",
        ],
        [
          "Why is the Government of India Act 1935 called a blueprint for the Constitution?",
          "How was the Constituent Assembly constituted?",
          "What are the key ideas in the Preamble?",
          "Which features were borrowed from which countries?",
        ],
      ),
      L(
        "pol-foundations-2",
        "The Preamble and the Basic Structure",
        "The Preamble as the identity card of the Constitution; sovereign, socialist, secular, democratic republic; justice, liberty, equality, fraternity; Kesavananda Bharati and the basic-structure doctrine; amendments and limits; the 42nd Amendment; the 'socialist' and 'secular' words; the Preamble's legal status.",
        [
          "A Preamble annotation diagram linking each phrase to a constitutional value.",
          "A timeline of the basic-structure doctrine from Shankari Prasad to Kesavananda and after.",
        ],
        [
          "Can the Preamble be amended?",
          "What is the basic-structure doctrine?",
          "Why was 'socialist' added to the Preamble?",
          "What would count as a violation of the basic structure?",
        ],
      ),
      L(
        "pol-foundations-3",
        "Features, Sources and the Constitution's Personality",
        "Parliamentary vs presidential systems; federalism with a strong centre; separation of powers; judicial review; fundamental rights and directive principles; universal adult franchise; single citizenship; emergency provisions; the Constitution's length and detail; colonial continuities and republican breaks.",
        [
          "A comparison table of parliamentary and presidential systems.",
          "A diagram of the constitutional scheme: rights, principles, institutions and federal division.",
        ],
        [
          "Why did India choose a parliamentary system?",
          "Is India truly federal?",
          "What is the difference between a right and a directive principle?",
          "Why is the Indian Constitution so long?",
        ],
      ),
    ],
  },
  {
    id: "pol-rights",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Fundamental Rights, Directive Principles and Fundamental Duties",
    title: "Rights, Duties and the Good Society",
    blurb:
      "Part III protects the individual; Part IV demands a just society. The tension between them is one of the most productive arguments in Indian constitutional law.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 2",
      "M. Laxmikanth, Indian Polity, fundamental rights and DPSP",
      "Selected Supreme Court judgments",
    ],
    references: [R.constitution, R.supremeCourt, R.wikiConstitution, R.nhrc],
    lessons: [
      L(
        "pol-rights-1",
        "Fundamental Rights: The Architecture of Part III",
        "Article 12 and the meaning of 'State'; Article 13 and judicial review; the six categories of rights; justiciability; suspension during emergency; the right to equality (Articles 14–18); equality before law vs equal protection; reasonable classification; reservation and equality.",
        [
          "A map of Part III showing the six right-clusters and their articles.",
          "A flowchart for an Article 14 challenge: classification, nexus, arbitrariness.",
        ],
        [
          "What does 'State' include under Article 12?",
          "What is the difference between equality before law and equal protection of laws?",
          "When can classification be reasonable?",
          "How does Article 13 make rights enforceable?",
        ],
      ),
      L(
        "pol-rights-2",
        "Freedom, Life and Liberty",
        "Article 19 freedoms and reasonable restrictions; Article 21 and the expansion of due process; right to privacy; right to education; right to health; right to a clean environment; Article 22 preventive detention; Articles 23–24; freedom of religion; cultural and educational rights; constitutional remedies under Articles 32 and 226.",
        [
          "A diagram of Article 19's six freedoms and their restriction grounds.",
          "A timeline of Article 21's expansion from personal liberty to privacy and environment.",
        ],
        [
          "What are the reasonable restrictions on free speech?",
          "How did Article 21 become a source of new rights?",
          "What is the difference between Article 32 and Article 226?",
          "What are the safeguards against preventive detention?",
        ],
      ),
      L(
        "pol-rights-3",
        "Directive Principles, Fundamental Duties and the Balance",
        "DPSP origins and categories (socialist, Gandhian, liberal-intellectual); Articles 36–51; fundamental duties (Article 51A); the conflict between rights and principles; Minerva Mills and the balance; the 42nd Amendment; the 44th Amendment; rights as means and principles as goals; welfare state.",
        [
          "A three-column chart of DPSP categories with examples.",
          "A balance diagram showing rights, DPSP and fundamental duties around the citizen.",
        ],
        [
          "Why are DPSP not enforceable in court?",
          "How did Minerva Mills balance rights and DPSP?",
          "What are the fundamental duties and their legal status?",
          "How do DPSP shape government policy?",
        ],
      ),
    ],
  },
  {
    id: "pol-executive",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Union and State Executive",
    title: "The Executive: President, Prime Minister, Governor",
    blurb:
      "The formal head and the political head are different people. Understanding that difference explains much of how Indian government actually works.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 4–5",
      "M. Laxmikanth, Indian Polity, executive chapters",
      "Constitution of India, Articles 52–78, 153–167",
    ],
    references: [R.constitution, R.parliament, R.prs, R.wikiParliament],
    lessons: [
      L(
        "pol-executive-1",
        "The President and Vice-President",
        "Election, qualification, term, impeachment; powers (executive, legislative, financial, judicial, emergency); ordinance power; pardoning power; the President as constitutional head; discretion; the Vice-President as ex-officio Chairman of the Rajya Sabha; removal.",
        [
          "A diagram of the President's election via the electoral college.",
          "A map of the President's powers across the three branches.",
        ],
        [
          "How is the President elected?",
          "When can the President exercise discretion?",
          "What is the ordinance power and its limits?",
          "What is the Vice-President's role in the Rajya Sabha?",
        ],
      ),
      L(
        "pol-executive-2",
        "The Prime Minister, Council of Ministers and Governor",
        "PM's appointment and powers; collective responsibility; cabinet committees; the Council of Ministers; the Governor's appointment, powers and discretion; Article 200 assent to Bills; reservation for the President; the Governor as a flashpoint in federal politics; Chief Minister and state cabinet.",
        [
          "A diagram of the Union executive: President, PM, Council of Ministers, cabinet committees.",
          "A flowchart of a Governor's options on a state Bill under Article 200.",
        ],
        [
          "Why is the PM called the keystone of the cabinet arch?",
          "What is collective responsibility?",
          "When can a Governor reserve a Bill for the President?",
          "Why are Governor-CM disputes politically charged?",
        ],
      ),
    ],
  },
  {
    id: "pol-parliament",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Parliament and State legislatures",
    title: "The House of Arguments: Parliament at Work",
    blurb:
      "Parliament is not only a law factory. It is the arena where the executive is questioned, the public purse is guarded and the nation argues with itself.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 5",
      "M. Laxmikanth, Indian Polity, Parliament",
      "PRS Legislative Research, Parliament sessions and bills",
    ],
    references: [R.parliament, R.prs, R.constitution, R.wikiParliament, R.pib],
    lessons: [
      L(
        "pol-parliament-1",
        "Composition, Sessions and Presiding Officers",
        "Lok Sabha and Rajya Sabha composition; qualifications and disqualifications; Speaker and Deputy Speaker; Chairman and Deputy Chairman; sessions (summoning, prorogation, dissolution); quorum; question hour; zero hour; adjournment motions; privileges; parliamentary committees overview.",
        [
          "A seating-plan diagram of the two Houses with the presiding officers.",
          "A calendar of a parliamentary session and its daily instruments.",
        ],
        [
          "What is the difference between adjournment, prorogation and dissolution?",
          "What is zero hour?",
          "What are parliamentary privileges?",
          "How does the Speaker maintain order?",
        ],
      ),
      L(
        "pol-parliament-2",
        "Bills, Money Bills and Ordinances",
        "Types of bills; ordinary, money and constitutional amendment bills; first, second and third readings; committee stage; joint sitting; President's assent; money bill certification; Rajya Sabha's limited role; ordinances and their approval; delegated legislation; legislative scrutiny.",
        [
          "A flowchart from a bill's introduction to presidential assent.",
          "A comparison table of ordinary, money and constitutional amendment bills.",
        ],
        [
          "What is a money bill?",
          "Can the Rajya Sabha reject a money bill?",
          "How is a constitutional amendment passed?",
          "What limits the ordinance power?",
        ],
      ),
      L(
        "pol-parliament-3",
        "Committees, Accountability and Parliamentary Control",
        "Departmentally Related Standing Committees; Public Accounts Committee; Estimates Committee; Committee on Public Undertakings; financial committees; question hour, calling attention, adjournment motion, no-confidence motion; budget process; parliamentary oversight of the executive; declining scrutiny and its consequences.",
        [
          "A diagram of Parliament's accountability tools.",
          "A table of major committees, their composition and functions.",
        ],
        [
          "What is the role of the Public Accounts Committee?",
          "How does a no-confidence motion work?",
          "Why are standing committees important?",
          "How does Parliament control the purse?",
        ],
      ),
    ],
  },
  {
    id: "pol-judiciary",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Judiciary, judicial review and access to justice",
    title: "The Guardian: Courts and the Constitution",
    blurb:
      "Judicial review gives the Constitution teeth. But courts also face backlog, vacancy and the perennial question of how independent they can be while remaining accountable.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 6",
      "M. Laxmikanth, Indian Polity, judiciary",
      "Supreme Court of India judgments and annual reports",
    ],
    references: [R.supremeCourt, R.constitution, R.wikiJudiciary, R.prs],
    lessons: [
      L(
        "pol-judiciary-1",
        "The Supreme Court and High Courts",
        "Composition and appointment; qualifications; tenure and removal; jurisdiction (original, appellate, advisory, writ); Article 32 and Article 226; judicial review; collegium; judicial independence; judicial accountability; contempt; court fees and access.",
        [
          "A diagram of the Indian court hierarchy and jurisdictions.",
          "A flowchart of Supreme Court jurisdiction under Articles 131–143.",
        ],
        [
          "What is the difference between Article 32 and Article 226?",
          "How are judges appointed and removed?",
          "What is the collegium system?",
          "What is advisory jurisdiction?",
        ],
      ),
      L(
        "pol-judiciary-2",
        "PIL, Judicial Activism and the Backlog",
        "Public Interest Litigation; locus standi; judicial activism vs restraint; Article 142; environmental and human-rights jurisprudence; pendency and vacancies; alternative dispute resolution; legal aid; e-courts; the debate over judicial overreach.",
        [
          "A diagram showing how a PIL moves from a letter to a hearing.",
          "A chart of pendency and vacancy pressure points in the justice system.",
        ],
        [
          "What is public interest litigation?",
          "What is the difference between judicial activism and restraint?",
          "Why is judicial backlog a governance problem?",
          "How does Article 142 give the Supreme Court special powers?",
        ],
      ),
    ],
  },
  {
    id: "pol-federalism",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Federalism, devolution and local government",
    title: "One Nation, Many Centres",
    blurb:
      "India is a union with a federal soul. The division of powers, the Governor, finance and local government are where that soul is tested.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 7",
      "M. Laxmikanth, Indian Polity, federalism and local government",
      "Sarkaria and Punchhi Commission summaries",
    ],
    references: [R.constitution, R.wikiFederalism, R.financeCommission, R.wikiPanchayat, R.prs],
    lessons: [
      L(
        "pol-federalism-1",
        "The Division of Powers",
        "Union, State and Concurrent Lists; residuary powers; Article 246; repugnancy and Article 254; inter-state trade; cooperative and competitive federalism; asymmetric federalism; Jammu and Kashmir's special status and its change; union territories; Article 356.",
        [
          "A three-list diagram with examples, plus residuary powers.",
          "A map of India's states and union territories with special constitutional arrangements noted.",
        ],
        [
          "What is residuary power and who has it?",
          "How is a conflict between a Union and a State law resolved?",
          "What is cooperative federalism?",
          "Why is Article 356 controversial?",
        ],
      ),
      L(
        "pol-federalism-2",
        "Inter-State Relations and Fiscal Federalism",
        "Inter-State Council; river-water disputes; inter-state trade and commerce; Finance Commission; tax devolution; GST Council; centrally sponsored schemes; fiscal consolidation; state borrowing; the balance between uniformity and autonomy.",
        [
          "A diagram of fiscal flows from the Union to states and local bodies.",
          "A map of major inter-state river disputes.",
        ],
        [
          "What does the Finance Commission do?",
          "How does the GST Council decide?",
          "Why do river-water disputes persist?",
          "What is the difference between tax devolution and grants?",
        ],
      ),
      L(
        "pol-federalism-3",
        "Emergency Provisions",
        "National emergency (Article 352); President's rule (Article 356); financial emergency (Article 360); grounds, procedure and effects; fundamental rights during emergency; the 44th Amendment safeguards; the Emergency of 1975; judicial review of emergency; federal consequences.",
        [
          "A three-column chart of the three emergencies and their effects.",
          "A timeline of the 1975 Emergency and the constitutional changes that followed.",
        ],
        [
          "What are the grounds for a national emergency?",
          "What happens to fundamental rights during an emergency?",
          "What safeguards did the 44th Amendment add?",
          "Can courts review an emergency proclamation?",
        ],
      ),
      L(
        "pol-federalism-4",
        "Local Government: The Third Tier",
        "73rd and 74th Amendments; panchayats and municipalities; Gram Sabha; three-tier structure; reservations; State Finance Commission; Eleventh and Twelfth Schedules; PESA; urban local bodies; municipal finance; capacity gaps; decentralisation in practice.",
        [
          "A diagram of the three-tier panchayat structure.",
          "A table of the Eleventh and Twelfth Schedule subjects.",
        ],
        [
          "What did the 73rd Amendment change?",
          "What is the role of the Gram Sabha?",
          "Why are municipal finances weak?",
          "What is PESA?",
        ],
      ),
    ],
  },
  {
    id: "pol-elections",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Elections, representation and political parties",
    title: "The Great Indian Election",
    blurb:
      "Elections are the machinery that turns public opinion into government. The rules of that machinery — and its loopholes — are core polity.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 3–4",
      "M. Laxmikanth, Indian Polity, elections",
      "Election Commission of India reports",
    ],
    references: [R.eci, R.constitution, R.prs, R.wikiParliament],
    lessons: [
      L(
        "pol-elections-1",
        "The Election Commission and the Conduct of Elections",
        "ECI composition and powers; Article 324; election machinery; model code of conduct; electoral rolls; EVMs and VVPAT; NOTA; expenditure limits; criminalisation of politics; electoral bonds and transparency; reforms.",
        [
          "A flowchart of the election process from notification to result.",
          "A diagram of the ECI's constitutional and statutory powers.",
        ],
        [
          "What is Article 324?",
          "Is the model code of conduct legally enforceable?",
          "What are the arguments around EVM and VVPAT?",
          "How can electoral funding be made transparent?",
        ],
      ),
      L(
        "pol-elections-2",
        "Representation, Parties and Anti-Defection",
        "First-past-the-post vs proportional representation; reservation of seats; Rajya Sabha elections; political parties and recognition; anti-defection law (Tenth Schedule); Speaker's role; coalition politics; pressure groups; democratic accountability.",
        [
          "A comparison diagram of FPTP and proportional representation.",
          "A flowchart of the anti-defection process and exceptions.",
        ],
        [
          "Why does India use first-past-the-post?",
          "What is the anti-defection law?",
          "When can a defection be exempted?",
          "How are political parties recognised?",
        ],
      ),
    ],
  },
  {
    id: "pol-bodies",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Polity — Constitutional, statutory, regulatory and quasi-judicial bodies",
    title: "The Institutions Beyond the Headlines",
    blurb:
      "Much of the state runs through bodies whose names fill the news but whose mandates are fuzzy. Learn who appoints them, what they can do and whom they answer to.",
    sources: [
      "M. Laxmikanth, Indian Polity, constitutional and statutory bodies",
      "PRS and PIB primers",
      "Official institutional websites",
    ],
    references: [R.upsc, R.cag, R.nhrc, R.cic, R.financeCommission, R.rbi],
    lessons: [
      L(
        "pol-bodies-1",
        "Constitutional Bodies",
        "UPSC and State PSCs; CAG; Finance Commission; Election Commission; National Commissions for SCs, STs and Women; Attorney General; Advocate General; Special Officer for Linguistic Minorities. Appointment, tenure, powers, independence and removal.",
        [
          "A table of constitutional bodies: article, appointment, tenure, removal.",
          "A diagram of checks between constitutional bodies and Parliament.",
        ],
        [
          "Why is the CAG called the guardian of the public purse?",
          "How independent is the UPSC?",
          "What is the role of the Finance Commission?",
          "Which constitutional bodies have removal procedures similar to judges?",
        ],
      ),
      L(
        "pol-bodies-2",
        "Statutory, Regulatory and Quasi-Judicial Bodies",
        "NHRC; CIC; CVC; Lokpal; NIA; SEBI; RBI; TRAI; CCI; NGT; NCW; NCPCR; NITI Aayog. Statutory vs constitutional vs executive bodies; regulatory independence; accountability; tribunalisation; judicial review of regulatory decisions.",
        [
          "A classification chart: constitutional, statutory, regulatory, executive and quasi-judicial bodies.",
          "A map of accountability relationships for a regulator.",
        ],
        [
          "What is the difference between a statutory and a regulatory body?",
          "Is NITI Aayog a constitutional body?",
          "How are regulators held accountable?",
          "What is a quasi-judicial body?",
        ],
      ),
    ],
  },
  {
    id: "pol-governance",
    subjectKey: "polity",
    subject: "Polity",
    paper: "Prelims GS-I · Mains GS-II",
    syllabusNode: "Governance — Transparency, accountability, e-governance and civil services",
    title: "The State in Everyday Life",
    blurb:
      "Governance is where the Constitution meets the queue at the office. Transparency, service delivery and the civil services decide whether rights become reality.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, ch. 8–10",
      "M. Laxmikanth, Indian Polity, governance",
      "Second ARC reports",
    ],
    references: [R.pib, R.cic, R.nhrc, R.prs, R.constitution],
    lessons: [
      L(
        "pol-gov-1",
        "RTI, Transparency and Accountability",
        "Right to Information Act 2005; Central and State Information Commissions; exemptions; public interest override; proactive disclosure; citizen charters; social audit; whistleblower protection; the debate over amendments and vacancies.",
        [
          "A flowchart of an RTI request from filing to appeal.",
          "A diagram of the accountability ecosystem: RTI, CAG, CVC, courts, media.",
        ],
        [
          "What is the public interest override in the RTI Act?",
          "Which information is exempt from disclosure?",
          "Why are Information Commission vacancies a problem?",
          "How does social audit strengthen accountability?",
        ],
      ),
      L(
        "pol-gov-2",
        "E-Governance and Digital Service Delivery",
        "E-governance models (G2C, G2B, G2G); Digital India; Aadhaar and DBT; UPI and digital public infrastructure; DigiLocker; e-office; data protection; digital divide; cybersecurity; citizen-centric service design; successful and failed models.",
        [
          "A diagram of the India Stack layers: identity, payments, data.",
          "A service-journey map showing how e-governance reduces friction.",
        ],
        [
          "What are the models of e-governance?",
          "How does DBT reduce leakage?",
          "What are the risks of digital exclusion?",
          "How does the DPDP Act affect e-governance?",
        ],
      ),
      L(
        "pol-gov-3",
        "Civil Services, Pressure Groups and the Policy Process",
        "Role of civil services in a democracy; generalist vs specialist; lateral entry; civil-service reform; pressure groups and their channels; NGOs and SHGs; policy cycle; implementation gaps; citizen participation; ethics in administration.",
        [
          "A diagram of the policy cycle from agenda to evaluation.",
          "A map of channels used by pressure groups to influence policy.",
        ],
        [
          "Why is neutrality central to the civil services?",
          "What are the arguments for and against lateral entry?",
          "How do pressure groups influence policy?",
          "Where does implementation usually fail?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // ECONOMY & DEVELOPMENT
  // ==========================================================================
  {
    id: "eco-basics",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — Growth, development, poverty, inclusion and demography",
    title: "The Economy's Big Picture",
    blurb:
      "Before markets and budgets, learn the scoreboard: what we measure, what we miss, and why growth is not the same as development.",
    sources: [
      "NCERT Class XI, Indian Economic Development",
      "NCERT Class XII, Introductory Macroeconomics",
      "Economic Survey (latest)",
    ],
    references: [R.mospi, R.niti, R.wikiEconomyIndia, R.pib, R.census],
    lessons: [
      L(
        "eco-basics-1",
        "National Income and the Measures of Growth",
        "GDP, GNP, NNP, per-capita income; nominal vs real; GDP deflator; factor cost vs market price; production, income and expenditure approaches; base-year revisions; informal economy; why GDP is an imperfect measure.",
        [
          "A circular-flow diagram of the economy with households, firms, government and external sector.",
          "A chart showing nominal vs real GDP and the deflator.",
        ],
        [
          "What is the difference between GDP and GNP?",
          "Why is real GDP a better growth measure than nominal GDP?",
          "What is the GDP deflator?",
          "What does GDP miss?",
        ],
      ),
      L(
        "eco-basics-2",
        "Inflation, Unemployment and the Labour Market",
        "Inflation types (demand-pull, cost-push); CPI vs WPI; core inflation; inflation targeting; unemployment types; PLFS; LFPR; formal vs informal employment; jobless growth; demographic dividend; skills gap.",
        [
          "A Phillips-curve-style diagram with a caveat about its limits.",
          "A labour-market diagram showing LFPR, workforce and unemployment.",
        ],
        [
          "What is the difference between CPI and WPI?",
          "What is core inflation?",
          "How is unemployment measured in India?",
          "What is jobless growth?",
        ],
      ),
      L(
        "eco-basics-3",
        "Poverty, Inequality and Human Development",
        "Poverty lines and multidimensional poverty; NITI Aayog MPI; inequality and the Gini coefficient; HDI; capability approach; social sector spending; inclusive growth; SDGs; the debate over poverty numbers.",
        [
          "A multidimensional-poverty diagram with health, education and living-standard dimensions.",
          "A Lorenz-curve and Gini illustration.",
        ],
        [
          "How does the MPI differ from an income poverty line?",
          "What does the Gini coefficient measure?",
          "What is the capability approach?",
          "Why is inclusive growth difficult to achieve?",
        ],
      ),
    ],
  },
  {
    id: "eco-money",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — Money, banking, monetary policy and financial markets",
    title: "Money and the Machine",
    blurb:
      "The RBI pulls levers; banks transmit the pull; markets react. Understand the chain and monetary policy stops looking like magic.",
    sources: [
      "NCERT Class XII, Introductory Macroeconomics, money and banking",
      "RBI publications and monetary policy reports",
      "Economic Survey, financial sector chapters",
    ],
    references: [R.rbi, R.wikiEconomyIndia, R.pib, R.mospi],
    lessons: [
      L(
        "eco-money-1",
        "Money, Banking and the RBI",
        "Functions of money; money supply (M0–M3); commercial banking; credit creation; RBI's functions; CRR, SLR, repo, reverse repo, MSF, OMO; monetary transmission; bank regulation; NPAs; financial inclusion.",
        [
          "A diagram of the RBI's monetary-policy toolkit.",
          "A balance-sheet view of credit creation by a commercial bank.",
        ],
        [
          "What is credit creation?",
          "How do CRR and SLR affect liquidity?",
          "What is the difference between repo and reverse repo?",
          "Why is monetary transmission weak in India?",
        ],
      ),
      L(
        "eco-money-2",
        "Monetary Policy and Inflation Targeting",
        "Monetary Policy Committee; inflation-targeting framework; repo rate decisions; liquidity management; fiscal-monetary coordination; exchange-rate considerations; limits of monetary policy; stagflation; supply shocks.",
        [
          "A flowchart of the MPC's decision process.",
          "A diagram of the inflation-targeting band and the RBI's response.",
        ],
        [
          "Who decides the repo rate?",
          "What is India's inflation target?",
          "What is fiscal dominance?",
          "Why can't monetary policy fix a supply shock?",
        ],
      ),
      L(
        "eco-money-3",
        "Financial Markets and Regulation",
        "Money market vs capital market; primary and secondary markets; stocks, bonds, derivatives; SEBI; mutual funds; insurance; pension funds; financial stability; crypto assets; fintech; investor protection.",
        [
          "A map of India's financial-market architecture and regulators.",
          "A simple diagram of primary vs secondary market flows.",
        ],
        [
          "What is the difference between the primary and secondary market?",
          "What does SEBI regulate?",
          "What are derivatives?",
          "Why is financial stability a public good?",
        ],
      ),
    ],
  },
  {
    id: "eco-fiscal",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — Public finance, budget, taxation, subsidies and fiscal federalism",
    title: "The Public Purse",
    blurb:
      "A budget is a moral document as much as an accounting one. It says who pays, who benefits and what kind of country we are building.",
    sources: [
      "NCERT Class XII, Introductory Macroeconomics, government budget",
      "Union Budget documents",
      "Economic Survey, fiscal chapter",
    ],
    references: [R.budget, R.wikiBudget, R.financeCommission, R.rbi, R.pib],
    lessons: [
      L(
        "eco-fiscal-1",
        "The Budget and Fiscal Policy",
        "Budgetary process; revenue and capital receipts/expenditure; fiscal deficit, revenue deficit, primary deficit; FRBM Act; fiscal consolidation; counter-cyclical policy; quality of spending; off-budget borrowing; public debt.",
        [
          "A budget-flow diagram from receipts to expenditure.",
          "A chart of deficits and their relationships.",
        ],
        [
          "What is fiscal deficit?",
          "Why is capital expenditure considered better than revenue expenditure?",
          "What is the FRBM Act?",
          "Is public debt always bad?",
        ],
      ),
      L(
        "eco-fiscal-2",
        "Taxation and GST",
        "Direct vs indirect taxes; progressive and regressive taxes; income tax; corporate tax; GST and the GST Council; tax buoyancy; tax evasion and avoidance; base erosion; tax expenditure; reforming indirect tax.",
        [
          "A diagram of the GST chain from manufacturer to consumer.",
          "A comparison of progressive, proportional and regressive tax structures.",
        ],
        [
          "What is the difference between direct and indirect tax?",
          "How does GST avoid cascading?",
          "What is tax buoyancy?",
          "Why is a regressive tax unfair to the poor?",
        ],
      ),
      L(
        "eco-fiscal-3",
        "Subsidies, Welfare and Fiscal Federalism",
        "Explicit and implicit subsidies; food, fertiliser and fuel subsidies; DBT; subsidy reform; welfare spending; centrally sponsored schemes; Finance Commission transfers; state fiscal space; fiscal rules; public goods.",
        [
          "A diagram of subsidy incidence: who pays, who receives.",
          "A fiscal-flow chart from the Union to states and beneficiaries.",
        ],
        [
          "Why are fertiliser subsidies hard to reform?",
          "How does DBT reduce leakage?",
          "What is the role of the Finance Commission?",
          "What is fiscal space?",
        ],
      ),
    ],
  },
  {
    id: "eco-external",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — External sector, trade, capital flows and international institutions",
    title: "India and the World Economy",
    blurb:
      "No economy is an island. Trade, capital flows and exchange rates transmit shocks — and opportunities — across borders.",
    sources: [
      "NCERT Class XII, Introductory Macroeconomics, open economy",
      "Economic Survey, external sector",
      "WTO, IMF and World Bank primers",
    ],
    references: [R.wto, R.imf, R.worldBank, R.rbi, R.pib],
    lessons: [
      L(
        "eco-external-1",
        "Balance of Payments and the Exchange Rate",
        "Current and capital accounts; trade balance; BoP crisis; foreign exchange reserves; fixed vs floating exchange rates; depreciation vs devaluation; convertibility; hedging; the impossible trinity.",
        [
          "A BoP structure diagram with current and capital accounts.",
          "A supply-demand diagram for foreign exchange.",
        ],
        [
          "What is the current account deficit?",
          "How do reserves protect an economy?",
          "What is the impossible trinity?",
          "What is the difference between depreciation and devaluation?",
        ],
      ),
      L(
        "eco-external-2",
        "Trade Policy, FDI and Global Value Chains",
        "Trade theories; tariffs and non-tariff barriers; India's trade agreements; FDI vs FPI; special economic zones; global value chains; export competitiveness; import dependence; trade deficits; WTO disputes.",
        [
          "A diagram of a global value chain for a smartphone.",
          "A chart of India's major exports, imports and partners.",
        ],
        [
          "What is the difference between FDI and FPI?",
          "Why do countries use non-tariff barriers?",
          "What is a global value chain?",
          "How can India improve export competitiveness?",
        ],
      ),
      L(
        "eco-external-3",
        "International Economic Institutions",
        "IMF and its lending facilities; World Bank Group; WTO and dispute settlement; Asian Development Bank; AIIB; BRICS bank; G20; India's role in global economic governance; reform of Bretton Woods institutions.",
        [
          "A table of international economic institutions and their mandates.",
          "A diagram of India's engagement across multilateral economic fora.",
        ],
        [
          "What does the IMF do?",
          "How does the WTO settle disputes?",
          "Why does India demand IMF quota reform?",
          "What is the role of the G20?",
        ],
      ),
    ],
  },
  {
    id: "eco-agriculture",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — Agriculture, food security, subsidies and rural economy",
    title: "The Field and the Market",
    blurb:
      "Agriculture employs the most people and feeds everyone. Its economics — MSP, subsidies, procurement and food security — is where policy gets hardest.",
    sources: [
      "NCERT Class XI, Indian Economic Development, rural development",
      "Economic Survey, agriculture chapters",
      "Ministry of Agriculture policy documents",
    ],
    references: [R.pib, R.wikiMSP, R.wikiAgricultureIndia, R.niti, R.budget],
    lessons: [
      L(
        "eco-agri-1",
        "MSP, Procurement and Food Security",
        "MSP and CACP; procurement and FCI; PDS and NFSA; buffer stocks; food subsidy; nutritional security; WTO Agreement on Agriculture; public stockholding; the farmer-income debate.",
        [
          "A diagram of the MSP-to-PDS chain.",
          "A chart of major crops and their procurement shares.",
        ],
        [
          "Who recommends MSP?",
          "What is the difference between MSP and procurement?",
          "How does the NFSA define eligibility?",
          "Why is public stockholding a WTO issue?",
        ],
      ),
      L(
        "eco-agri-2",
        "Subsidies, Credit and Insurance",
        "Input subsidies (fertiliser, power, irrigation); credit and priority-sector lending; crop insurance (PMFBY); agricultural marketing; e-NAM; contract farming; land leasing; farmer producer organisations; agri exports.",
        [
          "A diagram of the agricultural credit chain.",
          "A map of e-NAM mandis and major agri-export regions.",
        ],
        [
          "Why are power subsidies politically sensitive?",
          "How does PMFBY work?",
          "What is e-NAM?",
          "What are the benefits and risks of contract farming?",
        ],
      ),
      L(
        "eco-agri-3",
        "Land Reform, Productivity and Rural Diversification",
        "Land tenure and land reform; consolidation; ceiling laws; tenancy reform; farm size; productivity; irrigation; mechanisation; diversification to horticulture and livestock; food processing; rural non-farm employment.",
        [
          "A diagram of land-reform instruments.",
          "A chart of agriculture's share in output vs employment.",
        ],
        [
          "Why did land reform have mixed results?",
          "What is the inverse size-productivity relationship?",
          "Why is diversification important?",
          "How can food processing raise farmer incomes?",
        ],
      ),
    ],
  },
  {
    id: "eco-industry",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — Industry, infrastructure, investment and liberalisation",
    title: "Factories, Roads and the Growth Engine",
    blurb:
      "Industrial policy is back in fashion. Learn how India's factories, infrastructure and investment models fit together — and where the bottlenecks are.",
    sources: [
      "NCERT Class XI, Indian Economic Development, industry",
      "Economic Survey, industry and infrastructure",
      "Ministry of Commerce and Industry policy documents",
    ],
    references: [R.pib, R.niti, R.wikiEconomyIndia, R.budget, R.worldBank],
    lessons: [
      L(
        "eco-industry-1",
        "Industrial Policy and Liberalisation",
        "1948 and 1956 industrial policies; licence raj; 1991 reforms; LPG; industrial growth phases; Make in India; PLI schemes; MSMEs; industrial corridors; ease of doing business; deindustrialisation and reindustrialisation.",
        [
          "A timeline of India's industrial policy from 1948 to the present.",
          "A diagram of the licence raj vs the post-1991 regime.",
        ],
        [
          "What changed in 1991?",
          "What is the licence raj?",
          "How do PLI schemes work?",
          "Why are MSMEs important?",
        ],
      ),
      L(
        "eco-industry-2",
        "Infrastructure and Investment Models",
        "Energy, ports, roads, airports, railways; infrastructure gaps; public-private partnerships; BOT, BOOT, HAM; viability gap funding; asset monetisation; National Infrastructure Pipeline; financing constraints; land acquisition.",
        [
          "A diagram of PPP models and risk allocation.",
          "A map of major infrastructure corridors and projects.",
        ],
        [
          "What is a PPP?",
          "How does the HAM model work?",
          "Why is infrastructure a growth multiplier?",
          "What are the risks of asset monetisation?",
        ],
      ),
      L(
        "eco-industry-3",
        "Disinvestment, Public Sector and Competition",
        "Public sector undertakings; strategic vs non-strategic disinvestment; privatisation debates; competition law and CCI; natural monopolies; regulation; industrial sickness; bankruptcy (IBC); corporate governance.",
        [
          "A diagram of the disinvestment spectrum from minority stake sale to privatisation.",
          "A chart of competition-law institutions and their roles.",
        ],
        [
          "What is the difference between disinvestment and privatisation?",
          "Why do natural monopolies need regulation?",
          "How does the IBC resolve insolvency?",
          "What is the role of the CCI?",
        ],
      ),
    ],
  },
  {
    id: "eco-inclusive",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — Inclusive growth, employment, human capital and social security",
    title: "Growth That Reaches People",
    blurb:
      "Headline growth can coexist with jobless growth and deep exclusion. This unit asks the uncomfortable questions about who benefits.",
    sources: [
      "NCERT Class XI, Indian Economic Development",
      "Economic Survey, social sector and employment",
      "NITI Aayog and ILO reports",
    ],
    references: [R.niti, R.mospi, R.pib, R.worldBank, R.census],
    lessons: [
      L(
        "eco-inclusive-1",
        "Employment, Informality and Skills",
        "Employment structure; formal vs informal; gig economy; PLFS; female labour-force participation; skilling; apprenticeships; labour codes; social security for informal workers; migration and urban jobs.",
        [
          "A diagram of India's employment structure by sector and formality.",
          "A chart of female labour-force participation and its drivers.",
        ],
        [
          "Why is most Indian employment informal?",
          "What do the four labour codes change?",
          "Why is female LFPR low?",
          "How can skilling improve employability?",
        ],
      ),
      L(
        "eco-inclusive-2",
        "Human Capital, Health and Social Security",
        "Education and health spending; human capital index; Ayushman Bharat; nutrition; social security codes; pensions; MGNREGA; welfare delivery; universal basic income debate; demographic dividend.",
        [
          "A diagram of the human-capital lifecycle from child to worker.",
          "A chart of social-sector expenditure as a share of GDP.",
        ],
        [
          "What is human capital?",
          "How does Ayushman Bharat work?",
          "What is the demographic dividend?",
          "What are the arguments for and against UBI?",
        ],
      ),
    ],
  },
  {
    id: "eco-planning",
    subjectKey: "economy",
    subject: "Economy",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Economy — Planning, sustainable development and economic reform",
    title: "The Plan and the Market",
    blurb:
      "India has tried central planning, liberalisation and mission-mode governance. Each left lessons about the state's proper role.",
    sources: [
      "NCERT Class XI, Indian Economic Development, planning",
      "NITI Aayog documents",
      "Economic Survey",
    ],
    references: [R.niti, R.pib, R.wikiEconomyIndia, R.budget],
    lessons: [
      L(
        "eco-plan-1",
        "Five Year Plans to NITI Aayog",
        "Planning Commission; Mahalanobis model; plan periods and shifts; failures and successes; NITI Aayog; cooperative and competitive federalism; Aspirational Districts; SDG localisation; mission-mode governance.",
        [
          "A timeline of India's Five Year Plans with their central themes.",
          "A diagram of NITI Aayog's role vs the old Planning Commission.",
        ],
        [
          "Why was the Planning Commission replaced?",
          "What was the Mahalanobis model?",
          "What is mission-mode governance?",
          "How does NITI Aayog differ from the Finance Commission?",
        ],
      ),
      L(
        "eco-plan-2",
        "Sustainable Development and the 1991 Reform Legacy",
        "Sustainable development; SDGs; green growth; circular economy; 1991 balance-of-payments crisis; LPG reforms; outcomes and unfinished agenda; state capacity; next-generation reforms.",
        [
          "A diagram linking the SDGs to Indian policy schemes.",
          "A before-and-after diagram of the 1991 reforms.",
        ],
        [
          "What is sustainable development?",
          "Why did India liberalise in 1991?",
          "What reforms remain unfinished?",
          "What is the circular economy?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // HISTORY, FREEDOM STRUGGLE & WORLD HISTORY
  // ==========================================================================
  {
    id: "his-ancient",
    subjectKey: "history",
    subject: "History",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "History — Ancient India",
    title: "The First Civilisations",
    blurb:
      "From stone tools to the Mauryan empire, ancient India is a story of cities, texts, trade and ideas that still shape the subcontinent.",
    sources: [
      "NCERT Class XI, Themes in Indian History Part I",
      "NCERT Class XII, Themes in Indian History Part I",
      "R.S. Sharma, India's Ancient Past",
    ],
    references: [R.ncertHub, R.asi, R.ignca, R.wikiIndianCulture],
    lessons: [
      L(
        "his-ancient-1",
        "Prehistory and the Harappan Civilisation",
        "Palaeolithic, Mesolithic and Neolithic cultures; the Indus Valley Civilisation; town planning; Harappa and Mohenjo-daro; seals, script and trade; decline theories; post-Harappan cultures; the Aryan question.",
        [
          "A map of major Harappan sites and trade routes.",
          "A town-plan diagram of Mohenjo-daro with citadel and lower town.",
        ],
        [
          "What makes the Harappan civilisation urban?",
          "Why is its script undeciphered?",
          "What are the main theories of its decline?",
          "How did Harappan trade reach Mesopotamia?",
        ],
      ),
      L(
        "his-ancient-2",
        "The Vedic Age and the Mahajanapadas",
        "Rigvedic and Later Vedic periods; pastoral to agrarian transition; varna and jati; tribal assemblies; iron and the Ganga valley; Mahajanapadas; Magadha's rise; Jainism and Buddhism; the Mauryan empire; Ashoka's dhamma.",
        [
          "A map of the sixteen Mahajanapadas and Magadha's expansion.",
          "A diagram of the Mauryan administrative structure.",
        ],
        [
          "How did iron change the Ganga valley?",
          "Why did Magadha become the dominant mahajanapada?",
          "What was Ashoka's dhamma?",
          "How did Buddhism challenge Vedic society?",
        ],
      ),
      L(
        "his-ancient-3",
        "Post-Mauryan India and the Guptas",
        "Indo-Greek, Kushana and Satavahana rule; Silk Road trade; Gandhara and Mathura art; Sangam literature and the Tamilakam; the Gupta empire; land grants; classical art and literature; science and mathematics; the Huna invasions.",
        [
          "A map of trade routes linking India, Central Asia and Rome.",
          "A comparison of Gandhara, Mathura and Gupta sculpture styles.",
        ],
        [
          "How did the Silk Road shape Indian art?",
          "What was the Sangam age?",
          "Why is the Gupta period called classical?",
          "What changed in land relations under the Guptas?",
        ],
      ),
      L(
        "his-ancient-4",
        "Ancient South India and the Deccan",
        "Cholas, Pandyas and Cheras; Sangam polity and economy; Pallavas; Chalukyas; Rashtrakutas; temple-building; Chola local administration; maritime trade; Indian Ocean connections; cultural synthesis.",
        [
          "A map of ancient South Indian kingdoms and port towns.",
          "A diagram of Chola village administration.",
        ],
        [
          "What do Sangam texts tell us about early Tamil society?",
          "How did the Cholas manage local administration?",
          "Why was maritime trade important to the south?",
          "How did temple architecture evolve in the south?",
        ],
      ),
    ],
  },
  {
    id: "his-medieval",
    subjectKey: "history",
    subject: "History",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "History — Medieval India",
    title: "Sultans, Sultans and Syncretism",
    blurb:
      "Medieval India is not a gap between ancient and modern. It is a world of new states, new technologies, new devotional movements and extraordinary cultural mixing.",
    sources: [
      "NCERT Class XII, Themes in Indian History Part II",
      "Satish Chandra, Medieval India",
      "Selected primary sources",
    ],
    references: [R.ncertHub, R.asi, R.ignca, R.wikiIndianCulture],
    lessons: [
      L(
        "his-medieval-1",
        "The Delhi Sultanate",
        "Ghaznavid and Ghurid invasions; Slave, Khalji, Tughlaq, Sayyid and Lodi dynasties; administrative experiments; market reforms; Mongol pressure; Timur's invasion; decline; regional sultanates.",
        [
          "A timeline of the five Delhi Sultanate dynasties.",
          "A map of the Sultanate at its greatest extent and its regional rivals.",
        ],
        [
          "What were Alauddin Khalji's market reforms?",
          "Why did Muhammad bin Tughlaq's experiments fail?",
          "How did the Sultanate manage a diverse population?",
          "Why did regional sultanates emerge?",
        ],
      ),
      L(
        "his-medieval-2",
        "Vijayanagara, the Bahmanis and the Mughals",
        "Vijayanagara empire; Bahmani and Deccan sultanates; Mughal rise under Babur, Akbar, Jahangir, Shah Jahan and Aurangzeb; mansabdari; jagirdari; revenue systems; Rajput and Maratha relations; Mughal decline.",
        [
          "A map of Vijayanagara, the Deccan sultanates and the Mughal empire.",
          "A diagram of Mughal administration: emperor, mansabdars, jagirdars, zamindars.",
        ],
        [
          "How did Vijayanagara prosper?",
          "What was the mansabdari system?",
          "How did Akbar manage religious diversity?",
          "Why did the Mughal empire decline?",
        ],
      ),
      L(
        "his-medieval-3",
        "Bhakti, Sufism and the Making of a Composite Culture",
        "Bhakti movements (Alvars, Nayanars, Kabir, Nanak, Mirabai, Chaitanya); Sufi orders; syncretic shrines; regional languages and literature; music and painting; the Bhakti-Sufi challenge to orthodoxy; the idea of a composite culture.",
        [
          "A map of major Bhakti and Sufi centres.",
          "A diagram showing the shared vocabulary of Bhakti and Sufi devotion.",
        ],
        [
          "What did Kabir criticise?",
          "How did Sufism spread in India?",
          "Why is Bhakti called a democratising movement?",
          "What is composite culture?",
        ],
      ),
    ],
  },
  {
    id: "his-modern",
    subjectKey: "history",
    subject: "History",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "History — Modern India and the freedom struggle",
    title: "The Long Freedom Struggle",
    blurb:
      "From the Company's conquests to the midnight of 1947, this is the story of how Indians contested, negotiated and finally won independence.",
    sources: [
      "NCERT Class XII, Themes in Indian History Part III",
      "Bipan Chandra, India's Struggle for Independence",
      "Sumit Sarkar, Modern India",
    ],
    references: [R.ncertHub, R.asi, R.wikiIndianCulture, R.pib],
    lessons: [
      L(
        "his-modern-1",
        "The Advent of the Europeans and Company Rule",
        "Portuguese, Dutch, French and English trading companies; Battle of Plassey and Buxar; dual government; Permanent Settlement, Ryotwari and Mahalwari; deindustrialisation; drain of wealth; the Revolt of 1857.",
        [
          "A map of European trading posts in India.",
          "A diagram of the three land-revenue systems and their regions.",
        ],
        [
          "How did the East India Company become a territorial power?",
          "What were the effects of the Permanent Settlement?",
          "What caused the Revolt of 1857?",
          "What is the drain of wealth?",
        ],
      ),
      L(
        "his-modern-2",
        "Reform, Resistance and the Birth of the Congress",
        "Socio-religious reform movements; Brahmo Samaj, Arya Samaj, Ramakrishna Mission, Aligarh Movement; tribal and peasant revolts; the Indian National Congress (1885); moderates and extremists; Partition of Bengal and Swadeshi; Muslim League.",
        [
          "A timeline of reform movements and their founders.",
          "A map of major peasant and tribal revolts.",
        ],
        [
          "What did the socio-religious reformers seek to change?",
          "Why was the Congress founded in 1885?",
          "How did the Swadeshi movement change politics?",
          "Why did the Muslim League demand separate electorates?",
        ],
      ),
      L(
        "his-modern-3",
        "Gandhi and Mass Nationalism",
        "Champaran, Kheda and Ahmedabad; Non-Cooperation; Civil Disobedience and Dandi March; Round Table Conferences; Government of India Act 1935; Quit India; Gandhi's methods; Ambedkar and Dalit politics; Congress mobilisation.",
        [
          "A timeline of Gandhian mass movements from 1917 to 1942.",
          "A diagram of Gandhi's method: satyagraha, constructive programme, mass mobilisation.",
        ],
        [
          "What was satyagraha?",
          "Why did Gandhi call off Non-Cooperation?",
          "What was the significance of the Dandi March?",
          "How did Ambedkar's politics differ from Gandhi's?",
        ],
      ),
      L(
        "his-modern-4",
        "Towards Partition and Independence",
        "Second World War and India; Cripps Mission; INA and Subhas Chandra Bose; naval mutiny; Cabinet Mission; interim government; Mountbatten Plan; Partition; independence and the human cost; integration of princely states.",
        [
          "A map of the Cabinet Mission plan and the Radcliffe Line.",
          "A timeline from 1939 to 1950.",
        ],
        [
          "Why did the Cabinet Mission fail?",
          "What was the Mountbatten Plan?",
          "How did Partition reshape India?",
          "How were princely states integrated?",
        ],
      ),
      L(
        "his-modern-5",
        "The Making of Modern India: Themes and Debates",
        "Nationalism and communalism; caste and gender in the freedom struggle; workers and peasants; the press and public sphere; education and social change; the idea of India; historians' debates.",
        [
          "A diagram of the multiple streams of the national movement.",
          "A timeline of key social and political ideas from 1850 to 1950.",
        ],
        [
          "Was the freedom struggle a mass movement or an elite negotiation?",
          "How did women participate in the struggle?",
          "What was the role of the press?",
          "How do historians disagree about Partition?",
        ],
      ),
    ],
  },
  {
    id: "his-postindependence",
    subjectKey: "history",
    subject: "History",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "History — Post-independence consolidation and reorganisation",
    title: "The Republic Begins",
    blurb:
      "Independence was not an ending. The new state had to integrate princes, redraw states, feed millions, fight wars and hold a democracy together.",
    sources: [
      "NCERT Class XII, Politics in India Since Independence",
      "Ramachandra Guha, India After Gandhi",
      "Selected government reports",
    ],
    references: [R.ncertHub, R.pib, R.wikiConstitution, R.census],
    lessons: [
      L(
        "his-post-1",
        "Integration of Princely States and Linguistic Reorganisation",
        "Instrument of Accession; Hyderabad, Junagadh, Kashmir; Goa; States Reorganisation Act 1956; linguistic states; the States Reorganisation Commission; federal compromise; regional identity and national unity.",
        [
          "A map of princely-state integration and the linguistic reorganisation of states.",
          "A timeline from 1947 to 1966.",
        ],
        [
          "How did Sardar Patel integrate the princely states?",
          "Why were states reorganised on linguistic lines?",
          "What was the Kashmir question in 1947?",
          "Did linguistic states strengthen or weaken the Union?",
        ],
      ),
      L(
        "his-post-2",
        "Building the Economy and the Polity",
        "Planning; land reform; Green Revolution; public sector; industrial policy; the 1962 and 1965 wars; Tashkent; 1971 war and Bangladesh; the Emergency; Janata government; liberalisation.",
        [
          "A timeline of post-independence economic and political turning points.",
          "A map of the 1971 war and the creation of Bangladesh.",
        ],
        [
          "Why did India adopt planning?",
          "How did the Green Revolution change agriculture?",
          "What led to the Emergency?",
          "Why did India liberalise in 1991?",
        ],
      ),
      L(
        "his-post-3",
        "Democracy, Movements and the Unfinished Agenda",
        "Coalition era; Mandal Commission; rise of regional parties; social movements; environmental movements; women's movement; Dalit and Adivasi politics; judicial activism; media liberalisation; the idea of the world's largest democracy.",
        [
          "A timeline of major social and political movements since 1970.",
          "A diagram of the shift from one-party dominance to coalition politics.",
        ],
        [
          "Why did coalition politics become normal?",
          "What was the Mandal Commission?",
          "How did environmental movements change policy?",
          "What are the strengths and weaknesses of Indian democracy?",
        ],
      ),
    ],
  },
  {
    id: "his-world",
    subjectKey: "history",
    subject: "History",
    paper: "Mains GS-I",
    syllabusNode: "History — World history from the 18th century",
    title: "The Modern World in Broad Strokes",
    blurb:
      "World history is the backstory of today's headlines: revolutions, industrial power, empire, world war, decolonisation and the Cold War.",
    sources: [
      "NCERT Class XI, Themes in World History",
      "Norman Lowe, Mastering Modern World History",
      "Selected primary sources",
    ],
    references: [R.ncertHub, R.un, R.wikiNAM, R.wikiUNSC],
    lessons: [
      L(
        "his-world-1",
        "Renaissance, Reformation and the Scientific Revolution",
        "Humanism; printing; Reformation; Counter-Reformation; scientific method; Galileo, Newton and the Enlightenment; the public sphere; the intellectual roots of modernity.",
        [
          "A timeline from the Renaissance to the Enlightenment.",
          "A diagram of how printing amplified reform and science.",
        ],
        [
          "How did the printing press change Europe?",
          "What did the Reformation challenge?",
          "How did the Scientific Revolution change authority?",
          "What is the Enlightenment?",
        ],
      ),
      L(
        "his-world-2",
        "Revolutions and the Industrial Age",
        "American Revolution; French Revolution; Haitian Revolution; Napoleonic era; Industrial Revolution; capitalism and socialism; urbanisation; imperialism; the scramble for Africa.",
        [
          "A timeline of the Atlantic revolutions and the Industrial Revolution.",
          "A diagram of the industrial-factory system and its social effects.",
        ],
        [
          "Why did the French Revolution become radical?",
          "What made Britain the first industrial nation?",
          "How did imperialism reshape Africa and Asia?",
          "What is the difference between capitalism and socialism?",
        ],
      ),
      L(
        "his-world-3",
        "World Wars and the Making of the 20th Century",
        "Causes and consequences of World War I; Versailles; League of Nations; rise of fascism and Nazism; World War II; Holocaust; United Nations; decolonisation; Cold War; Non-Aligned Movement.",
        [
          "A map of Europe before and after the two world wars.",
          "A timeline from 1914 to 1991.",
        ],
        [
          "Was World War I inevitable?",
          "How did the Versailles settlement lead to World War II?",
          "Why did the League of Nations fail?",
          "How did the Cold War shape decolonisation?",
        ],
      ),
      L(
        "his-world-4",
        "The Contemporary World",
        "End of the Cold War; globalisation; rise of China; European Union; regionalism; terrorism; climate politics; the Global South; the changing world order; India's place in it.",
        [
          "A map of the post-Cold-War world and major regional blocs.",
          "A diagram of global power shifts from 1945 to the present.",
        ],
        [
          "Why did the Soviet Union collapse?",
          "What is globalisation?",
          "How has China's rise changed the world order?",
          "What is the Global South?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // ENVIRONMENT, ECOLOGY & CLIMATE
  // ==========================================================================
  {
    id: "env-ecology",
    subjectKey: "environment",
    subject: "Environment",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Environment — Ecology, ecosystems and ecosystem services",
    title: "The Web of Life",
    blurb:
      "Ecology is economics with consequences. Understand energy flow, nutrient cycles and ecosystem services before debating conservation policy.",
    sources: [
      "NCERT Class XII, Biology, ecology unit",
      "NCERT Class XI, Geography, biogeography chapters",
      "MoEFCC and CBD primers",
    ],
    references: [R.moefcc, R.cbd, R.wikiEcology, R.wikiBiodiversity],
    lessons: [
      L(
        "env-eco-1",
        "Ecology Fundamentals: Energy and Matter",
        "Organisms and environment; habitat and niche; food chains and webs; trophic levels; energy flow; ecological pyramids; productivity; biogeochemical cycles (carbon, nitrogen, phosphorus); limiting factors; carrying capacity.",
        [
          "A food-web diagram with trophic levels and energy loss at each step.",
          "A carbon-cycle diagram with major sinks and sources.",
        ],
        [
          "Why is energy flow unidirectional?",
          "What is a trophic level?",
          "Why is the nitrogen cycle important for agriculture?",
          "What is carrying capacity?",
        ],
      ),
      L(
        "env-eco-2",
        "Ecosystems and Ecosystem Services",
        "Terrestrial and aquatic ecosystems; succession; biodiversity and stability; keystone species; ecosystem services (provisioning, regulating, cultural, supporting); natural capital; payment for ecosystem services; degradation and restoration.",
        [
          "A diagram of ecosystem services with examples.",
          "A succession sequence from bare rock to forest.",
        ],
        [
          "What are ecosystem services?",
          "What is a keystone species?",
          "How does succession work?",
          "Why is biodiversity linked to resilience?",
        ],
      ),
      L(
        "env-eco-3",
        "Biodiversity: Levels, Hotspots and Threats",
        "Genetic, species and ecosystem diversity; India's megadiversity; biodiversity hotspots; endemic species; threats (habitat loss, invasive species, overexploitation, pollution, climate change); IUCN Red List; conservation genetics; citizen science.",
        [
          "A map of the world's biodiversity hotspots.",
          "A diagram of the drivers of biodiversity loss.",
        ],
        [
          "What are the levels of biodiversity?",
          "Which biodiversity hotspots lie in India?",
          "What is an invasive species?",
          "How does the IUCN Red List work?",
        ],
      ),
    ],
  },
  {
    id: "env-conservation",
    subjectKey: "environment",
    subject: "Environment",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Environment — Conservation law, protected areas and international conventions",
    title: "The Rules of Conservation",
    blurb:
      "India's conservation framework is a thicket of laws, protected areas and treaties. Learn the architecture, not just the acronyms.",
    sources: [
      "Wildlife (Protection) Act 1972; Forest Conservation Act 1980; Biological Diversity Act 2002",
      "NCERT Class XII, Biology, conservation",
      "MoEFCC and Ramsar materials",
    ],
    references: [R.moefcc, R.cbd, R.ramsar, R.wikiBiodiversity],
    lessons: [
      L(
        "env-cons-1",
        "Protected Areas and Conservation Law",
        "National parks, wildlife sanctuaries, conservation reserves, community reserves; biosphere reserves; tiger and elephant reserves; eco-sensitive zones; Wildlife Protection Act; Forest Conservation Act; Forest Rights Act; compensatory afforestation; critical wildlife habitat.",
        [
          "A map of India's major national parks, tiger reserves and biosphere reserves.",
          "A diagram of the protected-area categories and their permitted activities.",
        ],
        [
          "What is the difference between a national park and a wildlife sanctuary?",
          "What is an eco-sensitive zone?",
          "How does the Forest Rights Act interact with conservation?",
          "What is a biosphere reserve?",
        ],
      ),
      L(
        "env-cons-2",
        "International Conservation Conventions",
        "CBD and the Kunming-Montreal framework; CITES; Ramsar; CMS; UNFCCC; Nagoya Protocol; Cartagena Protocol; 30x30 target; India's position; biodiversity finance; access and benefit sharing.",
        [
          "A table of major conventions and what they regulate.",
          "A timeline from Stockholm 1972 to the present.",
        ],
        [
          "What is the 30x30 target?",
          "How does CITES protect species?",
          "What is the Nagoya Protocol?",
          "Why is biodiversity finance contentious?",
        ],
      ),
      L(
        "env-cons-3",
        "Species Conservation and Human-Wildlife Conflict",
        "Project Tiger and Project Elephant; cheetah reintroduction; vulture conservation; wetlands and mangroves; coral restoration; human-wildlife conflict; compensation; community-based conservation; ecotourism; wildlife crime.",
        [
          "A map of tiger reserves and elephant corridors.",
          "A diagram of the human-wildlife conflict cycle and mitigation options.",
        ],
        [
          "Why did Project Tiger work?",
          "What causes human-wildlife conflict?",
          "How can corridors reduce conflict?",
          "What is community-based conservation?",
        ],
      ),
    ],
  },
  {
    id: "env-climate",
    subjectKey: "environment",
    subject: "Environment",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Environment — Climate change, mitigation, adaptation and climate justice",
    title: "The Climate Bargain",
    blurb:
      "Climate change is a science problem, an economics problem and a justice problem. This unit connects all three.",
    sources: [
      "IPCC summaries for policymakers",
      "UNFCCC and Paris Agreement texts",
      "Economic Survey, climate chapters",
    ],
    references: [R.unfccc, R.moefcc, R.wikiClimateChange, R.pib, R.un],
    lessons: [
      L(
        "env-climate-1",
        "The Science of Climate Change",
        "Greenhouse effect; greenhouse gases; radiative forcing; carbon budget; temperature and sea-level rise; feedback loops; tipping points; attribution science; IPCC scenarios; India's vulnerability.",
        [
          "A greenhouse-effect diagram with incoming and outgoing radiation.",
          "A chart of global temperature and CO2 concentration over time.",
        ],
        [
          "What is the greenhouse effect?",
          "What is radiative forcing?",
          "What is a tipping point?",
          "Why is India vulnerable to climate change?",
        ],
      ),
      L(
        "env-climate-2",
        "The International Climate Regime",
        "UNFCCC; Kyoto Protocol; Paris Agreement; NDCs; global stocktake; loss and damage; climate finance; CBDR-RC; carbon markets (Article 6); COP process; India's commitments and net-zero target.",
        [
          "A timeline of the climate regime from 1992 to the present.",
          "A diagram of the Paris Agreement's ratchet mechanism.",
        ],
        [
          "What is CBDR-RC?",
          "What is an NDC?",
          "How does the global stocktake work?",
          "What is loss and damage?",
        ],
      ),
      L(
        "env-climate-3",
        "Mitigation, Adaptation and Climate Justice",
        "Renewable energy; energy efficiency; carbon pricing; green hydrogen; adaptation and resilience; just transition; climate justice; liability; green finance; India's climate policy; state climate action.",
        [
          "A mitigation-vs-adaptation diagram with examples.",
          "A chart of India's emissions by sector and its renewable targets.",
        ],
        [
          "What is the difference between mitigation and adaptation?",
          "What is a just transition?",
          "What is climate justice?",
          "How can carbon pricing reduce emissions?",
        ],
      ),
    ],
  },
  {
    id: "env-pollution",
    subjectKey: "environment",
    subject: "Environment",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Environment — Pollution, waste, EIA and environmental governance",
    title: "The Pollution Problem",
    blurb:
      "Pollution is a market failure with a body count. Learn the sources, the standards, the institutions and the policy tools.",
    sources: [
      "NCERT Class XII, Biology, environmental issues",
      "CPCB and MoEFCC reports",
      "Environmental Protection Act and EIA notifications",
    ],
    references: [R.moefcc, R.wikiPollution, R.wikiEIA, R.pib, R.un],
    lessons: [
      L(
        "env-poll-1",
        "Air and Water Pollution",
        "Pollutants and sources; PM2.5 and PM10; smog; indoor air pollution; acid rain; eutrophication; biochemical oxygen demand; industrial effluents; sewage; groundwater contamination; standards and monitoring; pollution and health.",
        [
          "A diagram of the air-pollution chain from source to health effect.",
          "A river-pollution diagram showing BOD, oxygen sag and recovery.",
        ],
        [
          "What is PM2.5?",
          "What causes eutrophication?",
          "What is BOD?",
          "Why is indoor air pollution a major health risk?",
        ],
      ),
      L(
        "env-poll-2",
        "Solid Waste, Plastics and the Circular Economy",
        "Municipal solid waste; landfill and leachate; recycling; plastic pollution; e-waste; hazardous waste; construction waste; extended producer responsibility; waste-to-energy; circular economy; Swachh Bharat and waste rules.",
        [
          "A waste-management hierarchy diagram (reduce, reuse, recycle, recover, dispose).",
          "A plastic-lifecycle diagram from production to leakage.",
        ],
        [
          "What is extended producer responsibility?",
          "Why is e-waste hazardous?",
          "What is the circular economy?",
          "What are the limits of waste-to-energy?",
        ],
      ),
      L(
        "env-poll-3",
        "Environmental Impact Assessment and Governance",
        "EIA process; screening, scoping, public hearing, appraisal; environmental clearance; categories A and B; coastal regulation zone; forest clearance; environmental courts; NGT; polluter-pays principle; precautionary principle; public trust doctrine; environmental federalism.",
        [
          "A flowchart of the EIA process.",
          "A diagram of India's environmental-governance institutions.",
        ],
        [
          "What is the EIA process?",
          "What is the precautionary principle?",
          "How does the NGT work?",
          "Why are environmental clearances controversial?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // SCIENCE & TECHNOLOGY
  // ==========================================================================
  {
    id: "sci-space",
    subjectKey: "science",
    subject: "Science & Technology",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Science & Technology — Space, satellites and space policy",
    title: "India Beyond the Sky",
    blurb:
      "ISRO is a story of frugal engineering and strategic autonomy. Learn the launchers, satellites, applications and the new space economy.",
    sources: [
      "ISRO annual reports and mission pages",
      "NCERT Class XI–XII Physics, selected chapters",
      "Department of Space policy documents",
    ],
    references: [R.isro, R.dst, R.wikiSpace, R.pib],
    lessons: [
      L(
        "sci-space-1",
        "Launch Vehicles and Orbits",
        "Rocket physics; staging; PSLV, GSLV, LVM3, SSLV; low Earth orbit, geostationary transfer orbit, sun-synchronous orbit; launch windows; re-entry; reusable launch; spaceports; India's launch competitiveness.",
        [
          "A diagram of a multi-stage rocket with stage separation.",
          "A comparison of LEO, GTO, SSO and polar orbits.",
        ],
        [
          "Why are rockets staged?",
          "What is the difference between PSLV and GSLV?",
          "What is a sun-synchronous orbit used for?",
          "Why is Sriharikota a good spaceport?",
        ],
      ),
      L(
        "sci-space-2",
        "Satellites and Their Applications",
        "Communication, remote sensing, navigation (NavIC), weather and disaster monitoring; INSAT and IRS; earth observation; GIS; satellite internet; small satellites; space debris; space weather.",
        [
          "A diagram of satellite applications by orbit type.",
          "A remote-sensing workflow from sensor to decision.",
        ],
        [
          "What is NavIC?",
          "How does remote sensing help agriculture?",
          "Why is space debris a threat?",
          "What is the difference between geostationary and polar orbits?",
        ],
      ),
      L(
        "sci-space-3",
        "Exploration, Commercialisation and Space Policy",
        "Chandrayaan, Mangalyaan, Aditya-L1, Gaganyaan; lunar and Mars science; IN-SPACe, NSIL and private space; space law; Outer Space Treaty; militarisation; planetary defence; India's space diplomacy.",
        [
          "A timeline of India's major space missions.",
          "A diagram of India's space-governance ecosystem.",
        ],
        [
          "What did Chandrayaan-3 achieve?",
          "What is IN-SPACe?",
          "What does the Outer Space Treaty prohibit?",
          "Why is space militarisation a concern?",
        ],
      ),
    ],
  },
  {
    id: "sci-biotech",
    subjectKey: "science",
    subject: "Science & Technology",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Science & Technology — Biotechnology, health and bioethics",
    title: "The Code of Life",
    blurb:
      "Biotechnology is rewriting medicine, agriculture and identity. Learn the science and the ethical lines we are drawing around it.",
    sources: [
      "NCERT Class XII, Biology, biotechnology and genetics",
      "Department of Biotechnology reports",
      "ICMR and WHO primers",
    ],
    references: [R.dst, R.wikiBiotech, R.pib, R.un],
    lessons: [
      L(
        "sci-biotech-1",
        "Genetics and Genetic Engineering",
        "DNA, genes and proteins; central dogma; recombinant DNA; CRISPR; gene therapy; GM crops; Bt cotton; gene drives; synthetic biology; bioethics; biosafety.",
        [
          "A central-dogma diagram from DNA to RNA to protein.",
          "A CRISPR-Cas9 mechanism diagram.",
        ],
        [
          "What is the central dogma?",
          "How does CRISPR work?",
          "What are the concerns around GM crops?",
          "What is gene therapy?",
        ],
      ),
      L(
        "sci-biotech-2",
        "Vaccines, Diagnostics and Public Health",
        "Immunity; vaccine types; mRNA vaccines; clinical trials; diagnostics (PCR, antigen, sequencing); antimicrobial resistance; zoonoses; pandemic preparedness; health systems; One Health.",
        [
          "A diagram of vaccine platforms and how they trigger immunity.",
          "A One Health diagram linking human, animal and environmental health.",
        ],
        [
          "How do mRNA vaccines work?",
          "Why is antimicrobial resistance a crisis?",
          "What is One Health?",
          "How are clinical trials regulated?",
        ],
      ),
      L(
        "sci-biotech-3",
        "Bioeconomy, IPR and Governance",
        "Bioeconomy; biomanufacturing; biofuel; biopharma; patents and IPR; traditional knowledge; biopiracy; Biological Diversity Act; GM regulation; stem-cell research; ethics of human genome editing.",
        [
          "A diagram of the bioeconomy value chain.",
          "A table of bioethics principles and their policy implications.",
        ],
        [
          "What is biopiracy?",
          "How does India regulate GM organisms?",
          "What is the bioeconomy?",
          "Why is human genome editing ethically contested?",
        ],
      ),
    ],
  },
  {
    id: "sci-digital",
    subjectKey: "science",
    subject: "Science & Technology",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Science & Technology — IT, AI, semiconductors, cybersecurity and digital policy",
    title: "The Digital Frontier",
    blurb:
      "Computing is no longer a sector; it is the substrate of the economy. Understand AI, chips, data and cyber risk.",
    sources: [
      "MeitY policy documents",
      "NASSCOM and industry reports",
      "NCERT Class XII, Computer Science, selected chapters",
    ],
    references: [R.dst, R.wikiAI, R.certIn, R.pib],
    lessons: [
      L(
        "sci-digital-1",
        "AI, Machine Learning and the Data Economy",
        "AI vs ML vs deep learning; neural networks; training data; generative AI; large language models; AI applications; algorithmic bias; AI governance; data protection; digital public infrastructure.",
        [
          "A diagram of the AI/ML/deep-learning nested relationship.",
          "A simple neural-network diagram with input, hidden and output layers.",
        ],
        [
          "What is the difference between AI and machine learning?",
          "What is a large language model?",
          "How can AI be biased?",
          "What is India's approach to AI governance?",
        ],
      ),
      L(
        "sci-digital-2",
        "Semiconductors, Quantum and Advanced Computing",
        "Semiconductor supply chain; chip fabrication; India's semiconductor mission; quantum computing; qubits; quantum cryptography; supercomputing; cloud computing; edge computing; 5G and 6G.",
        [
          "A semiconductor value-chain diagram from design to packaging.",
          "A qubit vs classical bit conceptual diagram.",
        ],
        [
          "Why are semiconductors strategically important?",
          "What is a qubit?",
          "How does quantum cryptography differ from classical cryptography?",
          "What is India's semiconductor mission?",
        ],
      ),
      L(
        "sci-digital-3",
        "Cybersecurity and the Information Society",
        "Cyber threats (phishing, ransomware, APTs); critical-infrastructure protection; CERT-In; cyber laws; data breaches; misinformation; platform regulation; digital rights; international cyber norms.",
        [
          "A threat-landscape diagram from individual to critical infrastructure.",
          "A defence-in-depth diagram for cybersecurity.",
        ],
        [
          "What is an APT?",
          "What does CERT-In do?",
          "How does misinformation spread?",
          "What are international cyber norms?",
        ],
      ),
    ],
  },
  {
    id: "sci-energy-health",
    subjectKey: "science",
    subject: "Science & Technology",
    paper: "Prelims GS-I · Mains GS-III",
    syllabusNode: "Science & Technology — Energy, nuclear technology, materials and health",
    title: "Powering and Healing the Future",
    blurb:
      "Energy transitions and new materials are as much security policy as they are physics. This unit connects the lab to the grid and the hospital.",
    sources: [
      "Department of Atomic Energy and MNRE materials",
      "NCERT Class XII, Physics and Chemistry, selected chapters",
      "WHO and ICMR primers",
    ],
    references: [R.dst, R.wikiNuclear, R.pib, R.isro],
    lessons: [
      L(
        "sci-energy-1",
        "Nuclear Technology and Radiation",
        "Fission and fusion; reactors; uranium enrichment; heavy-water reactors; thorium cycle; nuclear waste; radiation and safety; nuclear medicine; India's three-stage programme; non-proliferation and safeguards.",
        [
          "A fission-chain-reaction diagram.",
          "A diagram of India's three-stage nuclear programme.",
        ],
        [
          "What is the difference between fission and fusion?",
          "Why is thorium important to India?",
          "How is nuclear waste managed?",
          "What are the stages of India's nuclear programme?",
        ],
      ),
      L(
        "sci-energy-2",
        "Renewable Energy and Storage",
        "Solar PV; wind; hydro; biomass; green hydrogen; fuel cells; battery storage; grid integration; smart grids; energy efficiency; critical minerals; energy transition policy.",
        [
          "A diagram of a solar-PV system from panel to grid.",
          "A chart of India's installed capacity by source.",
        ],
        [
          "How does a solar cell work?",
          "What is green hydrogen?",
          "Why is storage the hard problem of renewables?",
          "What are critical minerals?",
        ],
      ),
      L(
        "sci-energy-3",
        "Materials, Nanotechnology and Health Technology",
        "Nanomaterials; graphene; advanced materials; 3D printing; robotics; medical devices; telemedicine; AI in diagnosis; drug discovery; health data; regulation and ethics.",
        [
          "A scale diagram from millimetres to nanometres.",
          "A diagram of the medical-technology innovation pipeline.",
        ],
        [
          "What is nanotechnology?",
          "What is graphene?",
          "How can AI improve diagnosis?",
          "What are the risks of medical AI?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // ART, CULTURE & HERITAGE
  // ==========================================================================
  {
    id: "art-ancient",
    subjectKey: "culture",
    subject: "Art & Culture",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Art & Culture — Ancient art, literature and the foundations of Indian aesthetics",
    title: "The First Imaginings",
    blurb:
      "Before temples and courts, India painted caves, carved seals and sang hymns. These are the roots of an aesthetic tradition.",
    sources: [
      "NCERT Class XI, An Introduction to Indian Art",
      "ASI site reports",
      "IGNCA and Ministry of Culture resources",
    ],
    references: [R.asi, R.ignca, R.culture, R.wikiIndianCulture, R.sangeetNatak],
    lessons: [
      L(
        "art-ancient-1",
        "Prehistoric Art and Harappan Material Culture",
        "Bhimbetka and rock art; Harappan seals, pottery, beads and bronzes; the dancing girl; sculpture and terracotta; art as evidence of belief and trade; continuity and change.",
        [
          "A map of prehistoric rock-art sites.",
          "A line drawing of a Harappan seal with its motifs labelled.",
        ],
        [
          "What does Bhimbetka tell us about prehistoric life?",
          "What motifs appear on Harappan seals?",
          "What does the dancing girl bronze suggest?",
          "How does Harappan art differ from later Indian art?",
        ],
      ),
      L(
        "art-ancient-2",
        "Vedic Literature, Epics and Classical Texts",
        "Vedas, Upanishads, Puranas; Ramayana and Mahabharata; Sangam literature; Arthashastra; Natyashastra; grammar and philosophy; oral tradition and manuscript culture; the idea of shastra.",
        [
          "A timeline of major Sanskrit and Tamil texts.",
          "A diagram of the Vedic corpus and its branches.",
        ],
        [
          "What is the difference between shruti and smriti?",
          "Why is the Natyashastra important for performance?",
          "What is Sangam literature?",
          "How were texts preserved orally?",
        ],
      ),
      L(
        "art-ancient-3",
        "Buddhist, Jain and Early Hindu Art",
        "Stupas (Sanchi, Amaravati); chaityas and viharas; Gandhara and Mathura schools; Ajanta and Ellora; Jain art; early Hindu sculpture; iconography and mudras; the transition from aniconic to iconic representation.",
        [
          "A map of major Buddhist and Jain art sites.",
          "A diagram of stupa architecture with its parts labelled.",
        ],
        [
          "Why was early Buddhist art aniconic?",
          "How do Gandhara and Mathura styles differ?",
          "What is a chaitya?",
          "What does Ajanta tell us about everyday life?",
        ],
      ),
    ],
  },
  {
    id: "art-architecture",
    subjectKey: "culture",
    subject: "Art & Culture",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Art & Culture — Temple architecture, Indo-Islamic architecture and heritage",
    title: "Stone, Space and the Sacred",
    blurb:
      "Indian architecture is a conversation between materials, cosmology and power. Learn to read a temple, a mosque and a colonial building.",
    sources: [
      "NCERT Class XI, An Introduction to Indian Art",
      "ASI conservation reports",
      "UNESCO World Heritage descriptions",
    ],
    references: [R.asi, R.unescoIndia, R.wikiTempleArchitecture, R.culture, R.ignca],
    lessons: [
      L(
        "art-arch-1",
        "Nagara, Dravida and Vesara Temple Styles",
        "Temple anatomy (garbhagriha, mandapa, shikhara, vimana, gopuram); Nagara sub-styles (Odisha, Khajuraho, Solanki); Dravida; Vesara; rock-cut and structural temples; Chola bronzes; temple towns.",
        [
          "A labelled temple diagram comparing Nagara and Dravida forms.",
          "A map of major temple sites by style.",
        ],
        [
          "What is the difference between shikhara and vimana?",
          "What are the main Nagara sub-styles?",
          "How did Chola temples function as institutions?",
          "What is Vesara style?",
        ],
      ),
      L(
        "art-arch-2",
        "Indo-Islamic and Colonial Architecture",
        "Delhi Sultanate architecture; Mughal architecture (Agra Fort, Fatehpur Sikri, Taj Mahal); domes, arches, minarets, pietra dura; provincial styles; Rajput and Sikh architecture; colonial Gothic, Indo-Saracenic and modernism; Chandigarh.",
        [
          "A comparison diagram of trabeate and arcuate construction.",
          "A map of major Indo-Islamic and colonial monuments.",
        ],
        [
          "What is trabeate vs arcuate architecture?",
          "How did the Taj Mahal synthesise styles?",
          "What is Indo-Saracenic architecture?",
          "How did colonialism reshape Indian cities?",
        ],
      ),
      L(
        "art-arch-3",
        "Heritage Conservation and UNESCO Sites",
        "UNESCO World Heritage criteria; India's sites; ASI and AMASR Act; heritage cities; intangible heritage; GI tags; museum policy; heritage tourism; conservation vs development; restitution of antiquities.",
        [
          "A map of India's UNESCO World Heritage Sites.",
          "A diagram of the heritage-conservation ecosystem.",
        ],
        [
          "What are the criteria for a World Heritage Site?",
          "What is the AMASR Act?",
          "What is intangible cultural heritage?",
          "Why is heritage conservation politically difficult?",
        ],
      ),
    ],
  },
  {
    id: "art-performing",
    subjectKey: "culture",
    subject: "Art & Culture",
    paper: "Prelims GS-I · Mains GS-I",
    syllabusNode: "Art & Culture — Performing arts, festivals, crafts and living traditions",
    title: "The Living Arts",
    blurb:
      "Culture is not only in museums. It is danced, sung, painted, woven and celebrated. This unit maps India's living traditions.",
    sources: [
      "NCERT Class XI, An Introduction to Indian Art",
      "Sangeet Natak Akademi and Sahitya Akademi resources",
      "Ministry of Culture scheme documents",
    ],
    references: [R.sangeetNatak, R.sahitya, R.culture, R.ignca, R.unescoIndia],
    lessons: [
      L(
        "art-perf-1",
        "Classical Dance and Music",
        "Eight classical dance forms (Bharatanatyam, Kathak, Kathakali, Kuchipudi, Odissi, Manipuri, Mohiniyattam, Sattriya); rasa and abhinaya; Hindustani and Carnatic music; raga and tala; gharanas; instruments; guru-shishya tradition.",
        [
          "A map of India's classical dance forms.",
          "A diagram of the navarasa and their emotional registers.",
        ],
        [
          "What are the eight classical dance forms?",
          "What is rasa theory?",
          "How do Hindustani and Carnatic music differ?",
          "What is a gharana?",
        ],
      ),
      L(
        "art-perf-2",
        "Folk Arts, Theatre and Festivals",
        "Folk theatre (Tamasha, Nautanki, Bhavai, Jatra, Yakshagana); puppetry; martial arts; folk music; festivals and their regional meanings; fairs; ritual arts; tribal art; the economics of folk performers.",
        [
          "A map of major folk-theatre and festival traditions.",
          "A diagram of a festival's ritual, economic and social dimensions.",
        ],
        [
          "What is the difference between classical and folk performance?",
          "How does Yakshagana tell a story?",
          "What is the social role of a festival?",
          "Why are folk artists economically vulnerable?",
        ],
      ),
      L(
        "art-perf-3",
        "Crafts, GI Tags and Cultural Economies",
        "Handicrafts and handlooms; GI tags; textile traditions; pottery, metalwork, woodwork; craft clusters; design intervention; tourism; intellectual property; sustainability; the artisan economy.",
        [
          "A map of major craft clusters and GI-tagged products.",
          "A value-chain diagram for a handloom product.",
        ],
        [
          "What is a GI tag?",
          "Why are handlooms declining?",
          "How can design help artisans?",
          "What is the cultural economy?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // INDIAN SOCIETY & SOCIAL JUSTICE
  // ==========================================================================
  {
    id: "soc-diversity",
    subjectKey: "society",
    subject: "Society",
    paper: "Prelims GS-I · Mains GS-I · Mains GS-II",
    syllabusNode: "Society — Diversity, family, caste, gender and identity",
    title: "Many Indias, One Society",
    blurb:
      "India's diversity is not a problem to be solved; it is the material of its politics. Learn the structures that hold it together and pull it apart.",
    sources: [
      "NCERT Class XII, Indian Society",
      "NCERT Class XII, Social Change and Development in India",
      "Census and NFHS reports",
    ],
    references: [R.census, R.niti, R.wikiIndianSociety, R.wikiCaste, R.nhrc],
    lessons: [
      L(
        "soc-div-1",
        "Diversity, Region and Language",
        "Regional, linguistic, religious and ethnic diversity; unity in diversity; federal accommodation; language politics; Eighth Schedule; minority rights; cultural pluralism; the idea of India.",
        [
          "A map of India's major language families.",
          "A diagram of the constitutional protections for diversity.",
        ],
        [
          "What is the Eighth Schedule?",
          "How does federalism accommodate diversity?",
          "What are minority rights?",
          "Is 'unity in diversity' a description or an aspiration?",
        ],
      ),
      L(
        "soc-div-2",
        "Caste, Class and Social Stratification",
        "Varna and jati; caste and occupation; untouchability; reservation policy; Mandal Commission; creamy layer; caste census debate; class and caste intersection; social mobility; discrimination.",
        [
          "A diagram of varna, jati and class as distinct but linked systems.",
          "A timeline of reservation policy from 1950 to the present.",
        ],
        [
          "What is the difference between varna and jati?",
          "Why was the Mandal Commission controversial?",
          "What is the creamy-layer principle?",
          "How does caste intersect with class?",
        ],
      ),
      L(
        "soc-div-3",
        "Gender, Family and Population",
        "Patriarchy; gender roles; female labour-force participation; sex ratio; violence against women; family types; marriage; kinship; ageing; population policy; demographic transition; women's movements.",
        [
          "A diagram of patriarchy operating across family, market and state.",
          "A chart of sex ratio and female LFPR over time.",
        ],
        [
          "What is patriarchy?",
          "Why is female LFPR low in India?",
          "How is the family changing?",
          "What is the demographic transition?",
        ],
      ),
    ],
  },
  {
    id: "soc-inequalities",
    subjectKey: "society",
    subject: "Society",
    paper: "Prelims GS-I · Mains GS-I · Mains GS-II",
    syllabusNode: "Society — Poverty, development, urbanisation and social justice",
    title: "The Unfinished Promise",
    blurb:
      "Development creates winners and losers. This unit examines poverty, urbanisation and the institutions meant to protect the vulnerable.",
    sources: [
      "NCERT Class XII, Social Change and Development in India",
      "NITI Aayog and Census reports",
      "Ministry of Social Justice materials",
    ],
    references: [R.niti, R.census, R.nhrc, R.wikiUrbanisation, R.pib],
    lessons: [
      L(
        "soc-ineq-1",
        "Poverty, Hunger and Vulnerability",
        "Poverty concepts; measurement; hunger and malnutrition; NFSA; POSHAN; vulnerable groups (SC/ST, OBC, minorities, disabled, elderly, children); social exclusion; welfare schemes; dignity.",
        [
          "A diagram of the cycle of poverty and vulnerability.",
          "A chart of malnutrition indicators.",
        ],
        [
          "What is social exclusion?",
          "How does the NFSA protect the poor?",
          "Why is malnutrition persistent?",
          "Who are the most vulnerable groups?",
        ],
      ),
      L(
        "soc-ineq-2",
        "Urbanisation and Its Problems",
        "Urban growth; slums; housing; transport; water and sanitation; solid waste; urban flooding; municipal finance; master plans; smart cities; migration; informal labour; urban inequality.",
        [
          "A diagram of the urbanisation cycle and its pressures.",
          "A map of India's largest urban agglomerations.",
        ],
        [
          "Why is urbanisation inevitable?",
          "What causes urban flooding?",
          "Why are municipal finances weak?",
          "What is a smart city?",
        ],
      ),
      L(
        "soc-ineq-3",
        "Social Justice: Institutions and Movements",
        "Constitutional safeguards; NHRC; NCSC/NCST/NCW; affirmative action; social movements; civil society; NGOs; rights-based legislation; legal aid; the role of the state in social change.",
        [
          "A diagram of the social-justice institutional architecture.",
          "A timeline of rights-based legislation in India.",
        ],
        [
          "What is affirmative action?",
          "How does the NHRC work?",
          "What is rights-based legislation?",
          "Can social change be legislated?",
        ],
      ),
    ],
  },
  {
    id: "soc-change",
    subjectKey: "society",
    subject: "Society",
    paper: "Mains GS-I · Mains GS-II",
    syllabusNode: "Society — Globalisation, communalism, regionalism and secularism",
    title: "Forces That Pull and Bind",
    blurb:
      "Globalisation, communalism, regionalism and secularism are not abstract nouns. They are live forces shaping Indian politics and everyday life.",
    sources: [
      "NCERT Class XII, Social Change and Development in India",
      "Selected sociological writings",
      "PIB and NHRC materials",
    ],
    references: [R.wikiIndianSociety, R.nhrc, R.pib, R.census],
    lessons: [
      L(
        "soc-change-1",
        "Globalisation and Indian Society",
        "Economic liberalisation; global culture; media; consumption; migration; diaspora; inequality; local resistance; glocalisation; the internet and social change.",
        [
          "A diagram of globalisation's flows: goods, capital, people, ideas.",
          "A before-and-after diagram of the Indian middle class.",
        ],
        [
          "What is glocalisation?",
          "How has globalisation changed Indian families?",
          "Does globalisation increase inequality?",
          "What is the role of the diaspora?",
        ],
      ),
      L(
        "soc-change-2",
        "Communalism, Regionalism and Secularism",
        "Communalism: meaning and causes; secularism in the Indian Constitution; state neutrality vs equal respect; regionalism and sub-nationalism; language movements; separatism; national integration; communal violence and the law.",
        [
          "A diagram distinguishing Indian secularism from Western laïcité.",
          "A map of major regional movements in India.",
        ],
        [
          "What is Indian secularism?",
          "What causes communalism?",
          "How is regionalism different from separatism?",
          "Can the state be neutral between religions?",
        ],
      ),
      L(
        "soc-change-3",
        "Social Change, Education and the Media",
        "Education and social mobility; literacy; digital divide; media and public opinion; fake news; social media and polarisation; civil society; youth and aspiration; the sociology of change.",
        [
          "A diagram of the school-to-work transition and its inequalities.",
          "A media-ecosystem diagram from producers to platforms to citizens.",
        ],
        [
          "How does education drive social mobility?",
          "What is the digital divide?",
          "How does social media affect democracy?",
          "What is civil society?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // INTERNATIONAL RELATIONS
  // ==========================================================================
  {
    id: "ir-foundations",
    subjectKey: "ir",
    subject: "International Relations",
    paper: "Mains GS-II",
    syllabusNode: "IR — India's foreign policy, neighbourhood and strategic autonomy",
    title: "India in the World",
    blurb:
      "Foreign policy is the art of pursuing national interest in a world you do not control. Begin with India's neighbourhood and its strategic grammar.",
    sources: [
      "NCERT Class XII, Contemporary World Politics",
      "MEA annual reports and statements",
      "Selected strategic-affairs primers",
    ],
    references: [R.mea, R.un, R.wikiNAM, R.wikiQuad],
    lessons: [
      L(
        "ir-found-1",
        "Foundations of Indian Foreign Policy",
        "Panchsheel; Non-Aligned Movement; strategic autonomy; multi-alignment; nuclear policy; economic diplomacy; soft power; diaspora; the institutions of foreign policy-making.",
        [
          "A timeline of Indian foreign policy from 1947 to the present.",
          "A diagram of the pillars of strategic autonomy.",
        ],
        [
          "What is strategic autonomy?",
          "Why did India join NAM?",
          "What is multi-alignment?",
          "How does the diaspora shape foreign policy?",
        ],
      ),
      L(
        "ir-found-2",
        "India's Neighbourhood",
        "Pakistan; China; Bangladesh; Nepal; Sri Lanka; Bhutan; Myanmar; Afghanistan; Maldives; neighbourhood-first policy; border disputes; connectivity; water-sharing; security dilemmas; SAARC and BIMSTEC.",
        [
          "A map of India's neighbours with major disputes and corridors.",
          "A diagram of India's neighbourhood policy instruments.",
        ],
        [
          "Why is the neighbourhood central to Indian security?",
          "What are the main India-China disputes?",
          "How does water-sharing affect India-Bangladesh ties?",
          "Why has SAARC been ineffective?",
        ],
      ),
      L(
        "ir-found-3",
        "Great Powers and Strategic Partnerships",
        "India-US relations; India-Russia; India-China; India-EU; India-Japan; Quad; BRICS; SCO; defence purchases; technology partnerships; trade disputes; balancing and hedging.",
        [
          "A map of India's major strategic partnerships.",
          "A diagram of India's balancing act among the US, Russia and China.",
        ],
        [
          "Why is the Quad important to India?",
          "How has India-Russia relations changed?",
          "What is hedging in foreign policy?",
          "What are the limits of strategic partnerships?",
        ],
      ),
    ],
  },
  {
    id: "ir-global",
    subjectKey: "ir",
    subject: "International Relations",
    paper: "Mains GS-II",
    syllabusNode: "IR — Global governance, groupings and the Global South",
    title: "The Global Commons",
    blurb:
      "Climate, trade, security and health are governed through institutions India did not design but must navigate. This unit maps that architecture.",
    sources: [
      "NCERT Class XII, Contemporary World Politics",
      "UN, WTO and IMF primers",
      "MEA multilateral documents",
    ],
    references: [R.un, R.wto, R.imf, R.wikiUNSC, R.mea],
    lessons: [
      L(
        "ir-global-1",
        "The United Nations and Multilateral Reform",
        "UN organs; Security Council; General Assembly; ECOSOC; peacekeeping; India's UNSC bid; G4; veto; reform proposals; UN funding; the UN's limits.",
        [
          "A diagram of the six principal organs of the UN.",
          "A table of UNSC reform proposals and India's position.",
        ],
        [
          "Why does India want a permanent UNSC seat?",
          "What is the G4?",
          "How does peacekeeping work?",
          "Why is UNSC reform so difficult?",
        ],
      ),
      L(
        "ir-global-2",
        "Groupings of the Global South",
        "BRICS; IBSA; G20; SCO; ASEAN; African Union; Commonwealth; NAM; Voice of the Global South; development finance; south-south cooperation; India's leadership ambitions.",
        [
          "A map of major plurilateral groupings and their members.",
          "A diagram of India's overlapping memberships.",
        ],
        [
          "What is the Global South?",
          "How did India use its G20 presidency?",
          "What is south-south cooperation?",
          "Why are overlapping groupings useful?",
        ],
      ),
      L(
        "ir-global-3",
        "Global Governance: Trade, Climate, Health and Security",
        "WTO; IMF and World Bank; UNFCCC; WHO; FATF; IAEA; global public goods; reform of multilateral institutions; sanctions; international law; India's role in rule-making.",
        [
          "A table of global-governance regimes and India's engagement.",
          "A diagram of the global-public-goods problem.",
        ],
        [
          "What are global public goods?",
          "How does the FATF affect India?",
          "Why is WTO dispute settlement in crisis?",
          "How can India shape global rules?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // ETHICS, INTEGRITY & APTITUDE
  // ==========================================================================
  {
    id: "eth-foundations",
    subjectKey: "ethics",
    subject: "Ethics",
    paper: "Mains GS-IV",
    syllabusNode: "Ethics — Human interface, values, attitude and emotional intelligence",
    title: "The Inner Compass",
    blurb:
      "Ethics is not a list of answers. It is the discipline of asking better questions when the rulebook runs out.",
    sources: [
      "NCERT Class XI, Indian Constitution at Work, rights and ethics chapters",
      "Selected writings on ethics and public administration",
      "Second ARC, ethics in governance",
    ],
    references: [R.wikiEthics, R.wikiEmotionalIntelligence, R.wikiIntegrity, R.nhrc],
    lessons: [
      L(
        "eth-found-1",
        "Ethics, Values and Human Action",
        "Ethics and morality; determinants of ethical action; consequences and intentions; deontology, utilitarianism and virtue ethics; ethics in private and public relationships; human values; family, society and education.",
        [
          "A diagram of the ethics triangle: agent, action, consequence.",
          "A comparison table of deontology, utilitarianism and virtue ethics.",
        ],
        [
          "What makes an action ethical?",
          "What is the difference between ethics and morality?",
          "How do private and public ethics differ?",
          "Can values be taught?",
        ],
      ),
      L(
        "eth-found-2",
        "Attitude, Aptitude and Emotional Intelligence",
        "Attitude content and structure; moral and political attitudes; social influence and persuasion; foundational values for civil service; integrity, impartiality, objectivity, empathy; emotional intelligence and its administrative uses.",
        [
          "A diagram of the ABC model of attitudes (affect, behaviour, cognition).",
          "A diagram of emotional-intelligence competencies.",
        ],
        [
          "What is the difference between attitude and aptitude?",
          "Why is empathy a civil-service value?",
          "How does emotional intelligence improve administration?",
          "What is moral persuasion?",
        ],
      ),
      L(
        "eth-found-3",
        "Moral Thinkers and Ethical Traditions",
        "Indian thinkers (Kautilya, Buddha, Mahavira, Gandhi, Ambedkar, Tagore); Western thinkers (Socrates, Kant, Mill, Rawls, Arendt); ideas of duty, justice, liberty and care; applying thinkers to administrative dilemmas.",
        [
          "A map of moral thinkers and their core ideas.",
          "A dilemma worksheet applying three ethical frameworks.",
        ],
        [
          "What did Kautilya say about statecraft and ethics?",
          "How does Kant's categorical imperative work?",
          "What is Rawls's veil of ignorance?",
          "How can thinkers help in a real administrative dilemma?",
        ],
      ),
    ],
  },
  {
    id: "eth-governance",
    subjectKey: "ethics",
    subject: "Ethics",
    paper: "Mains GS-IV",
    syllabusNode: "Ethics — Probity in governance, accountability and case studies",
    title: "Ethics in the Corridors of Power",
    blurb:
      "Public ethics is tested where discretion meets pressure. Learn the institutions of probity and practise the case-study method.",
    sources: [
      "Second ARC, Ethics in Governance",
      "RTI Act and Lokpal Act",
      "Selected case studies",
    ],
    references: [R.cic, R.nhrc, R.wikiIntegrity, R.pib, R.constitution],
    lessons: [
      L(
        "eth-gov-1",
        "Probity, Accountability and Anti-Corruption",
        "Concept of public service; probity; ethical governance; codes of ethics and conduct; citizen charters; RTI; Lokpal; CVC; whistleblower protection; conflict of interest; corruption and its causes.",
        [
          "A diagram of the probity ecosystem: rules, institutions, culture.",
          "A flowchart of a corruption complaint through the CVC/Lokpal.",
        ],
        [
          "What is probity in governance?",
          "How does the Lokpal work?",
          "What is a conflict of interest?",
          "Why do codes of conduct fail?",
        ],
      ),
      L(
        "eth-gov-2",
        "Ethical Dilemmas in Administration",
        "Dilemmas of loyalty vs conscience; rule-following vs public interest; discretion; political pressure; whistleblowing; resource allocation; disaster response; technology and privacy; ethical leadership.",
        [
          "A dilemma-analysis framework: facts, stakeholders, values, options, consequences.",
          "A diagram of pressures on a civil servant.",
        ],
        [
          "How should a civil servant handle political pressure?",
          "When is whistleblowing justified?",
          "How do you allocate scarce resources fairly?",
          "What is ethical leadership?",
        ],
      ),
      L(
        "eth-gov-3",
        "Case Studies: Method and Practice",
        "How to read a case study; identifying the ethical issue; stakeholders; competing values; options and consequences; decision and justification; communication; typical UPSC case patterns.",
        [
          "A case-study answer template with sections.",
          "A worked case study showing options and trade-offs.",
        ],
        [
          "How do you structure a case-study answer?",
          "How do you weigh competing values?",
          "What makes a justification convincing?",
          "How should a decision be communicated?",
        ],
      ),
    ],
  },

  // ==========================================================================
  // INTERNAL SECURITY & DISASTER MANAGEMENT
  // ==========================================================================
  {
    id: "sec-internal",
    subjectKey: "security",
    subject: "Internal Security",
    paper: "Mains GS-III",
    syllabusNode: "Security — Internal security, extremism, terrorism and border management",
    title: "The Security Within",
    blurb:
      "Internal security is not only policing. It is development, federalism, intelligence, technology and the legitimacy of the state.",
    sources: [
      "MHA annual reports",
      "NCERT Class XII, Contemporary World Politics, security chapters",
      "Selected security studies",
    ],
    references: [R.mha, R.wikiInternalSecurity, R.pib, R.un],
    lessons: [
      L(
        "sec-int-1",
        "Left-Wing Extremism and Insurgency",
        "LWE causes and geography; Red Corridor; SAMADHAN doctrine; development vs security; tribal rights; Northeast insurgencies; AFSPA; peace accords; intelligence and policing.",
        [
          "A map of the Red Corridor and major insurgency regions.",
          "A diagram of the development-security nexus.",
        ],
        [
          "What causes left-wing extremism?",
          "What is the SAMADHAN doctrine?",
          "Why is AFSPA controversial?",
          "How have peace accords changed the Northeast?",
        ],
      ),
      L(
        "sec-int-2",
        "Terrorism, Radicalisation and Organised Crime",
        "Terrorism types and financing; radicalisation; NIA; UAPA; intelligence coordination; organised crime; money laundering; narco-trafficking; border management; coastal security; public order.",
        [
          "A diagram of the terror-financing chain.",
          "A map of India's border-management challenges.",
        ],
        [
          "How is terrorism financed?",
          "What does the NIA do?",
          "How are organised crime and terrorism linked?",
          "Why is coastal security difficult?",
        ],
      ),
      L(
        "sec-int-3",
        "Security Forces, Intelligence and Civil-Military Relations",
        "Army, paramilitary and police roles; CAPFs; intelligence agencies; civil-military relations; defence procurement; strategic culture; accountability; human rights; police reform.",
        [
          "A table of security forces and their mandates.",
          "A diagram of intelligence and security coordination.",
        ],
        [
          "What is the difference between the army and CAPFs?",
          "Why is police reform difficult?",
          "What is civil-military relations?",
          "How can security forces be held accountable?",
        ],
      ),
    ],
  },
  {
    id: "sec-cyber",
    subjectKey: "security",
    subject: "Internal Security",
    paper: "Mains GS-III",
    syllabusNode: "Security — Cyber security, communication networks and economic security",
    title: "The Fifth Domain",
    blurb:
      "Cyber space is now a domain of conflict, crime and commerce. India's security depends on resilience as much as firewalls.",
    sources: [
      "CERT-In and MeitY reports",
      "National Cyber Security Policy",
      "Selected security studies",
    ],
    references: [R.certIn, R.wikiCyberSecurity, R.mha, R.pib],
    lessons: [
      L(
        "sec-cyber-1",
        "Cyber Threats and Critical Infrastructure",
        "Malware, ransomware, phishing, DDoS; APTs; critical information infrastructure; NCIIPC; CERT-In; cyber drills; supply-chain attacks; cyber insurance; incident response.",
        [
          "A threat-actor diagram from script kiddies to state-backed APTs.",
          "A critical-infrastructure dependency map.",
        ],
        [
          "What is an advanced persistent threat?",
          "What is critical information infrastructure?",
          "How does CERT-In respond to an incident?",
          "Why is the supply chain a cyber risk?",
        ],
      ),
      L(
        "sec-cyber-2",
        "Cyber Law, Data and Economic Security",
        "IT Act; data protection; cybercrime investigation; jurisdiction; encryption; social media regulation; misinformation; money laundering online; digital payments fraud; international cyber norms.",
        [
          "A diagram of India's cyber-law and governance framework.",
          "A fraud-chain diagram for a digital-payment scam.",
        ],
        [
          "What does the IT Act cover?",
          "How can cybercrime be investigated across borders?",
          "What is the debate over encryption?",
          "How can digital-payment fraud be reduced?",
        ],
      ),
    ],
  },
  {
    id: "sec-disaster",
    subjectKey: "security",
    subject: "Disaster Management",
    paper: "Mains GS-III",
    syllabusNode: "Disaster Management — Types, institutions, preparedness and climate risk",
    title: "When the Unthinkable Happens",
    blurb:
      "Disasters are not natural; hazards are. The difference is preparedness, institutions and the choices we make before the event.",
    sources: [
      "NDMA guidelines",
      "MHA disaster-management reports",
      "Selected climate-risk studies",
    ],
    references: [R.ndma, R.mha, R.imd, R.wikiDisasterManagement, R.un],
    lessons: [
      L(
        "sec-dis-1",
        "Disaster Types and the Hazard Cycle",
        "Natural and man-made disasters; hazard, vulnerability and risk; disaster-management cycle (mitigation, preparedness, response, recovery); earthquakes, floods, cyclones, droughts, landslides, heat waves; industrial and chemical disasters.",
        [
          "A disaster-management cycle diagram.",
          "A risk equation diagram: hazard × exposure × vulnerability.",
        ],
        [
          "What is the difference between a hazard and a disaster?",
          "What are the phases of disaster management?",
          "Why is vulnerability social?",
          "Which hazards are increasing in India?",
        ],
      ),
      L(
        "sec-dis-2",
        "Institutions and Governance",
        "NDMA, SDMA, DDMA; NDRF; National Disaster Management Plan; early warning; disaster response funds; insurance; building codes; Sendai Framework; community-based disaster management; role of the armed forces.",
        [
          "A diagram of India's disaster-management institutional hierarchy.",
          "A timeline of a disaster response from warning to recovery.",
        ],
        [
          "What does the NDMA do?",
          "How does the NDRF operate?",
          "What is the Sendai Framework?",
          "Why are building codes important?",
        ],
      ),
      L(
        "sec-dis-3",
        "Climate Change and Disaster Risk",
        "Climate extremes; attribution; heat waves; urban flooding; coastal erosion; glacial lake outburst floods; drought; migration; adaptation; disaster risk financing; resilient infrastructure; the future of risk.",
        [
          "A diagram linking climate change to hazard frequency and intensity.",
          "A map of India's multi-hazard vulnerability.",
        ],
        [
          "How does climate change affect disaster risk?",
          "Why are urban floods increasing?",
          "What is a GLOF?",
          "How can disaster risk be financed?",
        ],
      ),
    ],
  },
];

// The published curriculum interleaves each subject's first-pass units with its
// expansion units, so the series stays subject-by-subject instead of jumping
// across the syllabus twice.
export const CURRICULUM: SeriesUnit[] = SERIES_SUBJECTS.flatMap((subject) => [
  ...BASE_CURRICULUM.filter((unit) => unit.subjectKey === subject.key),
  ...(EXPANSION_UNITS[subject.key] ?? []),
]);