const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "portfolio-content";

const data = [
  // --- CONFIG ---
  {
    PK: "CONFIG",
    SK: "FEATURES",
    content: {
      show_contributions: true,
      show_resume_download: true,
      enable_ai: true
    }
  },
  
  // --- PROFILE ---
  {
    PK: "PROFILE",
    SK: "MAIN",
    content: {
      name: "Jeremy Spofford",
      title: "Senior DevOps Engineer",
      bio: "I am a Senior DevOps Engineer with expertise in cloud infrastructure, automation, and CI/CD pipeline optimization. I have extensive hands-on experience with Google Cloud Platform (GCP), Terraform, GitLab CI, and cloud-native tooling, with a proven track record of improving system performance, deployment reliability, and operational security.",
      email: "JeremySpofford@gmail.com",
      location: "Windham, ME USA",
      socials: {
        github: "https://github.com/jeremyspofford",
        linkedin: "https://linkedin.com/in/jeremyspofford"
      }
    }
  },

  // --- EXPERIENCE ---
  {
      PK: "EXPERIENCE",
      SK: "2022-11-01",
      content: {
          company: "VividCloud",
          role: "Senior DevOps Engineer",
          startDate: "2022-11",
          endDate: "Present",
          description: "Leading DevOps initiatives and cloud infrastructure management.",
          technologies: ["GCP", "Terraform", "GitLab CI", "Kubernetes"]
      }
  },
  {
      PK: "EXPERIENCE",
      SK: "2019-06-01",
      content: {
          company: "Tyler Technologies",
          role: "Software Engineer & DevOps Engineer",
          startDate: "2019-06",
          endDate: "2022-11",
          description: "Developed and maintained software solutions and DevOps pipelines.",
          technologies: ["AWS", "C#", ".NET", "Terraform"]
      }
  },
  {
      PK: "EXPERIENCE",
      SK: "2014-10-01",
      content: {
          company: "Maine Medical Center",
          role: "Systems Specialist & Desktop Support",
          startDate: "2014-10",
          endDate: "2017-08",
          description: "Provided systems support and desktop engineering solutions.",
          technologies: ["Windows", "Active Directory", "PowerShell"]
      }
  },

  // --- PROJECTS ---
  {
      PK: "PROJECT",
      SK: "EMQX_SSL",
      content: {
          title: "EMQX SSL Certificate Automation",
          description: "Developed an automated solution for managing EMQX SSL certificates, improving security and reducing manual intervention for renewals.",
          technologies: ["EMQX", "SSL", "Automation", "Python"]
      }
  },
  {
      PK: "PROJECT",
      SK: "TF_DOCS",
      content: {
          title: "Terraform Documentation & Examples Automation",
          description: "Engineered a system to automatically generate standardized READMEs, usage examples, and tfvars templates for Terraform modules.",
          technologies: ["Terraform", "CI/CD", "Python", "terraform-docs"]
      }
  },
  {
      PK: "PROJECT",
      SK: "PREVIEW_ENVS",
      content: {
          title: "Dynamic Preview Environments",
          description: "Designed and implemented scalable preview environments tied to GitLab merge requests to improve testing efficiency.",
          technologies: ["GitLab", "Terraform", "GCP"]
      }
  },
  {
      PK: "PROJECT",
      SK: "COST_OPT",
      content: {
          title: "Cloud Cost Optimization Initiative",
          description: "Led an initiative resulting in a 30% reduction in monthly infrastructure expenses across all environments.",
          technologies: ["GCP", "Terraform", "Cost Management"]
      }
  },
    {
      PK: "PROJECT",
      SK: "CERT_MGMT",
      content: {
          title: "Certificate Management Automation",
          description: "Implemented automated SSL certificate renewal system with GCP Secret Manager and Pub/Sub.",
          technologies: ["GCP Secret Manager", "Pub/Sub", "Terraform", "GitLab CI"]
      }
  },
    {
      PK: "PROJECT",
      SK: "INFRA_ORCH",
      content: {
          title: "Infrastructure Orchestration Repos",
          description: "Managed and contributed to core infrastructure orchestration repositories for consistent deployments.",
          technologies: ["Terraform", "Git", "IaC"]
      }
  },

  // --- SKILLS ---
  {
    PK: "SKILL",
    SK: "GCP",
    content: { category: "GCP", items: ["Compute Engine", "GKE", "Cloud Build", "BigQuery", "Pub/Sub"] }
  },
  {
    PK: "SKILL",
    SK: "AWS",
    content: { category: "AWS", items: ["EC2", "Lambda", "S3", "RDS", "DynamoDB"] }
  },
  {
    PK: "SKILL",
    SK: "IAC",
    content: { category: "IaC", items: ["Terraform", "OpenTofu", "CloudFormation", "Ansible"] }
  },
  {
    PK: "SKILL",
    SK: "CICD",
    content: { category: "CI/CD", items: ["GitLab CI", "GitHub Actions", "Jenkins"] }
  },
  {
    PK: "SKILL",
    SK: "LANGUAGES",
    content: { category: "Scripting/Lang", items: ["Python", "Bash", "TypeScript", "JavaScript", "Go"] }
  },

  // --- CERTIFICATIONS ---
  {
      PK: "CERTIFICATION",
      SK: "GCP_ACE_2025",
      content: {
          name: "Associate Cloud Engineer",
          issuer: "Google Cloud",
          date: "Jan 2025 - Jan 2028",
          active: true,
          link: "https://google.com" // Placeholder for verification link
      }
  },
  {
      PK: "CERTIFICATION",
      SK: "AWS_CCP_2020",
      content: {
          name: "AWS Certified Cloud Practitioner",
          issuer: "AWS",
          date: "Expired",
          active: false
      }
  },
  {
      PK: "CERTIFICATION",
      SK: "TF_ASSOC_003",
      content: {
          name: "HashiCorp Certified: Terraform Associate",
          issuer: "HashiCorp",
          date: "2023 - 2025",
          active: true
      }
  }

];

const run = async () => {
  const params = {
    RequestItems: {
      [TABLE_NAME]: data.map((item) => ({
        PutRequest: {
          Item: marshall(item),
        },
      })),
    },
  };

  try {
    const data = await client.send(new BatchWriteItemCommand(params));
    console.log("Success, items inserted", data);
  } catch (err) {
    console.error("Error", err);
  }
};

run();
