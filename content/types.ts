export interface Step {
  title: string;
  text: string;
}

export type FilterKey = "all" | "color" | "bw" | "portraits" | "memories" | "custom";

export interface Dictionary {
  meta: { title: string; description: string; ogAlt: string };
  nav: {
    home: string;
    about: string;
    work: string;
    process: string;
    diy: string;
    contact: string;
    menu: string;
    close: string;
    cta: string;
    skip: string;
    language: string;
    primary: string;
  };
  hero: { line1: string; line2: string; sub: string; cta: string; secondary: string; artAlt: string; scroll: string };
  intro: { label: string; title: string; paragraphs: string[] };
  beforeAfter: {
    label: string;
    title: string;
    lead: string;
    original: string;
    art: string;
    slider: string;
    hint: string;
    pairsLabel: string;
    pairs: string[];
    originalAlt: string;
    artAlt: string;
  };
  craft: {
    label: string;
    title: string;
    lead: string;
    handsSlot: string;
    details: { title: string; text: string; slot: string }[];
  };
  process: { label: string; title: string; lead: string; steps: Step[]; stepWord: string };
  color: { label: string; title: string; lead: string };
  bw: { label: string; title: string; lead: string };
  gallery: {
    label: string;
    title: string;
    lead: string;
    note: string;
    filtersLabel: string;
    filters: Record<FilterKey, string>;
    count: string;
    open: string;
    close: string;
    prev: string;
    next: string;
    zoomIn: string;
    zoomOut: string;
    category: string;
    technique: string;
    techniqueValue: string;
    tone: string;
    toneColor: string;
    toneBw: string;
    detail: string;
    dialog: string;
  };
  about: { label: string; title: string; paragraphs: string[]; slot: string };
  diy: {
    label: string;
    title: string;
    soon: string;
    lead: string;
    steps: Step[];
    stageLabel: string;
    kitTitle: string;
    kit: string[];
    codeLabel: string;
    back: string;
    next: string;
    note: string;
  };
  contact: {
    label: string;
    title: string;
    lead: string;
    whatsapp: string;
    whatsappAria: string;
    instagram: string;
    instagramAria: string;
    closing: string;
  };
  footer: { statement: string; rights: string; made: string };
  cursor: { view: string; drag: string; open: string };
  slot: string;
}
