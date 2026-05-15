/**
 * Strips all markdown artifacts from AI-generated text and returns clean HTML paragraphs.
 * Ensures no **, *, #, >, -, _ markers appear in rendered output.
 */
export function cleanAIText(raw: string): string {
  const lines = raw.split("\n");
  const cleaned = lines.map((line) => {
    return line
      // Remove heading markers
      .replace(/^#{1,6}\s+/, "")
      // Remove blockquote markers
      .replace(/^>\s?/, "")
      // Remove list markers (- item, * item, 1. item)
      .replace(/^[-*]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      // Remove bold/italic markers (keep text)
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/, "")
      // Remove backticks
      .replace(/`(.+?)`/g, "$1")
      .trim();
  });

  // Group into paragraphs — split on blank lines
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

  return paragraphs
    .map((p) => `<p style="text-align:justify;margin-bottom:1.1em">${p}</p>`)
    .join("");
}
