const request = require('supertest');
const app = require('../src/app');
const User =require('../src/models/user');

const userOne = {
    name: 'Mister',
    email: 'mister@example.com',
    password: '35What?!'
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should signup new user', async () => {
    await request(app).post('/users').send({
        name: 'Valter',
        email: 'valter@example.com',
        password: 'MyPass777!'
    }).expect(201);
});

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
});

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotapassword'
    }).expect(400);
});