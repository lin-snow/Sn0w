// All page copy lives here so it's easy to edit without touching layout.

export const intro = {
  name: "L1nSn0w",
  initial: "L", // used for the corner script monogram
  lines: [
    "Hi, I'm L1nSn0w — a 22-year-old Software Engineering student at GDUT, based in China.",
    "A full-stack dev at heart, with a soft spot for well-made products and design — the Apple & Google kind.",
    "Off the clock I'm hunting down clever software, playing The Finals, or talking tech with anyone who'll listen.",
  ],
  // Shown as the blue marginalia note.
  status:
    "Recently wrapped up at LangGenius (Dify) — open to new roles and open-source collaborations.",
  github: "https://github.com/lin-snow",
  message: "mailto:l1nsn0w@qq.com",
} as const;

// A dated row: the label on the left, the date on the right.
export type Entry = {
  label: string;
  date: string;
  href?: string;
};

export const experience: Entry[] = [
  { label: "Backend Software Engineer, LangGenius", date: "2025–Oct 2026" },
  { label: "B.Eng. Software Engineering, GDUT", date: "in progress" },
];

// A project. `date` shows on the row's hand-cut sticky tag. `href` is optional
// — omit it for closed-source / unlinked projects. `site` is an optional live /
// official site shown next to the repo link. `blurb` and `stack` fill the detail
// revealed when the row is clicked. `stamp` is the short word scrawled in the
// hand-drawn marker stamp on that detail, and `color` picks the marker accent
// it's inked in.
export type Project = {
  label: string;
  date: string;
  color: "red" | "green" | "blue";
  stamp: string;
  href?: string;
  site?: string;
  blurb?: string;
  stack?: string[];
};

export const projects: Project[] = [
  {
    label: "Ech0 — self-hosted microblog",
    href: "https://github.com/lin-snow/Ech0",
    site: "https://ech0.app",
    date: "2025",
    color: "red",
    stamp: "popular",
    blurb:
      "An open-source, self-hosted space for publishing and sharing your thoughts — your own little corner of the web.",
    stack: ["Go", "Vue"],
  },
  {
    label: "Dox — todos in terminal",
    href: "https://github.com/lin-snow/dox",
    date: "2026",
    color: "blue",
    stamp: "new",
    blurb:
      "More than a todo list: a terminal-first task manager. TUI by default, CLI for scripts — with projects, an inbox, markdown notes, full-text search, multi-user invites and an activity feed, all from one container and a single SQLite file.",
    stack: ["Go", "TypeScript"],
  },
  {
    label: "Kemate — a Vercel-like PaaS",
    date: "2026",
    color: "green",
    stamp: "WIP",
    blurb:
      "A platform-as-a-service taking aim at the likes of Vercel, built on a microservice architecture.",
    stack: ["Go"],
  },
];

export const artifacts: Entry[] = [
  {
    label: "2025 Year in Review",
    date: "2026.01",
    href: "https://blog.sn0w.fyi/posts/2025_summary/",
  },
  {
    label: "2024 Year in Review",
    date: "2025.01",
    href: "https://blog.sn0w.fyi/posts/2024_summary/",
  },
  {
    label: "2023 Year in Review",
    date: "2024.01",
    href: "https://blog.sn0w.fyi/posts/2023_summary/",
  },
];

// `heart: true` marks a "support me" link (rendered with a hand-drawn heart) so
// it reads as a CTA rather than just another profile link.
export type Link = { label: string; href: string; heart?: boolean };

export const links: Link[] = [
  { label: "GitHub", href: "https://github.com/lin-snow" },
  { label: "Blog", href: "https://blog.sn0w.fyi" },
  { label: "Memo", href: "https://memo.sn0w.fyi" },
  { label: "CV", href: "https://cv.sn0w.fyi" },
  { label: "Sponsor", href: "https://sponsor.sn0w.fyi", heart: true },
];
