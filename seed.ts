import {
  TaskTemplate,
  QuizBank,
  ProjectTemplate,
  InternshipOpportunity
} from '../types/index.ts';

export const INITIAL_ROADMAP_TEMPLATES: TaskTemplate[] = [
  // ==================== YEAR 1: FOUNDATIONS ====================
  {
    id: 'task-y1-01',
    year: 1,
    semester: 1,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Version Control with Git & GitHub Essentials',
    whatYouWillLearn: 'Learn how software engineers track code changes, branch features, and publish code to GitHub repositories.',
    whyItMatters: 'Every company and technical recruiter expects you to share clean Git repositories from your very first college semester.',
    timeNeeded: '45 mins',
    difficulty: 'Beginner',
    freeResourceUrl: 'https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources',
    resourceName: 'GitHub Official Starter Guide',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'skills',
    quizId: 'quiz-git-fundamentals',
    order: 1
  },
  {
    id: 'task-y1-02',
    year: 1,
    semester: 1,
    branchCategory: 'CSE_IT',
    goalCategory: 'Software Development',
    title: 'Programming Logic & C / C++ Fundamentals',
    whatYouWillLearn: 'Master variables, memory pointers, loops, conditional flows, and modular function construction in C/C++.',
    whyItMatters: 'Understanding memory management and basic syntax builds the rock-solid mental model you need for data structures.',
    timeNeeded: '1 hour',
    difficulty: 'Beginner',
    freeResourceUrl: 'https://en.cppreference.com/w/c',
    resourceName: 'C Programming Reference & Guides',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'skills',
    quizId: 'quiz-c-fundamentals',
    order: 2
  },
  {
    id: 'task-y1-03',
    year: 1,
    semester: 2,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Quantitative Problem Solving & Number Theory Basics',
    whatYouWillLearn: 'Practice prime testing, modular arithmetic, percentages, and basic analytical reasoning.',
    whyItMatters: 'Campus recruitment aptitude tests in your 3rd and 4th year test these identical mathematical fundamentals.',
    timeNeeded: '45 mins',
    difficulty: 'Beginner',
    freeResourceUrl: 'https://www.khanacademy.org/math',
    resourceName: 'Khan Academy Algebra & Number Theory',
    verificationType: 'quiz',
    verificationRule: 'Pass the Aptitude Foundation Quiz with at least 70%',
    threshold: 70,
    minTimeSeconds: 0,
    points: 20,
    category: 'practice',
    quizId: 'quiz-aptitude-foundations',
    order: 3
  },
  {
    id: 'task-y1-04',
    year: 1,
    semester: 2,
    branchCategory: 'ECE',
    goalCategory: 'Core Engineering',
    title: 'Circuit Analysis & Ohm\'s Law Simulation',
    whatYouWillLearn: 'Understand Kirchhoff\'s voltage and current laws, resistors in series/parallel, and basic node voltage analysis.',
    whyItMatters: 'Core electronics companies test fundamental circuit analysis in both written screens and technical interviews.',
    timeNeeded: '1 hour',
    difficulty: 'Beginner',
    freeResourceUrl: 'https://www.falstad.com/circuit/',
    resourceName: 'Falstad Interactive Circuit Simulator',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'skills',
    quizId: 'quiz-circuits-basics',
    order: 4
  },
  {
    id: 'task-y1-05',
    year: 1,
    semester: 2,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'First Year Portfolio Project Setup',
    whatYouWillLearn: 'Create your first public GitHub repository containing a simple calculator or utility program with a clean README.',
    whyItMatters: 'Having real repositories created early demonstrates consistent curiosity and genuine engineering discipline.',
    timeNeeded: '1.5 hours',
    difficulty: 'Beginner',
    freeResourceUrl: 'https://github.com',
    resourceName: 'GitHub Project Creation',
    verificationType: 'github_milestone',
    verificationRule: 'Submit public GitHub repo URL with at least 2 commits and a README.md file',
    threshold: 2,
    minTimeSeconds: 0,
    points: 30,
    category: 'projects',
    order: 5
  },

  // ==================== YEAR 2: PRACTICAL SKILLS ====================
  {
    id: 'task-y2-01',
    year: 2,
    semester: 3,
    branchCategory: 'CSE_IT',
    goalCategory: 'Software Development',
    title: 'Linear Data Structures: Arrays, Strings & Linked Lists',
    whatYouWillLearn: 'Learn memory representation, two-pointer techniques, fast-slow pointers, and time-space complexity calculations.',
    whyItMatters: 'Over 60% of online assessment technical rounds feature array and string manipulation questions.',
    timeNeeded: '1.5 hours',
    difficulty: 'Intermediate',
    freeResourceUrl: 'https://neetcode.io/roadmap',
    resourceName: 'NeetCode Data Structures Roadmap',
    verificationType: 'quiz',
    verificationRule: 'Pass the Linear Data Structures Practice Quiz with at least 70%',
    threshold: 70,
    minTimeSeconds: 0,
    points: 25,
    category: 'practice',
    quizId: 'quiz-dsa-linear',
    order: 6
  },
  {
    id: 'task-y2-02',
    year: 2,
    semester: 3,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Relational Database Fundamentals & SQL Queries',
    whatYouWillLearn: 'Write SELECT queries with INNER/LEFT JOINs, aggregate functions, GROUP BY, and understand table constraints.',
    whyItMatters: 'Every software backend, analytics job, and engineering firm stores operational records in relational databases.',
    timeNeeded: '1 hour',
    difficulty: 'Intermediate',
    freeResourceUrl: 'https://sqlbolt.com',
    resourceName: 'SQLBolt Interactive Lessons',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'skills',
    quizId: 'quiz-db-sql',
    order: 7
  },
  {
    id: 'task-y2-03',
    year: 2,
    semester: 4,
    branchCategory: 'CSE_IT',
    goalCategory: 'Software Development',
    title: 'Web Application API Architecture & REST',
    whatYouWillLearn: 'Build HTTP request handlers, understand status codes, JSON payload processing, and client-server decoupling.',
    whyItMatters: 'Modern applications communicate over REST and web standards; knowing how APIs work is essential for full-stack projects.',
    timeNeeded: '2 hours',
    difficulty: 'Intermediate',
    freeResourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps',
    resourceName: 'MDN Web Docs Server-side Guide',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'skills',
    quizId: 'quiz-web-api',
    order: 8
  },
  {
    id: 'task-y2-04',
    year: 2,
    semester: 4,
    branchCategory: 'ECE',
    goalCategory: 'Core Engineering',
    title: 'Microcontroller Architecture & GPIO Programming',
    whatYouWillLearn: 'Learn how timers, interrupts, analog-to-digital converters, and serial UART communications work on microcontrollers.',
    whyItMatters: 'Embedded software and IoT hardware roles evaluate your ability to control registers and process sensor signals.',
    timeNeeded: '1.5 hours',
    difficulty: 'Intermediate',
    freeResourceUrl: 'https://docs.espressif.com/projects/esp-idf/en/latest/',
    resourceName: 'Espressif IoT Development Framework',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'skills',
    quizId: 'quiz-embedded-gpio',
    order: 9
  },
  {
    id: 'task-y2-05',
    year: 2,
    semester: 4,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Build & Push Milestone 1 of Your Intermediate Project',
    whatYouWillLearn: 'Design the architecture, database schema, and initial repository scaffolding for an intermediate engineering project.',
    whyItMatters: 'Companies want to see deep projects built incrementally over months rather than rushed tutorial clones.',
    timeNeeded: '2 hours',
    difficulty: 'Intermediate',
    freeResourceUrl: 'https://github.com',
    resourceName: 'Project Milestone Tracker',
    verificationType: 'github_milestone',
    verificationRule: 'Submit public GitHub repo URL with at least 3 commits, working code, and documentation',
    threshold: 3,
    minTimeSeconds: 0,
    points: 30,
    category: 'projects',
    order: 10
  },

  // ==================== YEAR 3: INDUSTRY EXPERIENCE ====================
  {
    id: 'task-y3-01',
    year: 3,
    semester: 5,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Complete and Validate ATS-Compliant Technical Resume',
    whatYouWillLearn: 'Format your education, coursework, verified skills, and project summaries using clear action verbs and measurable metrics.',
    whyItMatters: 'Campus placement cells and internship screening algorithms filter out resumes that fail basic structural checks.',
    timeNeeded: '1 hour',
    difficulty: 'Intermediate',
    freeResourceUrl: '/resume',
    resourceName: 'CareerPath In-App Resume Builder',
    verificationType: 'resume',
    verificationRule: 'Fill education, >= 3 technical skills, and at least 2 documented projects in the Resume Builder',
    threshold: 1,
    minTimeSeconds: 0,
    points: 50,
    category: 'resume',
    order: 11
  },
  {
    id: 'task-y3-02',
    year: 3,
    semester: 5,
    branchCategory: 'CSE_IT',
    goalCategory: 'Software Development',
    title: 'Trees, Graphs & Dynamic Programming Concepts',
    whatYouWillLearn: 'Study depth-first search, breadth-first search, binary search trees, and optimal substructure patterns in algorithms.',
    whyItMatters: 'Product companies (Tier 1 & Tier 2) center their final interview coding rounds around tree and graph problems.',
    timeNeeded: '2 hours',
    difficulty: 'Advanced',
    freeResourceUrl: 'https://visualgo.net/en/dfsbfs',
    resourceName: 'VisuAlgo Visual Graph Algorithms',
    verificationType: 'quiz',
    verificationRule: 'Pass the Trees & Graphs Technical Quiz with at least 65%',
    threshold: 65,
    minTimeSeconds: 0,
    points: 25,
    category: 'practice',
    quizId: 'quiz-dsa-trees-graphs',
    order: 12
  },
  {
    id: 'task-y3-03',
    year: 3,
    semester: 6,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Record First Verified Internship Application',
    whatYouWillLearn: 'Research company eligibility, customize your project links, and submit your first formal internship application.',
    whyItMatters: 'Securing a pre-placement offer (PPO) via a 3rd-year summer internship is the most reliable path to a high-tier campus placement.',
    timeNeeded: '30 mins',
    difficulty: 'Intermediate',
    freeResourceUrl: '/internships',
    resourceName: 'CareerPath Internship Tracker',
    verificationType: 'internship_app',
    verificationRule: 'Record a complete internship application with company, target role, and date applied',
    threshold: 1,
    minTimeSeconds: 0,
    points: 20,
    category: 'internships',
    order: 13
  },
  {
    id: 'task-y3-04',
    year: 3,
    semester: 6,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Deploy Full-Stack or Hardware Capstone Milestone 2',
    whatYouWillLearn: 'Integrate the backend database with client interfaces or complete functional circuit breadboard testing with telemetry.',
    whyItMatters: 'Demonstrating end-to-end integration proves you can solve complex system-level engineering challenges.',
    timeNeeded: '3 hours',
    difficulty: 'Advanced',
    freeResourceUrl: 'https://github.com',
    resourceName: 'GitHub Milestone 2 Submission',
    verificationType: 'github_milestone',
    verificationRule: 'Submit public GitHub repo with at least 5 commits showing feature integration',
    threshold: 5,
    minTimeSeconds: 0,
    points: 30,
    category: 'projects',
    order: 14
  },

  // ==================== YEAR 4: PLACEMENT PREP ====================
  {
    id: 'task-y4-01',
    year: 4,
    semester: 7,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Company Aptitude Speed & Accuracy Assessment',
    whatYouWillLearn: 'Solve time-constrained numerical ability, logical deduction, and verbal comprehension questions under real exam timings.',
    whyItMatters: 'Almost every on-campus recruitment drive eliminates 70% of candidates in the first aptitude elimination round.',
    timeNeeded: '1 hour',
    difficulty: 'Advanced',
    freeResourceUrl: 'https://indiabix.com',
    resourceName: 'IndiaBIX Campus Aptitude Tests',
    verificationType: 'quiz',
    verificationRule: 'Pass the Full-Length Placement Aptitude Quiz with >= 70% score',
    threshold: 70,
    minTimeSeconds: 0,
    points: 25,
    category: 'practice',
    quizId: 'quiz-placement-aptitude',
    order: 15
  },
  {
    id: 'task-y4-02',
    year: 4,
    semester: 7,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Technical Core Revision: OS, DBMS, Networks & OOP',
    whatYouWillLearn: 'Review process scheduling, virtual memory, ACID properties, indexing, TCP/IP vs UDP, and design patterns.',
    whyItMatters: 'Technical interviewers at mass recruiters and product startups frequently begin rounds with fundamental CS theory questions.',
    timeNeeded: '1.5 hours',
    difficulty: 'Intermediate',
    freeResourceUrl: 'https://www.geeksforgeeks.org/operating-systems/',
    resourceName: 'GeeksforGeeks CS Subjects Handbook',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'skills',
    quizId: 'quiz-cs-core',
    order: 16
  },
  {
    id: 'task-y4-03',
    year: 4,
    semester: 7,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Mock Behavioral & HR Interview Preparation',
    whatYouWillLearn: 'Structure responses to "Tell me about yourself", "Conflict resolution", and project challenges using the STAR method.',
    whyItMatters: 'Even candidates with top coding scores get rejected if they fail to articulate their project contributions clearly in HR rounds.',
    timeNeeded: '45 mins',
    difficulty: 'Intermediate',
    freeResourceUrl: '/practice',
    resourceName: 'CareerPath Mock Interview Module',
    verificationType: 'learning',
    verificationRule: 'Active study tracker (60s min) + 5-question check quiz (>=60% score)',
    threshold: 60,
    minTimeSeconds: 45,
    points: 10,
    category: 'practice',
    quizId: 'quiz-behavioral-hr',
    order: 17
  },
  {
    id: 'task-y4-04',
    year: 4,
    semester: 8,
    branchCategory: 'ALL',
    goalCategory: 'ALL',
    title: 'Final Major Capstone Production Deployment',
    whatYouWillLearn: 'Ship production-grade documentation, setup CI/CD pipelines or hardware schematics, and record a live video walkthrough.',
    whyItMatters: 'A completed, fully-deployed capstone project sets you apart from thousands of candidates who only have unfinished code.',
    timeNeeded: '3 hours',
    difficulty: 'Advanced',
    freeResourceUrl: 'https://github.com',
    resourceName: 'Capstone Project Verification',
    verificationType: 'github_milestone',
    verificationRule: 'Submit public GitHub repo with at least 8 commits and deployment links',
    threshold: 8,
    minTimeSeconds: 0,
    points: 100,
    category: 'projects',
    order: 18
  }
];

export const INITIAL_QUIZ_BANKS: QuizBank[] = [
  {
    id: 'quiz-git-fundamentals',
    title: 'Git & Version Control Check',
    category: 'skills',
    passingScore: 60,
    questions: [
      {
        id: 'q-git-1',
        question: 'Which Git command prepares modified files in the working directory for the next commit?',
        options: ['git push', 'git add', 'git commit', 'git checkout'],
        correctIndex: 1,
        explanation: '`git add` stages changes into the index, preparing them to be committed.'
      },
      {
        id: 'q-git-2',
        question: 'What is the primary purpose of a `.gitignore` file?',
        options: [
          'To delete files from the local hard drive',
          'To specify intentionally untracked files that Git should ignore',
          'To list collaborators allowed to push commits',
          'To encrypt sensitive credentials in public repositories'
        ],
        correctIndex: 1,
        explanation: '`.gitignore` tells Git which files or directories (like node_modules, build artifacts, or secret keys) to skip.'
      },
      {
        id: 'q-git-3',
        question: 'Which command creates and switches to a new branch called "feature-login"?',
        options: ['git branch feature-login', 'git switch feature-login', 'git checkout -b feature-login', 'git merge feature-login'],
        correctIndex: 2,
        explanation: '`git checkout -b feature-login` (or `git switch -c feature-login`) creates a new branch and immediately checks it out.'
      },
      {
        id: 'q-git-4',
        question: 'What does `git pull` do under the hood?',
        options: [
          'It runs `git fetch` followed by `git merge`',
          'It uploads local changes to GitHub',
          'It deletes the current branch and pulls master',
          'It compresses old commits into a single commit'
        ],
        correctIndex: 0,
        explanation: '`git pull` fetches changes from the remote tracking branch and merges them into the current active branch.'
      },
      {
        id: 'q-git-5',
        question: 'What is a Merge Conflict in Git?',
        options: [
          'A hardware failure on GitHub servers',
          'When Git cannot automatically resolve differences in code between two commits',
          'When two users have the same username',
          'When a file exceeds 100MB in size'
        ],
        correctIndex: 1,
        explanation: 'Merge conflicts occur when competing changes are made to the same line of a file, requiring manual developer resolution.'
      }
    ]
  },
  {
    id: 'quiz-c-fundamentals',
    title: 'C / C++ Fundamentals Check',
    category: 'skills',
    passingScore: 60,
    questions: [
      {
        id: 'q-c-1',
        question: 'What is the size of an `int` on most standard 64-bit systems in C/C++?',
        options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
        correctIndex: 2,
        explanation: 'On standard 32-bit and 64-bit architectures, `int` is typically 4 bytes (32 bits).'
      },
      {
        id: 'q-c-2',
        question: 'What does the dereference operator `*` do when applied to a pointer variable `ptr`?',
        options: [
          'Returns the memory address of the pointer',
          'Accesses the value stored at the memory address pointed to by `ptr`',
          'Multiplies the address by 2',
          'Allocates dynamic heap memory'
        ],
        correctIndex: 1,
        explanation: '`*ptr` dereferences the pointer, reading or modifying the value stored at the address.'
      },
      {
        id: 'q-c-3',
        question: 'Which header file is required to use `printf()` and `scanf()` in standard C?',
        options: ['<stdlib.h>', '<stdio.h>', '<string.h>', '<math.h>'],
        correctIndex: 1,
        explanation: '`<stdio.h>` provides standard input and output stream declarations.'
      },
      {
        id: 'q-c-4',
        question: 'Where is memory allocated when you call `malloc()` in C?',
        options: ['Call Stack', 'Heap', 'CPU Registers', 'Read-Only Code Segment'],
        correctIndex: 1,
        explanation: '`malloc()` dynamically allocates memory blocks on the heap.'
      },
      {
        id: 'q-c-5',
        question: 'What happens if you allocate memory with `malloc()` and forget to call `free()`?',
        options: ['Segmentation fault immediately', 'Compiler syntax error', 'Memory leak', 'File system corruption'],
        correctIndex: 2,
        explanation: 'Unreleased heap memory remains occupied until the process terminates, causing a memory leak.'
      }
    ]
  },
  {
    id: 'quiz-aptitude-foundations',
    title: 'Quantitative Foundations Assessment',
    category: 'practice',
    passingScore: 70,
    questions: [
      {
        id: 'q-apt-1',
        question: 'A train 240 meters long passes a pole in 24 seconds. What is the speed of the train in km/h?',
        options: ['30 km/h', '36 km/h', '40 km/h', '48 km/h'],
        correctIndex: 1,
        explanation: 'Speed = Distance / Time = 240 m / 24 s = 10 m/s. Converting to km/h: 10 * (18/5) = 36 km/h.'
      },
      {
        id: 'q-apt-2',
        question: 'If A can finish a work in 12 days and B can finish it in 24 days, how many days do they take together?',
        options: ['6 days', '8 days', '10 days', '18 days'],
        correctIndex: 1,
        explanation: 'Combined rate = 1/12 + 1/24 = 3/24 = 1/8. Therefore, together they take 8 days.'
      },
      {
        id: 'q-apt-3',
        question: 'What is the remainder when 2^50 is divided by 7?',
        options: ['1', '2', '4', '6'],
        correctIndex: 2,
        explanation: '2^3 = 8 ≡ 1 (mod 7). 50 = 3*16 + 2. So 2^50 = (2^3)^16 * 2^2 ≡ 1^16 * 4 ≡ 4 (mod 7).'
      },
      {
        id: 'q-apt-4',
        question: 'An item marked at $800 is sold for $680. What is the discount percentage?',
        options: ['12%', '15%', '18%', '20%'],
        correctIndex: 1,
        explanation: 'Discount = 800 - 680 = 120. Percentage = (120 / 800) * 100 = 15%.'
      },
      {
        id: 'q-apt-5',
        question: 'Find the next number in the series: 3, 7, 15, 31, 63, ...',
        options: ['95', '125', '127', '129'],
        correctIndex: 2,
        explanation: 'Each term is (previous * 2) + 1. 63 * 2 + 1 = 127.'
      }
    ]
  },
  {
    id: 'quiz-circuits-basics',
    title: 'Circuits & Electrical Fundamentals Check',
    category: 'skills',
    passingScore: 60,
    questions: [
      {
        id: 'q-circ-1',
        question: 'According to Ohm\'s Law, what is the formula relating Voltage (V), Current (I), and Resistance (R)?',
        options: ['V = I * R', 'V = I / R', 'V = R / I', 'V = I^2 * R'],
        correctIndex: 0,
        explanation: 'Ohm\'s Law states that Voltage is directly proportional to current: V = I * R.'
      },
      {
        id: 'q-circ-2',
        question: 'What is Kirchhoff\'s Current Law (KCL)?',
        options: [
          'The sum of voltages in a loop is zero',
          'The algebraic sum of currents entering a node equals the sum of currents leaving the node',
          'Current decreases inversely with capacitance',
          'Resistance in parallel is always higher than in series'
        ],
        correctIndex: 1,
        explanation: 'KCL states that charge is conserved: total current entering a junction must equal total current leaving it.'
      },
      {
        id: 'q-circ-3',
        question: 'Two 100-ohm resistors are connected in parallel. What is the equivalent resistance?',
        options: ['200 ohms', '100 ohms', '50 ohms', '25 ohms'],
        correctIndex: 2,
        explanation: '1/R_eq = 1/100 + 1/100 = 2/100 -> R_eq = 50 ohms.'
      },
      {
        id: 'q-circ-4',
        question: 'Which component stores energy in an electric field?',
        options: ['Resistor', 'Inductor', 'Capacitor', 'Diode'],
        correctIndex: 2,
        explanation: 'Capacitors store electrical potential energy in the electric field between plates.'
      },
      {
        id: 'q-circ-5',
        question: 'What is the function of a standard semiconductor diode?',
        options: [
          'To amplify audio signals',
          'To allow electric current to flow predominantly in one direction',
          'To store magnetic flux',
          'To step down AC voltage'
        ],
        correctIndex: 1,
        explanation: 'Diodes conduct current readily when forward-biased and block current when reverse-biased.'
      }
    ]
  },
  {
    id: 'quiz-dsa-linear',
    title: 'Linear Data Structures Assessment',
    category: 'practice',
    passingScore: 70,
    questions: [
      {
        id: 'q-dsa-1',
        question: 'What is the average time complexity of accessing an element in an array by index?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correctIndex: 0,
        explanation: 'Arrays store contiguous memory, allowing direct index calculation in constant O(1) time.'
      },
      {
        id: 'q-dsa-2',
        question: 'Which pointer technique is ideal for detecting a cycle in a singly linked list?',
        options: ['Binary search', 'Floyd\'s Tortoise and Hare (Fast & Slow pointers)', 'Breadth-first search', 'Divide and conquer'],
        correctIndex: 1,
        explanation: 'Floyd\'s cycle detection algorithm moves one pointer at 1 step and another at 2 steps; if they meet, a cycle exists.'
      },
      {
        id: 'q-dsa-3',
        question: 'In a standard queue data structure, insertions and deletions happen according to which principle?',
        options: ['LIFO (Last In First Out)', 'FIFO (First In First Out)', 'Random order', 'Priority based only'],
        correctIndex: 1,
        explanation: 'A queue enforces First-In, First-Out (FIFO) ordering.'
      },
      {
        id: 'q-dsa-4',
        question: 'What is the worst-case time complexity of inserting a node at the head of a singly linked list (given head pointer)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 0,
        explanation: 'Inserting at head requires creating a node, pointing its next to the current head, and updating head pointer: O(1).'
      },
      {
        id: 'q-dsa-5',
        question: 'What data structure is used to check balanced parentheses in an expression?',
        options: ['Queue', 'Stack', 'Heap', 'Graph'],
        correctIndex: 1,
        explanation: 'A stack stores open brackets and matches the most recent opening bracket with incoming closing brackets (LIFO).'
      }
    ]
  },
  {
    id: 'quiz-db-sql',
    title: 'Database & SQL Essentials Check',
    category: 'skills',
    passingScore: 60,
    questions: [
      {
        id: 'q-db-1',
        question: 'Which SQL clause is used to filter records resulting from a `GROUP BY` aggregate calculation?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
        correctIndex: 1,
        explanation: '`WHERE` filters individual rows before aggregation; `HAVING` filters grouped rows after aggregation.'
      },
      {
        id: 'q-db-2',
        question: 'What does a `PRIMARY KEY` constraint ensure on a database table?',
        options: [
          'Values must be unique and cannot be NULL',
          'Values can be duplicated across rows',
          'It automatically encrypts the column data',
          'It links the table to an external microservice'
        ],
        correctIndex: 0,
        explanation: 'A PRIMARY KEY uniquely identifies each record in a table and cannot contain NULL values.'
      },
      {
        id: 'q-db-3',
        question: 'Which JOIN returns all rows from the left table, and matched rows from the right table?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
        correctIndex: 1,
        explanation: 'A LEFT (OUTER) JOIN returns all rows from the left table even if no matching row exists in the right table.'
      },
      {
        id: 'q-db-4',
        question: 'What does the "A" in the database ACID acronym stand for?',
        options: ['Asynchronous', 'Atomicity', 'Authorization', 'Aggregation'],
        correctIndex: 1,
        explanation: 'Atomicity ensures that all statements in a transaction either complete successfully or are entirely rolled back.'
      },
      {
        id: 'q-db-5',
        question: 'Why do database administrators create indexes on frequently queried columns?',
        options: [
          'To compress disk storage space',
          'To accelerate data retrieval (SELECT queries) at the cost of slight write overhead',
          'To prevent foreign keys from being created',
          'To convert SQL tables to NoSQL collections'
        ],
        correctIndex: 1,
        explanation: 'Indexes (like B-trees) enable fast lookups without scanning every table row.'
      }
    ]
  },
  {
    id: 'quiz-web-api',
    title: 'Web APIs & HTTP Architecture Check',
    category: 'skills',
    passingScore: 60,
    questions: [
      {
        id: 'q-api-1',
        question: 'Which HTTP method is conventionally used to create a new resource on a RESTful server?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctIndex: 1,
        explanation: 'POST is used to submit data to specify the creation of a subordinate resource.'
      },
      {
        id: 'q-api-2',
        question: 'What does an HTTP status code 404 signify?',
        options: [
          'Server internal error',
          'Unauthorized user access',
          'Requested resource not found',
          'Successful response with empty body'
        ],
        correctIndex: 2,
        explanation: 'HTTP 404 Not Found indicates that the server cannot locate the requested URI.'
      },
      {
        id: 'q-api-3',
        question: 'What is CORS (Cross-Origin Resource Sharing) in web browsers?',
        options: [
          'A video streaming compression format',
          'A browser security mechanism that restricts HTTP requests made to another domain',
          'A CSS preprocessor',
          'An offline database cache'
        ],
        correctIndex: 1,
        explanation: 'CORS is an HTTP-header based security feature allowing servers to indicate who can load their resources.'
      },
      {
        id: 'q-api-4',
        question: 'What is JSON Web Token (JWT) typically used for in web applications?',
        options: [
          'Storing high-definition image assets',
          'Stateless user authentication and secure claim transmission',
          'Rendering React components faster',
          'Routing database transactions'
        ],
        correctIndex: 1,
        explanation: 'JWTs encode signed JSON payloads used to verify authenticated user sessions statelessly.'
      },
      {
        id: 'q-api-5',
        question: 'What is the characteristic of an "idempotent" HTTP operation?',
        options: [
          'It can only be executed once during server lifetime',
          'Making multiple identical requests has the same intended effect as a single request',
          'It runs asynchronously in background threads',
          'It does not require headers'
        ],
        correctIndex: 1,
        explanation: 'GET, PUT, and DELETE are idempotent because executing them repeatedly results in the same state.'
      }
    ]
  },
  {
    id: 'quiz-embedded-gpio',
    title: 'Embedded Systems & GPIO Check',
    category: 'skills',
    passingScore: 60,
    questions: [
      {
        id: 'q-emb-1',
        question: 'What does GPIO stand for in microcontroller hardware?',
        options: [
          'General Purpose Input/Output',
          'Global Processor Internal Operations',
          'Ground Power Interface Optocoupler',
          'Graph Processing Integrated Oscillator'
        ],
        correctIndex: 0,
        explanation: 'GPIO pins can be configured by software as either digital inputs or digital outputs.'
      },
      {
        id: 'q-emb-2',
        question: 'What technique is used to simulate analog voltage output using a digital GPIO pin?',
        options: ['Frequency Modulation', 'Pulse Width Modulation (PWM)', 'Direct Memory Access', 'Phase Inversion'],
        correctIndex: 1,
        explanation: 'PWM rapidly toggles digital pin HIGH and LOW; the duty cycle controls the average perceived voltage.'
      },
      {
        id: 'q-emb-3',
        question: 'Which serial communication protocol uses two lines named SDA and SCL?',
        options: ['SPI', 'UART', 'I2C', 'RS-485'],
        correctIndex: 2,
        explanation: 'I2C (Inter-Integrated Circuit) uses Serial Data (SDA) and Serial Clock (SCL).'
      },
      {
        id: 'q-emb-4',
        question: 'What is the role of an Interrupt Service Routine (ISR)?',
        options: [
          'To format the microcontroller flash memory',
          'A special function executed immediately when a specific hardware interrupt event occurs',
          'To compress sensor telemetry before Wi-Fi transmission',
          'To calibrate analog reference voltage once per hour'
        ],
        correctIndex: 1,
        explanation: 'An ISR temporarily pauses main execution to handle urgent hardware events (like pin state change or timer alarm).'
      },
      {
        id: 'q-emb-5',
        question: 'Why do pull-up or pull-down resistors get configured on input pins?',
        options: [
          'To double the clock speed of the MCU',
          'To prevent floating pin states when no external signal is connected',
          'To dissipate excessive heat generated by the crystal',
          'To switch the MCU into sleep mode'
        ],
        correctIndex: 1,
        explanation: 'Floating pins pick up ambient electromagnetic noise; pull-up/down resistors anchor them to a defined logic state.'
      }
    ]
  },
  {
    id: 'quiz-dsa-trees-graphs',
    title: 'Trees & Graphs Advanced Assessment',
    category: 'practice',
    passingScore: 65,
    questions: [
      {
        id: 'q-tg-1',
        question: 'What is the maximum number of nodes at level `k` (with root at level 0) in a binary tree?',
        options: ['k^2', '2^k', '2^(k+1)', '2k'],
        correctIndex: 1,
        explanation: 'Level 0 has 1 (2^0), level 1 has 2 (2^1), level 2 has 4 (2^2), so level k has 2^k nodes.'
      },
      {
        id: 'q-tg-2',
        question: 'Which graph traversal algorithm uses a First-In, First-Out (FIFO) queue?',
        options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Dijkstra with Priority Queue', 'Tarjan\'s Algorithm'],
        correctIndex: 1,
        explanation: 'BFS explores vertices level by level using a standard queue.'
      },
      {
        id: 'q-tg-3',
        question: 'In a Binary Search Tree (BST), what traversal produces node keys in ascending sorted order?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
        correctIndex: 1,
        explanation: 'Inorder traversal visits Left subtree, current Node, then Right subtree, producing sorted output.'
      },
      {
        id: 'q-tg-4',
        question: 'What is the time complexity of Dijkstra\'s algorithm using a min-heap on a graph with V vertices and E edges?',
        options: ['O(V^2)', 'O(E log V)', 'O(V + E)', 'O(V!)'],
        correctIndex: 1,
        explanation: 'Using a binary min-heap priority queue, Dijkstra\'s algorithm runs in O((V + E) log V) or O(E log V).'
      },
      {
        id: 'q-tg-5',
        question: 'What is the defining property of a Directed Acyclic Graph (DAG)?',
        options: [
          'It has no vertices with degree greater than 2',
          'It contains directed edges and zero directed cycles',
          'All edge weights must be positive integers',
          'Every node can reach every other node'
        ],
        correctIndex: 1,
        explanation: 'A DAG has directed edges with no path starting and ending at the same node (no directed cycles).'
      }
    ]
  },
  {
    id: 'quiz-cs-core',
    title: 'Operating Systems & Networks Core Check',
    category: 'skills',
    passingScore: 60,
    questions: [
      {
        id: 'q-cs-1',
        question: 'What is the condition where two or more processes are unable to proceed because each is waiting for the other to release a lock?',
        options: ['Starvation', 'Deadlock', 'Race Condition', 'Context Switch'],
        correctIndex: 1,
        explanation: 'Deadlock occurs when processes hold resources while waiting indefinitely for resources held by others.'
      },
      {
        id: 'q-cs-2',
        question: 'Which transport layer protocol provides connection-oriented, reliable, and ordered byte-stream delivery?',
        options: ['UDP', 'TCP', 'ICMP', 'ARP'],
        correctIndex: 1,
        explanation: 'TCP (Transmission Control Protocol) establishes a 3-way handshake and guarantees delivery and order.'
      },
      {
        id: 'q-cs-3',
        question: 'What is Virtual Memory in modern operating systems?',
        options: [
          'Simulated memory stored inside cloud servers',
          'A memory management capability that provides an idealized abstraction of storage resources using disk paging',
          'The onboard cache inside the CPU core',
          'A GPU rendering pipeline'
        ],
        correctIndex: 1,
        explanation: 'Virtual memory maps virtual addresses to physical RAM or page files on disk, enabling process isolation.'
      },
      {
        id: 'q-cs-4',
        question: 'What is the fundamental difference between a Process and a Thread?',
        options: [
          'Processes share memory by default; threads do not',
          'A process has its own independent address space; threads within the same process share that address space',
          'Threads are scheduled by hardware; processes are scheduled by Python',
          'Processes cannot execute concurrent code'
        ],
        correctIndex: 1,
        explanation: 'Processes have independent virtual address spaces, while threads within a process share code, data, and open files.'
      },
      {
        id: 'q-cs-5',
        question: 'In computer networking, what is the role of the DNS (Domain Name System)?',
        options: [
          'To encrypt password strings in Wi-Fi routers',
          'To translate human-friendly domain names (e.g. google.com) into numerical IP addresses',
          'To assign MAC addresses to network cards',
          'To balance electric voltage across Ethernet cables'
        ],
        correctIndex: 1,
        explanation: 'DNS acts as the internet directory, resolving domain hostnames to IP addresses.'
      }
    ]
  },
  {
    id: 'quiz-placement-aptitude',
    title: 'Campus Placement Speed Aptitude Test',
    category: 'practice',
    passingScore: 70,
    questions: [
      {
        id: 'q-pla-1',
        question: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both are opened together, how long does it take to fill?',
        options: ['10 mins', '12 mins', '15 mins', '25 mins'],
        correctIndex: 1,
        explanation: 'Rate = 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12. Time taken = 12 minutes.'
      },
      {
        id: 'q-pla-2',
        question: 'If 6 men or 8 women can reap a field in 86 days, how long will 14 men and 10 women take to reap it?',
        options: ['24 days', '28 days', '32 days', '36 days'],
        correctIndex: 0,
        explanation: '6 men = 8 women => 1 man = 4/3 women. 14 men = 56/3 women. Total women = 56/3 + 10 = 86/3 women. Days = (8 * 86) / (86/3) = 24 days.'
      },
      {
        id: 'q-pla-3',
        question: 'What is the angle between the hour hand and the minute hand of a clock at 3:40?',
        options: ['120 degrees', '130 degrees', '140 degrees', '150 degrees'],
        correctIndex: 1,
        explanation: 'Angle = |30*H - (11/2)*M| = |30*3 - (11/2)*40| = |90 - 220| = 130 degrees.'
      },
      {
        id: 'q-pla-4',
        question: 'In how many ways can the letters of the word "LEADER" be arranged?',
        options: ['72', '144', '360', '720'],
        correctIndex: 2,
        explanation: 'Total letters = 6, with "E" repeating 2 times. Total permutations = 6! / 2! = 720 / 2 = 360.'
      },
      {
        id: 'q-pla-5',
        question: 'A sum of money invested at simple interest doubles in 8 years. What is the annual rate of interest?',
        options: ['10%', '12.5%', '14%', '15%'],
        correctIndex: 1,
        explanation: 'SI = P. P = (P * R * 8) / 100 => R = 100 / 8 = 12.5%.'
      }
    ]
  },
  {
    id: 'quiz-behavioral-hr',
    title: 'HR & Behavioral Interview Competency Check',
    category: 'practice',
    passingScore: 60,
    questions: [
      {
        id: 'q-hr-1',
        question: 'What does the STAR framework stand for when answering behavioral questions?',
        options: [
          'Situation, Task, Action, Result',
          'Strategy, Target, Allocation, Return',
          'Skill, Technology, Application, Review',
          'Summary, Test, Achievement, Rating'
        ],
        correctIndex: 0,
        explanation: 'STAR stands for Situation, Task, Action, and Result — the structured standard for storytelling in interviews.'
      },
      {
        id: 'q-hr-2',
        question: 'When asked "What is your greatest weakness?", which approach is most effective?',
        options: [
          'Say "I have no real weaknesses, I am a perfectionist"',
          'Mention a genuine professional area of improvement and describe the active steps you are taking to overcome it',
          'Blame past professors or college team members',
          'Refuse to answer the question'
        ],
        correctIndex: 1,
        explanation: 'Interviewers look for self-awareness and proactive learning rather than deflection.'
      },
      {
        id: 'q-hr-3',
        question: 'At the end of an interview when the interviewer asks "Do you have any questions for us?", what should you do?',
        options: [
          'Say "No, I am good" and leave immediately',
          'Ask thoughtful questions about engineering culture, tech stack challenges, or mentorship programs',
          'Ask how many paid leaves you get in your first month',
          'Ask when you will receive your joining bonus'
        ],
        correctIndex: 1,
        explanation: 'Asking informed questions shows genuine enthusiasm and strategic interest in the organization.'
      },
      {
        id: 'q-hr-4',
        question: 'When asked to explain a team conflict during a college hackathon or project, what should your focus be?',
        options: [
          'Explaining why the other person was incompetent',
          'Highlighting constructive communication, finding common technical ground, and delivering the project on time',
          'Stating that you took over the entire project alone',
          'Ignoring the conflict because it was unimportant'
        ],
        correctIndex: 1,
        explanation: 'Companies evaluate how you de-escalate disagreement and collaborate under tight deadlines.'
      },
      {
        id: 'q-hr-5',
        question: 'Why should you quantify project accomplishments on your resume and in interviews (e.g. "reduced latency by 35%")?',
        options: [
          'Because numbers make the document look longer',
          'Because concrete metrics provide verifiable proof of your technical contribution and impact',
          'To confuse non-technical recruiters',
          'It is a mandatory legal requirement'
        ],
        correctIndex: 1,
        explanation: 'Measurable outcomes prove that your code provided tangible value rather than just following a tutorial.'
      }
    ]
  }
];

export const INITIAL_PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'proj-01',
    title: 'Distributed In-Memory Key-Value Cache Engine',
    description: 'Build a high-performance in-memory key-value storage engine supporting TTL expiration, LRU eviction policy, and TCP/REST network interfaces.',
    branch: ['CSE', 'IT'],
    year: [2, 3, 4],
    careerGoal: ['Software Development', 'AI/Data Science'],
    difficulty: 'Intermediate',
    techStack: ['Node.js / Go / C++', 'TypeScript', 'TCP Sockets', 'Jest'],
    learningOutcomes: [
      'Understand hash indexing and O(1) memory lookup algorithms',
      'Implement doubly linked list and hash map for Least Recently Used (LRU) cache',
      'Handle concurrent connection lifecycles and thread-safe operations'
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Milestone 1: Repository Architecture & Data Structure Design',
        description: 'Initialize Git repo with README, configure TypeScript/Go build, implement core Map & Doubly Linked List for LRU cache.',
        verificationHint: 'Requires public GitHub repo with >= 2 commits and detailed architecture diagram in README.',
        points: 30
      },
      {
        id: 'm2',
        title: 'Milestone 2: Protocol Layer & TTL Eviction Engine',
        description: 'Expose TCP socket or HTTP REST handlers, implement background TTL sweep routine, and write automated unit test suites.',
        verificationHint: 'Requires >= 5 commits with passing test scripts.',
        points: 40
      },
      {
        id: 'm3',
        title: 'Milestone 3: Benchmark Suite, Dockerization & Live Demo',
        description: 'Containerize application with Dockerfile, generate throughput latency benchmarks, and host live deployment.',
        verificationHint: 'Requires >= 8 commits with Dockerfile and benchmark results.',
        points: 50
      }
    ],
    repoGuidelines: 'Create a public repository named `distributed-kv-cache` with clear setup instructions in README.md.'
  },
  {
    id: 'proj-02',
    title: 'Autonomous Campus Placement Portal & ATS Ranker',
    description: 'A full-stack student placement coordination system with automated resume parsing, eligibility filters, and application tracking pipelines.',
    branch: ['CSE', 'IT'],
    year: [2, 3, 4],
    careerGoal: ['Software Development', 'AI/Data Science', 'Exploring'],
    difficulty: 'Intermediate',
    techStack: ['React', 'TypeScript', 'Node.js / Express', 'PostgreSQL / SQLite', 'Tailwind CSS'],
    learningOutcomes: [
      'Design relational schemas for users, company drives, applications, and rounds',
      'Implement role-based access control (Student vs Training & Placement Officer)',
      'Build responsive UI pipelines with real-time status transitions'
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Milestone 1: Schema Specification & Auth System',
        description: 'Configure Vite/React frontend and Express backend with JWT role authentication and database migrations.',
        verificationHint: 'Requires public GitHub repo with >= 3 commits and working auth endpoints.',
        points: 30
      },
      {
        id: 'm2',
        title: 'Milestone 2: Drive Creation & Student Application Pipeline',
        description: 'TPO can create recruitment drives with CGPA cutoffs; eligible students can apply with uploaded resumes.',
        verificationHint: 'Requires >= 6 commits with relational schema migrations.',
        points: 40
      },
      {
        id: 'm3',
        title: 'Milestone 3: Export Reports & Production Deployment',
        description: 'Generate CSV shortlist exports for companies and deploy to Vercel/Render with documentation.',
        verificationHint: 'Requires >= 9 commits with deployment URL in README.',
        points: 50
      }
    ],
    repoGuidelines: 'Create a public repository named `campus-placement-portal` with setup instructions.'
  },
  {
    id: 'proj-03',
    title: 'IoT Real-Time Environmental Sensor & Telemetry Node',
    description: 'Design an ESP32 or Arduino-based environmental telemetry node with DHT22 temperature/humidity sensor, OLED display, and MQTT cloud logging.',
    branch: ['ECE', 'EEE', 'Mechanical'],
    year: [2, 3, 4],
    careerGoal: ['Core Engineering', 'Software Development'],
    difficulty: 'Intermediate',
    techStack: ['ESP32 / Arduino', 'C / C++', 'MQTT / HTTP', 'Adafruit Libraries', 'FreeRTOS'],
    learningOutcomes: [
      'Configure ADC pins, I2C bus communications, and hardware timers',
      'Implement non-blocking FreeRTOS tasks for sampling and Wi-Fi transmission',
      'Publish telemetry data to a cloud MQTT broker'
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Milestone 1: Circuit Schematic & Sensor Driver Scaffolding',
        description: 'Create wiring schematic in Fritzing or Falstad, initialize Arduino/ESP-IDF codebase with sensor polling.',
        verificationHint: 'Requires public GitHub repo with schematic image and pin assignment documentation in README.',
        points: 30
      },
      {
        id: 'm2',
        title: 'Milestone 2: MQTT Telemetry & Non-Blocking Task Loop',
        description: 'Connect ESP32 to Wi-Fi, publish JSON packets every 5 seconds to public broker, and handle network disconnect reconnects.',
        verificationHint: 'Requires >= 5 commits with working C++ firmware code.',
        points: 40
      },
      {
        id: 'm3',
        title: 'Milestone 3: Hardware Enclosure CAD / Web Dashboard',
        description: 'Design 3D printable STL enclosure or build lightweight web dashboard displaying live telemetry graphs.',
        verificationHint: 'Requires >= 7 commits with CAD files or dashboard code.',
        points: 50
      }
    ],
    repoGuidelines: 'Create a public repository named `esp32-telemetry-node` with wiring diagrams.'
  },
  {
    id: 'proj-04',
    title: 'Automated CAD Parametric Generator & Structural Analyzer',
    description: 'Python script utilizing FreeCAD or OpenCASCADE API to generate parametric mechanical brackets and calculate stress load factors.',
    branch: ['Mechanical', 'Civil'],
    year: [2, 3, 4],
    careerGoal: ['Core Engineering', 'Higher Studies'],
    difficulty: 'Intermediate',
    techStack: ['Python', 'FreeCAD API / NumPy', 'Matplotlib', 'Git'],
    learningOutcomes: [
      'Write procedural 3D solid geometry generation scripts',
      'Calculate cross-sectional moment of inertia and bending moments',
      'Export automated STEP and STL manufacturing files'
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Milestone 1: Mathematical Model & Script Scaffolding',
        description: 'Implement calculation functions for moment of inertia, yield stress threshold, and safety factor.',
        verificationHint: 'Requires public GitHub repo with mathematical formulations in README.',
        points: 30
      },
      {
        id: 'm2',
        title: 'Milestone 2: Parametric Solid Generation',
        description: 'Generate 3D bracket solid with variable fillet radii and bolt hole spacing based on input load parameters.',
        verificationHint: 'Requires >= 5 commits with exported sample STL models.',
        points: 40
      },
      {
        id: 'm3',
        title: 'Milestone 3: Stress Heatmap & CLI Interface',
        description: 'Create interactive command-line tool with visual stress distribution plot generation.',
        verificationHint: 'Requires >= 8 commits with CLI documentation.',
        points: 50
      }
    ],
    repoGuidelines: 'Create a public repository named `parametric-cad-analyzer` with sample models.'
  }
];

export const INITIAL_OPPORTUNITIES: InternshipOpportunity[] = [
  {
    id: 'opp-01',
    company: 'Razorpay',
    role: 'Software Engineering Intern (Backend & Payments)',
    location: 'Bengaluru / Hybrid',
    type: 'Summer Internship',
    stipend: '₹45,000 / month',
    branch: ['CSE', 'IT', 'ECE'],
    requirements: ['Data Structures & Algorithms (C++/Java/Go)', 'REST API fundamentals', 'Basic SQL knowledge'],
    verifiedSource: 'Razorpay Official Careers Portal (Verified Listing)',
    lastCheckedDate: '2026-10-01',
    applicationLink: 'https://razorpay.com/jobs',
    isVerified: true
  },
  {
    id: 'opp-02',
    company: 'Texas Instruments',
    role: 'Analog & Embedded Systems Intern',
    location: 'Bengaluru, India',
    type: 'Summer Internship',
    stipend: '₹50,000 / month',
    branch: ['ECE', 'EEE'],
    requirements: ['Circuit analysis & Op-Amps', 'Microcontroller architecture (ARM Cortex/MSP430)', 'C programming'],
    verifiedSource: 'Texas Instruments University Relations Board',
    lastCheckedDate: '2026-09-28',
    applicationLink: 'https://careers.ti.com',
    isVerified: true
  },
  {
    id: 'opp-03',
    company: 'Tata Consultancy Services (TCS Digital)',
    role: 'Digital Systems & Cloud Engineering Intern',
    location: 'Pan-India',
    type: 'Full-Time Internship',
    stipend: '₹25,000 / month',
    branch: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'],
    requirements: ['Quantitative aptitude proficiency', 'Python / Java / C++', 'Object-Oriented Design'],
    verifiedSource: 'TCS NextStep National Qualifier Portal',
    lastCheckedDate: '2026-10-05',
    applicationLink: 'https://nextstep.tcs.com',
    isVerified: true
  },
  {
    id: 'opp-04',
    company: 'Siemens Technology',
    role: 'R&D Industrial Automation & Digital Twin Intern',
    location: 'Pune / Bengaluru',
    type: 'Winter Internship',
    stipend: '₹35,000 / month',
    branch: ['ECE', 'EEE', 'Mechanical', 'CSE'],
    requirements: ['PLC/SCADA fundamentals or C++ / Python', 'Control systems knowledge', 'Problem-solving mindset'],
    verifiedSource: 'Siemens Careers University Talent Pool',
    lastCheckedDate: '2026-09-30',
    applicationLink: 'https://jobs.siemens.com',
    isVerified: true
  },
  {
    id: 'opp-05',
    company: 'Larsen & Toubro (L&T Construction)',
    role: 'Graduate Trainee Intern (BIM & Structural Modeling)',
    location: 'Chennai / Mumbai',
    type: 'Summer Internship',
    stipend: '₹22,000 / month',
    branch: ['Civil', 'Mechanical'],
    requirements: ['AutoCAD & Revit / STAAD.Pro proficiency', 'Structural engineering basics', 'Site surveying familiarity'],
    verifiedSource: 'L&T Build India Scholarship & Intern Portal',
    lastCheckedDate: '2026-10-02',
    applicationLink: 'https://www.larsentoubro.com/corporate/careers',
    isVerified: true
  }
];
