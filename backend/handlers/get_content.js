const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient();
const TABLE_NAME = "portfolio-content";

exports.handler = async (event) => {
  console.log("get-content invoked", JSON.stringify(event));
  
  const section = event.queryStringParameters?.section;

  try {
    let command;
    if (section) {
        command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ":pk": { S: section }
            }
        });
    } else {
        command = new ScanCommand({ TableName: TABLE_NAME });
    }

    const data = await client.send(command);
    const items = data.Items.map(item => unmarshall(item));

    return {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Configure stricter in production
      },
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
