export interface Capability {
  title: string;
  desc: string;
}

export interface Step {
  title: string;
  desc: string;
  points: string[];
}

export interface Service {
  num: string;
  slug: string; // route segment, e.g. "Web-Engineering"
  name: string; // signature name shown as the headline
  title: string; // plain discipline name
  tagline: string; // short editorial line (serif italic)
  summary: string; // one-liner used on the home section
  lead: string; // inner-page lead paragraph
  body: string; // inner-page supporting paragraph
  highlights: string[]; // short bullets for the home section
  capabilities: Capability[];
  processHeading: string; // sticky heading beside the process steps
  process: Step[];
  stack: string[];
}

export const services: Service[] = [
  {
    num: "01",
    slug: "Web-Engineering",
    name: "The Build Room",
    title: "Web Engineering",
    tagline: "Fast, solid, built to last.",
    summary: "Full-stack websites and web apps on modern frameworks: clean code, fast loads and SEO-ready from day one.",
    lead: "Full-stack website and web-app development on modern frameworks. Clean code, fast load times and search engine optimisation from day one.",
    body: "I build production-grade web systems focused on speed, modularity and pixel-perfect design translation. From clean APIs to lightweight static pages, every codebase is structured for longevity and easy scaling.",
    highlights: ["Next.js & React apps", "APIs, auth & databases", "Performance & SEO baked in"],
    capabilities: [
      { title: "Single Page Apps", desc: "Snappy, app-like interfaces with client-side routing and state that stays predictable." },
      { title: "Server-Side Rendering", desc: "SSR and static generation so pages load instantly and index well." },
      { title: "SEO & Metadata", desc: "Semantic markup, structured data, sitemaps and social previews set up properly." },
      { title: "Databases & Schemas", desc: "Data models, APIs and admin flows designed around how your business actually works." },
      { title: "Performance Tuning", desc: "Audits, bundle trimming, image strategy and caching to hit green Core Web Vitals." },
      { title: "Responsive Engineering", desc: "Layouts that hold up from small phones to ultrawide screens, without hacks." },
    ],
    processHeading: "From a rough idea to a fast, reliable product in production.",
    process: [
      {
        title: "Scope & plan",
        desc: "Every good build starts with clarity. We map your goals, users and must-have features, then turn them into a technical plan with clear milestones, so there are no surprises later.",
        points: ["Kick-off call & requirements", "Feature list and priorities", "Architecture & stack choice", "Timeline with milestones"],
      },
      {
        title: "Architect the foundation",
        desc: "Before writing UI, I design the data model, API shape and page structure. A solid foundation keeps the app fast today and easy to extend tomorrow.",
        points: ["Database schema & relations", "API and auth design", "Routing and rendering strategy", "Repo, CI and environments"],
      },
      {
        title: "Build in small steps",
        desc: "Development happens in small, reviewable increments with a live preview link at every stage. You see real progress weekly and can steer before anything is locked in.",
        points: ["Component-driven frontend", "Backend, APIs & integrations", "Live preview deployments", "Weekly progress check-ins"],
      },
      {
        title: "Launch & tune",
        desc: "We go live with monitoring in place, then measure real-world performance and polish what the numbers point to: speed, SEO and the small details users notice.",
        points: ["Production deployment", "Core Web Vitals & SEO audit", "Analytics and error tracking", "Handover & documentation"],
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Supabase", "PostgreSQL", "Prisma"],
  },
  {
    num: "02",
    slug: "Interface-Design",
    name: "Interfaces with Intent",
    title: "Interface Design",
    tagline: "Intuitive first, beautiful always.",
    summary: "Interfaces that feel obvious to use and look exceptional, backed by research and executed pixel-perfect.",
    lead: "User interfaces that feel intuitive and look exceptional. Research-backed flows with pixel-perfect execution.",
    body: "I design sleek digital interfaces focused on usability, accessibility and modern aesthetics. By bridging wireframe logic with creative visuals, I build scalable layouts people genuinely enjoy navigating.",
    highlights: ["Research & user flows", "Hi-fi UI & prototypes", "Design systems"],
    capabilities: [
      { title: "User Research", desc: "Personas and journey maps grounded in who actually uses the product." },
      { title: "User Flows", desc: "Clear paths through the product so every screen has one obvious next step." },
      { title: "High-Fidelity UI", desc: "Polished, on-brand screens with real content, states and edge cases." },
      { title: "Interactive Prototypes", desc: "Clickable prototypes to test ideas before a single line of code." },
      { title: "Design Systems", desc: "Reusable components, tokens and rules that keep the product consistent." },
      { title: "Usability Testing", desc: "Quick feedback loops to find friction and fix it early." },
    ],
    processHeading: "Interfaces people understand at a glance, and enjoy coming back to.",
    process: [
      {
        title: "Discover",
        desc: "Good design starts with understanding. I learn who your users are, what they are trying to get done and where today's experience lets them down.",
        points: ["Stakeholder interviews", "User & competitor research", "Personas and key journeys", "Problems worth solving"],
      },
      {
        title: "Structure",
        desc: "Before any colour or polish, I lay out the information architecture and flows in wireframes, so the logic of every screen is right first.",
        points: ["Information architecture", "User flow diagrams", "Low-fidelity wireframes", "Content hierarchy"],
      },
      {
        title: "Design",
        desc: "The structure becomes a polished, on-brand interface: typography, colour, components and the interaction details that make it feel considered.",
        points: ["High-fidelity screens", "Component library", "Interaction & motion details", "Responsive layouts"],
      },
      {
        title: "Validate & hand off",
        desc: "Clickable prototypes go in front of real users. We fix friction early, then hand over clean, developer-ready files with specs.",
        points: ["Interactive prototype", "Usability testing", "Iteration on feedback", "Dev-ready handoff & specs"],
      },
    ],
    stack: ["Figma", "Framer", "Adobe XD", "Photoshop", "Illustrator", "Tailwind CSS"],
  },
  {
    num: "03",
    slug: "Digital-Experience",
    name: "Scroll-Stopping Sites",
    title: "Digital Experience",
    tagline: "Websites people remember.",
    summary: "End-to-end web design, from wireframe to final visual, crafted for conversion and built for brand consistency.",
    lead: "End-to-end web design from wireframe to final visual. Crafted for conversion, built for brand consistency.",
    body: "I shape complete digital journeys that guide visitors naturally toward your goals. By combining high-fidelity layout engineering with smooth, scroll-driven motion, I design sites that leave a lasting impression.",
    highlights: ["Interaction & motion", "Conversion-led layouts", "Art direction"],
    capabilities: [
      { title: "Interaction Design", desc: "Micro-interactions and feedback that make the interface feel alive." },
      { title: "Scroll & Motion", desc: "GSAP and Framer Motion choreography that supports the story, never distracts." },
      { title: "Art Direction", desc: "A distinct visual voice: type, colour, imagery and rhythm." },
      { title: "Content Hierarchy", desc: "Structure that leads the eye from headline to call-to-action." },
      { title: "Responsive Layouts", desc: "Experiences designed for every breakpoint, not shrunk to fit." },
      { title: "Cross-Platform QA", desc: "Tested across browsers and devices so it feels right everywhere." },
    ],
    processHeading: "A website that tells your story and turns visitors into enquiries.",
    process: [
      {
        title: "Story & goals",
        desc: "We define what a visitor should feel, learn and do on every page. That story becomes the backbone of the design and the yardstick for every decision.",
        points: ["Brand & audience workshop", "Conversion goals", "Sitemap & page purposes", "Tone and visual references"],
      },
      {
        title: "Wireframe the journey",
        desc: "Section by section, I lay out the narrative and the path to the call-to-action, testing the flow before visual design begins.",
        points: ["Section-by-section wireframes", "Copy hierarchy", "Call-to-action placement", "Mobile-first layout"],
      },
      {
        title: "Craft visuals & motion",
        desc: "Visual design and motion are designed together, not bolted on. Scroll choreography and micro-interactions support the story and keep it smooth.",
        points: ["Art direction & typography", "Scroll-driven animation", "Micro-interactions", "Motion performance budget"],
      },
      {
        title: "Build & refine",
        desc: "The site is built pixel-perfect, tested on real devices and browsers, then refined after launch based on how visitors actually behave.",
        points: ["Pixel-perfect build", "Cross-browser & device QA", "Accessibility checks", "Post-launch improvements"],
      },
    ],
    stack: ["GSAP", "Framer Motion", "Lenis", "React", "Next.js", "Tailwind CSS"],
  },
  {
    num: "04",
    slug: "Visual-Identity",
    name: "Brand DNA",
    title: "Visual Identity",
    tagline: "Recognisable at a glance.",
    summary: "Brand identity systems, marketing collateral and graphics that communicate instantly and stay consistent.",
    lead: "Brand identity systems, marketing collateral and graphic design that communicates instantly.",
    body: "I construct clean visual systems that express the core values of your product or brand. From monograms and colour palettes to vector details, I translate brand strategy into striking, usable assets.",
    highlights: ["Logos & wordmarks", "Colour & typography", "Brand guidelines"],
    capabilities: [
      { title: "Brand Marks", desc: "Logos, wordmarks and monograms with variants for every surface." },
      { title: "Colour Systems", desc: "Palettes with clear roles for primary, accent and neutral use." },
      { title: "Typography", desc: "Type pairings and scales that carry the brand voice." },
      { title: "Marketing Graphics", desc: "Posters, brochures and social assets that stay on-brand." },
      { title: "Logo Motion", desc: "Animated marks for intros, reels and digital touchpoints." },
      { title: "Guidelines", desc: "A practical brand book so anyone can use the identity correctly." },
    ],
    processHeading: "An identity that is unmistakably yours, on every surface.",
    process: [
      {
        title: "Research",
        desc: "I study your market, competitors and audience to find what makes you genuinely different, and what the brand needs to communicate first.",
        points: ["Brand questionnaire", "Competitor landscape", "Audience & positioning", "Mood boards"],
      },
      {
        title: "Concept",
        desc: "Several distinct creative directions are explored and presented with real-world mock-ups, so choosing the strongest idea is easy.",
        points: ["Logo explorations", "Colour & type directions", "Mock-ups in context", "Direction review together"],
      },
      {
        title: "Refine",
        desc: "The chosen direction is perfected: the mark, palette and typography are tested at every size, from site hoardings to favicons.",
        points: ["Final mark & variants", "Colour system with roles", "Typography scale", "Small-size & mono tests"],
      },
      {
        title: "Deliver",
        desc: "You receive every file format you need plus clear guidelines, so your team and partners can use the identity consistently.",
        points: ["Logo files (SVG, PNG, PDF)", "Brand guidelines", "Social & print templates", "Optional logo animation"],
      },
    ],
    stack: ["Illustrator", "Photoshop", "After Effects", "Figma", "InDesign", "SVG"],
  },
  {
    num: "05",
    slug: "Growth-Digital-Presence",
    name: "Signal & Reach",
    title: "Growth & Presence",
    tagline: "Get seen. Get chosen.",
    summary: "Strategic social content, campaign design and digital positioning that grow reach and turn attention into leads.",
    lead: "Strategic social media content, campaign design and digital brand positioning across platforms.",
    body: "I align product visuals with growth metrics to expand your online reach. By designing target-driven ad creatives, landing pages and content funnels, I help teams lift engagement and conversion.",
    highlights: ["Campaign creatives", "Landing pages", "Analytics & tracking"],
    capabilities: [
      { title: "Social Strategy", desc: "Content pillars and formats matched to where your audience is." },
      { title: "Ad Creatives", desc: "Scroll-stopping campaign visuals built to be tested and iterated." },
      { title: "Landing Pages", desc: "Focused, SEO-friendly pages with a single clear conversion goal." },
      { title: "Engagement Flows", desc: "Funnels that move people from first touch to enquiry." },
      { title: "Analytics Setup", desc: "Tracking and dashboards so decisions are based on real data." },
      { title: "Content Calendars", desc: "A consistent publishing rhythm that is easy to maintain." },
    ],
    processHeading: "More of the right people finding you, and choosing you.",
    process: [
      {
        title: "Audit",
        desc: "We review your current channels, content and analytics to see what is already working and where attention is leaking away.",
        points: ["Channel & content review", "Analytics baseline", "Competitor benchmarks", "Quick wins list"],
      },
      {
        title: "Plan",
        desc: "Clear goals, target audiences and a content and campaign roadmap that fits your team's capacity to keep it going.",
        points: ["Goals & KPIs", "Audience segments", "Content pillars", "Campaign roadmap"],
      },
      {
        title: "Create",
        desc: "Creatives, landing pages and funnels are produced and set up for testing from day one, so every campaign teaches us something.",
        points: ["Ad & social creatives", "Landing pages", "Lead capture flows", "A/B test variants"],
      },
      {
        title: "Measure & grow",
        desc: "Results are tracked against the goals we set. We double down on what performs and cut what doesn't, month after month.",
        points: ["Tracking & dashboards", "Monthly performance review", "Creative iteration", "Scaling what works"],
      },
    ],
    stack: ["Figma", "After Effects", "Next.js", "Google Analytics", "Search Console", "Canva"],
  },
  {
    num: "06",
    slug: "AI-Integration-Agents",
    name: "Thinking Machines",
    title: "AI Integration & Agents",
    tagline: "Products that think for themselves.",
    summary: "LLM features, semantic search and agentic workflows shipped into real products, not just demos.",
    lead: "Bringing AI models, semantic search and agentic workflows into production apps, safely and reliably.",
    body: "I integrate AI capabilities directly into product ecosystems: autonomous agent pipelines, Retrieval-Augmented Generation (RAG), prompt design and evaluation, delivered as fast, production-ready features.",
    highlights: ["Agents & automations", "RAG & semantic search", "LLM product features"],
    capabilities: [
      { title: "Agentic Workflows", desc: "Multi-step agents that plan, call tools and complete real tasks." },
      { title: "RAG & Search", desc: "Answers grounded in your own documents and data with semantic retrieval." },
      { title: "LLM Integrations", desc: "Claude, Gemini and OpenAI models wired into your product safely." },
      { title: "Prompting & Evaluation", desc: "Prompt design and test suites so outputs stay on-brand and accurate." },
      { title: "NLP Features", desc: "Classification, extraction and summarisation that remove manual work." },
      { title: "AI Automation", desc: "Internal tools that turn repetitive workflows into one click." },
    ],
    processHeading: "AI that does real work inside your product, not just in a demo.",
    process: [
      {
        title: "Find the leverage",
        desc: "We identify the workflow where AI creates real, measurable value, and define what a good answer looks like before choosing any model.",
        points: ["Workflow & data audit", "Use-case prioritisation", "Success criteria", "Model & cost options"],
      },
      {
        title: "Prototype fast",
        desc: "A working proof is built quickly with your real data, so we can judge the quality of results instead of guessing.",
        points: ["Prompt & tool design", "Retrieval over your data", "Working prototype", "Early quality review"],
      },
      {
        title: "Harden",
        desc: "Prototypes become dependable: evaluation suites, guardrails against bad or unsafe output, and controls on latency and cost.",
        points: ["Evaluation test suite", "Guardrails & validation", "Prompt-injection defences", "Cost & latency limits"],
      },
      {
        title: "Integrate & monitor",
        desc: "The feature ships inside your product with a UX people trust, and is monitored so quality stays high as usage grows.",
        points: ["In-product UX", "Logging & monitoring", "Feedback loops", "Ongoing improvements"],
      },
    ],
    stack: ["Anthropic Claude", "Gemini API", "OpenAI APIs", "LangChain", "Vector DBs", "Supabase", "Python", "TypeScript"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
