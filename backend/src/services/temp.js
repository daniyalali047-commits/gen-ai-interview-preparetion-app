const resume = `
ALEX CHEN
Full Stack Software Engineer | San Francisco, CA | alex.chen@email.com | github.com/alexchen-dev

PROFESSIONAL SUMMARY
Full Stack Engineer with 4+ years of experience designing, building, and scaling web applications using JavaScript/TypeScript, React, Node.js, and PostgreSQL. Proven track record of optimizing frontend bundle performance by 35% and converting legacy monoliths into serverless microservices.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
- Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, REST APIs, GraphQL
- Backend: Node.js, Express, PostgreSQL, MongoDB, Redis, RESTful API Design
- DevOps & Tools: Docker, AWS (S3, EC2, Lambda), Git, Jest, CI/CD (GitHub Actions)

PROFESSIONAL EXPERIENCE

Nexus Tech Solutions | Senior Full Stack Engineer
Jan 2024 – Present | San Francisco, CA
- Architected and built a real-time analytics dashboard using React, Tailwind, and Node.js, serving 50k active daily users.
- Reduced API response latency by 40% by implementing Redis caching layer across core microservices.
- Led migration of backend database from MongoDB to PostgreSQL, improving data consistency and query execution times.

Apex Digital Systems | Software Engineer
Jun 2022 – Dec 2023 | San Jose, CA
- Developed user-facing onboarding flows in Next.js and TypeScript, improving user registration conversion by 18%.
- Wrote end-to-end integration tests using Jest and Playwright, increasing test coverage from 55% to 88%.
- Integrated Stripe payment processing API and Webhooks to support multi-currency recurring subscription billing.

EDUCATION
B.S. in Computer Science | San Jose State University (2018 – 2022)
`

const jobdescription = `
Role: Senior Full Stack Engineer (Node.js / React / Cloud)
Company: CloudScale AI
Location: Remote (US) / San Francisco, CA

ABOUT THE ROLE:
CloudScale AI is looking for an experienced Senior Full Stack Engineer to join our Core Product team. You will lead the development of our enterprise AI workflow engine, designing high-throughput web applications and scalable API infrastructure.

KEY RESPONSIBILITIES:
- Design, build, and maintain frontend user interfaces in Next.js and TypeScript.
- Architect resilient backend microservices using Node.js, Express, and PostgreSQL.
- Containerize and orchestrate services using Docker and Kubernetes deployed on AWS (EKS/EC2).
- Build and consume streaming APIs (WebSockets / gRPC) for real-time model outputs.
- Mentor junior engineers and champion CI/CD and testing best practices across teams.

QUALIFICATIONS & REQUIREMENTS:
- 4+ years of professional software engineering experience.
- Mastery of TypeScript, React/Next.js, Node.js, and relational databases (PostgreSQL).
- Hands-on experience with containerization (Docker) and Kubernetes orchestration.
- Familiarity with real-time streaming architectures (WebSockets, Redis Pub/Sub, or Kafka).
- Strong background in writing unit and integration tests (Jest, Cypress, or Playwright).
- Bonus: Prior experience working with Generative AI / LLM APIs (OpenAI, Anthropic).
`

const selfdescription = `
"I’m a product-focused Full Stack Engineer who thrives in fast-moving teams where I can take full ownership of features from UI design to cloud deployment. 

While my professional experience at Nexus and Apex has heavily focused on building React dashboards, Node.js APIs, and managing PostgreSQL databases, I’ve spent the past six months heavily experimenting with Gen AI integration. In my spare time, I built a personal side project using Next.js and the OpenAI API that streams responses via WebSockets, which gave me hands-on experience with streaming architectures.

My strongest technical skills are TypeScript, React, and backend API design. One gap in my formal employment history is production Kubernetes management—while I use Docker daily and run a local K3s cluster for my homelab, I haven't managed a production Kubernetes cluster at work yet. 

I’m looking for a role at CloudScale AI because I want to bring my core stack experience to an AI-first product while expanding my infrastructure and real-time streaming capabilities."
`

export default {
    resume,
    jobdescription,
    selfdescription
};