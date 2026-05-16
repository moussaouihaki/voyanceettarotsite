function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strips all markdown artifacts from AI-generated text and returns clean HTML paragraphs.
 * HTML-escapes the raw output first to prevent XSS from unexpected AI-generated markup.
 */
export function cleanAIText(raw: string): string {
  const lines = escapeHtml(raw).split("\n");
  const cleaned = lines.map((line) => {
    return line
      .replace(/^#{1,6}\s+/, "")
      .replace(/^&gt;\s?/, "")
      .replace(/^[-*]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/^[-*_]{3,}$/, "")
      .replace(/`(.+?)`/g, "$1")
      .trim();
  });

  const paragraphs: string[] = [];
  let current = "";
  for (const line of cleaned) {
    if (line === "") {
      if (current.trim()) {
        paragraphs.push(current.trim());
        current = "";
      }
    } else {
      current += (current ? " " : "") + line;
    }
  }
  if (current.trim()) paragraphs.push(current.trim());

  return paragraphs.map((p) => `<p class="ai-paragraph">${p}</p>`).join("");
}
