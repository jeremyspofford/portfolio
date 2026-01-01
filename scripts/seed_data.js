const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "portfolio-content";

const data = [
  {
    PK: "CONFIG",
    SK: "FEATURES",
    content: {
      show_contributions: true,
      show_resume_download: true,
      enable_ai: true
    }
  },
  {
    PK: "PROFILE",
    SK: "MAIN",
    content: {
      name: "Jeremy Spofford",
      title: "Senior DevOps Engineer",
      bio: "Passionate about building scalable infrastructure and developer tools.",
      email: "jeremy@example.com",
      socials: {
        github: "https://github.com/jeremyspofford",
        linkedin: "https://linkedin.com/in/jeremyspofford"
      }
    }
  },
  {
      PK: "EXPERIENCE",
      SK: "2023-01-01",
      content: {
          company: "Current Company",
          role: "Senior DevOps Engineer",
          startDate: "2023-01",
          endDate: "Present",
          description: "Leading the platform engineering team...",
          technologies: ["AWS", "Terraform", "Kubernetes"]
      }
  },
  {
    PK: "SKILL",
    SK: "INFRASTRUCTURE",
    content: {
        category: "Infrastructure",
        items: ["Terraform", "CloudFormation", "Ansible"]
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
