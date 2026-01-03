const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "portfolio-content";

const data = [
  // --- PROFILE ---
  {
    PK: "PROFILE",
    SK: "MAIN",
    content: {
      name: "Jeremy Spofford",
      title: "Senior DevOps Engineer",
      titles: ["Senior DevOps Engineer", "Cloud Infrastructure Architect", "Platform Engineer", "Site Reliability Engineer"],
      bio: "I am a Senior DevOps Engineer with expertise in cloud infrastructure, automation, and CI/CD pipeline optimization. I have extensive hands-on experience with Google Cloud Platform (GCP), Terraform, GitLab CI, and cloud-native tooling, with a proven track record of improving system performance, deployment reliability, and operational security.",
      email: "JeremySpofford@gmail.com",
      location: "Maine, USA",
      socials: {
        github: "https://github.com/jeremyspofford",
        gitlab: "https://gitlab.com/jeremyspofford",
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
          technologies: ["GCP", "Terraform", "GitLab CI", "Kubernetes"],
          key_deliverables: [
            {
                title: "Cloud Cost Optimization Initiative",
                description: "Led an initiative resulting in a 30% reduction in monthly infrastructure expenses across all environments.",
                technologies: ["GCP", "Terraform", "Cost Management"]
            },
            {
                title: "Dynamic Preview Environments",
                description: "Designed and implemented scalable preview environments tied to GitLab merge requests to improve testing efficiency.",
                technologies: ["GitLab", "Terraform", "GCP"]
            },
             {
                title: "Certificate Management Automation",
                description: "Implemented automated SSL certificate renewal system with GCP Secret Manager and Pub/Sub.",
                technologies: ["GCP Secret Manager", "Pub/Sub", "Terraform", "GitLab CI"]
            }
          ]
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
          technologies: ["AWS", "C#", ".NET", "Terraform"],
          key_deliverables: [
              {
                  title: "Terraform Documentation & Examples Automation",
                  description: "Engineered a system to automatically generate standardized READMEs, usage examples, and tfvars templates for Terraform modules.",
                  technologies: ["Terraform", "CI/CD", "Python", "terraform-docs"]
              },
               {
                  title: "Infrastructure Orchestration Repos",
                  description: "Managed and contributed to core infrastructure orchestration repositories for consistent deployments.",
                  technologies: ["Terraform", "Git", "IaC"]
              }
          ]
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
          technologies: ["Windows", "Active Directory", "PowerShell"],
          key_deliverables: [
            {
              title: "Documentation & Reporting",
              description: "Developed documentation, procedures, and automated reporting systems to facilitate efficient IT-stakeholder communication and improve data accessibility.",
              technologies: ["PowerShell", "SQL", "Excel", "SharePoint"]
            }
          ]
      }
  },

  // --- SKILLS ---
  {
    PK: "SKILL",
    SK: "GCP",
    content: { 
        category: "GCP", 
        items: ["Compute Engine", "GKE", "Cloud Build", "BigQuery", "Pub/Sub"],
        icon: "cloud",
        description: "Expertise in Google Cloud Platform services and architecture."
    }
  },
  {
    PK: "SKILL",
    SK: "AWS",
    content: { 
        category: "AWS", 
        items: ["EC2", "Lambda", "S3", "RDS", "DynamoDB"],
        icon: "cloud",
        description: "Deep knowledge of AWS core services and serverless computing."
    }
  },
  {
    PK: "SKILL",
    SK: "IAC",
    content: { 
        category: "IaC", 
        items: ["Terraform", "OpenTofu", "Terragrunt", "AWS CDK", "Ansible"],
        icon: "code",
        description: "Automatating infrastructure provisioning and configuration management."
    }
  },
  {
    PK: "SKILL",
    SK: "CICD",
    content: { 
        category: "CI/CD", 
        items: ["GitLab CI", "GitHub Actions"],
        icon: "terminal",
        description: "Building robust automated pipelines for build, test, and deployment."
    }
  },
  {
    PK: "SKILL",
    SK: "LANGUAGES",
    content: { 
        category: "Scripting/Lang", 
        items: ["Python", "Bash", "TypeScript", "JavaScript"],
        icon: "code",
        description: "Polyglot programming for automation, scripting, and application development."
    }
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
          link: "https://www.credly.com/badges/1031a5b8-a13d-4d24-803c-8282a2cb408e/public_url",
          imageUrl: "https://images.credly.com/size/680x680/images/6df3b36d-9d41-4560-b6bd-139857d45e5f/gcp-ace.png" // Placeholder or actual URL
      }
  },
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
