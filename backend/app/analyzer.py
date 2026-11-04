import io
import re
from pathlib import Path

import fitz
from docx import Document
from PIL import Image
import pytesseract

from .roles import ROLES, SkillDefinition

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".docx"}
MAX_BYTES = 10 * 1024 * 1024

STUDY_GUIDES = {
    "Python": {"topics": ["Functions, modules, and object-oriented programming", "Error handling, typing, and virtual environments", "File handling, APIs, and clean project structure"], "practice": "Build a command-line tool that reads data, calls a public API, and saves a validated result.", "project": "Create a small production-style Python service with tests and a README.", "duration": "1–2 weeks"},
    "JavaScript": {"topics": ["ES modules, async/await, and promises", "DOM or frontend state management", "Error handling and browser performance"], "practice": "Build a searchable dashboard that consumes a REST API and handles loading and error states.", "project": "Ship a responsive web app with reusable components and API integration.", "duration": "1–2 weeks"},
    "React": {"topics": ["Component composition and props", "State, effects, forms, and custom hooks", "Routing, accessibility, and performance"], "practice": "Rebuild one dashboard screen using reusable components and a real API response.", "project": "Build and deploy a role-focused portfolio dashboard with authentication-ready routing.", "duration": "1–2 weeks"},
    "HTML/CSS": {"topics": ["Semantic HTML and accessible forms", "Flexbox, Grid, responsive breakpoints", "Design tokens, states, and mobile-first layouts"], "practice": "Convert a desktop mockup into a responsive page that works at three viewport sizes.", "project": "Create a polished accessible portfolio site with a reusable design system.", "duration": "4–7 days"},
    "Node.js": {"topics": ["Express or Fastify routing and middleware", "Validation, authentication, and error handling", "Database access and API testing"], "practice": "Build a CRUD API with request validation, pagination, and consistent error responses.", "project": "Create a production-style service with a documented OpenAPI contract.", "duration": "1–2 weeks"},
    "SQL": {"topics": ["Joins, grouping, subqueries, and window functions", "Indexes, constraints, and normalization", "Transactions and query performance"], "practice": "Solve 20 reporting queries using a realistic multi-table dataset.", "project": "Design a normalized database and API for a small job or learning platform.", "duration": "1–2 weeks"},
    "Git": {"topics": ["Branches, rebasing, and conflict resolution", "Pull requests and code review", "Tags, releases, and useful commit history"], "practice": "Use feature branches and a pull-request workflow for your next project.", "project": "Contribute a documented improvement to an open-source repository.", "duration": "2–4 days"},
    "Testing": {"topics": ["Unit, integration, and end-to-end testing", "Mocks, fixtures, and test isolation", "Coverage and testing failure paths"], "practice": "Add tests for success, validation failure, permissions, and a dependency outage.", "project": "Create a CI pipeline that runs tests and reports coverage on every pull request.", "duration": "4–7 days"},
    "REST APIs": {"topics": ["HTTP methods, status codes, and resource design", "Authentication, validation, pagination", "OpenAPI documentation and API tests"], "practice": "Design and test five endpoints for a small resource with validation and errors.", "project": "Build a documented API consumed by your own frontend application.", "duration": "4–7 days"},
    "ETL Pipelines": {"topics": ["Extracting from APIs/files and schema validation", "Transformations, idempotency, and data quality", "Scheduling, retries, and observability"], "practice": "Load daily data from an API, validate it, transform it, and store it in a database.", "project": "Build an observable ETL pipeline with retry handling and a data-quality report.", "duration": "1–2 weeks"},
    "Apache Spark": {"topics": ["DataFrames, transformations, and actions", "Partitioning and joins", "Spark jobs, testing, and performance"], "practice": "Process a large public dataset and compare a naive query with an optimized version.", "project": "Build a batch analytics pipeline that writes curated data to a warehouse.", "duration": "1–2 weeks"},
    "Cloud": {"topics": ["Identity, networking, storage, and compute", "Managed databases and monitoring", "Cost, security, and high availability basics"], "practice": "Deploy a small service with private configuration, logs, health checks, and a rollback path.", "project": "Deploy your portfolio API and frontend using managed cloud services.", "duration": "1–2 weeks"},
    "AWS": {"topics": ["IAM, VPC, EC2, S3, and RDS fundamentals", "Lambda, queues, and managed services", "CloudWatch monitoring and least-privilege access"], "practice": "Deploy a small API and configure logs, environment variables, and a health check.", "project": "Build a secure AWS-hosted application with a documented architecture diagram.", "duration": "2 weeks"},
    "Linux": {"topics": ["Files, permissions, processes, and networking", "Bash scripting and package management", "Logs, services, and troubleshooting"], "practice": "Write a deployment script that installs, configures, and health-checks an application.", "project": "Operate a small Linux server with backups, logs, and a documented runbook.", "duration": "1 week"},
    "Docker": {"topics": ["Images, containers, volumes, and networks", "Dockerfiles and multi-stage builds", "Compose, secrets, and production limits"], "practice": "Containerize your API and database locally with a reproducible Compose setup.", "project": "Create a secure, small production image and publish it through CI.", "duration": "4–7 days"},
    "Kubernetes": {"topics": ["Pods, deployments, services, and ingress", "ConfigMaps, secrets, and health probes", "Scaling, rolling updates, and troubleshooting"], "practice": "Deploy a containerized API with readiness/liveness probes and a rolling update.", "project": "Run a small multi-service application on a local Kubernetes cluster.", "duration": "2 weeks"},
    "Terraform": {"topics": ["Providers, resources, variables, and outputs", "Modules, state, and remote backends", "Plan review, drift, and secrets"], "practice": "Provision a small environment from code and destroy/recreate it safely.", "project": "Define the infrastructure for your portfolio application with reusable modules.", "duration": "1–2 weeks"},
    "CI/CD": {"topics": ["Build, test, artifact, and deployment stages", "Secrets, environments, and approvals", "Rollback, caching, and deployment health"], "practice": "Create a pipeline that runs tests and deploys only after a successful build.", "project": "Add automated preview and production deployments to a real application.", "duration": "1 week"},
    "Machine Learning": {"topics": ["Feature preparation and train/validation/test splits", "Model selection, metrics, and cross-validation", "Data leakage, interpretability, and reproducibility"], "practice": "Train two baseline models and explain the metric tradeoffs on held-out data.", "project": "Build an end-to-end model API with evaluation notes and reproducible training.", "duration": "2–3 weeks"},
    "Deep Learning": {"topics": ["Tensors, architectures, loss, and optimization", "Overfitting, regularization, and transfer learning", "Experiment tracking and model serving"], "practice": "Train a small classifier and compare augmentation or regularization strategies.", "project": "Deploy a documented inference API for a trained model.", "duration": "2–3 weeks"},
    "Statistics": {"topics": ["Probability, distributions, and sampling", "Confidence intervals and hypothesis tests", "Correlation, regression, and experiment design"], "practice": "Analyze a dataset and communicate uncertainty rather than only reporting averages.", "project": "Create an experiment report with assumptions, tests, and an executive summary.", "duration": "1–2 weeks"},
    "Data Visualization": {"topics": ["Choosing charts for questions", "Clear labeling, hierarchy, and accessibility", "Interactive filters and stakeholder storytelling"], "practice": "Turn a messy dataset into a one-page dashboard with three decisions it supports.", "project": "Build a portfolio case study showing the analysis, dashboard, and recommendation.", "duration": "1 week"},
    "Excel": {"topics": ["Lookups, pivots, formulas, and cleaning", "Data validation and repeatable reporting", "Charts and communicating business findings"], "practice": "Automate a weekly report from raw rows into a clean summary dashboard.", "project": "Create a reusable financial or operations reporting workbook.", "duration": "4–7 days"},
    "Network Security": {"topics": ["TCP/IP, DNS, HTTP, and network segmentation", "Firewalls, IDS/IPS, and secure configuration", "Incident investigation and threat modeling"], "practice": "Document and investigate a simulated suspicious network event.", "project": "Create a small lab with network controls and an incident-response report.", "duration": "2 weeks"},
    "SIEM": {"topics": ["Log sources, parsing, and normalization", "Queries, alerts, dashboards, and triage", "Detection tuning and incident timelines"], "practice": "Write detections for authentication anomalies and explain false-positive handling.", "project": "Build a small security monitoring dashboard with documented detections.", "duration": "1–2 weeks"},
    "Risk Assessment": {"topics": ["Asset identification and threat modeling", "Vulnerability severity and likelihood", "Controls, remediation plans, and reporting"], "practice": "Assess a small application and rank five risks with evidence and mitigations.", "project": "Produce a professional security assessment report for a portfolio application.", "duration": "1 week"},
}


def extract_text(filename: str, content: bytes) -> str:
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported file type. Upload a PDF, DOCX, PNG, JPG, or JPEG resume.")
    if len(content) > MAX_BYTES:
        raise ValueError("The resume is larger than the 10 MB limit.")
    try:
        if extension == ".pdf":
            with fitz.open(stream=content, filetype="pdf") as document:
                text = "\n".join(page.get_text() for page in document)
                if text.strip():
                    return text
                images = [page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5)) for page in document]
                return "\n".join(pytesseract.image_to_string(Image.open(io.BytesIO(pix.tobytes("png")))) for pix in images)
        if extension == ".docx":
            document = Document(io.BytesIO(content))
            return "\n".join(paragraph.text for paragraph in document.paragraphs)
        return pytesseract.image_to_string(Image.open(io.BytesIO(content)))
    except pytesseract.pytesseract.TesseractNotFoundError as error:
        raise RuntimeError("OCR is required for this image/scanned resume. Install Tesseract OCR and add it to PATH.") from error
    except Exception as error:
        raise ValueError(f"The resume could not be read: {error}") from error


def _contains_skill(text: str, skill: SkillDefinition) -> bool:
    lowered = text.lower()
    return any(re.search(rf"(?<![a-z0-9]){re.escape(alias.lower())}(?![a-z0-9])", lowered) for alias in skill.aliases)


def analyze_resume(text: str, role: str) -> dict:
    if role not in ROLES:
        raise ValueError("Choose a supported target role.")
    requirements = ROLES[role]
    skills = []
    weighted_score = 0.0
    total_weight = sum(item.weight for item in requirements)
    for requirement in requirements:
        found = _contains_skill(text, requirement)
        level = "Evidence found" if found else "Missing"
        if found:
            weighted_score += requirement.weight
        skills.append({"name": requirement.name, "status": level, "found": found, "weight": requirement.weight, "why": requirement.why})
    score = round((weighted_score / total_weight) * 100) if total_weight else 0
    missing = [item for item in skills if not item["found"]]
    recommendations = []
    for item in sorted(missing, key=lambda item: item["weight"], reverse=True):
        guide = STUDY_GUIDES.get(item["name"], {"topics": [f"Core concepts and terminology in {item['name']}", f"Common tools and workflows used with {item['name']}", "How to test and explain your work"], "practice": f"Complete a small guided exercise using {item['name']}.", "project": f"Build a portfolio project that demonstrates {item['name']} in the context of your target role.", "duration": "1–2 weeks"})
        recommendations.append({"skill": item["name"], "priority": "High" if item["weight"] >= .9 else "Medium", "reason": item["why"], "resume_addition": f"Only add {item['name']} if you have actually used it. Include the project, work, course, or assessment where you applied it and what you delivered.", **guide})
    high_priority_missing = sum(item["weight"] for item in missing if item["weight"] >= .9)
    sufficient = score >= 70 and high_priority_missing == 0
    verdict = "Likely sufficient" if sufficient else "Needs improvement before applying"
    verdict_reason = "Your resume shows evidence for the core weighted requirements of this role." if sufficient else "Your resume is missing evidence for one or more important requirements. Build or document the missing skills before relying on this application."
    return {"target_role": role, "match_score": score, "skills": skills, "missing_count": len(missing), "sufficient": sufficient, "verdict": verdict, "verdict_reason": verdict_reason, "what_to_add": [item["resume_addition"] for item in recommendations], "recommendations": recommendations, "extracted_text": text.strip()}
