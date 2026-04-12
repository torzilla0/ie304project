from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

# Create canvas
c = canvas.Canvas("SYSTEM_ARCHITECTURE_REPORT.pdf", pagesize=letter)
width, height = letter

# Title
c.setFont("Helvetica-Bold", 16)
c.drawString(0.5*inch, height - 0.5*inch, "METU-IE Summer Practice RAG Chatbot")
c.setFont("Helvetica", 12)
c.drawString(0.5*inch, height - 0.75*inch, "System Architecture Report")
c.setFont("Helvetica", 9)
c.drawString(0.5*inch, height - 1*inch, "April 9, 2026 | Version 1.0 | Ready for Deployment")

y = height - 1.4*inch

# Section 1
c.setFont("Helvetica-Bold", 11)
c.drawString(0.5*inch, y, "1. System Architecture")
y -= 0.2*inch

c.setFont("Helvetica", 9)
lines = [
    "Technology: React 19 + Next.js 16 + Google Generative AI",
    "Key Innovation: Local TF-IDF retrieval (zero API cost)",
    "Backend: Next.js App Router with TypeScript",
    "Knowledge Base: 27 FAQ entries + 30+ companies"
]
for line in lines:
    c.drawString(0.7*inch, y, line)
    y -= 0.15*inch

# Section 2
y -= 0.1*inch
c.setFont("Helvetica-Bold", 11)
c.drawString(0.5*inch, y, "2. TF-IDF Retrieval System")
y -= 0.2*inch

c.setFont("Helvetica", 9)
lines = [
    "• Tokenization: Lowercase, remove punctuation, filter <3 chars",
    "• Stopwords: 46 common English + IE-specific terms filtered",
    "• IDF Calculation: log(total_docs / docs_with_token)",
    "• Exact phrase match boost: +10 points for relevance",
    "• Performance: <50ms retrieval time, <1MB index size"
]
for line in lines:
    c.drawString(0.7*inch, y, line)
    y -= 0.15*inch

# Section 3
y -= 0.1*inch
c.setFont("Helvetica-Bold", 11)
c.drawString(0.5*inch, y, "3. Knowledge Coverage")
y -= 0.2*inch

c.setFont("Helvetica", 9)
lines = [
    "✓ IE 300 prerequisites (5 courses) & company types",
    "✓ IE 400 prerequisites & variations (group, project-based)",
    "✓ SGK insurance application timing & process",
    "✓ Required documents (8 items) & submission deadlines",
    "✓ Company opportunities with contact information",
    "✓ Special programs (Erasmus, voluntary internships)"
]
for line in lines:
    c.drawString(0.7*inch, y, line)
    y -= 0.15*inch

# Section 4
y -= 0.1*inch
c.setFont("Helvetica-Bold", 11)
c.drawString(0.5*inch, y, "4. Test Queries")
y -= 0.2*inch

c.setFont("Helvetica", 9)
lines = [
    "Q1: 'IE 300 prerequisites?' → Retrieves course requirements (IE 102, 251, etc.)",
    "Q2: 'Required documents?' → Lists 8 items (Application, Protocol, Insurance...)",
    "Q3: 'Company types for IE 300?' → Manufacturing only; no service industries",
    "Q4: 'SGK insurance timing?' → 2-3 weeks before, 1 week safety margin",
    "Q5: 'Weather today?' → Out-of-scope response (correctly declines)"
]
for line in lines:
    c.drawString(0.7*inch, y, line)
    y -= 0.15*inch

# Section 5
y -= 0.1*inch
c.setFont("Helvetica-Bold", 11)
c.drawString(0.5*inch, y, "5. Key Features")
y -= 0.2*inch

c.setFont("Helvetica", 9)
lines = [
    "✓ Zero API cost retrieval (local computation)",
    "✓ Multi-lingual (Turkish/English) responses",
    "✓ Scope-aware (declines out-of-scope queries)",
    "✓ Fast retrieval (<50ms), deterministic results",
    "✓ Professional Material Design 3 UI"
]
for line in lines:
    c.drawString(0.7*inch, y, line)
    y -= 0.15*inch

# Footer
c.setFont("Helvetica", 8)
c.drawString(0.5*inch, 0.5*inch, "METU Industrial Engineering | IE 304 Project | 2025-2026 Academic Year")

# Save
c.save()
print("PDF created successfully: SYSTEM_ARCHITECTURE_REPORT.pdf")
