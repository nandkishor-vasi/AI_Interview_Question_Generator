from langchain_cohere import ChatCohere
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
load_dotenv()

question_llm = ChatCohere(
    model="command-r-plus",  
    temperature=0.7
)

def generate_questions(resume_text: str):
    print("🧠 Resume passed to prompt (first 300 chars):", resume_text[:300])
    truncated_resume = resume_text[:750]

    prompt = f"""You are a technical interviewer.

Based on the following resume, generate 5 personalized technical interview questions that evaluate the candidate's skills, education, and project experience.

Resume:
{truncated_resume}

Questions:"""

    try:
        response = question_llm.invoke([HumanMessage(content=prompt)])
        result = response.content
        print("🤖 Cohere output:", result)

        lines = [line.strip("-• ") for line in result.split("\n") if line.strip()]
        questions = [
            line for line in lines
            if line.strip().endswith("?") or line.strip()[0].isdigit()
        ]

        return questions
    except Exception as e:
        print("❌ Error during Cohere generation:", str(e))
        return []
