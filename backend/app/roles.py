from dataclasses import dataclass

@dataclass(frozen=True)
class SkillDefinition:
    name: str
    aliases: tuple[str, ...]
    weight: float
    why: str

ROLES: dict[str, tuple[SkillDefinition, ...]] = {
    "Software Developer": (
        SkillDefinition("Python", ("python",), 1.0, "Common for backend services, automation, and technical interviews."),
        SkillDefinition("JavaScript", ("javascript", "js"), 1.0, "Core language for modern web applications."),
        SkillDefinition("Git", ("git", "github", "gitlab"), 0.7, "Required for collaborative software delivery."),
        SkillDefinition("SQL", ("sql", "postgresql", "mysql", "sqlite"), 0.9, "Used to query and work with application data."),
        SkillDefinition("REST APIs", ("rest api", "restful", "api development"), 0.9, "Connects frontend clients, services, and integrations."),
        SkillDefinition("Testing", ("unit testing", "pytest", "jest", "testing"), 0.8, "Demonstrates reliable, maintainable software delivery."),
    ),
    "Full Stack Developer": (
        SkillDefinition("React", ("react", "react.js", "reactjs"), 1.0, "Primary frontend framework for this role."),
        SkillDefinition("JavaScript", ("javascript", "js", "typescript", "ts"), 1.0, "Core language for browser and server applications."),
        SkillDefinition("HTML/CSS", ("html", "css", "tailwind", "bootstrap"), 0.7, "Builds accessible, responsive user interfaces."),
        SkillDefinition("Node.js", ("node.js", "nodejs", "express"), 0.9, "Common runtime for full-stack backend services."),
        SkillDefinition("SQL", ("sql", "postgresql", "mysql", "sqlite"), 0.8, "Persists and retrieves application data."),
        SkillDefinition("Git", ("git", "github", "gitlab"), 0.6, "Supports collaborative source control and delivery."),
    ),
    "Data Analyst": (
        SkillDefinition("SQL", ("sql", "postgresql", "mysql", "bigquery"), 1.0, "Essential for extracting and transforming business data."),
        SkillDefinition("Python", ("python", "pandas", "numpy"), 0.9, "Used for analysis, automation, and repeatable workflows."),
        SkillDefinition("Excel", ("excel", "microsoft excel", "spreadsheets"), 0.7, "Still widely used for business analysis and reporting."),
        SkillDefinition("Data Visualization", ("tableau", "power bi", "matplotlib", "seaborn", "data visualization"), 0.9, "Turns analysis into decisions stakeholders can use."),
        SkillDefinition("Statistics", ("statistics", "statistical analysis", "hypothesis testing"), 0.8, "Supports trustworthy interpretation of data."),
    ),
    "Data Engineer": (
        SkillDefinition("Python", ("python",), 0.9, "Used for data pipelines, orchestration, and tooling."),
        SkillDefinition("SQL", ("sql", "postgresql", "mysql", "bigquery"), 1.0, "Foundation for data transformation and warehouse work."),
        SkillDefinition("ETL Pipelines", ("etl", "elt", "data pipeline", "airflow"), 1.0, "Moves and transforms reliable data at scale."),
        SkillDefinition("Apache Spark", ("spark", "pyspark", "apache spark"), 0.9, "Processes large datasets across distributed systems."),
        SkillDefinition("Cloud", ("aws", "azure", "gcp", "cloud"), 0.8, "Provides scalable storage, compute, and managed data services."),
    ),
    "AI/ML Engineer": (
        SkillDefinition("Python", ("python",), 1.0, "Primary language for machine-learning systems."),
        SkillDefinition("Machine Learning", ("machine learning", "scikit-learn", "sklearn"), 1.0, "Core capability for training and evaluating models."),
        SkillDefinition("Deep Learning", ("deep learning", "pytorch", "tensorflow", "keras"), 0.9, "Needed for modern neural and generative AI systems."),
        SkillDefinition("Statistics", ("statistics", "probability", "hypothesis testing"), 0.7, "Improves model evaluation and experimental reasoning."),
        SkillDefinition("SQL", ("sql", "postgresql", "mysql"), 0.5, "Supports feature retrieval and production data work."),
    ),
    "Cloud Engineer": (
        SkillDefinition("AWS", ("aws", "amazon web services"), 1.0, "Common cloud platform for infrastructure roles."),
        SkillDefinition("Linux", ("linux", "unix", "bash", "shell scripting"), 0.8, "Supports servers, automation, and troubleshooting."),
        SkillDefinition("Docker", ("docker", "containers", "containerization"), 0.8, "Packages services consistently across environments."),
        SkillDefinition("Kubernetes", ("kubernetes", "k8s"), 0.9, "Orchestrates production containers at scale."),
        SkillDefinition("Terraform", ("terraform", "infrastructure as code", "iac"), 0.8, "Defines repeatable cloud infrastructure."),
    ),
    "Cybersecurity Analyst": (
        SkillDefinition("Network Security", ("network security", "firewalls", "ids", "ips"), 1.0, "Protects systems and investigates network threats."),
        SkillDefinition("Linux", ("linux", "unix", "bash"), 0.7, "Common environment for security tools and investigation."),
        SkillDefinition("Python", ("python",), 0.6, "Automates investigation and security operations."),
        SkillDefinition("SIEM", ("siem", "splunk", "sentinel"), 0.9, "Correlates security events and supports incident response."),
        SkillDefinition("Risk Assessment", ("risk assessment", "vulnerability assessment", "penetration testing"), 0.9, "Identifies and prioritizes security exposure."),
    ),
    "DevOps Engineer": (
        SkillDefinition("Linux", ("linux", "unix", "bash", "shell scripting"), 0.8, "Foundation for automation and production operations."),
        SkillDefinition("Docker", ("docker", "containers"), 0.8, "Standardizes build and deployment environments."),
        SkillDefinition("Kubernetes", ("kubernetes", "k8s"), 0.9, "Runs and scales containerized workloads."),
        SkillDefinition("CI/CD", ("ci/cd", "continuous integration", "continuous deployment", "jenkins", "github actions"), 1.0, "Automates reliable software delivery."),
        SkillDefinition("Cloud", ("aws", "azure", "gcp", "cloud"), 0.9, "Provides the infrastructure for modern delivery platforms."),
    ),
    "Python Developer": (
        SkillDefinition("Python", ("python",), 1.0, "Primary language for the target role."),
        SkillDefinition("REST APIs", ("rest api", "restful", "fastapi", "flask", "django"), 0.9, "Builds services and integrations."),
        SkillDefinition("SQL", ("sql", "postgresql", "mysql", "sqlite"), 0.8, "Works with persistent application data."),
        SkillDefinition("Testing", ("unit testing", "pytest", "unittest", "testing"), 0.7, "Protects Python code as systems evolve."),
        SkillDefinition("Git", ("git", "github", "gitlab"), 0.6, "Supports collaborative development workflows."),
    ),
}
