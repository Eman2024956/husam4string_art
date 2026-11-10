import type { Shape } from "@/lib/thread";
import type { Locale } from "./site";

export type Tone = "color" | "bw";
export type Category = "portraits" | "memories" | "custom";

export interface Artwork {
  id: string;
  title: Record<Locale, string>;
  tone: Tone;
  category: Category;
  /**
   * Real photography. Add files under /public/images/looma/artworks/<color|black-white>/
   * and set `image` (and optionally `detailImage`, `processImage`). While empty, the
   * site draws a placeholder piece from `art` so the layout can be judged.
   */
  image?: string;
  detailImage?: string;
  processImage?: string;
  alt: Record<Locale, string>;
  art: { kind: "shape"; shape: Shape; seed: number } | { kind: "ring"; nails: number; k: number };
  /** Span on the 12-column wall and vertical offset, so the wall looks hung, not packed. */
  wall: { span: 3 | 4 | 5 | 6; offset: 0 | 1 | 2 };
}

/** Placeholder hanging. Titles describe the slot, not a real commission. */
export const artworks: Artwork[] = [
  {
    id: "portrait-study",
    title: { en: "Portrait study", ar: "دراسة بورتريه" },
    tone: "color",
    category: "portraits",
    alt: { en: "Placeholder: thread portrait of one person, colour", ar: "نموذج مؤقت: بورتريه بالخيوط لشخص واحد، ملوّن" },
    art: { kind: "shape", shape: "bust", seed: 11 },
    wall: { span: 5, offset: 0 },
  },
  {
    id: "two-together",
    title: { en: "Two together", ar: "اثنان معاً" },
    tone: "bw",
    category: "memories",
    alt: { en: "Placeholder: thread artwork of two people side by side, black and white", ar: "نموذج مؤقت: لوحة خيوط لشخصين جنباً إلى جنب، أبيض وأسود" },
    art: { kind: "shape", shape: "duo", seed: 23 },
    wall: { span: 4, offset: 2 },
  },
  {
    id: "ring-composition",
    title: { en: "Ring composition", ar: "تكوين دائري" },
    tone: "color",
    category: "custom",
    alt: { en: "Placeholder: abstract thread composition strung around a ring of nails", ar: "نموذج مؤقت: تكوين تجريدي بالخيوط حول حلقة من المسامير" },
    art: { kind: "ring", nails: 150, k: 2 },
    wall: { span: 3, offset: 1 },
  },
  {
    id: "parent-and-child",
    title: { en: "Parent and child", ar: "أب وطفل" },
    tone: "bw",
    category: "portraits",
    alt: { en: "Placeholder: thread artwork of an adult and a child, black and white", ar: "نموذج مؤقت: لوحة خيوط لشخص بالغ وطفل، أبيض وأسود" },
    art: { kind: "shape", shape: "child", seed: 37 },
    wall: { span: 4, offset: 1 },
  },
  {
    id: "family-memory",
    title: { en: "Family memory", ar: "ذكرى عائلية" },
    tone: "color",
    category: "memories",
    alt: { en: "Placeholder: thread artwork of two family members, colour", ar: "نموذج مؤقت: لوحة خيوط لفردين من العائلة، ملوّنة" },
    art: { kind: "shape", shape: "duo", seed: 58 },
    wall: { span: 5, offset: 0 },
  },
  {
    id: "quiet-portrait",
    title: { en: "Quiet portrait", ar: "بورتريه هادئ" },
    tone: "bw",
    category: "portraits",
    alt: { en: "Placeholder: thread portrait of one person, black and white", ar: "نموذج مؤقت: بورتريه بالخيوط لشخص واحد، أبيض وأسود" },
    art: { kind: "shape", shape: "bust", seed: 71 },
    wall: { span: 3, offset: 2 },
  },
  {
    id: "woven-ring",
    title: { en: "Woven ring", ar: "حلقة منسوجة" },
    tone: "bw",
    category: "custom",
    alt: { en: "Placeholder: dense abstract thread pattern on a ring of nails", ar: "نموذج مؤقت: نقش تجريدي كثيف بالخيوط على حلقة من المسامير" },
    art: { kind: "ring", nails: 180, k: 3 },
    wall: { span: 4, offset: 0 },
  },
  {
    id: "first-steps",
    title: { en: "First steps", ar: "الخطوات الأولى" },
    tone: "color",
    category: "memories",
    alt: { en: "Placeholder: thread artwork of an adult with a small child, colour", ar: "نموذج مؤقت: لوحة خيوط لشخص بالغ مع طفل صغير، ملوّنة" },
    art: { kind: "shape", shape: "child", seed: 93 },
    wall: { span: 5, offset: 1 },
  },
];
