const request = require('supertest');
const express = require('express');
const { defaultResponses } = require('../src/defaultResponses');
const app = express();
app.use(express.json());
app.use(require('../src/routing'));

jest.mock('../src/interfaces', () => ({
  PeerIface: jest.fn().mockImplementation(() => ({
    getRecommendation: jest.fn().mockResolvedValue("Peer response")
  })),
  OpenAiIface: jest.fn().mockImplementation(() => ({
    getResponse: jest.fn().mockResolvedValue("OpenAI response")
  })),
  DatabaseIface: jest.fn().mockImplementation(() => ({
    getResponse: jest.fn().mockResolvedValue("Database response")
  }))
}));

describe('RecommenderController', () => {
  test('/OpenAI endpoint returns data from OpenAiIface', async () => {
    console.log("Starting test01");
    const response = await request(app).get('/OpenAI');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("OpenAI response");
  });

  test('/DefaultResponses endpoint returns data from DatabaseIface', async () => {
    const response = await request(app).get('/DefaultResponses');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Database response");
  });

  test('/Endpoint endpoint returns default response', async () => {
    const response = await request(app).get('/Endpoint');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain(defaultResponses.default);
  });
});
