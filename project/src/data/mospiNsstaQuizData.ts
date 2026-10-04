/**
 * MoSPI & NSSTA Quiz Question Bank
 * ──────────────────────────────────────────────────────────────────────
 * Curated quiz questions derived from official MoSPI publications and
 * NSSTA (National Statistical Systems Training Academy) curriculum.
 *
 * Sources referenced:
 *  - MoSPI Statistical Yearbook India
 *  - National Accounts Statistics (NAS)
 *  - Periodic Labour Force Survey (PLFS)
 *  - Consumer Price Index (CPI) methodology
 *  - Index of Industrial Production (IIP)
 *  - Annual Survey of Industries (ASI)
 *  - NSSTA Training Modules (Sampling, SNA, Price Statistics, Data Quality)
 *  - Sustainable Development Goals (SDG) India Index by MoSPI
 *  - eSankhyiki portal / Data Governance Quality Assurance Framework
 *
 * Each question includes:
 *  - source: 'mospi' or 'nssta' to indicate origin
 *  - sourcePublication: specific publication or training module
 *  - competencyTag: maps to existing competency IDs (c1–c8)
 */

import type { Difficulty } from '@/types';

export interface MospiNsstaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  explanation: string;
  source: 'mospi' | 'nssta';
  sourcePublication: string;
  competencyTag: string;
  topic: string;
}

// ─── MoSPI Publication-Based Questions ─────────────────────────────────────

export const mospiQuestions: MospiNsstaQuestion[] = [
  // ── National Accounts Statistics (NAS) ────────────────────────────────
  {
    id: 'mospi-nas-001',
    question: "According to MoSPI's National Accounts Statistics, India's GDP is compiled using which base year as of the latest revision?",
    options: [
      "2004-05",
      "2011-12",
      "2017-18",
      "2000-01",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "India's GDP series was most recently revised to the base year 2011-12 by the Central Statistics Office (CSO) under MoSPI. This revision adopted the SNA 2008 framework and introduced changes like using the corporate affairs database (MCA-21) for estimating private corporate sector GVA.",
    source: 'mospi',
    sourcePublication: "National Accounts Statistics (NAS) — Base Year Revision",
    competencyTag: 'c7',
    topic: "National Accounts",
  },
  {
    id: 'mospi-nas-002',
    question: "In the System of National Accounts followed by MoSPI, which of the following is NOT one of the three approaches to measuring GDP?",
    options: [
      "Production (Output) Approach",
      "Expenditure Approach",
      "Income Approach",
      "Monetary Circulation Approach",
    ],
    correctAnswer: 3,
    difficulty: 'easy',
    explanation: "The three standard approaches to measuring GDP under SNA are: (1) Production/Output approach (GVA at basic prices), (2) Expenditure approach (final consumption + GFCF + net exports), and (3) Income approach (sum of factor incomes). The \"Monetary Circulation Approach\" is not a recognized method.",
    source: 'mospi',
    sourcePublication: "National Accounts Statistics — Methodology Document",
    competencyTag: 'c7',
    topic: "National Accounts",
  },
  {
    id: 'mospi-nas-003',
    question: "What does GVA stand for in the context of MoSPI's National Accounts Statistics?",
    options: [
      "Gross Value Added",
      "General Variance Analysis",
      "Government Value Assessment",
      "Gross Volume Aggregate",
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: "GVA stands for Gross Value Added. It measures the value of goods and services produced in an area, industry, or sector minus the cost of inputs and raw materials. GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies.",
    source: 'mospi',
    sourcePublication: "National Accounts Statistics — Key Indicators",
    competencyTag: 'c7',
    topic: "National Accounts",
  },
  {
    id: 'mospi-nas-004',
    question: "According to NAS methodology, what is the relationship between GDP at market prices and GVA at basic prices?",
    options: [
      "GDP at market prices = GVA at basic prices − Product Taxes + Product Subsidies",
      "GDP at market prices = GVA at basic prices + Product Taxes − Product Subsidies",
      "GDP at market prices = GVA at basic prices × Deflator Index",
      "They are identical measures",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "The NAS relationship is: GDP at market prices = GVA at basic prices + Product Taxes − Product Subsidies. Product taxes (like GST, customs duties) are added while product subsidies (like food and fertilizer subsidies) are subtracted to arrive at the market price valuation.",
    source: 'mospi',
    sourcePublication: "National Accounts Statistics — GDP Compilation Methodology",
    competencyTag: 'c7',
    topic: "National Accounts",
  },
  {
    id: 'mospi-nas-005',
    question: "In MoSPI's NAS framework, which sector classification system is used to organize economic activities for GDP compilation?",
    options: [
      "Standard Industrial Classification (SIC)",
      "National Industrial Classification (NIC)",
      "International Standard Industrial Classification (ISIC) directly",
      "Harmonized System (HS) Codes",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "MoSPI uses the National Industrial Classification (NIC) for organizing economic activities. The NIC is broadly based on the ISIC framework of the United Nations but adapted for Indian economic conditions. NIC-2008 is the current version used alongside the base year 2011-12.",
    source: 'mospi',
    sourcePublication: "National Accounts Statistics — Classification Standards",
    competencyTag: 'c7',
    topic: "National Accounts",
  },

  // ── Periodic Labour Force Survey (PLFS) ───────────────────────────────
  {
    id: 'mospi-plfs-001',
    question: "The Periodic Labour Force Survey (PLFS) conducted by MoSPI uses which sampling design for rural areas?",
    options: [
      "Simple Random Sampling",
      "Two-stage stratified sampling with census villages as First Stage Units (FSUs)",
      "Systematic sampling with random start",
      "Cluster sampling without stratification",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "The PLFS uses a two-stage stratified design in rural areas. Census villages serve as FSUs (First Stage Units) in the first stage, and households within selected villages are the Ultimate Stage Units (USUs) in the second stage. Villages are stratified by population size and selected with probability proportional to size (PPS).",
    source: 'mospi',
    sourcePublication: "Periodic Labour Force Survey — Annual Report & Methodology",
    competencyTag: 'c1',
    topic: "Sampling Design",
  },
  {
    id: 'mospi-plfs-002',
    question: "What is the rotation pattern used in the PLFS for urban panels?",
    options: [
      "Complete replacement every quarter",
      "Rotation panel scheme where 25% of sample is replaced each quarter (4-panel rotation)",
      "50% replacement every 6 months",
      "No rotation — same households throughout",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "The PLFS follows a rotational panel design in urban areas where the sample is divided into 4 panels. Each quarter, one panel (25%) is replaced with a new panel, creating overlap for quarter-on-quarter estimation while ensuring fresh representation. This balances survey burden with statistical efficiency.",
    source: 'mospi',
    sourcePublication: "Periodic Labour Force Survey — Survey Design Document",
    competencyTag: 'c1',
    topic: "Sampling Design",
  },
  {
    id: 'mospi-plfs-003',
    question: "The PLFS classifies the labour force status using which approach?",
    options: [
      "Only the Usual Status (principal + subsidiary) approach",
      "Only the Current Weekly Status (CWS) approach",
      "Both Usual Status and Current Weekly Status approaches",
      "Only the Current Daily Status (CDS) approach",
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The PLFS provides estimates using multiple reference periods: Usual Status (principal + subsidiary, reference period of 365 days) and Current Weekly Status (CWS, reference period of 7 days). The annual report includes both, providing a comprehensive view of labour market dynamics.",
    source: 'mospi',
    sourcePublication: "Periodic Labour Force Survey — Key Indicators",
    competencyTag: 'c2',
    topic: "Statistical Methods",
  },
  {
    id: 'mospi-plfs-004',
    question: "In PLFS terminology, the Labour Force Participation Rate (LFPR) is defined as:",
    options: [
      "The percentage of employed persons in the total population",
      "The percentage of persons in the labour force (employed + unemployed) in the working-age population",
      "The ratio of unemployed to employed persons",
      "The percentage of persons who worked at least one hour in the reference week",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "LFPR is the percentage of the population that is either employed or seeking employment (i.e., in the labour force) relative to the working-age population. This includes both employed persons and those actively looking for work (unemployed).",
    source: 'mospi',
    sourcePublication: "Periodic Labour Force Survey — Definitions & Concepts",
    competencyTag: 'c2',
    topic: "Statistical Methods",
  },

  // ── Consumer Price Index (CPI) ────────────────────────────────────────
  {
    id: 'mospi-cpi-001',
    question: "MoSPI compiles the Consumer Price Index (CPI) with which base year for the current series?",
    options: [
      "2010 = 100",
      "2012 = 100",
      "2015 = 100",
      "2001 = 100",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The current CPI series compiled by MoSPI (CSO) uses 2012 = 100 as the base year. CPI is compiled for three categories: CPI (Combined), CPI (Rural), and CPI (Urban), with data collected from 310 towns and 1181 villages across the country.",
    source: 'mospi',
    sourcePublication: "Consumer Price Index — Methodology & Base Year Document",
    competencyTag: 'c2',
    topic: "Price Statistics",
  },
  {
    id: 'mospi-cpi-002',
    question: "Which weighting methodology does MoSPI use for the Consumer Price Index?",
    options: [
      "Equal weights for all commodity groups",
      "Expenditure weights derived from the Consumer Expenditure Survey (CES)",
      "Production-based weights from the Annual Survey of Industries",
      "Import-export trade volume weights",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "CPI item weights are derived from the Consumer Expenditure Survey (CES) conducted by NSSO/NSO. The CES provides household consumption expenditure patterns which determine the relative importance (weight) of each item group in the CPI basket.",
    source: 'mospi',
    sourcePublication: "CPI — Weighting Diagram & Methodology",
    competencyTag: 'c2',
    topic: "Price Statistics",
  },
  {
    id: 'mospi-cpi-003',
    question: "The CPI (Combined) inflation rate published by MoSPI is calculated as:",
    options: [
      "The absolute change in the index value from the previous month",
      "The year-on-year percentage change in the CPI index",
      "The ratio of CPI to WPI for the same month",
      "The geometric mean of price relatives for the current month",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "CPI inflation rate is calculated as the year-on-year (YoY) percentage change: ((CPI_current_month − CPI_same_month_previous_year) / CPI_same_month_previous_year) × 100. This measures how consumer prices have changed over a 12-month period.",
    source: 'mospi',
    sourcePublication: "CPI Press Release — Methodology Notes",
    competencyTag: 'c2',
    topic: "Price Statistics",
  },

  // ── Index of Industrial Production (IIP) ──────────────────────────────
  {
    id: 'mospi-iip-001',
    question: "The Index of Industrial Production (IIP) published by MoSPI covers which sectors?",
    options: [
      "Only Manufacturing",
      "Manufacturing, Mining, and Electricity",
      "Manufacturing, Agriculture, and Services",
      "Mining, Construction, and Transport",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "The IIP covers three broad sectors: Mining, Manufacturing, and Electricity. Manufacturing has the largest weight. The IIP provides a broad-based indicator of the physical volume of production in the industrial sector. The current base year is 2011-12.",
    source: 'mospi',
    sourcePublication: "Index of Industrial Production — Methodology Document",
    competencyTag: 'c7',
    topic: "Economic Indicators",
  },
  {
    id: 'mospi-iip-002',
    question: "In the IIP methodology, what type of index formula is used for computation?",
    options: [
      "Paasche index",
      "Fisher ideal index",
      "Laspeyres index with fixed base-year weights",
      "Divisia index",
    ],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: "The IIP uses a Laspeyres index with fixed base-year weights. The Laspeyres formula uses base-period quantities as weights: IIP = Σ(w_i × q_i_t / q_i_0) × 100, where w_i are base-year weights and q represents quantities in the current and base periods respectively.",
    source: 'mospi',
    sourcePublication: "IIP — Technical Methodology Notes",
    competencyTag: 'c2',
    topic: "Statistical Methods",
  },

  // ── Statistical Yearbook India ────────────────────────────────────────
  {
    id: 'mospi-syb-001',
    question: "MoSPI's Statistical Yearbook India is best described as:",
    options: [
      "A monthly bulletin of price statistics",
      "A comprehensive annual compendium of socio-economic statistics across sectors",
      "A report exclusively on population census data",
      "A quarterly report on industrial output",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "The Statistical Yearbook India (formerly \"Statistical Abstract\") is a comprehensive annual publication by MoSPI that covers data across sectors including population, health, education, employment, agriculture, industry, trade, environment, and more. It serves as a primary reference for India\\'s official statistics.",
    source: 'mospi',
    sourcePublication: "Statistical Yearbook India — Preface & Contents",
    competencyTag: 'c7',
    topic: "Official Statistics",
  },
  {
    id: 'mospi-syb-002',
    question: "Which of the following is a major data source that MoSPI coordinates for the Statistical Yearbook compilation?",
    options: [
      "Only Reserve Bank of India (RBI) data",
      "Data from multiple ministries, departments, and state governments",
      "Only Census of India data",
      "Only NITI Aayog reports",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "The Statistical Yearbook draws from multiple government sources — various ministries (Agriculture, Commerce, Health, etc.), departments, state statistical bureaus, RBI, DGCI&S, and other organizations. MoSPI coordinates and compiles these into a unified publication.",
    source: 'mospi',
    sourcePublication: "Statistical Yearbook India — Sources & Compilation",
    competencyTag: 'c7',
    topic: "Official Statistics",
  },

  // ── Annual Survey of Industries (ASI) ─────────────────────────────────
  {
    id: 'mospi-asi-001',
    question: "The Annual Survey of Industries (ASI) conducted under MoSPI covers factories registered under which Act?",
    options: [
      "Companies Act, 2013",
      "Factories Act, 1948 (employing 10+ workers with power or 20+ without power)",
      "Industries (Development and Regulation) Act, 1951",
      "Small Industries Development Organisation (SIDO) Act",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The ASI covers all factories registered under sections 2m(i) and 2m(ii) of the Factories Act, 1948 — factories employing 10 or more workers using power, and those employing 20 or more workers without power. It is the principal source of industrial statistics in India.",
    source: 'mospi',
    sourcePublication: "Annual Survey of Industries — Methodology & Coverage",
    competencyTag: 'c1',
    topic: "Survey Design",
  },
  {
    id: 'mospi-asi-002',
    question: "In the ASI sampling framework, the census sector includes:",
    options: [
      "All factories with 50 or fewer workers",
      "All factories employing 100 or more workers (completely enumerated)",
      "Only government-owned factories",
      "Only factories in Special Economic Zones",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "The ASI divides the factory frame into census and sample sectors. The census sector includes all factories employing 100 or more workers — these are completely enumerated every year. The sample sector (factories with fewer than 100 workers) uses a stratified circular systematic sampling scheme.",
    source: 'mospi',
    sourcePublication: "Annual Survey of Industries — Sampling Design",
    competencyTag: 'c1',
    topic: "Sampling Design",
  },

  // ── SDG India Index ────────────────────────────────────────────────────
  {
    id: 'mospi-sdg-001',
    question: "MoSPI plays a key role in monitoring India's Sustainable Development Goals (SDGs). The SDG India Index measures progress using:",
    options: [
      "A single composite score on a 0–100 scale for each state/UT across multiple goals",
      "Only Goal 1 (No Poverty) and Goal 2 (Zero Hunger)",
      "Exclusively international datasets from the United Nations",
      "A binary pass/fail assessment for each goal",
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: "The SDG India Index (published by NITI Aayog with MoSPI support for the National Indicator Framework) provides composite scores on a 0–100 scale for each state and UT. States are classified as Aspirant (0–49), Performer (50–64), Front Runner (65–99), or Achiever (100) for each goal.",
    source: 'mospi',
    sourcePublication: "SDG National Indicator Framework — MoSPI Coordination",
    competencyTag: 'c4',
    topic: "Data Visualization",
  },

  // ── Data Governance & eSankhyiki ──────────────────────────────────────
  {
    id: 'mospi-dg-001',
    question: "MoSPI's eSankhyiki portal is primarily designed to:",
    options: [
      "Replace all state-level statistical offices",
      "Provide a centralized digital platform for accessing macro-level statistical indicators and datasets",
      "Conduct online surveys replacing field enumeration",
      "Serve as an e-commerce platform for statistical publications",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "The eSankhyiki portal (esankhyiki.mospi.gov.in) is MoSPI's centralized data dissemination platform. It provides access to macro-level indicators from the Economic Census, national accounts, price statistics, and other official datasets in downloadable formats (CSV, Excel) for researchers, policymakers, and the public.",
    source: 'mospi',
    sourcePublication: "eSankhyiki Portal — User Guide",
    competencyTag: 'c4',
    topic: "Data Visualization",
  },
  {
    id: 'mospi-dg-002',
    question: "In MoSPI's data quality framework, which dimension assesses whether statistical data are produced and disseminated in a timely manner?",
    options: [
      "Relevance",
      "Accuracy",
      "Timeliness and Punctuality",
      "Comparability",
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "Timeliness and Punctuality is one of the key dimensions in the data quality framework. Timeliness refers to the lag between the reference period and the availability of results, while punctuality measures whether data are released on the dates announced in advance. Other dimensions include relevance, accuracy, coherence, accessibility, and comparability.",
    source: 'mospi',
    sourcePublication: "MoSPI Data Quality Assurance Framework (DQAF)",
    competencyTag: 'c8',
    topic: "Data Quality",
  },

  // ── Economic Census ───────────────────────────────────────────────────
  {
    id: 'mospi-ec-001',
    question: "The Economic Census conducted by MoSPI is a complete enumeration of all:",
    options: [
      "Households in the country",
      "Establishments/enterprises engaged in economic activity (excluding crop production)",
      "Government offices only",
      "Only manufacturing units with more than 10 workers",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The Economic Census is a complete count of all establishments (including those in the informal/unorganized sector) engaged in any economic activity other than crop production and plantation. It provides the frame for designing sample surveys and detailed follow-up surveys for the unorganized sector.",
    source: 'mospi',
    sourcePublication: "Economic Census — Methodology & Coverage",
    competencyTag: 'c1',
    topic: "Data Collection",
  },
];

// ─── NSSTA Training Curriculum-Based Questions ─────────────────────────────

export const nsstaQuestions: MospiNsstaQuestion[] = [
  // ── Sampling Theory & Methods ─────────────────────────────────────────
  {
    id: 'nssta-samp-001',
    question: "In the NSSTA curriculum on sampling theory, the \"design effect\" (deff) is defined as:",
    options: [
      "The ratio of the variance under the actual design to the variance under simple random sampling of the same size",
      "The reduction in bias achieved by stratification",
      "The number of stages in a multi-stage design",
      "The total cost of the survey design",
    ],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: "The design effect (deff) = Var(estimator under actual design) / Var(estimator under SRS of same sample size). A deff > 1 indicates the design is less efficient than SRS (common in cluster sampling), while deff < 1 indicates greater efficiency (common in stratified sampling with optimum allocation).",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Sampling Theory & Design",
    competencyTag: 'c1',
    topic: "Sampling Design",
  },
  {
    id: 'nssta-samp-002',
    question: "Under Neyman allocation in stratified sampling (NSSTA curriculum), sample allocation to each stratum is proportional to:",
    options: [
      "The stratum population size only",
      "The product of stratum population size and stratum standard deviation",
      "The inverse of stratum variance",
      "The geographic area of the stratum",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "Neyman (optimum) allocation assigns sample sizes proportional to N_h × S_h (stratum size × stratum standard deviation). This minimizes the variance of the estimator for a fixed total sample size. If costs vary by stratum, Neyman allocation is further modified to account for per-unit costs.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Sampling Theory & Design",
    competencyTag: 'c1',
    topic: "Sampling Design",
  },
  {
    id: 'nssta-samp-003',
    question: "In cluster sampling as taught in NSSTA modules, the intra-class correlation coefficient (ρ) measures:",
    options: [
      "The correlation between two different variables in the survey",
      "The homogeneity of elements within clusters — how similar units within a cluster are compared to the population",
      "The response rate in each cluster",
      "The sampling fraction used for selecting clusters",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "The intra-class correlation coefficient (ρ or roh) measures the degree of homogeneity within clusters. A high ρ (elements within clusters are very similar) leads to a large design effect and reduced efficiency of cluster sampling. Survey designers aim for heterogeneous clusters (low ρ) to improve efficiency.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Cluster & Multi-Stage Sampling",
    competencyTag: 'c1',
    topic: "Sampling Design",
  },
  {
    id: 'nssta-samp-004',
    question: "Probability Proportional to Size (PPS) sampling, a key topic in NSSTA training, is most appropriate when:",
    options: [
      "All units in the population are of equal size",
      "Units vary substantially in size and larger units should have higher selection probability",
      "The population is homogeneous",
      "Non-response rates are very high",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "PPS sampling assigns selection probabilities proportional to a size measure (e.g., population of a village, number of workers in a factory). This is particularly useful in multi-stage designs where first-stage units vary significantly in size, ensuring that larger units, which contain more information, are more likely to be selected.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Advanced Sampling Techniques",
    competencyTag: 'c1',
    topic: "Sampling Design",
  },

  // ── System of National Accounts ───────────────────────────────────────
  {
    id: 'nssta-sna-001',
    question: "In the SNA framework taught at NSSTA, the institutional sectors of the economy include:",
    options: [
      "Only the government sector and the private corporate sector",
      "Non-financial corporations, financial corporations, general government, households, and NPISHs",
      "Primary, secondary, and tertiary sectors only",
      "Agriculture, industry, and services only",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The SNA 2008 framework classifies the economy into five institutional sectors: (1) Non-financial corporations, (2) Financial corporations, (3) General government, (4) Households, and (5) Non-Profit Institutions Serving Households (NPISHs). Each sector has distinct production, income, and capital accounts.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: System of National Accounts (SNA 2008)",
    competencyTag: 'c7',
    topic: "National Accounts",
  },
  {
    id: 'nssta-sna-002',
    question: "The \"production boundary\" in SNA, as explained in NSSTA curriculum, includes:",
    options: [
      "Only goods and services sold in the market",
      "All goods and services produced for sale or own use, including imputed rents on owner-occupied housing, but excluding unpaid domestic services",
      "All human activities including unpaid household work",
      "Only goods and services produced by the government",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "The SNA production boundary includes: (a) goods and services produced for sale or barter, (b) goods produced for own final use (including owner-occupied housing), (c) government services. It notably EXCLUDES unpaid domestic and personal services (cooking, cleaning) performed by household members for their own consumption.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: System of National Accounts (SNA 2008)",
    competencyTag: 'c7',
    topic: "National Accounts",
  },
  {
    id: 'nssta-sna-003',
    question: "In NSSTA's SNA module, the \"Sequence of Accounts\" begins with:",
    options: [
      "The Capital Account",
      "The Financial Account",
      "The Production Account",
      "The Balance Sheet",
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The SNA Sequence of Accounts flows: Production Account → Generation of Income Account → Allocation of Primary Income Account → Secondary Distribution of Income Account → Use of Income Account → Capital Account → Financial Account → Balance Sheet. The Production Account is the starting point, showing output, intermediate consumption, and value added.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: National Accounts — Sequence of Accounts",
    competencyTag: 'c7',
    topic: "National Accounts",
  },

  // ── Price Statistics ──────────────────────────────────────────────────
  {
    id: 'nssta-price-001',
    question: "The Laspeyres price index, used in India's CPI compilation and covered in NSSTA training, uses weights from:",
    options: [
      "The current period",
      "The base period",
      "An average of base and current periods",
      "A geometric mean across all periods",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The Laspeyres price index uses base-period quantity weights: P_L = Σ(p_t × q_0) / Σ(p_0 × q_0) × 100. India\\'s CPI uses modified Laspeyres with base-year expenditure shares as weights. The advantage is that weights don\\'t change each period, but it may overstate inflation if consumers substitute away from items with rising prices.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Price Statistics & Index Numbers",
    competencyTag: 'c2',
    topic: "Price Statistics",
  },
  {
    id: 'nssta-price-002',
    question: "What is the key difference between CPI and WPI as taught in NSSTA's price statistics module?",
    options: [
      "CPI measures retail/consumer prices while WPI measures wholesale/producer-level prices",
      "CPI covers only food items while WPI covers all items",
      "CPI is compiled monthly while WPI is compiled annually",
      "There is no practical difference between them",
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: "CPI (Consumer Price Index) measures price changes at the retail level from the consumer\\'s perspective, including services. WPI (Wholesale Price Index) measures prices at the first point of bulk sale (producer/wholesale level) and covers only goods, not services. CPI is used for inflation targeting by RBI, while WPI serves as a deflator for industrial output.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Price Statistics — CPI vs WPI",
    competencyTag: 'c2',
    topic: "Price Statistics",
  },

  // ── Statistical Methods ───────────────────────────────────────────────
  {
    id: 'nssta-stats-001',
    question: "In NSSTA's statistical methods curriculum, the Central Limit Theorem states that:",
    options: [
      "The population must be normally distributed for any statistical inference",
      "The sampling distribution of the sample mean approaches a normal distribution as the sample size increases, regardless of the population distribution",
      "All statistical tests require at least 1000 observations",
      "The median is always equal to the mean in large samples",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The Central Limit Theorem (CLT) states that as sample size n increases, the sampling distribution of the sample mean (x̄) approaches a normal distribution with mean μ and variance σ²/n, regardless of the shape of the population distribution. This is the foundation for confidence intervals and hypothesis testing in large samples.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Fundamental Statistical Methods",
    competencyTag: 'c2',
    topic: "Statistical Methods",
  },
  {
    id: 'nssta-stats-002',
    question: "In hypothesis testing (NSSTA curriculum), a Type I error occurs when:",
    options: [
      "We fail to reject a false null hypothesis",
      "We reject a true null hypothesis",
      "The sample size is too small",
      "The confidence interval is too wide",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "Type I error (false positive) occurs when we reject the null hypothesis when it is actually true. The probability of Type I error is denoted by α (significance level). Type II error (β) is failing to reject a false null hypothesis. Balancing these errors is crucial in designing statistical tests for official statistics.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Hypothesis Testing & Inference",
    competencyTag: 'c2',
    topic: "Statistical Methods",
  },
  {
    id: 'nssta-stats-003',
    question: "NSSTA's curriculum on non-parametric methods covers the Kruskal-Wallis test. This test is the non-parametric equivalent of:",
    options: [
      "Paired t-test",
      "One-way ANOVA (analysis of variance)",
      "Two-sample Z-test",
      "Chi-square goodness-of-fit test",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "The Kruskal-Wallis H test is a rank-based non-parametric test used to compare three or more independent groups. It is the non-parametric alternative to one-way ANOVA when the assumption of normality is violated. It tests whether the populations have the same distribution using ranked data.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Non-Parametric Statistical Methods",
    competencyTag: 'c2',
    topic: "Statistical Methods",
  },

  // ── Data Analysis & Python/R ──────────────────────────────────────────
  {
    id: 'nssta-python-001',
    question: "In NSSTA's Python for Statistics module, which pandas method creates a cross-tabulation (contingency table) from two categorical columns?",
    options: [
      "pd.merge()",
      "pd.crosstab()",
      "pd.concat()",
      "pd.melt()",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "pd.crosstab() computes a cross-tabulation (frequency table) of two or more categorical variables. It is equivalent to a pivot table counting occurrences. Example: pd.crosstab(df[\"State\"], df[\"Sector\"]) produces a frequency matrix showing counts for each state-sector combination.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Python for Statistical Computing",
    competencyTag: 'c5',
    topic: "Python for Statistics",
  },
  {
    id: 'nssta-python-002',
    question: "When performing a t-test on PLFS wage data using Python (NSSTA training), which scipy function is used?",
    options: [
      "scipy.stats.chi2_contingency()",
      "scipy.stats.ttest_ind()",
      "scipy.stats.pearsonr()",
      "scipy.stats.kstest()",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "scipy.stats.ttest_ind() performs an independent two-sample t-test, comparing the means of two independent groups. For PLFS wage data, this could compare mean wages between rural and urban workers. The function returns the test statistic and p-value.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Python for Statistical Computing",
    competencyTag: 'c5',
    topic: "Python for Statistics",
  },
  {
    id: 'nssta-python-003',
    question: "In NSSTA's R programming module, which function from the survey package is used to specify a complex survey design for PLFS data analysis?",
    options: [
      "lm()",
      "svydesign()",
      "glm()",
      "t.test()",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "svydesign() from the R \"survey\" package specifies the complex survey design including stratification variables, cluster (PSU) identifiers, and sampling weights. This is essential for PLFS analysis: svydesign(ids = ~psu, strata = ~stratum, weights = ~weight, data = plfs_data). Standard functions like lm() would ignore the design and produce incorrect variance estimates.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: R Programming for Official Statistics",
    competencyTag: 'c5',
    topic: "Python for Statistics",
  },

  // ── Data Visualization ────────────────────────────────────────────────
  {
    id: 'nssta-viz-001',
    question: "According to NSSTA's data visualization guidelines for official statistical publications, a Lorenz curve is used to visualize:",
    options: [
      "Time series trends in GDP growth",
      "Income or wealth inequality (cumulative share of income against cumulative share of population)",
      "Correlation between two continuous variables",
      "Seasonal decomposition of time series data",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The Lorenz curve plots the cumulative percentage of total income (y-axis) against the cumulative percentage of the population ordered from poorest to richest (x-axis). The farther the curve is from the 45° line of perfect equality, the greater the inequality. The Gini coefficient is the ratio of the area between the Lorenz curve and the equality line.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Data Visualization for Official Reports",
    competencyTag: 'c4',
    topic: "Data Visualization",
  },
  {
    id: 'nssta-viz-002',
    question: "For visualizing CPI basket composition across major expenditure groups, NSSTA recommends:",
    options: [
      "A 3D pie chart with transparency effects",
      "A treemap or stacked bar chart showing proportional weights",
      "A scatter plot of prices vs. quantities",
      "A line chart of individual item prices",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "NSSTA guidelines recommend treemaps or stacked bar charts for showing composition data like CPI basket weights. Treemaps effectively display hierarchical part-to-whole relationships (e.g., Food & Beverages → Cereals → Rice). 3D pie charts are discouraged due to distortion of proportions and difficulty in comparing slice sizes.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Data Visualization Best Practices",
    competencyTag: 'c4',
    topic: "Data Visualization",
  },

  // ── Data Quality & Assurance ──────────────────────────────────────────
  {
    id: 'nssta-dq-001',
    question: "The NSSTA curriculum on data quality defines \"coherence\" as:",
    options: [
      "Whether the data are published on schedule",
      "The degree to which data from different sources or methods can be reliably combined and compared",
      "Whether the data collection was done by trained enumerators",
      "The physical security of data storage systems",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "Coherence refers to the internal consistency of statistics — whether data from different sources, methods, or time periods can be meaningfully combined. For example, if PLFS and Census give very different employment estimates for the same period, there is a coherence issue. Coherence spans across datasets (cross-domain), across time, and across geographies.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Data Quality Assurance Framework",
    competencyTag: 'c8',
    topic: "Data Quality",
  },
  {
    id: 'nssta-dq-002',
    question: "In NSSTA's data quality training, \"non-sampling errors\" include:",
    options: [
      "Errors arising solely from selecting a sample instead of a census",
      "Errors from measurement, non-response, data processing, coverage, and specification",
      "Only transcription errors during data entry",
      "Errors that can be eliminated by increasing the sample size",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "Non-sampling errors are errors that can occur in both censuses and sample surveys. They include: coverage errors (under/over-coverage), measurement errors (faulty instruments, interviewer bias), non-response errors, processing errors (data entry, coding), and specification errors. Unlike sampling errors, they cannot be reduced simply by increasing sample size.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Survey Errors & Data Quality",
    competencyTag: 'c8',
    topic: "Data Quality",
  },
  {
    id: 'nssta-dq-003',
    question: "The NSSTA module on imputation recommends which method for handling item non-response in household surveys?",
    options: [
      "Deleting the entire household record",
      "Hot-deck imputation using a suitable donor record from the same stratum",
      "Replacing all missing values with zero",
      "Ignoring missing items in the analysis",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "Hot-deck imputation selects a \"donor\" record from the same stratum or matching class with complete data and substitutes the missing values. This preserves the joint distribution of variables and is preferred for household surveys like PLFS and CES because it uses observed values from similar respondents rather than model-based estimates.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Missing Data & Imputation Methods",
    competencyTag: 'c8',
    topic: "Data Quality",
  },

  // ── Survey Design & Methodology ───────────────────────────────────────
  {
    id: 'nssta-survey-001',
    question: "In NSSTA's survey methodology training, a \"pilot survey\" is conducted primarily to:",
    options: [
      "Collect final data for a subset of the population",
      "Test the questionnaire design, field procedures, and estimate key parameters for sample size determination",
      "Replace the main survey if budget is limited",
      "Train data entry operators",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "A pilot survey is a small-scale preliminary study conducted before the main survey to: (1) test questionnaire clarity and skip patterns, (2) identify potential problems in field operations, (3) estimate variance parameters needed for sample size calculation, and (4) assess response rates and survey duration. It is not a substitute for the main survey.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Survey Design & Questionnaire Development",
    competencyTag: 'c6',
    topic: "Survey Design",
  },
  {
    id: 'nssta-survey-002',
    question: "In NSSTA's training on questionnaire design, \"telescoping\" is a type of:",
    options: [
      "Sampling error",
      "Response error where respondents report events outside the reference period as if they occurred within it",
      "Coverage error due to frame incompleteness",
      "Processing error during data entry",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "Telescoping is a recall/memory bias where respondents \"telescope\" events — reporting events that happened before the reference period (backward telescoping) as occurring within it, or events within the period as being outside it (forward telescoping). This is particularly relevant in expenditure surveys and the PLFS where reference periods are critical.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Questionnaire Design & Response Errors",
    competencyTag: 'c6',
    topic: "Survey Design",
  },
  {
    id: 'nssta-survey-003',
    question: "According to NSSTA training materials, the \"multiplier\" or \"raising factor\" in a sample survey is used to:",
    options: [
      "Increase the sample size after data collection",
      "Weight each sample observation to represent the population, accounting for selection probability and non-response adjustments",
      "Calculate the standard error of the estimate",
      "Determine the number of survey rounds",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The multiplier (weight/raising factor) ensures that each sampled unit represents the appropriate number of units in the population. It typically equals the inverse of the selection probability (design weight), adjusted for non-response and calibrated to known population totals. Correct weighting is essential for unbiased population estimates from NSSO/PLFS surveys.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Estimation & Weighting in Sample Surveys",
    competencyTag: 'c6',
    topic: "Survey Design",
  },

  // ── Data Analysis Advanced ────────────────────────────────────────────
  {
    id: 'nssta-analysis-001',
    question: "In NSSTA's advanced data analysis module, seasonal adjustment of time series data using X-13 ARIMA-SEATS involves:",
    options: [
      "Simply removing the month with the highest value",
      "Decomposing the series into trend-cycle, seasonal, and irregular components and removing the seasonal component",
      "Replacing all values with their annual average",
      "Only applying a 12-month moving average",
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "X-13 ARIMA-SEATS decomposes a time series into trend-cycle, seasonal, and irregular components. The seasonal component captures regular within-year patterns (e.g., festival-period spending spikes). Seasonal adjustment removes this component to reveal underlying trends, making month-to-month and quarter-to-quarter comparisons meaningful for indicators like IIP and GDP.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Time Series Analysis & Seasonal Adjustment",
    competencyTag: 'c3',
    topic: "Data Analysis",
  },
  {
    id: 'nssta-analysis-002',
    question: "When analyzing ASI data, NSSTA training emphasizes that outlier factories should be:",
    options: [
      "Automatically deleted from the dataset",
      "Investigated for data errors vs. genuine large units, with Winsorization applied if they are genuine extremes",
      "Replaced with the median value",
      "Moved to a separate \"rejected\" file without analysis",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "NSSTA training emphasizes that in industrial data (ASI), extreme values may represent genuine large factories (e.g., a steel plant with thousands of workers). Outlier treatment should first distinguish data errors from genuine extremes. For genuine extremes, techniques like Winsorization (capping at a percentile) can reduce their influence without deleting valid observations.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Data Analysis for Industrial Statistics",
    competencyTag: 'c3',
    topic: "Data Analysis",
  },

  // ── Agriculture Statistics ────────────────────────────────────────────
  {
    id: 'nssta-agri-001',
    question: "In NSSTA's agriculture statistics module, crop production estimates in India are primarily based on:",
    options: [
      "Satellite imagery exclusively",
      "The Improvement of Crop Statistics (ICS) scheme using crop-cutting experiments",
      "Self-reporting by farmers without verification",
      "Market arrival data from APMCs only",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The Improvement of Crop Statistics (ICS) scheme involves conducting crop-cutting experiments on scientifically selected plots. Area statistics come from land records or sample surveys, while yield estimates are based on crop-cutting experiments where a random plot is harvested and weighed. The scheme is supervised by NSSO field staff to ensure objectivity.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Agriculture Statistics & Crop Estimation",
    competencyTag: 'c1',
    topic: "Data Collection",
  },

  // ── Demography & Social Statistics ────────────────────────────────────
  {
    id: 'nssta-demo-001',
    question: "In NSSTA's demography module, the Total Fertility Rate (TFR) represents:",
    options: [
      "The actual number of children born per woman in a given year",
      "The average number of children a woman would bear over her lifetime if she experienced the current age-specific fertility rates",
      "The crude birth rate divided by the crude death rate",
      "The percentage of women of childbearing age in the population",
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "TFR is a synthetic (period) measure: the sum of age-specific fertility rates (ASFR) for all age groups (typically 15–49). It represents the average number of children a hypothetical cohort of women would have if subjected to the current year\\'s age-specific rates throughout their reproductive period. A TFR of 2.1 is considered replacement level fertility.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Demography & Vital Statistics",
    competencyTag: 'c2',
    topic: "Statistical Methods",
  },

  // ── Gender Statistics ─────────────────────────────────────────────────
  {
    id: 'nssta-gender-001',
    question: "NSSTA's gender statistics module emphasizes that sex-disaggregated data means:",
    options: [
      "Collecting data only from female respondents",
      "Data that are collected, tabulated, and presented separately for males and females to reveal gender disparities",
      "Using a 50-50 male-female sampling ratio",
      "Applying gender quotas in survey teams",
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "Sex-disaggregated data is data collected and presented separately for males and females. This is a minimum requirement for gender analysis and is critical for indicators like LFPR, literacy rate, wage gaps, and health outcomes. NSSTA emphasizes that every survey should be designed to produce sex-disaggregated statistics to support SDG-5 monitoring.",
    source: 'nssta',
    sourcePublication: "NSSTA Module: Gender Statistics & SDG Monitoring",
    competencyTag: 'c6',
    topic: "Survey Design",
  },
];

// ─── Combined & Categorized Exports ─────────────────────────────────────────

/** All MoSPI + NSSTA questions combined */
export const allMospiNsstaQuestions: MospiNsstaQuestion[] = [
  ...mospiQuestions,
  ...nsstaQuestions,
];

/** Questions organized by competency for targeted assessment */
export const questionsByCompetency: Record<string, MospiNsstaQuestion[]> = allMospiNsstaQuestions.reduce(
  (acc, q) => {
    if (!acc[q.competencyTag]) acc[q.competencyTag] = [];
    acc[q.competencyTag].push(q);
    return acc;
  },
  {} as Record<string, MospiNsstaQuestion[]>
);

/** Questions organized by topic */
export const questionsByTopic: Record<string, MospiNsstaQuestion[]> = allMospiNsstaQuestions.reduce(
  (acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  },
  {} as Record<string, MospiNsstaQuestion[]>
);

/** Questions organized by difficulty */
export const questionsByDifficulty: Record<Difficulty, MospiNsstaQuestion[]> = {
  easy: allMospiNsstaQuestions.filter(q => q.difficulty === 'easy'),
  medium: allMospiNsstaQuestions.filter(q => q.difficulty === 'medium'),
  hard: allMospiNsstaQuestions.filter(q => q.difficulty === 'hard'),
};

/** Get N random questions, optionally filtered */
export function getRandomQuestions(
  count: number,
  options?: {
    source?: 'mospi' | 'nssta';
    competencyTag?: string;
    difficulty?: Difficulty;
    topic?: string;
  }
): MospiNsstaQuestion[] {
  let pool = [...allMospiNsstaQuestions];

  if (options?.source) pool = pool.filter(q => q.source === options.source);
  if (options?.competencyTag) pool = pool.filter(q => q.competencyTag === options.competencyTag);
  if (options?.difficulty) pool = pool.filter(q => q.difficulty === options.difficulty);
  if (options?.topic) pool = pool.filter(q => q.topic === options.topic);

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(count, pool.length));
}

/** Get all unique topics */
export function getAvailableTopics(): string[] {
  return [...new Set(allMospiNsstaQuestions.map(q => q.topic))].sort();
}

/** Get quiz statistics */
export function getQuizBankStats() {
  return {
    totalQuestions: allMospiNsstaQuestions.length,
    mospiCount: mospiQuestions.length,
    nsstaCount: nsstaQuestions.length,
    byDifficulty: {
      easy: questionsByDifficulty.easy.length,
      medium: questionsByDifficulty.medium.length,
      hard: questionsByDifficulty.hard.length,
    },
    topics: getAvailableTopics(),
    competencies: [...new Set(allMospiNsstaQuestions.map(q => q.competencyTag))].sort(),
  };
}
