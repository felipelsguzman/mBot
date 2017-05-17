'use strict';

const run = require('ava');
const test = require('unit.js');
const mBot = require('../src/mBot');
const server = require('../index');
const request = require('supertest');

// fixtures
const payload = require('./lib/fixtures/payload');
const referralPayload = require('./lib/fixtures/referralPayload');
const postbackStartButtonPayload = require('./lib/fixtures/postbackStartButtonPayload');
const quickReplyPayload = require('./lib/fixtures/quickReplyPayload');
const textPayload = require('./lib/fixtures/textPayload');
const stickerPayload = require('./lib/fixtures/stickerPayload');
const imagePayload = require('./lib/fixtures/imagePayload');
const audioPayload = require('./lib/fixtures/audioPayload');
const videoPayload = require('./lib/fixtures/videoPayload');

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

run('handlePayload', async () => {

    test.$factory('mBot', () => {
        return mBot;
    });

    test.$factory('referralPayload', () => {
        return referralPayload.entry;
    });

    test.$factory('postbackStartButtonPayload', () => {
        return postbackStartButtonPayload.entry;
    });

    test.$factory('quickReplyPayload', () => {
        return quickReplyPayload.entry;
    });

    test.$factory('textPayload', () => {
        return textPayload.entry;
    });

    test.$factory('stickerPayload', () => {
        return stickerPayload.entry;
    });

    test.$factory('imagePayload', () => {
        return imagePayload.entry;
    });

    test.$factory('audioPayload', () => {
        return audioPayload.entry;
    });

    test.$factory('videoPayload', () => {
        return videoPayload.entry;
    });

    test
        .case('referral', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('referralPayload');

            mBot.handlePayload(payload);

            mBot.on('referral', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('referral');
            });
        })
        .case('postback - startButton', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('postbackStartButtonPayload');

            mBot.handlePayload(payload);

            mBot.on('startButton', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('postback');
            });
        })
        .case('quickReply', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('quickReplyPayload');

            mBot.handlePayload(payload);

            mBot.on('quickReply', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('mid')
                    .hasProperty('seq')
                    .hasProperty('quickReply')
                    .hasProperty('text');
            })
        })
        .case('text message', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('textPayload');

            mBot.handlePayload(payload);

            mBot.on('text', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('mid')
                    .hasProperty('seq')
                    .hasProperty('text');
            });
        })
        .case('sticker message', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('stickerPayload');

            mBot.handlePayload(payload);

            mBot.on('sticker', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('mid')
                    .hasProperty('seq')
                    .hasProperty('stickerId')
                    .hasProperty('stickerUrl');
            });

        })
        .case('image message', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('imagePayload');

            mBot.handlePayload(payload);

            mBot.on('image', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('mid')
                    .hasProperty('seq')
                    .hasProperty('image');
            });

        })
        .case('audio message', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('audioPayload');

            mBot.handlePayload(payload);

            mBot.on('audio', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('mid')
                    .hasProperty('seq')
                    .hasProperty('audio');
            });

        })
        .case('video message', () => {
            let mBot = test.$di.get('mBot');
            let payload = test.$di.get('videoPayload');

            mBot.handlePayload(payload);

            mBot.on('video', data => {
                test.object(data)
                    .hasProperty('id')
                    .hasProperty('time')
                    .hasProperty('senderId')
                    .hasProperty('recipientId')
                    .hasProperty('timestamp')
                    .hasProperty('mid')
                    .hasProperty('seq')
                    .hasProperty('video');
            });

        });
});

