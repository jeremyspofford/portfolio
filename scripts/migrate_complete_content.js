const { DynamoDBClient, BatchWriteItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "portfolio-content";

// Complete content migration including all missing data from original portfolio
const completeData = [
  // --- PROFILE (UPDATED with Windham location) ---
  {
    PK: "PROFILE",
    SK: "MAIN",
    content: {
      name: "Jeremy Spofford",
      title: "Senior DevOps Engineer",
      titles: ["Senior DevOps Engineer", "Cloud Infrastructure Architect", "Platform Engineer", "Site Reliability Engineer"],
      bio: "I am a Senior DevOps Engineer with expertise in cloud infrastructure, automation, and CI/CD pipeline optimization. I have extensive hands-on experience with Google Cloud Platform (GCP), Terraform, GitLab CI, and cloud-native tooling, with a proven track record of improving system performance, deployment reliability, and operational security.",
      email: "JeremySpofford@gmail.com",
      location: "Windham, ME", // UPDATED from "Maine, USA"
      socials: {
        github: "https://github.com/jeremyspofford",
        gitlab: "https://gitlab.com/jeremyspofford",
        linkedin: "https://linkedin.com/in/jeremyspofford"
      }
    }
  },

  // --- EXPERIENCE (ALL 6 ROLES) ---
  {
    PK: "EXPERIENCE",
    SK: "2022-11-01",
    content: {
      company: "VividCloud",
      role: "Senior DevOps Engineer",
      startDate: "2022-11",
      endDate: "Present",
      description: "Led cloud infrastructure optimization initiatives resulting in significant cost reductions. Enhanced CI/CD workflows with parallelized Terraform jobs and dynamic preview environments. Automated SSL certificate renewal processes using GCP Secret Manager and Pub/Sub.",
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
        },
        {
          title: "Terraform Documentation Automation",
          description: "Engineered comprehensive automation generating standardized README files, usage examples, and configuration templates with automatic updates.",
          technologies: ["Terraform", "terraform-docs", "GitLab CI"]
        }
      ]
    }
  },
  {
    PK: "EXPERIENCE",
    SK: "2021-06-01",
    content: {
      company: "Tyler Technologies",
      role: "Software Engineer",
      startDate: "2021-06",
      endDate: "2022-11",
      description: "Developed cloud administration applications reducing support call durations by 50%. Collaborated on web application for cloud migrations, removing technical interventions. Implemented code review protocols strengthening software quality standards.",
      technologies: ["C#", ".NET", "AWS", "SQL"],
      key_deliverables: [
        {
          title: "Cloud Administration Application",
          description: "Developed cloud administration tool that reduced support call durations by 50% through self-service capabilities.",
          technologies: ["C#", ".NET", "AWS"]
        },
        {
          title: "Migration to GitHub CI/CD",
          description: "Led migration from legacy CI systems to GitHub Actions with automated security scanning.",
          technologies: ["GitHub Actions", "Security Scanning"]
        }
      ]
    }
  },
  {
    PK: "EXPERIENCE",
    SK: "2019-06-01",
    content: {
      company: "Tyler Technologies",
      role: "DevOps Engineer",
      startDate: "2019-06",
      endDate: "2021-06",
      description: "Designed CI/CD pipelines streamlining deployment processes across teams. Architected scalable Puppet infrastructure for environment consistency. Automated user onboarding and routine administrative tasks via PowerShell.",
      technologies: ["AWS", "Puppet", "PowerShell", "IIS", "Terraform"],
      key_deliverables: [
        {
          title: "CI/CD Pipeline Architecture",
          description: "Designed and implemented comprehensive CI/CD pipelines streamlining deployment processes across multiple teams.",
          technologies: ["AWS", "Terraform", "GitLab CI"]
        },
        {
          title: "Infrastructure Automation",
          description: "Architected scalable Puppet infrastructure ensuring consistency across all environments.",
          technologies: ["Puppet", "AWS", "PowerShell"]
        }
      ]
    }
  },
  {
    PK: "EXPERIENCE",
    SK: "2017-08-01",
    content: {
      company: "Tyler Technologies",
      role: "Conversions Developer",
      startDate: "2017-08",
      endDate: "2019-06",
      description: "Converted legacy data systems, increasing revenue by $500K. Engineered a CLI automation tool for error log processing, accelerating conversion speed by 50%. Developed SQL scripts for seamless data integration.",
      technologies: ["C#", ".NET", "SQL", "Python"],
      key_deliverables: [
        {
          title: "Legacy System Conversions",
          description: "Successfully converted legacy data systems contributing to $500K in increased revenue.",
          technologies: ["C#", "SQL", "Data Migration"]
        },
        {
          title: "CLI Automation Tool",
          description: "Engineered automation tool for error log processing, accelerating conversion speed by 50%.",
          technologies: ["Python", "CLI Development"]
        }
      ]
    }
  },
  {
    PK: "EXPERIENCE",
    SK: "2016-04-01",
    content: {
      company: "Maine Medical Center",
      role: "Systems Specialist",
      startDate: "2016-04",
      endDate: "2017-08",
      description: "Implemented automated pharmacy reporting systems using Python and SQL. Established IT communication protocols with 2-hour response standards. Created comprehensive IT documentation framework.",
      technologies: ["Windows", "Active Directory", "PowerShell", "Python", "SQL"],
      key_deliverables: [
        {
          title: "Automated Pharmacy Reporting",
          description: "Implemented automated reporting systems for pharmacy operations using Python and SQL.",
          technologies: ["Python", "SQL", "Automation"]
        },
        {
          title: "IT Documentation Framework",
          description: "Created comprehensive documentation framework establishing IT communication protocols and standards.",
          technologies: ["PowerShell", "SQL", "SharePoint"]
        }
      ]
    }
  },
  {
    PK: "EXPERIENCE",
    SK: "2014-10-01",
    content: {
      company: "Maine Medical Center",
      role: "Desktop Support Specialist",
      startDate: "2014-10",
      endDate: "2016-04",
      description: "Led OS upgrades across thousands of hospital machines. Orchestrated software deployment strategies minimizing operational disruption. Provided desktop support and systems troubleshooting.",
      technologies: ["Windows", "Active Directory", "SCCM"],
      key_deliverables: [
        {
          title: "Large-Scale OS Upgrades",
          description: "Successfully led OS upgrade initiative across thousands of hospital workstations with minimal disruption.",
          technologies: ["Windows", "SCCM", "Active Directory"]
        }
      ]
    }
  },

  // --- SKILLS (WITH PROFICIENCY LEVELS) ---
  {
    PK: "SKILL",
    SK: "GCP",
    content: {
      category: "GCP Cloud Platform",
      proficiency: 95,
      items: ["Compute Engine", "Cloud Run", "Cloud Functions", "VPC/Subnets", "Private Service Connect", "Secret Manager", "GKE", "Cloud Build", "BigQuery", "Pub/Sub"],
      icon: "cloud",
      description: "Expertise in Google Cloud Platform services and architecture with extensive hands-on experience."
    }
  },
  {
    PK: "SKILL",
    SK: "IAC",
    content: {
      category: "Infrastructure as Code",
      proficiency: 90,
      items: ["Terraform", "OpenTofu", "Terragrunt", "AWS CDK", "Ansible"],
      icon: "code",
      description: "Advanced infrastructure automation and configuration management expertise."
    }
  },
  {
    PK: "SKILL",
    SK: "CICD",
    content: {
      category: "CI/CD & Automation",
      proficiency: 90,
      items: ["GitLab CI/CD", "GitHub Actions", "Jenkins"],
      icon: "terminal",
      description: "Building robust automated pipelines for build, test, and deployment workflows."
    }
  },
  {
    PK: "SKILL",
    SK: "AWS",
    content: {
      category: "AWS Services",
      proficiency: 85,
      items: ["IAM", "EC2", "S3", "Lambda", "RDS", "DynamoDB", "CloudFront", "API Gateway"],
      icon: "cloud",
      description: "Deep knowledge of AWS core services and serverless computing architectures."
    }
  },
  {
    PK: "SKILL",
    SK: "LINUX",
    content: {
      category: "Linux Administration",
      proficiency: 85,
      items: ["Ubuntu/Debian", "RHEL/CentOS", "Shell Scripting", "System Monitoring"],
      icon: "terminal",
      description: "Comprehensive Linux system administration and automation capabilities."
    }
  },
  {
    PK: "SKILL",
    SK: "CONTAINERS",
    content: {
      category: "Containerization",
      proficiency: 85,
      items: ["Docker", "Kubernetes", "Container Security"],
      icon: "box",
      description: "Container orchestration and cloud-native application deployment expertise."
    }
  },
  {
    PK: "SKILL",
    SK: "SECURITY",
    content: {
      category: "Security & Compliance",
      proficiency: 85,
      items: ["SonarQube", "Veracode", "Secret Management", "IAM Integration"],
      icon: "shield",
      description: "Security best practices, compliance, and vulnerability management."
    }
  },
  {
    PK: "SKILL",
    SK: "LANGUAGES",
    content: {
      category: "Scripting & Programming",
      proficiency: 80,
      items: ["Python", "Bash", "TypeScript", "JavaScript", "PowerShell", "C#"],
      icon: "code",
      description: "Polyglot programming for automation, scripting, and application development."
    }
  },
  {
    PK: "SKILL",
    SK: "WINDOWS",
    content: {
      category: "Windows Server",
      proficiency: 80,
      items: ["Active Directory", "IIS", "PowerShell Automation", "Group Policy"],
      icon: "server",
      description: "Windows Server administration and automation expertise."
    }
  },
  {
    PK: "SKILL",
    SK: "DATABASE",
    content: {
      category: "Database Management",
      proficiency: 75,
      items: ["SQL", "Liquibase", "Redis", "MSSQL", "PostgreSQL", "DynamoDB"],
      icon: "database",
      description: "Database administration, schema migrations, and data management."
    }
  },

  // --- CERTIFICATIONS (WITH EXPIRED AWS CERT) ---
  {
    PK: "CERTIFICATION",
    SK: "GCP_ACE_2025",
    content: {
      name: "Associate Cloud Engineer",
      issuer: "Google Cloud",
      date: "Mar 2025 - Mar 2028",
      issuedDate: "Mar 2025",
      expirationDate: "Mar 2028",
      active: true,
      link: "https://www.credly.com/badges/1031a5b8-a13d-4d24-803c-8282a2cb408e/public_url",
      imageUrl: "https://images.credly.com/size/680x680/images/6df3b36d-9d41-4560-b6bd-139857d45e5f/gcp-ace.png"
    }
  },
  {
    PK: "CERTIFICATION",
    SK: "AWS_CCP_2020",
    content: {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Jun 2020 - Jun 2023",
      issuedDate: "Jun 2020",
      expirationDate: "Jun 2023",
      active: false,
      link: "https://www.credly.com/badges/58407824-f9ed-47d5-8b3b-a96f134cc416/public_url",
      imageUrl: "https://images.credly.com/size/680x680/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png"
    }
  },

  // --- EDUCATION ---
  {
    PK: "EDUCATION",
    SK: "SMCC_2017",
    content: {
      degree: "Associate's Degree in Computer Science",
      institution: "Southern Maine Community College",
      graduationDate: "May 2017",
      gpa: "3.8",
      honors: ["Phi Theta Kappa Honor Society"]
    }
  },

  // --- PROJECTS ---
  {
    PK: "PROJECT",
    SK: "2025-01-EMQX",
    content: {
      title: "EMQX SSL Certificate Automation",
      date: "Jan 2025",
      description: "Developed automated SSL certificate management solution improving security and reducing manual intervention for EMQX broker deployments.",
      technologies: ["GCP", "Secret Manager", "Pub/Sub", "Terraform"],
      link: null
    }
  },
  {
    PK: "PROJECT",
    SK: "2024-03-TERRAFORM-DOCS",
    content: {
      title: "Terraform Documentation Automation",
      date: "Mar 2024",
      description: "Implemented comprehensive automation generating standardized README files, usage examples, and configuration templates with automatic updates for Terraform modules.",
      technologies: ["Terraform", "terraform-docs", "Python", "GitLab CI"],
      link: null
    }
  },
  {
    PK: "PROJECT",
    SK: "2023-09-PREVIEW-ENVS",
    content: {
      title: "Dynamic Preview Environments",
      date: "Sep 2023",
      description: "Designed scalable preview environments tied to GitLab merge requests improving testing efficiency and development workflow.",
      technologies: ["GitLab", "Terraform", "GCP", "Kubernetes"],
      link: null
    }
  },
  {
    PK: "PROJECT",
    SK: "2023-05-CERT-MGMT",
    content: {
      title: "Certificate Management Automation",
      date: "May 2023",
      description: "Implemented automated SSL renewal system eliminating manual processes and downtime risks using GCP Secret Manager and Pub/Sub.",
      technologies: ["GCP Secret Manager", "Pub/Sub", "Terraform", "GitLab CI"],
      link: null
    }
  },
  {
    PK: "PROJECT",
    SK: "2023-05-COST-OPT",
    content: {
      title: "Cloud Cost Optimization Initiative",
      date: "May 2023",
      description: "Led optimization initiative resulting in 30% reduction in monthly infrastructure expenses across all cloud environments.",
      technologies: ["GCP", "Terraform", "Cost Management", "FinOps"],
      link: null
    }
  }
];

const run = async () => {
  console.log("Starting complete content migration...");
  console.log(`Migrating ${completeData.length} items to DynamoDB...`);

  // Batch write all items
  const params = {
    RequestItems: {
      [TABLE_NAME]: completeData.map((item) => ({
        PutRequest: {
          Item: marshall(item),
        },
      })),
    },
  };

  try {
    const result = await client.send(new BatchWriteItemCommand(params));
    console.log("✅ Success! All items migrated:", result);
    console.log("\nMigration Summary:");
    console.log("- Profile: Updated location to Windham, ME");
    console.log("- Experience: 6 complete roles (3 new additions)");
    console.log("- Skills: 10 categories with proficiency levels");
    console.log("- Certifications: 2 items (1 active, 1 expired)");
    console.log("- Education: 1 entry added");
    console.log("- Projects: 5 portfolio items added");
  } catch (err) {
    console.error("❌ Error migrating content:", err);
  }
};

run();
