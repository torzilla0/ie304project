from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

# Create PDF
pdf_path = "SYSTEM_ARCHITECTURE_REPORT.pdf"
doc = SimpleDocTemplate(pdf_path, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)

story = []
styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=22,
    textColor=colors.HexColor('#1F3A93'),
    spaceAfter=6,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=13,
    textColor=colors.HexColor('#1F3A93'),
    spaceAfter=8,
    spaceBefore=6,
    fontName='Helvetica-Bold'
)

normal_style = ParagraphStyle(
    'CustomNormal',
    parent=styles['Normal'],
    fontSize=9,
    alignment=TA_JUSTIFY,
    spaceAfter=6,
    leading=11
)

# Title
story.append(Paragraph("METU-IE Summer Practice RAG Chatbot", title_style))
story.append(Paragraph("System Architecture Report", styles['Heading3']))
story.append(Spacer(1, 0.2*inch))

# 1. System Architecture
story.append(Paragraph("1. System Architecture", heading_style))

story.append(Paragraph(
    "This project implements a <b>Retrieval-Augmented Generation (RAG)</b> chatbot using Next.js, "
    "React, and Google Generative AI. The core innovation is a <b>TF-IDF keyword search system</b> "
    "that requires zero API cost for document retrieval.",
    normal_style
))

# Technology Stack
tech_data = [
    ["Component", "Technology"],
    ["Frontend", "React 19 + Tailwind CSS 4"],
    ["Backend", "Next.js 16 App Router"],
    ["Retrieval", "TF-IDF Keyword Search (Local)"],
    ["LLM", "Google Generative AI (Gemini)"],
    ["Text Processing", "LangChain.js + RecursiveCharacterTextSplitter"],
]

tech_table = Table(tech_data, colWidths=[2.5*inch, 2.5*inch])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1F3A93')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F0F4F8')]),
]))
story.append(tech_table)
story.append(Spacer(1, 0.15*inch))

# 2. Retrieval System
story.append(Paragraph("2. TF-IDF Retrieval System", heading_style))

story.append(Paragraph(
    "<b>Key Innovation:</b> Instead of using expensive embedding API calls, the system implements "
    "local TF-IDF (Term Frequency-Inverse Document Frequency) scoring. Documents are tokenized, "
    "stopwords are filtered, and relevance is computed locally in milliseconds. This approach costs "
    "zero API dollars while maintaining high accuracy for domain-specific queries.",
    normal_style
))

story.append(Paragraph("<b>Implementation Details:</b>", ParagraphStyle('Bold', parent=styles['Normal'], fontName='Helvetica-Bold')))
story.append(Paragraph("• 27 FAQ entries covering IE 300/400 requirements and procedures<br/>"
    "• 30+ company opportunities with contact information<br/>"
    "• 46-item stopword list (English + IE-specific terms)<br/>"
    "• Exact phrase matching with +10 point boost<br/>"
    "• Average retrieval time: &lt;50ms",
    normal_style))

story.append(Spacer(1, 0.1*inch))

# 3. Knowledge Base
story.append(Paragraph("3. Knowledge Base Content", heading_style))

kb_data = [
    ["Topic", "Coverage"],
    ["IE 300 Prerequisites", "5 courses (IE 102, IE 251, IE 265, IE 241, OHS 101)"],
    ["IE 400 Prerequisites", "IE 300 + 4 courses (IE 252, IE 323, IE 333 + 2 electives)"],
    ["Required Documents", "8 items (Application, Protocol, SGK, Declaration, Evaluation, Survey, Report, Payment)"],
    ["Company Types", "Manufacturing (IE 300); Manufacturing + Service (IE 400)"],
    ["SGK Insurance", "Application timing, process, approval schedule"],
    ["Report Deadline", "October 24, 2025 (via ODTUClass)"],
]

kb_table = Table(kb_data, colWidths=[1.8*inch, 3.2*inch])
kb_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1F3A93')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F0F4F8')]),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
]))
story.append(kb_table)
story.append(Spacer(1, 0.15*inch))

# 4. Test Queries
story.append(Paragraph("4. Test Queries & Verification", heading_style))

story.append(Paragraph(
    "<b>Query 1:</b> 'What are the prerequisites for IE 300?' "
    "&rarr; Retrieves IE 300 prerequisites (IE 102, IE 251, IE 265, IE 241, OHS 101)",
    normal_style
))

story.append(Paragraph(
    "<b>Query 2:</b> 'What documents do I need?' "
    "&rarr; Returns list of 8 required documents",
    normal_style
))

story.append(Paragraph(
    "<b>Query 3:</b> 'Can I do my internship abroad?' "
    "&rarr; Retrieves Erasmus program information (3-12 months)",
    normal_style
))

story.append(Paragraph(
    "<b>Query 4:</b> 'What's the weather?' "
    "&rarr; Out-of-scope; responds with scope notice",
    normal_style
))

story.append(Spacer(1, 0.15*inch))

# 5. Features
story.append(Paragraph("5. System Features", heading_style))

story.append(Paragraph(
    "✓ <b>Zero API Cost Retrieval</b> &ndash; Local TF-IDF computation<br/>"
    "✓ <b>Multi-lingual</b> &ndash; Turkish and English responses<br/>"
    "✓ <b>Scope-Aware</b> &ndash; Declines out-of-scope queries<br/>"
    "✓ <b>Fast Queries</b> &ndash; Retrieval in &lt;50ms<br/>"
    "✓ <b>Deterministic</b> &ndash; Consistent results<br/>"
    "✓ <b>Material Design 3</b> &ndash; Professional UI with responsive layout",
    normal_style
))

# Build PDF
doc.build(story)
print(f"PDF created: {pdf_path}")
