import { isDev } from "./env";

export const SITE_CONFIG = {
  name: "LLMFlow",
  title: "LLMFlow - A Next.js shadcn/ui starter template",
  description:
    "A Next.js shadcn/ui base project for kickstarting your next web application with a modern tech stack, beautiful components, and developer-friendly setup.",
  domain: "llm-flow.vercel.app",
  url: isDev ? "http://localhost:3000" : "https://llm-flow.vercel.app",
  github: {
    name: "llm-flow",
    repo: "llm-flow",
    url: "https://github.com/daFoggo/llm-flow",
  },
  author: {
    name: "daFoggo",
    url: "https://github.com/daFoggo",
  },
};

export type ISiteConfig = typeof SITE_CONFIG;
