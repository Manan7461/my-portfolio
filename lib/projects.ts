export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  shortDesc: string;
  description: string;
  solution: string;
  deliverables: string[];
  stack: string[];
  techUsed: string[];
  images: string[];
  link: string;
  color: string;
  accent: string; // vivid brand colour for the case-study page
  accent2: string; // secondary colour for gradients
  github?: string; // source repository
  live?: string; // deployed site
  video?: string; // looping screen recording for the card
}

export const projects: Project[] = [
  {
    id: "01",
    title: "Leaklens – Pre-Deploy Security Checker",
    category: "Developer Security",
    year: "2026",
    shortDesc: "A free, local-first security checker that finds leaked API keys before you deploy, shows whether visitors can actually reach them, and walks you through rotating them for real.",
    description: "Students, solo developers and people building with AI coding tools leak secrets all the time: a Stripe key in a NEXT_PUBLIC_ variable, a token in git history. Most scanners only say \"a key was found\"; they don't tell you whether the public can reach it, what it can do, or whether you actually fixed it. And uploading your code to a scanner is a privacy risk of its own.",
    solution: "Built one scanning engine with two front-ends. The website scans a dropped folder or .zip entirely in the browser tab: a strict Content-Security-Policy blocks every upload, and a Proof-of-Privacy panel shows 0 network requests after each scan. Exposure Path Tracing shows the exact chain from .env to the browser and ranks findings by reachability. A Fire Drill checklist then takes each leaked key from replacement through revocation. A CLI, GitHub Action and pre-commit hook add git-history scanning and SARIF output.",
    deliverables: [
      "In-browser scanner that works offline as a PWA",
      "Exposure Path Tracing across Next.js, Vite, SvelteKit, Nuxt, Astro and more",
      "Fire Drill key-rotation checklist with progress tracking",
      "Proof-of-Privacy panel (0 network requests per scan)",
      "CLI, GitHub Action and pre-commit hook with SARIF, HTML and Markdown reports"
    ],
    stack: ["TypeScript", "React", "Vite", "Tailwind CSS", "Node.js"],
    techUsed: ["Frontend (React, Vite, Tailwind CSS)", "Scanning (TypeScript engine in Web Workers)", "Packaging (fflate for .zip reading)", "CLI (Node.js, Commander)", "Testing (Playwright end-to-end)"],
    images: ["/Project/pr11_1.png", "/Project/pr11_2.png", "/Project/pr11_3.png", "/Project/pr11_4.png"],
    link: "/leaklens",
    accent: "#B8F26B",
    accent2: "#2FB67C",
    live: "https://leaklensai.vercel.app/",
    video: "/Project/video/leaklens.webm",
    color: "#DDE6DE",
  },
  {
    id: "02",
    title: "PlacePilot – AI Placement Email Organizer",
    category: "AI Integration",
    year: "2026",
    shortDesc: "An AI assistant for Indian campus students that reads placement emails (read-only), extracts every deadline, test and cutoff, and flags hidden service bonds and scam drives.",
    description: "During campus placements, final-year students get dozens of urgent emails from TPOs and recruiters. Google Form deadlines close within hours, test links get buried in threads, eligibility cutoffs differ by branch, and companies hide 1–2 lakh training bonds or ask for \"registration fees\" in fake drives. Generic to-do apps need everything typed in by hand.",
    solution: "Connected Gmail with a strict read-only scope, pre-filtered placement emails, and used Claude to extract structured facts, with the untrusted email text isolated to block prompt injection and every result validated with Zod. Everything lands in a Closing-in-48-hours radar, a drag-and-drop Kanban pipeline, a calendar and a skills heatmap. Thread merging updates extended deadlines instead of duplicating them, and Telegram alerts fire 24h and 3h before each deadline.",
    deliverables: [
      "Read-only Gmail sync with AI extraction of deadlines, tests and cutoffs",
      "Service-bond detector and scam / fee shield",
      "Eligibility matcher against the student's CGPA, backlogs and branch",
      "List, Kanban board, calendar and skills-heatmap views",
      "Telegram reminders, .ics calendar export and a no-login demo mode"
    ],
    stack: ["Next.js", "Claude API", "Supabase", "Gmail API", "Tailwind CSS"],
    techUsed: ["Frontend (Next.js, React, Tailwind CSS)", "AI (Anthropic Claude with Zod-validated output)", "Data (Supabase Postgres with row-level security)", "Integrations (Gmail API read-only, Telegram Bot)", "Testing (Vitest)"],
    images: ["/Project/pr10_1.png", "/Project/pr10_2.png", "/Project/pr10_3.png", "/Project/pr10_4.png"],
    link: "/placepilot",
    accent: "#FFD43B",
    accent2: "#FF8A3D",
    live: "https://placepilotai.vercel.app/",
    video: "/Project/video/placepilot.webm",
    color: "#F1E7C6",
  },
  {
    id: "03",
    title: "HR Real Estate Platform",
    category: "Web Engineering",
    year: "2024",
    shortDesc: "A full-stack property listing platform connecting buyers, sellers, and admins across North Gujarat's fastest-growing corridor with verified listings and an interactive corridor map.",
    description: "A digital ecosystem for verified real estate transactions, including a public-facing search portal and a secure admin dashboard. It solves the problem of unverified listings and scattered property data in the Kadi-Ahmedabad industrial corridor.",
    solution: "Built an interactive \"Golden Corridor\" map with city markers, a 3-step hassle-free selling flow (Submit → Valuation → Closing), and a robust admin panel for managing property listings, users, and approvals with search/filter capabilities.",
    deliverables: [
      "Interactive corridor map interface",
      "Admin dashboard with CRUD operations (Add/Edit/Delete properties)",
      "Advanced property search/filters (by city, type, builder)",
      "3-step seller onboarding flow",
      "KPI dashboards for analytics"
    ],
    stack: ["React", "Node.js", "MongoDB", "Express", "Figma"],
    techUsed: ["Frontend (React, Tailwind CSS)", "Backend (Node.js, Express)", "Database (MongoDB)", "Prototyping (Figma)", "Authentication (JWT)"],
    images: ["/Project/pr1_1_1.png", "/Project/pr1_1_2.png", "/Project/pr1_1_3.png", "/Project/pr1_1_4.png"],
    link: "/project1",
    accent: "#E8B04B",
    accent2: "#E0563B",
    color: "#E8E4DC",
  },
  {
    id: "04",
    title: "Zomato Clone with AI Integration",
    category: "Interface Design",
    year: "2024",
    shortDesc: "A modern food delivery interface redesign featuring an AI Food Assistant that curates smart dining recommendations based on weather, mood, and user context.",
    description: "A conceptual redesign of a food delivery app focusing on hyper-personalization. Instead of just searching, users get an AI assistant that suggests dishes (e.g., hot Ramen on rainy days) to reduce decision fatigue.",
    solution: "Integrated an AI chat widget providing contextual suggestions via a \"mood/weather\" trigger. Designed a seamless \"Trending dining spots\" feed with live tracking badges and a categorized inspiration grid (Pizza, Burger, Sushi, etc.).",
    deliverables: [
      "AI Suggestion module with dynamic prompts",
      "Interactive restaurant listing cards with ratings and delivery times",
      "\"Inspiration for your first order\" quick-select grid",
      "Cohesive Zomato-inspired UI theme"
    ],
    stack: ["React", "Tailwind CSS", "LLM API", "Figma"],
    techUsed: ["Frontend (React.js, Tailwind CSS)", "AI (OpenAI/LLM API for contextual prompts)", "Design (Figma for high-fidelity UI components)", "Version Control (Git)"],
    images: ["/Project/pr2_2_1.png", "/Project/pr2_2_2.png", "/Project/pr2_2_3.png", "/Project/pr2_2_4.png"],
    link: "/project2",
    accent: "#FF4D5E",
    accent2: "#FFB347",
    color: "#E4E8DC",
  },
  {
    id: "05",
    title: "Jagdamba Sales Agency Smart Desk",
    category: "Growth & Digital Presence",
    year: "2024",
    shortDesc: "An AI-powered inventory management and POS dashboard that helps sales agencies track stock value, manage quick sales, and automate AI-driven restock alerts based on sales velocity.",
    description: "A comprehensive digital growth solution for a lubricant/oil sales agency to move from manual ledgers to digital tracking. It centralizes stock value, profit estimation, and purchase history.",
    solution: "Implemented a \"Smart Restock\" engine using AI logic to calculate average daily sales and predict stock depletion (URGENT, RESTOCK SOON, MONITOR). Integrated a 3-step Quick Sell POS flow (Customer → Items → Payment) and a detailed Reports module.",
    deliverables: [
      "Stock value dashboard (Total items, Low stock, Est. Profit)",
      "AI Restock suggestion engine with order quantity recommendations",
      "Quick Sell customer selection and checkout flow",
      "Reports page for viewing sales/purchase history"
    ],
    stack: ["React", "Chart.js", "Node.js", "MongoDB"],
    techUsed: ["Frontend (React, Custom CSS)", "Data Visualization (Chart.js)", "Backend (Node.js)", "Database (MongoDB)", "AI Logic (Rule-based sales velocity algorithm)"],
    images: ["/Project/pr3_1_1.png", "/Project/pr3_1_2.png", "/Project/pr3_1_3.png", "/Project/pr3_1_4.png"],
    link: "/project3",
    accent: "#4DA3FF",
    accent2: "#7AE7C7",
    color: "#DCE4E8",
  },
  {
    id: "06",
    title: "CampusMate.ai",
    category: "AI Integration",
    year: "2024",
    shortDesc: "An LLM-based AI assistant designed to reduce faculty workload by providing instant, 24/7 answers to student queries about exams, timetables, campus notices, and lecture locations.",
    description: "A conversational AI platform specifically trained to handle repetitive college campus queries. It bridges the communication gap between students and administration, ensuring students get answers anytime without waiting for faculty.",
    solution: "Built a chat interface with persistent history, context-aware prompting for academic schedules, and a dedicated landing page. Included example prompts like \"When are my final exams?\" and \"Where is my lecture at 12:30 PM?\" to guide users.",
    deliverables: [
      "AI chat interface with sidebar history",
      "Landing/Hero page (\"No more searching. Just ask.\")",
      "About Us section with mission statement",
      "Contact Us page with a functional feedback form"
    ],
    stack: ["React", "LLM API", "Node.js", "Figma"],
    techUsed: ["Frontend (React.js, CSS)", "AI (LLM/Generative AI API)", "Backend (Node.js)", "Design (Figma)", "State Management (Context API)"],
    images: ["/Project/pr4_1.png", "/Project/pr4_2.png", "/Project/pr4_3.png", "/Project/pr4_4.png"],
    link: "/project4",
    accent: "#A78BFA",
    accent2: "#60A5FA",
    color: "#E8DCE4",
  },
  {
    id: "07",
    title: "SkillConnect – Freelancer Marketplace",
    category: "Web Platform",
    year: "2026",
    shortDesc: "A modern freelance marketplace that connects clients with top-tier freelancers, featuring verified reviews, secure payments, service categories, and a user-friendly discovery flow.",
    description: "A digital platform to hire and manage freelancers, designed to streamline project workflows and build trust through transparent reviews and robust support. It solves the discovery and trust gap for new clients.",
    solution: "Designed an intuitive homepage with a hero search bar and popular tags, a categorized service grid (Web Dev, Design, Marketing), featured freelancer profiles with ratings/starting prices, and a trust badge section (Secure Payments, Verified Reviews, 24/7 Support).",
    deliverables: [
      "Searchable landing page with service tags",
      "Popular Service Categories strip",
      "Featured Freelancers cards (Name, Role, Rating, Price)",
      "Trust & Safety section",
      "Structured footer with \"Ready to Get Started?\" CTAs"
    ],
    stack: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    techUsed: ["Frontend (React, Tailwind CSS)", "Backend (Node.js, Express)", "Database (MongoDB)", "Authentication (Passport/JWT)", "Design (Figma)"],
    images: ["/Project/pr6_1.png", "/Project/pr6_2.png", "/Project/pr6_3.png", "/Project/pr6_4.png"],
    link: "/project5",
    accent: "#2DD4BF",
    accent2: "#A3E635",
    color: "#E8E8DC",
  },
  {
    id: "08",
    title: "Vishat Construction – Brand Identity",
    category: "Visual Identity",
    year: "2023",
    shortDesc: "A complete visual identity system for a construction company, featuring a versatile logo suite with bold primary, lowercase alternate, monochrome variant, and full lockup versions.",
    description: "Design of a professional brand identity to establish authority, trust, and visibility for a leading construction firm in the competitive infrastructure sector. The goal was to make the brand recognizable at a distance (site hoardings) and on small formats (stationery).",
    solution: "Developed a primary bold sans-serif wordmark for strength, a lowercase alternate for softer applications (uniforms/invoices), a monochrome white variant for dark backgrounds (vehicles/banners), and an extended \"Construction Company\" lockup to clarify full-service scope.",
    deliverables: [
      "Primary Logo (VISHAT CONSTRUCTION)",
      "Alternate Logo (VISHAT construction)",
      "Monochrome/Dark Background Variant",
      "Full lockup (VISHAT CONSTRUCTION COMPANY)",
      "Brand usage guidelines"
    ],
    stack: ["Illustrator", "Photoshop", "Figma"],
    techUsed: ["Adobe Illustrator (Vector Logo design)", "Adobe Photoshop (Mockups for hoardings/vehicles)", "Figma (Brand guideline presentation)", "Typography (Industrial sans-serif fonts)"],
    images: ["/Project/pr8_1.png", "/Project/pr8_2.png", "/Project/pr8_3.png", "/Project/pr8_4.png"],
    link: "/project6",
    accent: "#5B8CFF",
    accent2: "#FF8A3D",
    color: "#DCE8E4",
  },
  {
    id: "09",
    title: "HR Realty – Digital Experience Design",
    category: "Digital Experience Design",
    year: "2023",
    shortDesc: "A cohesive set of high-conversion digital and print marketing collaterals for a real estate firm, designed to drive inquiries, showcase property expertise, and promote investment stability.",
    description: "Marketing assets designed to bridge offline and online presence, focusing on emotional appeal (\"Dream Homes\") and logical investment (Land/Returns). It transforms generic real estate ads into compelling, trust-building visuals.",
    solution: "Created a bold \"Dream Homes\" poster with gold accents for emotional connection, a detailed services brochure listing residential/commercial/industrial/agricultural services, an investment-focused social media card highlighting land sizes (250/400/500 sqm), and a minimalist \"Know More\" flyer for direct lead generation.",
    deliverables: [
      "\"Own Your Dream Home\" Poster/Flyer",
      "Full Services Brochure (6 service blocks)",
      "Investment Social Media Card (Instagram/Facebook ready)",
      "Minimalist \"Know More\" CTA poster",
      "Complete contact/location details integration"
    ],
    stack: ["Photoshop", "InDesign", "Figma", "Canva"],
    techUsed: ["Adobe Photoshop (Image editing & poster design)", "Adobe InDesign (Brochure layout)", "Figma (Digital mockups and social previews)", "Canva (Social media template adaptation)"],
    images: ["/Project/pr9_1.jpg", "/Project/pr9_2.jpg", "/Project/pr9_3.jpg", "/Project/pr9_4.jpg"],
    link: "/project7",
    accent: "#F5B04C",
    accent2: "#F472B6",
    color: "#E8DCE8",
  },
];
