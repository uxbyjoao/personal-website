/**
 * Type declarations
 */
interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  key: boolean;
  description: string[];
  skills: Array<
    | "HTML"
    | "CSS"
    | "JavaScript"
    | "React"
    | "Vue"
    | "NextJS"
    | "Gatsby"
    | "Bootstrap"
    | "TailwindCSS"
    | "Squarespace"
    | "Jekyll"
    | "Sketch"
    | "Figma"
    | "ZeroHeight"
    | "Zeplin"
    | "Principle"
    | "Adobe Creative Suite"
    | "Tokens Studio"
    | "LottieFiles"
    | "ProtoPie"
    | "Google Analytics"
    | "Contentful"
    | "Ableton Live"
    | "Logic Pro"
    | "PHP"
    | "WordPress"
  >;
}

interface Education {
  institution: string;
  location: string;
  endDate: string;
  description: string[];
}

interface SocialMedia {
  name: string;
  icon: string;
  url: string;
}

/**
 * Experience
 */
export const experience: Experience[] = [
  {
    title: "Senior UX Designer",
    company: "Nivoda",
    location: "London, England (Remote)",
    startDate: "Apr 2022",
    endDate: "Present",
    key: true,
    description: [
      "Researching, designing, prototyping, testing and delivering digital experiences for web and mobile.",
      "Designing for IoT, inventory management systems and e-commerce experiences — both B2C and B2B2C.",
      "Building, managing and maintaining custom design systems, working closely with developers.",
      "Coaching designers and leadership on design systems development, methodology and Figma best practices.",
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Figma",
      "ProtoPie",
      "ZeroHeight",
      "LottieFiles",
    ],
  },
  {
    title: "Senior UX/UI Designer",
    company: "Aklamio",
    location: "Berlin, Germany (Hybrid)",
    startDate: "Jan 2022",
    endDate: "Apr 2022",
    key: false,
    description: [
      "Contributed for foundational development of custom end-to-end design system.",
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Figma",
      "TailwindCSS",
      "Tokens Studio",
      "LottieFiles",
    ],
  },
  {
    title: "UI Designer",
    company: "Contentful",
    location: "Berlin, Germany (Hybrid)",
    startDate: "Sep 2021",
    endDate: "Dec 2021",
    key: true,
    description: [
      "Delivered UI design for Contentful's marketing website, with hundreds of thousands of accesses worldwide daily.",
      "Contributed to Contentful's marketing website's design system.",
      "Assisted in optimizing assets and animations.",
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Gatsby",
      "Figma",
      "Contentful",
      "LottieFiles",
    ],
  },
  {
    title: "UX/UI Designer",
    company: "Aklamio",
    location: "Berlin, Germany (Hybrid)",
    startDate: "Aug 2021",
    endDate: "Sep 2021",
    key: false,
    description: [
      "Delivered foundational research, including heuristics evaluation, user journey mapping, among others.",
      "Contributed for foundational development of custom end-to-end design system.",
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Figma",
      "TailwindCSS",
      "Tokens Studio",
      "LottieFiles",
    ],
  },
  {
    title: "UX/UI Designer",
    company: "NE2 Group",
    location: "Calgary, Alberta, Canada (Remote)",
    startDate: "Sep 2019",
    endDate: "Aug 2021",
    key: true,
    description: [
      "Performed research, design, prototyping and testing for web and mobile experiences in the energy trading sector.",
      "Designed a complex trading application used by 350 companies and 2500 users worldwide on a daily basis.",
      "Developed from scratch and managed a custom design system using Figma, ZeroHeight & Zeplin.",
      "Designed and developed static websites and rich interactive prototypes using React and Vue.",
      "Delivered complete company rebrand including brand study, stationery design, office signage etc.",
    ],
    skills: [
      "Adobe Creative Suite",
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "TailwindCSS",
      "React",
      "Vue",
      "NextJS",
      "Squarespace",
      "Figma",
      "ZeroHeight",
      "Zeplin",
    ],
  },
  {
    title: "UX/UI Designer, Front-End Developer",
    company: "Freelance",
    location: "Fortaleza, Brazil",
    startDate: "2014",
    endDate: "Sep 2019",
    key: false,
    description: [
      "Brand, print, web and app design for myriad local clients.",
      "Designed and developed responsive static websites.",
    ],
    skills: [
      "Adobe Creative Suite",
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Jekyll",
      "Sketch",
      "Figma",
      "Principle",
    ],
  },
  {
    title: "Senior Art Director, Web Designer",
    company: "Convertte",
    location: "Fortaleza, Brazil",
    startDate: "2012",
    endDate: "2014",
    key: false,
    description: [
      "Performed creative direction and design for award-winning digital advertising campaigns.",
      "Designed for responsive web and native apps.",
    ],
    skills: [
      "Adobe Creative Suite",
      "Sketch",
      "HTML",
      "CSS",
      "Google Analytics",
    ],
  },
  {
    title: "Web & Graphic Designer",
    company: "Reimagine Comunicação",
    location: "Fortaleza, Brazil",
    startDate: "2012",
    endDate: "2012",
    key: false,
    description: [
      "Designed advertising campaigns for print & web media.",
      "Designed websites for clients, working closely with developers.",
    ],
    skills: ["Adobe Creative Suite", "HTML", "CSS"],
  },
  {
    title: "Professional Musician",
    company: "Freelance",
    location: "Fortaleza, Brazil",
    startDate: "2010",
    endDate: "2017",
    key: false,
    description: [
      "Professional performing musician.",
      "Live performance, sound engineering, mixing/mastering & producing.",
    ],
    skills: [
      "Adobe Creative Suite",
      "HTML",
      "CSS",
      "Ableton Live",
      "Logic Pro",
    ],
  },
  {
    title: "Art Director",
    company: "Paz Comunicação Estratégica",
    location: "Fortaleza, Brazil (Contract)",
    startDate: "2008",
    endDate: "2008",
    key: false,
    description: [
      "Worked as a designer for local politician Patricia Saboya's bid for mayor.",
      "Designed & developed websites, ads for TV & print.",
    ],
    skills: ["Adobe Creative Suite", "HTML", "CSS", "PHP", "WordPress"],
  },
  {
    title: "Art Direction Intern",
    company: "Ágil",
    location: "Fortaleza, Brazil",
    startDate: "2007",
    endDate: "2008",
    key: false,
    description: ["Designed ad campaigns for print & web media."],
    skills: ["Adobe Creative Suite"],
  },
];

/**
 * Education
 */
export const education: Education[] = [
  {
    institution: "Rhine-Waal University of Applied Sciences",
    location: "Kamp-Lintfort, North Rhine-Westphalia, Germany",
    endDate: "Ongoing",
    description: ["M. Sc. in Usability Engineering"],
  },
  {
    institution: "Rhine-Waal University of Applied Sciences",
    location: "Kleve, North Rhine-Westphalia, Germany",
    endDate: "2019 (Incomplete)",
    description: [
      "Incomplete B. Sc. in Mechatronics Systems Engineering (4 semesters)",
    ],
  },
  {
    institution: "Universidade de Fortaleza (UNIFOR)",
    location: "Fortaleza, Brazil",
    endDate: "2015",
    description: ["B. A. in Communication Sciences"],
  },
];

/**
 * Social Media
 */
export const socialMedia: SocialMedia[] = [
  {
    name: "GitHub",
    icon: "tabler:brand-github",
    url: "https://github.com/uxbyjoao",
  },
  {
    name: "Behance",
    icon: "tabler:brand-behance",
    url: "https://www.behance.net/uxbyjoao",
  },
  {
    name: "LinkedIn",
    icon: "tabler:brand-linkedin",
    url: "https://www.linkedin.com/in/jlfgms/",
  },
];
