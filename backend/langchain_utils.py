from PyPDF2 import PdfReader
from docx import Document
import io

def parse_resume(contents: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(contents))
        return "\n".join([page.extract_text() or "" for page in reader.pages])
    elif filename.endswith(".docx"):
        doc = Document(io.BytesIO(contents))
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        return "Unsupported file type"