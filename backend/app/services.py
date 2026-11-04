import json
import os
from typing import Any

import httpx
from openai import AsyncOpenAI


def build_roadmap(analysis: dict[str, Any]) -> dict[str, Any]:
    weeks = []
    for index, recommendation in enumerate(analysis.get("recommendations", []), start=1):
        weeks.append({
            "week": index,
            "skill": recommendation["skill"],
            "duration": recommendation["duration"],
            "priority": recommendation["priority"],
            "objectives": recommendation["topics"],
            "practice": recommendation["practice"],
            "project": recommendation["project"],
            "completed": False,
        })
    return {"target_role": analysis["target_role"], "weeks": weeks, "total_weeks": len(weeks)}


async def generate_assessment(analysis: dict[str, Any], count: int = 8) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured. Add it to backend/.env to generate assessments.")
    client = AsyncOpenAI(api_key=api_key)
    missing = [item["skill"] for item in analysis.get("recommendations", [])]
    prompt = {
        "target_role": analysis["target_role"],
        "missing_skills": missing,
        "instruction": "Create a practical assessment for the missing skills. Return only valid JSON with an questions array. Each question needs id, skill, difficulty, prompt, options (four strings), answer_index, and explanation. Do not claim resume mentions prove proficiency.",
    }
    response = await client.chat.completions.create(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"), temperature=0.2, response_format={"type": "json_object"}, messages=[{"role": "system", "content": "You create fair technical skill assessments."}, {"role": "user", "content": json.dumps(prompt)}], max_tokens=3000)
    try:
        payload = json.loads(response.choices[0].message.content or "{}")
        questions = payload.get("questions", [])[:count]
        if not questions:
            raise ValueError("The AI provider returned no assessment questions.")
        return {"target_role": analysis["target_role"], "questions": questions}
    except (json.JSONDecodeError, ValueError, TypeError) as error:
        raise RuntimeError(f"The assessment provider returned an invalid response: {error}") from error


async def search_jobs(role: str, skills: list[str], country: str = "") -> dict[str, Any]:
    query = role
    if skills:
        query = f"{role} {skills[0]}"
    url = "https://www.arbeitnow.com/api/job-board-api"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.HTTPError as error:
        raise RuntimeError(f"The public job provider is unavailable: {error}") from error

    terms = [role.lower(), *(skill.lower() for skill in skills)]
    jobs = []
    for item in response.json().get("data", []):
        searchable = f"{item.get('title', '')} {item.get('description', '')}".lower()
        if not any(term in searchable for term in terms):
            continue
        jobs.append({
            "id": item.get("slug") or item.get("id"),
            "title": item.get("title"),
            "company": item.get("company_name"),
            "location": item.get("location"),
            "description": item.get("description"),
            "url": item.get("url"),
            "salary_min": None,
            "salary_max": None,
        })
        if len(jobs) == 20:
            break
    return {"source": "Arbeitnow", "query": query, "count": len(jobs), "jobs": jobs}
