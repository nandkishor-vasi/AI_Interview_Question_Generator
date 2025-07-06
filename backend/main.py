from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from langchain_utils import parse_resume
from resume_parser import generate_questions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is running. Use POST /upload-resume/ to get interview questions."}


@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        resume_text = parse_resume(contents, file.filename)
        
        questions = generate_questions(resume_text)
        print("Generated questions:", questions)

        return {"questions": questions}
    except Exception as e:
        return {"error": str(e)}
