'use strict';

const run = require('ava');
const test = require('unit.js');
const mBot = require('../src/mBot');
const server = require('../index');
const request = require('supertest');

// fixtures
const payload = require('./lib/fixtures/payload');

const app = server.listen();

run('check messengerAPI object properties', () => {

        test.object(mBot.api);

});

run('GET /messenger - test 401 Unauthorized', async () => {
    await request(app)
        .get('/messenger')
        .query({
            'hub.verify_token': 'testVerifyToken',
            'hub.challenge': 9876543210
        })
        .expect('Content-type', 'text/plain; charset=utf-8')
        .expect(401)
        .then(response => {
            test.bool(response.unauthorized).isTrue();
        })
        .catch(error => {
            test.fail(error);
        });
});

run('GET /messenger - test 200 OK', async () => {
    await request(app)
        .get('/messenger')
        .query({
            'hub.verify_token': mBot.verifyToken,
            'hub.challenge': 9876543210
        })
        .expect('Content-type', 'text/plain; charset=utf-8')
        .expect(200)
        .then(response => {
            test.bool(response.ok).isTrue();
        })
        .catch(error => {
            test.fail(error);
        });
});

run('GET /messenger - test register hook for facebook', async () => {
    await request(app)
        .get('/messenger')
        .query({
            'hub.verify_token': mBot.verifyToken,
            'hub.challenge': 9876543210
        })
        .expect('Content-type', 'text/plain; charset=utf-8')
        .expect(200)
        .then(response => {
            test.number(Number(response.text)).is(9876543210);
        })
        .catch(error => {
            test.fail(error);
        });
});

run('POST /messenger - test webhook', async () => {
    await request(app)
        .post('/messenger')
        .send(payload)
        .expect('Content-type', 'text/plain; charset=utf-8')
        .expect(200)
        .then(response => {
            test.bool(response.ok).isTrue();
        })
        .catch(error => {
            test.fail(error);
        });
});
