import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChartLine,
  CircleHelp,
  FileText,
  Flag,
  FlaskConical,
  Globe,
  Handshake,
  House,
  LayoutGrid,
  LifeBuoy,
  Newspaper,
  Package,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Workflow,
} from "lucide-react";

export type NavigationIconOption = {
  title: string;
  value: string;
  icon: LucideIcon;
  keywords?: string[];
};

export const NAVIGATION_ICON_OPTIONS: NavigationIconOption[] = [
  { title: "Home", value: "home", icon: House, keywords: ["main", "landing"] },
  { title: "Grid", value: "grid", icon: LayoutGrid, keywords: ["products", "menu"] },
  { title: "Product", value: "product", icon: Package, keywords: ["item", "catalog"] },
  { title: "Service", value: "service", icon: BriefcaseBusiness, keywords: ["offer"] },
  { title: "Blog", value: "blog", icon: Newspaper, keywords: ["post", "article"] },
  { title: "Docs", value: "docs", icon: BookOpen, keywords: ["guide", "documentation"] },
  { title: "Page", value: "page", icon: FileText, keywords: ["content"] },
  { title: "Company", value: "company", icon: Building2, keywords: ["about", "org"] },
  { title: "Contact", value: "contact", icon: Handshake, keywords: ["sales"] },
  { title: "Pricing", value: "pricing", icon: BadgeCheck, keywords: ["plan"] },
  { title: "Growth", value: "growth", icon: ChartLine, keywords: ["analytics"] },
  { title: "Rocket", value: "rocket", icon: Rocket, keywords: ["start", "launch"] },
  { title: "AI", value: "ai", icon: Sparkles, keywords: ["smart", "assistant"] },
  { title: "Magic", value: "magic", icon: WandSparkles, keywords: ["automation"] },
  { title: "Workflow", value: "workflow", icon: Workflow, keywords: ["process"] },
  { title: "Security", value: "security", icon: ShieldCheck, keywords: ["safe"] },
  { title: "Search", value: "search", icon: ScanSearch, keywords: ["find"] },
  { title: "Support", value: "support", icon: LifeBuoy, keywords: ["help", "faq"] },
  { title: "Help", value: "help", icon: CircleHelp, keywords: ["question"] },
  { title: "Global", value: "global", icon: Globe, keywords: ["world", "web"] },
  { title: "Labs", value: "labs", icon: FlaskConical, keywords: ["beta", "experiment"] },
  { title: "Program", value: "program", icon: Flag, keywords: ["community"] },
];
