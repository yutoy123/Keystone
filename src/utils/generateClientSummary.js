import { jsPDF } from "jspdf";

// Client-facing, plain-language version of the pathway — no jargon,
// no legal citations, just what to do and where to go.
export function generateClientSummary({ result, goalLabel }) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const marginLeft = 60;
  let y = 70;

  const line = (text, opts = {}) => {
    const { size = 12, bold = false, gap = 20, color = "#000000" } = opts;
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(color);
    const wrapped = doc.splitTextToSize(text, 495);
    doc.text(wrapped, marginLeft, y);
    y += gap * wrapped.length;
  };

  line("Your Next Steps", { size: 20, bold: true, gap: 26 });
  line(`Goal: ${goalLabel}`, { size: 12, color: "#444444", gap: 30 });

  result.steps.forEach((step, i) => {
    line(`${i + 1}. ${step.title}`, { size: 13, bold: true, gap: 18 });
    line(step.detail, { size: 11, color: "#333333", gap: 15 });
    y += 10;
  });

  y += 10;
  doc.setDrawColor("#cccccc");
  doc.line(marginLeft, y, marginLeft + 495, y);
  y += 25;

  line(
    "Keep this paper with you. If someone at an office asks what you need, show them this list.",
    { size: 10, color: "#666666", gap: 14 }
  );

  doc.save("My_Next_Steps.pdf");
}

// Builds a short SMS-length plain text version (for a "copy to send via text" action)
export function buildClientSmsText({ result, goalLabel }) {
  const stepLines = result.steps
    .map((s, i) => `${i + 1}. ${s.title}`)
    .join("\n");
  return `Your steps for ${goalLabel}:\n${stepLines}\nKeep this to show at any office.`;
}
