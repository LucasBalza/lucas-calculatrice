const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;

describe('POST /calculate', () => {
  beforeAll(async () => {
    // Démarrer MongoDB en mémoire pour les tests
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });
  test('addition réussie', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operation: '+', a: 5, b: 3 })
      .expect(200);

    expect(response.body).toEqual({ result: 8 });
  });

  test('soustraction réussie', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operation: '-', a: 10, b: 4 })
      .expect(200);

    expect(response.body).toEqual({ result: 6 });
  });

  test('multiplication réussie', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operation: '*', a: 3, b: 4 })
      .expect(200);

    expect(response.body).toEqual({ result: 12 });
  });

  test('division réussie', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operation: '/', a: 15, b: 3 })
      .expect(200);

    expect(response.body).toEqual({ result: 5 });
  });

  test('division par zéro retourne une erreur', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operation: '/', a: 10, b: 0 })
      .expect(400);

    expect(response.body.error).toContain('Division par zéro');
  });

  test('paramètres manquants retourne une erreur', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operation: '+' })
      .expect(400);

    expect(response.body.error).toContain('Paramètres manquants');
  });

  test('opération invalide retourne une erreur', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operation: '%', a: 10, b: 5 })
      .expect(400);

    expect(response.body.error).toContain('Opération invalide');
  });
});

