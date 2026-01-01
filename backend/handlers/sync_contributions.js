const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const https = require('https');

const client = new DynamoDBClient();
const TABLE_NAME = "portfolio-content";
const GITHUB_USERNAME = "jeremyspofford";

function fetchGitHubData(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: path,
            headers: {
                'User-Agent': 'Portfolio-Sync-Lambda'
            }
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`GitHub API Error: ${res.statusCode} ${data}`));
                }
            });
        }).on('error', (err) => reject(err));
    });
}

exports.handler = async (event) => {
    console.log("Syncing contributions...");
    
    try {
        // Fetch User Data
        const user = await fetchGitHubData(`/users/${GITHUB_USERNAME}`);
        // Fetch Repos (simplified logic for total stars for now, or just use user stats)
        
        const content = {
            source: "github",
            username: GITHUB_USERNAME,
            public_repos: user.public_repos,
            followers: user.followers,
            last_synced: new Date().toISOString()
            // We can add contribution graph scraping later if needed, but API gives basic stats
        };

        const item = {
            PK: "CONTRIBUTIONS",
            SK: "GITHUB",
            content: content
        };

        await client.send(new PutItemCommand({
            TableName: TABLE_NAME,
            Item: marshall(item)
        }));

        console.log("Successfully synced GitHub content");
        return { statusCode: 200, body: JSON.stringify({ status: "synced", data: content }) };

    } catch (error) {
        console.error("Sync failed:", error);
         return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
