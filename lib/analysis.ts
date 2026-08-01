export type VerificationState = "verified" | "edited" | "missing";

export type AssetAnalysis = {
  id: string;
  name: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  fingerprint: string;
  createdAt: string;
  state: VerificationState;
  score: number;
  signer: string | null;
  ingredients: number;
  warnings: string[];
};

const hex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

const imageDimensions = (file: File) =>
  new Promise<{ width?: number; height?: number }>((resolve) => {
    if (!file.type.startsWith("image/")) return resolve({});
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });

export async function inspectFile(
  file: File,
  onProgress: (progress: number, label: string) => void,
) {
  const stages = [
    [12, "Reading asset bytes"],
    [34, "Calculating fingerprint"],
    [58, "Locating Content Credentials"],
    [76, "Checking manifest structure"],
    [92, "Preparing evidence report"],
  ] as const;

  onProgress(4, "Opening asset");
  const buffer = await file.arrayBuffer();
  for (const [progress, label] of stages) {
    onProgress(progress, label);
    await new Promise((resolve) => window.setTimeout(resolve, 170));
  }

  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const dimensions = await imageDimensions(file);
  onProgress(100, "Analysis ready");

  return {
    id: crypto.randomUUID(),
    name: file.name,
    mime: file.type || "application/octet-stream",
    size: file.size,
    ...dimensions,
    fingerprint: hex(digest),
    createdAt: new Date().toISOString(),
    state: "missing" as const,
    score: 0,
    signer: null,
    ingredients: 0,
    warnings: [
      "No embedded Content Credential was detected by the browser demo.",
      "Absence of provenance data does not mean the content is false.",
    ],
  } satisfies AssetAnalysis;
}

export const demoAssets: AssetAnalysis[] = [
  {
    id: "northstar-editorial",
    name: "northstar-editorial.jpg",
    mime: "image/jpeg",
    size: 18_400_000,
    width: 4096,
    height: 2731,
    fingerprint:
      "8f42a91c7460d3b8c654efe63a78ae94c37d0ce29b7a287ff91b6937771484c2",
    createdAt: "2026-07-31T06:42:00.000Z",
    state: "verified",
    score: 100,
    signer: "Northstar News",
    ingredients: 3,
    warnings: [],
  },
  {
    id: "campaign-export",
    name: "campaign-export.png",
    mime: "image/png",
    size: 8_200_000,
    width: 2400,
    height: 1600,
    fingerprint:
      "31af07eaee0e96d657a666a182d89cad0b003cf30c542dbf5fb753b1f0fbcc2d",
    createdAt: "2026-07-30T11:18:00.000Z",
    state: "edited",
    score: 86,
    signer: "Northstar Studio",
    ingredients: 5,
    warnings: ["Declared crop and color adjustment found."],
  },
  {
    id: "social-repost",
    name: "social-repost.webp",
    mime: "image/webp",
    size: 2_700_000,
    width: 1600,
    height: 1067,
    fingerprint:
      "d19fb31200c27d62176749de297e524cc753652ad203972b817f392bc58922c1",
    createdAt: "2026-07-29T16:24:00.000Z",
    state: "missing",
    score: 0,
    signer: null,
    ingredients: 0,
    warnings: [
      "No Content Credential was found. This is not evidence that the asset is false.",
    ],
  },
];

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
};

export const validateImage = (file: Pick<File, "type" | "size">) => {
  if (!file.type.startsWith("image/")) return "Choose a supported image file";
  if (file.size > 25 * 1024 * 1024)
    return "File exceeds the 25 MB browser demo limit";
  return null;
};
