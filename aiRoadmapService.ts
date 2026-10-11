import { GoogleGenAI } from '@google/genai';
import { UserProfile, AIRoadmap, AIRoadmapPhase } from '../types/index.ts';

// Server-side initialization of Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

/**
 * Curated, branch-specific and goal-specific fallback roadmaps.
 * Used when GEMINI_API_KEY is not configured or upstream API encounters rate limits/network issues.
 * Explicitly transparent with source: 'curated_fallback'.
 */
export function buildCuratedFallbackRoadmap(profile: UserProfile): AIRoadmap {
  const branch = profile.branch || 'CSE';
  const goal = profile.careerGoal || 'Software Development';
  const studyTime = profile.dailyStudyTime || '1 hr';
  const year = profile.year || 2;
  const stage = profile.educationLevel || (year ? `Year ${year} B.Tech` : 'Undergraduate');

  // Determine phases tailored to branch and goal
  const phases: AIRoadmapPhase[] = [];

  if (goal === 'Software Development' || goal === 'Immediate Employment' || branch === 'CSE' || branch === 'IT') {
    phases.push(
      {
        phaseNumber: 1,
        title: 'Programming Core & Problem Solving Fundamentals',
        expectedDuration: studyTime === '30 min' ? '6 Weeks' : '4 Weeks',
        skillsToLearn: ['Data Structures Foundations', 'Clean Code Principles', 'Git & GitHub Version Control', 'Algorithm Analysis (Big-O)'],
        topicsToStudy: ['Arrays, Hash Maps, Linked Lists, Stacks & Queues', 'Time & Space Complexity', 'Modular Code & Debugging Techniques', 'Branching & Pull Request Workflows'],
        freeResources: [
          { title: 'Harvard CS50x Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/', type: 'Course' },
          { title: 'NeetCode Roadmap & Beginner Algorithms', url: 'https://neetcode.io/roadmap', type: 'Practice' },
          { title: 'FreeCodeCamp Git and GitHub Handbook', url: 'https://www.freecodecamp.org/news/git-and-github-handbook/', type: 'Documentation' }
        ],
        practiceExercises: [
          'Solve 25 fundamental LeetCode Easy problems on Arrays, Strings, and Hash Maps',
          'Implement basic data structures from scratch (Stack, Queue, Singly Linked List)',
          'Create a GitHub repository and document your daily coding solutions with Git commits'
        ],
        projectsToBuild: [
          {
            title: 'CLI Task & Habit Manager with Persistence',
            description: 'A modular command-line application demonstrating data structure operations, JSON/file persistence, and automated input validation.',
            techStack: ['Python or TypeScript', 'Git', 'JSON File I/O'],
            folderStructure: 'src/\n  commands/\n  models/\n  storage/\n  index.ts\ntests/\nREADME.md'
          }
        ],
        expectedOutcome: 'Fluency in writing structured code, evaluating computational efficiency, and working with git repository versioning.',
        completionRequirements: '25 algorithm problems solved, CLI project pushed to GitHub with clean README documentation.',
        dependencies: 'Basic syntax understanding of chosen programming language.'
      },
      {
        phaseNumber: 2,
        title: 'Full-Stack Web Architecture & REST API Engineering',
        expectedDuration: studyTime === '30 min' ? '8 Weeks' : '5 Weeks',
        skillsToLearn: ['Modern Frontend (React & Tailwind)', 'Backend Web Services (Node.js/Express)', 'Relational & Document Databases', 'Authentication & JWT'],
        topicsToStudy: ['Component Lifecycles & State Management', 'RESTful API Design & HTTP Status Codes', 'SQL Queries, Indexes & Relational Modeling', 'Secure Password Hashing & Bearer Tokens'],
        freeResources: [
          { title: 'The Odin Project: Full Stack JavaScript', url: 'https://www.theodinproject.com/', type: 'Course' },
          { title: 'MDN Web Docs: Express & Node.js Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs', type: 'Documentation' },
          { title: 'Roadmap.sh Full Stack Developer Roadmap', url: 'https://roadmap.sh/full-stack', type: 'Interactive' }
        ],
        practiceExercises: [
          'Design an Express.js CRUD API with input validation middleware and comprehensive error handling',
          'Build responsive UI screens using Tailwind CSS without relying on monolithic CSS libraries',
          'Write raw SQL queries for filtering, multi-table joins, and aggregate reports'
        ],
        projectsToBuild: [
          {
            title: 'Full-Stack Developer Portfolio & Project Showcase Platform',
            description: 'A production-ready web application with user authentication, database CRUD operations, file uploads, and public portfolio share links.',
            techStack: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL / SQLite'],
            folderStructure: 'client/\n  src/components/\n  src/pages/\nserver/\n  routes/\n  controllers/\n  db/\n  server.ts'
          }
        ],
        expectedOutcome: 'Ability to independently design, code, connect, and debug complete client-server web applications.',
        completionRequirements: 'Deployed full-stack app on a public URL (e.g., Render or Vercel) with live database integration.',
        dependencies: 'Completion of Phase 1 programming fundamentals.'
      },
      {
        phaseNumber: 3,
        title: 'System Design, Testing & Cloud Deployment',
        expectedDuration: studyTime === '30 min' ? '6 Weeks' : '4 Weeks',
        skillsToLearn: ['Automated Unit & Integration Testing', 'Docker Containerization', 'Cloud Hosting & CI/CD Pipelines', 'Caching & Performance Optimization'],
        topicsToStudy: ['Dockerfiles & Multi-stage builds', 'GitHub Actions workflow automation', 'Redis caching strategies', 'Database indexing and connection pooling'],
        freeResources: [
          { title: 'Docker Official Getting Started Tutorial', url: 'https://docs.docker.com/get-started/', type: 'Documentation' },
          { title: 'GitHub Skills: Continuous Integration with Actions', url: 'https://skills.github.com/', type: 'Interactive' },
          { title: 'System Design Primer by Donne Martin', url: 'https://github.com/donnemartin/system-design-primer', type: 'Documentation' }
        ],
        practiceExercises: [
          'Containerize your Phase 2 project using a Dockerfile and docker-compose',
          'Configure a GitHub Actions pipeline that runs linting and automated tests on every push',
          'Benchmark API response times with and without database indexes'
        ],
        projectsToBuild: [
          {
            title: 'High-Concurrency URL Shortener & Analytics Engine',
            description: 'Scalable service featuring rate limiting, Redis caching layer, Docker orchestration, and real-time click analytics dashboard.',
            techStack: ['Node.js', 'Redis', 'PostgreSQL', 'Docker', 'Chart.js'],
            folderStructure: 'src/\n  services/\n  cache/\n  controllers/\nDockerfile\ndocker-compose.yml'
          }
        ],
        expectedOutcome: 'Understanding of production deployment lifecycles, containerization, and modern software engineering operations.',
        completionRequirements: 'Containerized application running with automated GitHub Actions CI tests.',
        dependencies: 'Phase 2 full-stack experience.'
      },
      {
        phaseNumber: 4,
        title: 'Interview Sprints, ATS Resume & Placement Readiness',
        expectedDuration: studyTime === '30 min' ? '6 Weeks' : '4 Weeks',
        skillsToLearn: ['Technical Interview Problem Solving', 'ATS-Optimized Engineering Resume', 'System Design Whiteboard Interviews', 'STAR Method Behavioral Communication'],
        topicsToStudy: ['Top 75 Interview Patterns (Two Pointers, Sliding Window, Trees, Graphs, DP)', 'Operating Systems, DBMS & Computer Networks revision', 'STAR framework for behavioral questions', 'Live technical mock interview etiquette'],
        freeResources: [
          { title: 'Blind 75 LeetCode Questions Guide', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', type: 'Practice' },
          { title: 'Gate Smashers CS Core Subjects Playlist', url: 'https://www.youtube.com/@GateSmashers', type: 'Course' },
          { title: 'Pramp Free Peer-to-Peer Mock Interviews', url: 'https://www.pramp.com/', type: 'Practice' }
        ],
        practiceExercises: [
          'Complete 50 curated Blind-75 interview questions with written explanations',
          'Conduct 3 peer mock technical interviews simulating live coding and behavioral rounds',
          'Revise core CS topics: Virtual Memory, ACID properties, TCP 3-way handshake, and Normalization'
        ],
        projectsToBuild: [
          {
            title: 'Production Capstone: Real-Time Collaborative Workspace',
            description: 'End-to-end distributed application with WebSockets, optimistic UI updates, unit testing suite, and detailed technical architecture documentation.',
            techStack: ['TypeScript', 'React', 'WebSocket / Socket.io', 'Tailwind CSS', 'Docker'],
            folderStructure: 'docs/\n  architecture.md\nclient/\nserver/\ntests/\nREADME.md'
          }
        ],
        expectedOutcome: 'High interview readiness for product and service engineering campus placement drives and off-campus internships.',
        completionRequirements: 'Tailored 1-page ATS resume formatted with quantifiable metrics, completed capstone, 50 LeetCode interview patterns mastered.',
        dependencies: 'Phase 1, 2, and 3.'
      }
    );
  } else if (goal === 'AI and Data Science' || goal === 'AI/Data Science' || goal === 'Research') {
    phases.push(
      {
        phaseNumber: 1,
        title: 'Python Mastery, Linear Algebra & Data Wrangling',
        expectedDuration: '4 Weeks',
        skillsToLearn: ['Python for Scientific Computing', 'NumPy & Pandas', 'Matplotlib & Seaborn', 'Exploratory Data Analysis (EDA)'],
        topicsToStudy: ['Vectorized operations & broadcasting', 'Handling missing data and outliers', 'Feature distributions and correlation heatmaps', 'Statistical significance testing'],
        freeResources: [
          { title: 'Kaggle Python & Pandas Micro-Courses', url: 'https://www.kaggle.com/learn', type: 'Interactive' },
          { title: 'Scipy & NumPy Documentation', url: 'https://numpy.org/doc/stable/', type: 'Documentation' }
        ],
        practiceExercises: ['Clean and analyze 3 distinct messy datasets on Kaggle', 'Write EDA scripts finding hidden correlations and statistical anomalies'],
        projectsToBuild: [{
          title: 'Automated Exploratory Data Analysis & Insight Generator',
          description: 'A tool that ingests arbitrary CSV data, computes statistical summaries, detects outliers, and produces publication-quality charts.',
          techStack: ['Python', 'Pandas', 'Seaborn', 'Streamlit']
        }],
        expectedOutcome: 'Confident data exploration, manipulation, and hypothesis verification.',
        completionRequirements: 'Published Kaggle notebook with comprehensive EDA report.',
        dependencies: 'Basic math and programming familiarity.'
      },
      {
        phaseNumber: 2,
        title: 'Classical Machine Learning & Model Evaluation',
        expectedDuration: '5 Weeks',
        skillsToLearn: ['Scikit-Learn', 'Supervised Learning Algorithms', 'Unsupervised Clustering', 'Validation & Hyperparameter Tuning'],
        topicsToStudy: ['Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost', 'K-Means, PCA Dimensionality Reduction', 'Precision, Recall, ROC-AUC, F1-Score', 'Cross-Validation and Grid Search'],
        freeResources: [
          { title: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', type: 'Course' },
          { title: 'StatQuest Machine Learning Video Series', url: 'https://www.youtube.com/@statquest', type: 'Course' }
        ],
        practiceExercises: ['Build a regression and classification pipeline with Scikit-learn', 'Perform 5-fold cross-validation and hyperparameter optimization'],
        projectsToBuild: [{
          title: 'Predictive Student Placement & Salary Estimator',
          description: 'Machine learning model predicting placement likelihood and offer bands with interactive web interface and SHAP model interpretability.',
          techStack: ['Python', 'Scikit-Learn', 'XGBoost', 'SHAP', 'Streamlit']
        }],
        expectedOutcome: 'Deep understanding of training, diagnosing, tuning, and explaining machine learning models.',
        completionRequirements: 'Trained model achieving >85% accuracy/F1 with SHAP explanations deployed online.',
        dependencies: 'Phase 1 data manipulation.'
      },
      {
        phaseNumber: 3,
        title: 'Deep Learning, NLP & Modern LLM Engineering',
        expectedDuration: '5 Weeks',
        skillsToLearn: ['PyTorch Foundations', 'Neural Network Architectures', 'Hugging Face Transformers', 'Retrieval-Augmented Generation (RAG)'],
        topicsToStudy: ['Backpropagation, Loss functions, Optimizers', 'CNNs for Vision and Transformers for NLP', 'Vector Embeddings, FAISS & Pinecone', 'Prompt Engineering & LangChain/LlamaIndex'],
        freeResources: [
          { title: 'Fast.ai Practical Deep Learning for Coders', url: 'https://course.fast.ai/', type: 'Course' },
          { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'Documentation' }
        ],
        practiceExercises: ['Fine-tune a lightweight BERT classifier for sentiment analysis', 'Build a local vector search index using sentence-transformers and FAISS'],
        projectsToBuild: [{
          title: 'Domain-Specific RAG Knowledge Assistant',
          description: 'Production AI assistant answering queries over engineering textbooks or company documents using vector search and Gemini API.',
          techStack: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI', 'Gemini API']
        }],
        expectedOutcome: 'Ability to architect modern AI applications combining embeddings, vector stores, and foundation models.',
        completionRequirements: 'Working RAG pipeline with source citation and evaluation metrics.',
        dependencies: 'Phase 2 machine learning.'
      },
      {
        phaseNumber: 4,
        title: 'MLOps, Model Serving & Applied AI Capstone',
        expectedDuration: '4 Weeks',
        skillsToLearn: ['FastAPI Model Serving', 'Docker for ML', 'Experiment Tracking (MLflow/W&B)', 'Model Monitoring & Latency Optimization'],
        topicsToStudy: ['ONNX Runtime & TensorRT conversion', 'Batch vs real-time inference endpoints', 'Data drift detection', 'Portfolio presentation for AI roles'],
        freeResources: [
          { title: 'Made With ML - MLOps Course', url: 'https://madewithml.com/', type: 'Course' }
        ],
        practiceExercises: ['Deploy an inference API on cloud using Docker and FastAPI', 'Track model metrics and artifacts using MLflow'],
        projectsToBuild: [{
          title: 'Full MLOps End-to-End Prediction Platform',
          description: 'Automated training pipeline, registry, containerized REST API, and monitoring dashboard.',
          techStack: ['Docker', 'FastAPI', 'MLflow', 'Streamlit', 'GitHub Actions']
        }],
        expectedOutcome: 'Readiness for AI Engineer, Data Scientist, and ML Engineering interviews.',
        completionRequirements: 'Containerized ML service deployed with CI/CD pipeline and GitHub repository.',
        dependencies: 'Phases 1-3.'
      }
    );
  } else if (goal === 'Core Engineering' || branch === 'ECE' || branch === 'EEE' || branch === 'Mechanical' || branch === 'Civil') {
    phases.push(
      {
        phaseNumber: 1,
        title: `${branch} Core Engineering Foundations & Technical Standards`,
        expectedDuration: '4 Weeks',
        skillsToLearn: ['Core Discipline Fundamentals', 'Industry Technical Codes & Standards', 'Scientific Computing & Simulation', 'Engineering Technical Drawing / Circuit Analysis'],
        topicsToStudy: [`Core subject revision for ${branch}`, 'Mathematical modeling of physical systems', 'MATLAB / Python for engineering calculations', 'Engineering documentation & specifications'],
        freeResources: [
          { title: 'NPTEL Online Courses for Engineering', url: 'https://nptel.ac.in/', type: 'Course' },
          { title: 'MIT OpenCourseWare Engineering', url: 'https://ocw.mit.edu/', type: 'Documentation' }
        ],
        practiceExercises: ['Solve 50 GATE-level conceptual problems in primary core subject', 'Model a multi-variable physical or electrical system using Python/Scipy'],
        projectsToBuild: [{
          title: `${branch} Analytical Simulation Tool`,
          description: 'A parameter-driven calculation and visualization tool solving core engineering equations with automated verification reports.',
          techStack: ['Python', 'NumPy', 'Matplotlib', 'Streamlit']
        }],
        expectedOutcome: 'Solid mastery of foundational concepts tested in PSU examinations and core industry interviews.',
        completionRequirements: '50 GATE core questions solved and documented simulation script.',
        dependencies: '1st and 2nd year engineering mathematics.'
      },
      {
        phaseNumber: 2,
        title: 'Industry Software Tools & Hands-on Design',
        expectedDuration: '6 Weeks',
        skillsToLearn: ['Industry-Standard CAD / EDA / CAE Tools', 'Design for Manufacturing & Testing', 'Schematic Capture / 3D Modeling', 'Parameter Tolerance & Thermal Analysis'],
        topicsToStudy: ['Component selection & datasheets', 'Geometric dimensioning and tolerancing (GD&T) or PCB layout rules', 'Simulation convergence and finite element analysis (FEA)', 'Design review presentations'],
        freeResources: [
          { title: 'Autodesk / KiCad Official Learning Portal', url: 'https://www.kicad.org/help/learning-resources/', type: 'Documentation' }
        ],
        practiceExercises: ['Complete 3 complete design exercises conforming to international ISO/IEEE standards', 'Perform static or signal integrity simulations on your design'],
        projectsToBuild: [{
          title: `${branch} Industry Design Capstone`,
          description: 'Complete engineering design package including schematics/drawings, bill of materials (BOM), cost analysis, and simulation reports.',
          techStack: ['CAD/EDA Software', 'Python', 'Excel / Sheets']
        }],
        expectedOutcome: 'Practical fluency with software packages demanded by top core engineering recruiters (L&T, Tata, Texas Instruments, Bosch, Siemens).',
        completionRequirements: 'Complete design dossier with simulation results and BOM.',
        dependencies: 'Phase 1 foundations.'
      },
      {
        phaseNumber: 3,
        title: 'Embedded/IoT Interfacing & Automation Skills',
        expectedDuration: '5 Weeks',
        skillsToLearn: ['Microcontrollers & Sensor Interfacing', 'C / Embedded C / PLC programming', 'Communication Protocols (UART, SPI, I2C, CAN, Modbus)', 'Data Acquisition & Monitoring'],
        topicsToStudy: ['Analog to digital conversion', 'Interrupt service routines and timer configuration', 'Industrial automation topologies', 'Sensor calibration algorithms'],
        freeResources: [
          { title: 'Arduino & ESP32 Documentation', url: 'https://docs.espressif.com/', type: 'Documentation' }
        ],
        practiceExercises: ['Interface 3 different sensors (temperature, pressure, accelerometer) and log telemetry', 'Implement an interrupt-driven control loop with safe fault handling'],
        projectsToBuild: [{
          title: 'Smart Industrial Monitoring & Control Node',
          description: 'Physical or simulated telemetry system transmitting telemetry over MQTT/HTTP with threshold alerts and emergency trip logic.',
          techStack: ['C/C++', 'ESP32 / Arduino', 'MQTT', 'Python Dashboard']
        }],
        expectedOutcome: 'Competitive edge bridging physical mechanical/electrical hardware with modern digital interfaces.',
        completionRequirements: 'Working sensor node demonstration with real-time logging.',
        dependencies: 'Phases 1 and 2.'
      },
      {
        phaseNumber: 4,
        title: 'PSU / GATE / Core Company Placement Strategy',
        expectedDuration: '4 Weeks',
        skillsToLearn: ['Core Technical Interview Problem Solving', 'GATE Previous Years Question (PYQ) Mastery', 'Engineering Aptitude & Reasoning', 'Technical Case Study Defense'],
        topicsToStudy: ['Formula revision sheets and speed drills', 'General Aptitude and Verbal ability', 'Technical HR questions on core capstone', 'Safety standards and industry trends'],
        freeResources: [
          { title: 'GATE Overflow Free Previous Year Questions', url: 'https://gateoverflow.in/', type: 'Practice' }
        ],
        practiceExercises: ['Solve 5 full-length mock tests under strict timed conditions', 'Prepare a 10-slide technical presentation defending your engineering capstone design'],
        projectsToBuild: [{
          title: 'Comprehensive Engineering Technical Portfolio',
          description: 'Polished portfolio featuring design files, simulation graphs, hardware test logs, and technical paper summary ready for placement panels.',
          techStack: ['GitHub', 'PDF Dossier', 'LinkedIn Showcase']
        }],
        expectedOutcome: 'Peak readiness for core company placements, PSU recruitment exams, and postgraduate entrance examinations.',
        completionRequirements: '100 PYQs solved, technical portfolio verified, resume tailored for core engineering companies.',
        dependencies: 'Phases 1-3.'
      }
    );
  } else {
    // General / Higher Studies / GATE / MBA / Exploring
    phases.push(
      {
        phaseNumber: 1,
        title: 'Academic Foundations, Quantitative Aptitude & Goal Alignment',
        expectedDuration: '4 Weeks',
        skillsToLearn: ['Quantitative & Logical Reasoning', 'Verbal Ability & Technical Writing', 'Core Discipline Foundations', 'Systematic Daily Habit Building'],
        topicsToStudy: ['Number theory, probability, permutations & combinations', 'Critical reasoning and reading comprehension', 'High-weightage syllabus topics', 'Pomodoro focus blocks for daily study time'],
        freeResources: [
          { title: 'IndiaBIX Quantitative Aptitude & Reasoning', url: 'https://www.indiabix.com/', type: 'Practice' },
          { title: 'Khan Academy Advanced Mathematics & Logic', url: 'https://www.khanacademy.org/', type: 'Course' }
        ],
        practiceExercises: ['Complete 30 quantitative aptitude questions every day', 'Read and summarize 1 technical or economic paper weekly'],
        projectsToBuild: [{
          title: 'Systematic Learning & Examination Progress Tracker',
          description: 'A structured tracker calculating accuracy rates, weak topic distributions, and projected mock percentiles.',
          techStack: ['Sheets / Python', 'Data Visualization']
        }],
        expectedOutcome: 'Strong foundation in analytical problem solving and consistent study discipline.',
        completionRequirements: 'Baseline mock diagnostic exam taken with detailed weak-area breakdown.',
        dependencies: 'None.'
      },
      {
        phaseNumber: 2,
        title: 'In-Depth Syllabus Coverage & High-Yield Mastery',
        expectedDuration: '6 Weeks',
        skillsToLearn: ['Subject-by-Subject Concept Consolidation', 'Formula Memory Sheets', 'Speed-Accuracy Optimization', 'Error Log Maintenance'],
        topicsToStudy: ['Top 5 high-yield subject modules', 'Common distractor elimination in multiple-choice questions', 'Time management per section', 'Spaced repetition revision schedules'],
        freeResources: [
          { title: 'NPTEL Online Exam Preparation Resources', url: 'https://nptel.ac.in/', type: 'Documentation' }
        ],
        practiceExercises: ['Solve 50 chapter-wise practice problems after completing each topic', 'Maintain an active error notebook documenting every mistake'],
        projectsToBuild: [{
          title: 'Synthesized High-Yield Formula & Concept Compendium',
          description: 'A modular, indexed digital compendium of key formulas, exceptions, shortcuts, and case examples.',
          techStack: ['Markdown / Notion', 'Digital Mind Maps']
        }],
        expectedOutcome: 'Comprehensive coverage of 70%+ of target examination syllabus with proven retention.',
        completionRequirements: 'Completed compendium and error notebook with >200 analyzed questions.',
        dependencies: 'Phase 1 fundamentals.'
      },
      {
        phaseNumber: 3,
        title: 'Full-Length Mock Testing & Real-Time Analytics',
        expectedDuration: '5 Weeks',
        skillsToLearn: ['Simulated Exam Environment Conditioning', 'Test Taking Strategy & Question Selection', 'Stress Management & Endurance', 'Post-Test Root Cause Analysis'],
        topicsToStudy: ['Negative marking avoidance strategies', 'Energy pacing across 3-hour exam windows', 'Score fluctuation normalization', 'Micro-revisions based on diagnostic trends'],
        freeResources: [
          { title: 'GATE Overflow / Testbook Free Mock Tests', url: 'https://gateoverflow.in/', type: 'Practice' }
        ],
        practiceExercises: ['Take 1 full-length simulated mock examination every weekend in the official time slot', 'Spend 3 hours thoroughly reviewing each test before moving to new questions'],
        projectsToBuild: [{
          title: 'Performance Heatmap & Strategy Dossier',
          description: 'Data-driven analysis tracking topic accuracy over time, identifying negative marking traps, and prescribing focus areas.',
          techStack: ['Analytics Dashboard', 'Excel / Python']
        }],
        expectedOutcome: 'Consistent mock exam percentiles matching target admission/selection cutoffs.',
        completionRequirements: 'At least 8 full-length simulated mock exams completed with positive score progression.',
        dependencies: 'Phases 1 and 2.'
      },
      {
        phaseNumber: 4,
        title: 'Interview Preparation, Profile Building & Final Sprints',
        expectedDuration: '4 Weeks',
        skillsToLearn: ['Personal Interview & SOP / Essay Crafting', 'Group Discussion & Case Study Articulation', 'Current Affairs & Industry Trends', 'Final Rapid Revision Protocols'],
        topicsToStudy: ['Statement of Purpose (SOP) structure and narrative arc', 'Structuring GD arguments using PESTLE framework', 'Defending academic background and career transitions', 'Mental conditioning for test day'],
        freeResources: [
          { title: 'Harvard Business Review Interview Preparation Articles', url: 'https://hbr.org/', type: 'Documentation' }
        ],
        practiceExercises: ['Write and polish your Statement of Purpose (SOP) across 3 iterative reviews', 'Conduct 2 recorded mock interviews with feedback on body language and clarity'],
        projectsToBuild: [{
          title: 'Comprehensive Candidate Portfolio & Application Dossier',
          description: 'Ready-to-submit dossier with verified transcripts, polished SOP, academic writing samples, and documented achievements.',
          techStack: ['Professional PDF', 'LinkedIn Showcase']
        }],
        expectedOutcome: 'Top-tier readiness to secure admissions, crack competitive selections, or transition into high-growth career paths.',
        completionRequirements: 'Final SOP finalized, 2 mock interviews cleared, revision notes memorized.',
        dependencies: 'Phases 1-3.'
      }
    );
  }

  // Current Position Analysis
  const existingSkillNames = profile.currentSkills?.map(s => s.name) || ['C Programming', 'Basic Problem Solving'];
  const strengths = existingSkillNames.length > 0
    ? existingSkillNames.slice(0, 3).map(s => `Foundational familiarity in ${s}`)
    : ['Academic coursework exposure', 'Commitment to structured skill development'];
  
  const gaps = [
    `Practical hands-on projects matching industry expectations in ${goal}`,
    'Systematic version control and code portfolio presence on GitHub',
    'Experience with real-world engineering constraints, debugging, and deployment'
  ];

  const currentPosition = {
    stageTitle: `${stage} - ${branch}`,
    careerGoal: goal,
    existingSkills: existingSkillNames,
    skillsToImprove: ['Data Structures & Algorithms', 'Modern Frameworks', 'System Architecture', 'Interview Aptitude'],
    currentStrengths: strengths,
    importantSkillGaps: gaps,
    summary: `Currently in ${stage} (${branch}) targeting ${goal}. With ${studyTime} of committed daily study time, you have sufficient runway to build deep practical skills, ship standout portfolio projects, and achieve placement readiness without academic burnout.`
  };

  const immediateActionPlan = {
    today: `Spend ${studyTime} reviewing the Phase 1 curriculum, setting up your development workspace, and exploring the recommended free learning resources.`,
    thisWeek: `Complete the first 5 hands-on practice exercises in Phase 1 and initialize your project repository on GitHub.`,
    thisMonth: `Finish all Phase 1 exercises, complete the first standalone portfolio project, and push clean code with a descriptive README.`,
    nextMilestone: `Complete Phase 1 completion requirements and begin Phase 2 full-stack / core application architecture.`
  };

  const futureOpportunities = {
    potentialRoles: [
      `${goal} Engineer`,
      `Associate Software Engineer`,
      `Technical Graduate Trainee`,
      `Systems Analyst / Developer`
    ],
    internshipsAndExams: [
      'Smart India Hackathon (SIH)',
      'Summer Industrial Internships via Internshala & LinkedIn',
      'Campus Recruitment Placement Drives (TCS, Infosys, Wipro, Product Startups)',
      'GATE Examination (for PSU recruitment or M.Tech admissions)'
    ],
    higherStudiesOptions: [
      'M.Tech in Computer Science / VLSI / AI from premier institutes (IITs/NITs/BITS)',
      'MS in Computer Science or Data Science abroad (US, Germany, Ireland)',
      'MBA (Tech / Operations) through CAT/GMAT for techno-management leadership'
    ],
    specializations: [
      'Cloud Architecture & DevOps',
      'Distributed Systems & High-Scale Backend',
      'Applied Artificial Intelligence & Machine Learning Systems'
    ],
    disclaimer: 'Note: These career trajectories, salary bands, and exam recommendations reflect current engineering industry patterns and are provided as guided possibilities, not guaranteed employment promises.'
  };

  return {
    id: `roadmap-${profile.userId || 'demo'}-${Date.now()}`,
    userId: profile.userId,
    generatedAt: new Date().toISOString(),
    source: 'curated_fallback',
    currentPosition,
    phases,
    immediateActionPlan,
    futureOpportunities,
    topThreeActions: [
      `Block out ${studyTime} daily in your calendar for deliberate, uninterrupted practice.`,
      `Build and commit code for your Phase 1 project on GitHub with proper README documentation.`,
      `Track your milestones daily using the CareerPath proof-of-work completion engine.`
    ],
    progressMeasurement: 'Progress is tracked through milestone verification, hands-on code reviews, quiz scores, and interactive streak retention.'
  };
}

/**
 * Generate a personalized roadmap using Gemini 3.8 Flash.
 * Falls back transparently to curated branch roadmap if API is unavailable or rate limited.
 */
export async function generateAIRoadmap(profile: UserProfile): Promise<AIRoadmap> {
  const branch = profile.branch || 'CSE';
  const goal = profile.careerGoal || 'Software Development';
  const studyTime = profile.dailyStudyTime || '1 hr';
  const year = profile.year || 2;
  const semester = profile.semester || 4;
  const educationLevel = profile.educationLevel || 'B.Tech pursuing';
  const currentSituation = profile.currentSituation || 'Learning skills';
  const skillsList = profile.currentSkills?.map(s => `${s.name} (${s.level})`).join(', ') || 'Beginner in programming';
  const interestsList = profile.interests?.join(', ') || 'Software, Web Development';
  const preferredLanguage = profile.preferredLanguage || 'English';
  const existingExp = profile.existingExperience
    ? `Projects: ${profile.existingExperience.projects || 'None'}, Certs: ${profile.existingExperience.certifications || 'None'}, Exams: ${profile.existingExperience.examsCompleted || 'None'}`
    : 'None specified';

  const systemInstruction = `You are a world-class senior engineering career advisor, university placement director, and principal tech lead.
Your task is to analyze an engineering student's profile and create an authentic, highly personalized, actionable career roadmap.
You MUST output valid, structured JSON adhering strictly to the AIRoadmap schema.
Write in clear, motivating, simple English. Avoid vague buzzwords or generic platitudes.
Provide real, specific, free learning resources (e.g., Harvard CS50, freeCodeCamp, MDN Web Docs, NeetCode, roadmap.sh, NPTEL, Kaggle, Docker Docs).
Provide tangible project ideas with realistic tech stacks and folder structures tailored to the student's available daily study time.
Realistic timeline is critical: a student with 30 min/day needs different milestone scopes than one with 3+ hrs/day.`;

  const userPrompt = `Generate a personalized AI career roadmap for this engineering student:
- Name: ${profile.name}
- Education Stage: ${educationLevel}
- Branch: ${branch}
- Current Year & Semester: Year ${year}, Semester ${semester}
- Target Career Goal: ${goal}
- Current Situation: ${currentSituation}
- Current Skills & Levels: ${skillsList}
- Areas of Interest: ${interestsList}
- Daily Study Time Available: ${studyTime}
- Preferred Learning Language: ${preferredLanguage}
- Existing Background / Experience: ${existingExp}

Requirements:
1. Explain:
   - Where the student is currently (current position, strengths, skill gaps).
   - What the student should learn next and why each skill is important.
   - Which specific projects they should build with tech stack.
   - Which internships, exams, or certifications they should pursue.
   - What they should do during their current semester and after graduation.
   - Immediate action plan: What to do today, this week, this month, and next milestone.
2. Structure the roadmap into 4 sequential phases, each with:
   - phaseNumber, title, expectedDuration
   - skillsToLearn (array of strings)
   - topicsToStudy (array of strings)
   - freeResources (array of { title, url, type: "Documentation" | "Course" | "Interactive" | "Practice" })
   - practiceExercises (array of strings)
   - projectsToBuild (array of { title, description, techStack: string[], folderStructure?: string })
   - expectedOutcome (string)
   - completionRequirements (string)
   - dependencies (string)
3. Include:
   - topThreeActions (array of 3 high-impact strings)
   - progressMeasurement (string explaining how proof of work is verified)
   - futureOpportunities (potentialRoles, internshipsAndExams, higherStudiesOptions, specializations, disclaimer stating these are possibilities not guarantees).

Respond ONLY with valid JSON with keys:
{
  "currentPosition": {
    "stageTitle": string,
    "careerGoal": string,
    "existingSkills": string[],
    "skillsToImprove": string[],
    "currentStrengths": string[],
    "importantSkillGaps": string[],
    "summary": string
  },
  "phases": [...],
  "immediateActionPlan": {
    "today": string,
    "thisWeek": string,
    "thisMonth": string,
    "nextMilestone": string
  },
  "futureOpportunities": {
    "potentialRoles": string[],
    "internshipsAndExams": string[],
    "higherStudiesOptions": string[],
    "specializations": string[],
    "disclaimer": string
  },
  "topThreeActions": string[],
  "progressMeasurement": string
}`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[AIRoadmap] GEMINI_API_KEY not configured. Using curated branch roadmap.');
      return buildCuratedFallbackRoadmap(profile);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(text);
    if (!parsed.phases || !Array.isArray(parsed.phases) || parsed.phases.length === 0) {
      throw new Error('Invalid roadmap structure received from AI model');
    }

    const aiRoadmap: AIRoadmap = {
      id: `roadmap-${profile.userId || 'usr'}-${Date.now()}`,
      userId: profile.userId,
      generatedAt: new Date().toISOString(),
      source: 'gemini',
      currentPosition: parsed.currentPosition || {
        stageTitle: `${educationLevel} - ${branch}`,
        careerGoal: goal,
        existingSkills: profile.currentSkills?.map(s => s.name) || [],
        skillsToImprove: ['Advanced Problem Solving', 'Production Project Experience'],
        currentStrengths: ['Motivated learner'],
        importantSkillGaps: ['Industry architecture practice'],
        summary: `Personalized plan tailored for ${profile.name} pursuing ${goal}.`
      },
      phases: parsed.phases.map((p: any, idx: number) => ({
        phaseNumber: p.phaseNumber || idx + 1,
        title: p.title || `Phase ${idx + 1}: Technical Advancement`,
        expectedDuration: p.expectedDuration || '4-6 Weeks',
        skillsToLearn: Array.isArray(p.skillsToLearn) ? p.skillsToLearn : ['Core Competencies'],
        topicsToStudy: Array.isArray(p.topicsToStudy) ? p.topicsToStudy : ['Conceptual foundations'],
        freeResources: Array.isArray(p.freeResources) ? p.freeResources : [
          { title: 'FreeCodeCamp Core Guides', url: 'https://www.freecodecamp.org/', type: 'Course' }
        ],
        practiceExercises: Array.isArray(p.practiceExercises) ? p.practiceExercises : ['Complete weekly coding challenges'],
        projectsToBuild: Array.isArray(p.projectsToBuild) ? p.projectsToBuild.map((pr: any) => ({
          title: pr.title || 'Practical Implementation Project',
          description: pr.description || 'Hands-on project verifying learned skills.',
          techStack: Array.isArray(pr.techStack) ? pr.techStack : ['Modern Tech Stack'],
          folderStructure: pr.folderStructure || 'src/\n  index.ts'
        })) : [],
        expectedOutcome: p.expectedOutcome || 'Mastery of target phase competencies.',
        completionRequirements: p.completionRequirements || 'Project pushed to GitHub and validated with automated tests.',
        dependencies: p.dependencies || (idx === 0 ? 'None' : `Phase ${idx}`)
      })),
      immediateActionPlan: parsed.immediateActionPlan || {
        today: `Dedicate ${studyTime} to configuring development tools and beginning Phase 1.`,
        thisWeek: 'Complete initial 5 practice problems.',
        thisMonth: 'Publish first working project to GitHub.',
        nextMilestone: 'Phase 1 verification and Phase 2 commencement.'
      },
      futureOpportunities: parsed.futureOpportunities || {
        potentialRoles: [`${goal} Associate`, 'Software Engineer'],
        internshipsAndExams: ['Summer Tech Internships', 'Campus Placement Drives'],
        higherStudiesOptions: ['M.Tech / MS in relevant domain'],
        specializations: ['Applied Engineering Systems'],
        disclaimer: 'Career projections reflect industry patterns and are not guaranteed placement outcomes.'
      },
      topThreeActions: Array.isArray(parsed.topThreeActions) && parsed.topThreeActions.length >= 3
        ? parsed.topThreeActions.slice(0, 3)
        : [
            `Maintain a daily ${studyTime} habit without breaks.`,
            'Build and commit code to GitHub daily.',
            'Verify all milestones with tangible proof of work.'
          ],
      progressMeasurement: parsed.progressMeasurement || 'Measured via quiz completions, GitHub commits, and code project deliverables.'
    };

    return aiRoadmap;
  } catch (error) {
    console.error('[AIRoadmap] Gemini generation encountered error, falling back to curated roadmap:', error);
    return buildCuratedFallbackRoadmap(profile);
  }
}

/**
 * Ask AI Career Mentor: Answer questions about the student's specific roadmap.
 */
export async function askCareerMentor(
  question: string,
  profile: UserProfile,
  roadmap: AIRoadmap | null,
  context?: string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return `Career Advisor Note: Based on your ${profile.branch} background and target of ${profile.careerGoal}, the most important principle is consistent daily execution (${profile.dailyStudyTime} per day). Focus on completing one phase at a time and publishing clean, documented projects to your GitHub profile. If you have semester exams coming up, reduce your daily study time to 30 mins focused on revision rather than pausing completely.`;
  }

  const prompt = `You are CareerPath's AI Career Mentor, an expert advisor for Indian engineering students (B.Tech, BE, BCA, MCA).
The student is asking: "${question}"

Student Profile:
- Name: ${profile.name}
- Education Stage: ${profile.educationLevel || 'B.Tech'}
- Branch: ${profile.branch} (Year ${profile.year}, Semester ${profile.semester})
- Career Goal: ${profile.careerGoal}
- Current Situation: ${profile.currentSituation || 'Learning skills'}
- Daily Study Time: ${profile.dailyStudyTime}
- Current Skills: ${profile.currentSkills?.map(s => s.name).join(', ') || 'Foundations'}
- Additional Context: ${context || 'None'}

Current Roadmap Summary:
${roadmap ? `Roadmap Source: ${roadmap.source}, Current Stage: ${roadmap.currentPosition?.stageTitle}, Immediate Action Today: ${roadmap.immediateActionPlan?.today}` : 'No roadmap generated yet'}

Provide an empathetic, actionable, realistic response in 2 to 4 concise paragraphs.
Focus on:
1. Direct answer to their question.
2. Practical steps they can take today or this week with their available daily study time (${profile.dailyStudyTime}).
3. How to balance with college semester exams / labs / placement drives if relevant.
Do not use generic generic corporate jargon. Be friendly, practical, and direct.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7
      }
    });

    return response.text || 'Keep working on your daily milestones. Consistency is key to engineering placement success!';
  } catch (err) {
    console.error('[CareerMentor] Error answering student question:', err);
    return `Great question! For ${profile.careerGoal} in ${profile.branch}, the best approach is to protect your daily ${profile.dailyStudyTime} block. Treat your college coursework and skill-building as complementary: apply whatever programming or systems concepts you learn to your current semester lab projects!`;
  }
}
