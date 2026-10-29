// Resource directory for the prototype. Campus entries are bracketed PLACEHOLDERS: they
// must not be filled in until the research team verifies them with each office.
// National entries are official public services.

export type ResourceCategory = "basic" | "emergency" | "aid" | "coaching" | "talk";

export type Resource = {
  name: string;
  category: ResourceCategory;
  about: string;
  scope: "campus-placeholder" | "national";
  url?: string;
};

export const categories: { id: ResourceCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "basic", label: "Food & housing" },
  { id: "emergency", label: "Emergency money" },
  { id: "aid", label: "Financial aid & loans" },
  { id: "coaching", label: "Money coaching" },
  { id: "talk", label: "Someone to talk to" },
];

export const resources: Resource[] = [
  { name: "[CAMPUS BASIC NEEDS CENTER / FOOD PANTRY]", category: "basic", scope: "campus-placeholder", about: "Free groceries and help finding housing support. [HOURS] · [LOCATION]" },
  { name: "[CAMPUS EMERGENCY AID FUND]", category: "emergency", scope: "campus-placeholder", about: "Small grants for unexpected costs like a car repair or a short rent gap. [HOW TO APPLY]" },
  { name: "[FINANCIAL AID OFFICE]", category: "aid", scope: "campus-placeholder", about: "Questions about your aid package, appeals after a change in family income, and loan options. [CONTACT]" },
  { name: "[CAMPUS COUNSELING CENTER]", category: "talk", scope: "campus-placeholder", about: "Confidential support when money stress is affecting sleep, classes, or wellbeing. [CONTACT]" },
  { name: "Federal Student Aid", category: "aid", scope: "national", url: "https://studentaid.gov", about: "The U.S. Department of Education site for FAFSA, federal loans, and repayment plans." },
  { name: "CFPB — Paying for College", category: "aid", scope: "national", url: "https://www.consumerfinance.gov/students/", about: "Plain-language tools for comparing aid offers and planning loan repayment." },
  { name: "CFPB — Your Money, Your Goals", category: "coaching", scope: "national", url: "https://www.consumerfinance.gov/your-money-your-goals/", about: "Free worksheets for budgeting, cash flow, and setting goals." },
  { name: "National Foundation for Credit Counseling", category: "coaching", scope: "national", url: "https://www.nfcc.org", about: "Find a nonprofit credit counselor for help with debt or a spending plan." },
  { name: "988 Suicide & Crisis Lifeline", category: "talk", scope: "national", url: "https://988lifeline.org", about: "Free, confidential support 24/7 if stress feels overwhelming. Call or text 988." },
];
