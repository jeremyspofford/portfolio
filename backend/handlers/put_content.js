const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,PUT"
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "Missing body" }) };
    }

    const item = JSON.parse(event.body);
    
    // Basic validation
    if (!item.PK || !item.SK || !item.content) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: "Missing PK, SK, or content" }) };
    }

    const params = {
      TableName: TABLE_NAME,
      Item: marshall(item)
    };

    await client.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Content updated successfully", item })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};
