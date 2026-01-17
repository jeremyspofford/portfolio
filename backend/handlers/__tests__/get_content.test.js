const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBClient, QueryCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { handler } = require('../get_content');

const ddbMock = mockClient(DynamoDBClient);

describe('get_content handler', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  describe('RED PHASE - DynamoDB table state verification', () => {
    test('should return EXPERIENCE items from DynamoDB', async () => {
      // Mock DynamoDB response
      const mockExperienceItems = [
        {
          PK: { S: 'EXPERIENCE' },
          SK: { S: '2022-11-01' },
          content: {
            M: {
              company: { S: 'VividCloud' },
              role: { S: 'Senior DevOps Engineer' },
              startDate: { S: '2022-11' },
              endDate: { S: 'Present' }
            }
          }
        },
        {
          PK: { S: 'EXPERIENCE' },
          SK: { S: '2019-06-01' },
          content: {
            M: {
              company: { S: 'Tyler Technologies' },
              role: { S: 'Software Engineer & DevOps Engineer' },
              startDate: { S: '2019-06' },
              endDate: { S: '2022-11' }
            }
          }
        },
        {
          PK: { S: 'EXPERIENCE' },
          SK: { S: '2014-10-01' },
          content: {
            M: {
              company: { S: 'Maine Medical Center' },
              role: { S: 'Systems Specialist & Desktop Support' },
              startDate: { S: '2014-10' },
              endDate: { S: '2017-08' }
            }
          }
        }
      ];

      ddbMock.on(QueryCommand).resolves({
        Items: mockExperienceItems
      });

      const event = {
        queryStringParameters: {
          section: 'EXPERIENCE'
        }
      };

      const response = await handler(event);
      const body = JSON.parse(response.body);

      // This test will FAIL if DynamoDB doesn't have 3+ experience entries
      expect(response.statusCode).toBe(200);
      expect(body.length).toBeGreaterThanOrEqual(3);
      expect(body.find(item => item.content.company === 'VividCloud')).toBeDefined();
      expect(body.find(item => item.content.company === 'Tyler Technologies')).toBeDefined();
      expect(body.find(item => item.content.company === 'Maine Medical Center')).toBeDefined();
    });

    test('should return SKILL items from DynamoDB', async () => {
      const mockSkillItems = [
        {
          PK: { S: 'SKILL' },
          SK: { S: 'GCP' },
          content: {
            M: {
              category: { S: 'GCP' },
              items: { L: [{ S: 'Compute Engine' }, { S: 'GKE' }] }
            }
          }
        }
      ];

      ddbMock.on(QueryCommand).resolves({
        Items: mockSkillItems
      });

      const event = {
        queryStringParameters: {
          section: 'SKILL'
        }
      };

      const response = await handler(event);
      const body = JSON.parse(response.body);

      // This test will FAIL if DynamoDB doesn't have skill items
      expect(response.statusCode).toBe(200);
      expect(body.length).toBeGreaterThanOrEqual(1);
    });

    test('should return CERTIFICATION items from DynamoDB', async () => {
      const mockCertItems = [
        {
          PK: { S: 'CERTIFICATION' },
          SK: { S: 'GCP-ACE' },
          content: {
            M: {
              name: { S: 'Associate Cloud Engineer' },
              issuer: { S: 'Google Cloud' },
              active: { BOOL: true }
            }
          }
        }
      ];

      ddbMock.on(QueryCommand).resolves({
        Items: mockCertItems
      });

      const event = {
        queryStringParameters: {
          section: 'CERTIFICATION'
        }
      };

      const response = await handler(event);
      const body = JSON.parse(response.body);

      // This test will FAIL if DynamoDB doesn't have certification items
      expect(response.statusCode).toBe(200);
      expect(body.length).toBeGreaterThanOrEqual(1);
    });

    test('should return PROFILE item from DynamoDB', async () => {
      const mockProfileItem = [
        {
          PK: { S: 'PROFILE' },
          SK: { S: 'MAIN' },
          content: {
            M: {
              name: { S: 'Jeremy Spofford' },
              title: { S: 'Senior DevOps Engineer' },
              email: { S: 'JeremySpofford@gmail.com' }
            }
          }
        }
      ];

      ddbMock.on(QueryCommand).resolves({
        Items: mockProfileItem
      });

      const event = {
        queryStringParameters: {
          section: 'PROFILE'
        }
      };

      const response = await handler(event);
      const body = JSON.parse(response.body);

      // This test will FAIL if DynamoDB doesn't have profile item
      expect(response.statusCode).toBe(200);
      expect(body.length).toBe(1);
      expect(body[0].content.name).toBe('Jeremy Spofford');
    });
  });

  describe('Error handling', () => {
    test('should return 500 on DynamoDB error', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('DynamoDB error'));

      const event = {
        queryStringParameters: {
          section: 'EXPERIENCE'
        }
      };

      const response = await handler(event);

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body).error).toBe('Internal Server Error');
    });
  });

  describe('CORS headers', () => {
    test('should include CORS headers in response', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] });

      const event = {
        queryStringParameters: {
          section: 'EXPERIENCE'
        }
      };

      const response = await handler(event);

      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(response.headers['Content-Type']).toBe('application/json');
    });
  });
});
