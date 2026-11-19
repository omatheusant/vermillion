/**
 * Validação de imagem por assinatura binária real (magic bytes), nunca
 * só pela extensão ou pelo Content-Type declarado pelo navegador —
 * exigência explícita do documento mestre ("MIME real validado").
 */
export interface DetectedImageType {
  mime: string;
  extension: string;
}

const SIGNATURES: Array<{
  mime: string;
  extension: string;
  matches: (bytes: Uint8Array) => boolean;
}> = [
  {
    mime: "image/jpeg",
    extension: "jpg",
    matches: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: "image/png",
    extension: "png",
    matches: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    mime: "image/webp",
    extension: "webp",
    matches: (b) =>
      b.length >= 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
];

export function detectImageType(bytes: Uint8Array): DetectedImageType | null {
  for (const signature of SIGNATURES) {
    if (signature.matches(bytes)) {
      return { mime: signature.mime, extension: signature.extension };
    }
  }
  return null;
}

export function generateRandomFileName(extension: string): string {
  return `${crypto.randomUUID()}.${extension}`;
}

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

/** Retrato já sai recortado/reencodado em JPEG pelo client (src/lib/image-crop.ts) — teto maior só por segurança. */
export const MAX_PORTRAIT_BYTES = 8 * 1024 * 1024;
