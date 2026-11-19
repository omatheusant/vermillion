"use client";

/**
 * Recorte + redimensionamento no client antes do upload — nunca confia no
 * arquivo como veio do usuário. Toda imagem de retrato sai daqui com
 * proporção 3:4 (base 1536×2048, diminuída se a foto original for menor),
 * sempre reencodada como JPEG — simplifica a validação de MIME real no
 * servidor (src/lib/media.ts) e mantém o tamanho do arquivo previsível.
 */
export const PORTRAIT_ASPECT_RATIO = 3 / 4;
export const PORTRAIT_MAX_WIDTH = 1536;
export const PORTRAIT_MAX_HEIGHT = 2048;

export async function cropAndResizeToPortrait(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  try {
    const sourceRatio = bitmap.width / bitmap.height;

    let cropWidth = bitmap.width;
    let cropHeight = bitmap.height;
    if (sourceRatio > PORTRAIT_ASPECT_RATIO) {
      cropWidth = Math.round(bitmap.height * PORTRAIT_ASPECT_RATIO);
    } else if (sourceRatio < PORTRAIT_ASPECT_RATIO) {
      cropHeight = Math.round(bitmap.width / PORTRAIT_ASPECT_RATIO);
    }
    const cropX = Math.floor((bitmap.width - cropWidth) / 2);
    const cropY = Math.floor((bitmap.height - cropHeight) / 2);

    const scale = Math.min(1, PORTRAIT_MAX_WIDTH / cropWidth, PORTRAIT_MAX_HEIGHT / cropHeight);
    const outputWidth = Math.max(1, Math.round(cropWidth * scale));
    const outputHeight = Math.max(1, Math.round(cropHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível processar a imagem neste navegador.");

    ctx.drawImage(bitmap, cropX, cropY, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) throw new Error("Não foi possível gerar a imagem final.");
    return blob;
  } finally {
    bitmap.close();
  }
}
