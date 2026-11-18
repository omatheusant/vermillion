import { describe, it, expect } from "vitest";
import { evaluateVisibility, PRIVATE_DETAIL_FIELDS, PUBLIC_DETAIL_FIELDS } from "./evaluate-visibility";

describe("evaluateVisibility", () => {
  it("dono sempre vê tudo, mesmo rascunho privado", () => {
    const result = evaluateVisibility("owner", { visibility: "private", status: "draft" });
    expect(result.canViewCharacter).toBe(true);
    expect(result.visibleDetailFields).toEqual([...PUBLIC_DETAIL_FIELDS, ...PRIVATE_DETAIL_FIELDS]);
  });

  it("staff sempre vê tudo, inclusive campos privados, para revisão", () => {
    const result = evaluateVisibility("staff", { visibility: "private", status: "submitted" });
    expect(result.canViewCharacter).toBe(true);
    expect(result.visibleDetailFields).toContain("private_notes");
  });

  it("visitante não vê personagem privado/rascunho", () => {
    const result = evaluateVisibility("public", { visibility: "private", status: "draft" });
    expect(result.canViewCharacter).toBe(false);
    expect(result.visibleDetailFields).toEqual([]);
  });

  it("visitante não vê personagem público mas ainda não publicado", () => {
    const result = evaluateVisibility("public", { visibility: "public", status: "approved" });
    expect(result.canViewCharacter).toBe(false);
  });

  it("visitante vê só os campos públicos de um personagem published+public", () => {
    const result = evaluateVisibility("public", { visibility: "public", status: "published" });
    expect(result.canViewCharacter).toBe(true);
    expect(result.visibleDetailFields).toEqual(PUBLIC_DETAIL_FIELDS);
    expect(result.visibleDetailFields).not.toContain("private_notes");
  });
});
