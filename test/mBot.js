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

const whitelistedUrl = process.env.TEST_URL;

// routes

run('GET /messenger - 401 Unauthorized', async () => {
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

run('GET /messenger - 200 OK', async () => {
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

run('GET /messenger - register hook for facebook', async () => {
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

run('POST /messenger - receive data from facebook messenger', async () => {
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


// methods
run('koa()', () => {
    test.object(mBot)
        .notHasValue(null);
});

run('init()', async () => {
    test.object(mBot)
        .notHasValue(null);
});

run('handlePayload()', async () => {

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

run('sendTextMessage()', async () => {

    await mBot.api.sendTextMessage({
        userId: process.env.TEST_FBID,
        message: 'TEST - sendTextMessage'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error);
        });

});

run('sendAttachment() - audio', async () => {

    await mBot.api.sendAttachment({
        userId: process.env.TEST_FBID,
        type: 'audio',
        payloadUrl: 'https://japarvi.cl/wp-content/uploads/2017/05/Failure-trumpet-melody.mp3'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });

});

run('sendAttachment() - file', async () => {

    await mBot.api.sendAttachment({
        userId: process.env.TEST_FBID,
        type: 'file',
        payloadUrl: 'http://greenteapress.com/thinkpython2/thinkpython2.pdf'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });

});

run('sendAttachment() - image', async () => {

    await mBot.api.sendAttachment({
        userId: process.env.TEST_FBID,
        type: 'image',
        payloadUrl: 'http://kingofwallpapers.com/image/image-025.jpg'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });

});

run('sendAttachment() - video', async () => {

    await mBot.api.sendAttachment({
        userId: process.env.TEST_FBID,
        type: 'video',
        payloadUrl: 'https://static.videezy.com/system/resources/previews/000/000/551/original/VE_003.mp4'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });

});

run('sendButtonTemplate()', async () => {
    let buttons = [
        {
            type: 'web_url',
            url: 'https://www.some-url.com',
            title: 'buttonTitle'
        },
        {
            type: 'postback',
            title: 'buttonTitle',
            payload: 'userDefinedPayload'
        }
    ];

    await mBot.api.sendButtonTemplate({
        userId: process.env.TEST_FBID,
        text: 'TEST - sendButtonTemplate',
        buttons: buttons
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendGenericTemplate()', async () => {

    let elements = [
        {
            title: 'titleText',
            item_url: 'https://www.some-url.com',
            image_url: 'https://www.some-url.com/some-image.png',
            subtitle: 'someSubtitle',
            buttons:[
                {
                    type: 'web_url',
                    url: 'https://www.some-url.com',
                    title: 'buttonTitle'
                },
                {
                    type: 'postback',
                    title: 'buttonTitle',
                    payload: 'userDefinedPayload'
                }
            ]
        },
        {
            title: 'titleText',
            item_url: 'https://www.some-url.com',
            image_url: 'https://www.some-url.com/some-image.png',
            subtitle: 'someSubtitle',
            buttons:[
                {
                    type: 'web_url',
                    url: 'https://www.some-url.com',
                    title: 'buttonTitle'
                },
                {
                    type: 'postback',
                    title: 'buttonTitle',
                    payload: 'userDefinedPayload'
                }
            ]
        },
        {
            title: 'titleText',
            item_url: 'https://www.some-url.com',
            image_url: 'https://www.some-url.com/some-image.png',
            subtitle: 'someSubtitle',
            buttons:[
                {
                    type: 'web_url',
                    url: 'https://www.some-url.com',
                    title: 'buttonTitle'
                },
                {
                    type: 'postback',
                    title: 'buttonTitle',
                    payload: 'userDefinedPayload'
                }
            ]
        }
    ];

    await mBot.api.sendGenericTemplate({
        userId: process.env.TEST_FBID,
        elements: elements
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendReceiptTemplate()', async () => {

    let elements = [
        {
            title: 'Classic White T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 2,
            price: 50,
            currency: 'USD',
            image_url: 'http://petersapparel.parseapp.com/img/whiteshirt.png'
        },
        {
            title: 'Classic Gray T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 1,
            price: 25,
            currency: 'USD',
            image_url: 'http://petersapparel.parseapp.com/img/grayshirt.png'
        }
    ];

    let address = {
        street_1: '1 Hacker Way',
        street_2: '',
        city: 'Menlo Park',
        postal_code: 94025,
        state: 'CA',
        country: 'US'
    };

    let summary = {
        subtotal: 7500,
        shipping_cost: 495,
        total_tax: 619,
        total_cost: 5614
    };

    let adjustments = [
        {
            name: 'New Customer Discount',
            amount: 20
        },
        {
            name: '$10 Off Coupon',
            amount: 10
        }
    ];

    await mBot.api.sendReceiptTemplate({
        userId: process.env.TEST_FBID,
        recipientName: 'Jesus',
        orderNumber: 700845554,
        merchantName: 'BlackMarket',
        currency: 'CLP',
        paymentMethod: 'VISA 4884',
        timestamp: 1428444852,
        orderUrl: 'https://www.some-url.com',
        elements: elements,
        address: address,
        summary: summary,
        adjustments: adjustments
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendListTemplate()', async () => {

    let elements = [
        {
            title: 'Classic T-Shirt Collection',
            image_url: `${whitelistedUrl}/img/collection.png`,
            subtitle: 'See all our colors',
            default_action: {
                type: 'web_url',
                url: `${whitelistedUrl}/shop_collection`,
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: `${whitelistedUrl}`
            },
            buttons: [
                {
                    title: 'View',
                    type: 'web_url',
                    url: `${whitelistedUrl}/collection`,
                    messenger_extensions: true,
                    webview_height_ratio: 'tall',
                    fallback_url: `${whitelistedUrl}`
                }
            ]
        },
        {
            title: 'Classic T-Shirt Collection',
            image_url: `${whitelistedUrl}/img/collection.png`,
            subtitle: 'See all our colors',
            default_action: {
                type: 'web_url',
                url: `${whitelistedUrl}/shop_collection`,
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: `${whitelistedUrl}`
            },
            buttons: [
                {
                    title: 'View',
                    type: 'web_url',
                    url: `${whitelistedUrl}/collection`,
                    messenger_extensions: true,
                    webview_height_ratio: 'tall',
                    fallback_url: `${whitelistedUrl}`
                }
            ]
        },
        {
            title: 'Classic T-Shirt Collection',
            image_url: `${whitelistedUrl}/img/collection.png`,
            subtitle: 'See all our colors',
            default_action: {
                type: 'web_url',
                url: `${whitelistedUrl}/shop_collection`,
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: `${whitelistedUrl}`
            },
            buttons: [
                {
                    title: 'View',
                    type: 'web_url',
                    url: `${whitelistedUrl}/collection`,
                    messenger_extensions: true,
                    webview_height_ratio: 'tall',
                    fallback_url: `${whitelistedUrl}`
                }
            ]
        },
        {
            title: 'Classic T-Shirt Collection',
            image_url: `${whitelistedUrl}/img/collection.png`,
            subtitle: 'See all our colors',
            default_action: {
                type: 'web_url',
                url: `${whitelistedUrl}/shop_collection`,
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: `${whitelistedUrl}`
            },
            buttons: [
                {
                    title: 'View',
                    type: 'web_url',
                    url: `${whitelistedUrl}/collection`,
                    messenger_extensions: true,
                    webview_height_ratio: 'tall',
                    fallback_url: `${whitelistedUrl}`
                }
            ]
        }
    ];

    let buttons  = [
        {
            title: 'View More',
            type: 'postback',
            payload: 'payload'
        }
    ];

    await mBot.api.sendListTemplate({
        userId: process.env.TEST_FBID,
        elements: elements,
        buttons:  buttons,
        type: 'large'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendBoardingPassTemplate()', async () => {

    let boardingPass = [
        {
            passenger_name: 'SMITH\/NICOLAS',
            pnr_number: 'CG4X7U',
            travel_class: 'business',
            seat: '74J',
            auxiliary_fields: [
                {
                    label: 'Terminal',
                    value: 'T1'
                },
                {
                    label: 'Departure',
                    value: '30OCT 19:05'
                }
            ],
            secondary_fields: [
                {
                    label: 'Boarding',
                    value: '18:30'
                },
                {
                    label: 'Gate',
                    value: 'D57'
                },
                {
                    label: 'Seat',
                    value: '74J'
                },
                {
                    label: 'Sec.Nr.',
                    value: '003'
                }
            ],
            logo_image_url: 'https:\/\/www.example.com\/en\/logo.png',
            header_image_url: 'https:\/\/www.example.com\/en\/fb\/header.png',
            qr_code: 'M1SMITH\/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
            above_bar_code_image_url: 'https:\/\/www.example.com\/en\/PLAT.png',
            flight_info: {
                flight_number: 'KL0642',
                departure_airport: {
                    airport_code: 'JFK',
                    city: 'New York',
                    terminal: 'T1',
                    gate: 'D57'
                },
                arrival_airport: {
                    airport_code: 'AMS',
                    city: 'Amsterdam'
                },
                flight_schedule: {
                    departure_time: '2016-01-02T19:05',
                    arrival_time: '2016-01-05T17:30'
                }
            }
        },
        {
            passenger_name: 'JONES\/FARBOUND',
            pnr_number: 'CG4X7U',
            travel_class: 'business',
            seat: '74K',
            auxiliary_fields: [
                {
                    label: 'Terminal',
                    value: 'T1'
                },
                {
                    label: 'Departure',
                    value: '30OCT 19:05'
                }
            ],
            secondary_fields: [
                {
                    label: 'Boarding',
                    value: '18:30'
                },
                {
                    label: 'Gate',
                    value: 'D57'
                },
                {
                    label: 'Seat',
                    value: '74K'
                },
                {
                    label: 'Sec.Nr.',
                    value: '004'
                }
            ],
            logo_image_url: 'https:\/\/www.example.com\/en\/logo.png',
            header_image_url: 'https:\/\/www.example.com\/en\/fb\/header.png',
            qr_code: 'M1JONES\/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
            above_bar_code_image_url: 'https:\/\/www.example.com\/en\/PLAT.png',
            flight_info: {
                flight_number: 'KL0642',
                departure_airport: {
                    airport_code: 'JFK',
                    city: 'New York',
                    terminal: 'T1',
                    gate: 'D57'
                },
                arrival_airport: {
                    airport_code: 'AMS',
                    city: 'Amsterdam'
                },
                flight_schedule: {
                    departure_time: '2016-01-02T19:05',
                    arrival_time: '2016-01-05T17:30'
                }
            }
        }
    ];

    await mBot.api.sendBoardingPassTemplate({
        userId: process.env.TEST_FBID,
        introMessage: 'You are checked in.',
        locale: 'en_US',
        boardingPass: boardingPass
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendChekinTemplate()', async () => {

    let flightInfo = [
        {
            flight_number: 'f001',
            departure_airport: {
                airport_code: 'SFO',
                city: 'San Francisco',
                terminal: 'T4',
                gate: 'G8'
            },
            arrival_airport: {
                airport_code: 'SEA',
                city: 'Seattle',
                terminal: 'T4',
                gate: 'G8'
            },
            flight_schedule: {
                boarding_time: '2016-01-05T15:05',
                departure_time: '2016-01-05T15:45',
                arrival_time: '2016-01-05T17:30'
            }
        }
    ];

    await mBot.api.sendCheckinTemplate({
        userId: process.env.TEST_FBID,
        introMessage: 'Check-in is available now.',
        locale: 'en_US',
        pnrNumber: 'ABCDEF',
        flightInfo: flightInfo,
        checkinUrl: 'https:\/\/www.airline.com\/check-in'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendItineraryTemplate()', async () => {

    let passengerInfo = [
        {
            name: 'Farbound Smith Jr',
            ticket_number: '0741234567890',
            passenger_id: 'p001'
        },
        {
            name: 'Nick Jones',
            ticket_number: '0741234567891',
            passenger_id: 'p002'
        }
    ];

    let flightInfo = [
        {
            connection_id: 'c001',
            segment_id: 's001',
            flight_number: 'KL9123',
            aircraft_type: 'Boeing 737',
            departure_airport: {
                airport_code: 'SFO',
                city: 'San Francisco',
                terminal: 'T4',
                gate: 'G8'
            },
            arrival_airport: {
                airport_code: 'SLC',
                city: 'Salt Lake City',
                terminal: 'T4',
                gate: 'G8'
            },
            flight_schedule: {
                departure_time: '2016-01-02T19:45',
                arrival_time: '2016-01-02T21:20'
            },
            travel_class: 'business'
        },
        {
            connection_id: 'c002',
            segment_id: 's002',
            flight_number: 'KL321',
            aircraft_type: 'Boeing 747-200',
            travel_class: 'business',
            departure_airport: {
                airport_code: 'SLC',
                city: 'Salt Lake City',
                terminal: 'T1',
                gate: 'G33'
            },
            arrival_airport: {
                airport_code: 'AMS',
                city: 'Amsterdam',
                terminal: 'T1',
                gate: 'G33'
            },
            flight_schedule: {
                departure_time: '2016-01-02T22:45',
                arrival_time: '2016-01-03T17:20'
            }
        }
    ];

    let passengerSegmentInfo = [
        {
            segment_id: 's001',
            passenger_id: 'p001',
            seat: '12A',
            seat_type: 'Business'
        },
        {
            segment_id: 's001',
            passenger_id: 'p002',
            seat: '12B',
            seat_type: 'Business'
        },
        {
            segment_id: 's002',
            passenger_id: 'p001',
            seat: '73A',
            seat_type: 'World Business',
            product_info: [
                {
                    title: 'Lounge',
                    value: 'Complimentary lounge access'
                },
                {
                    title: 'Baggage',
                    value: '1 extra bag 50lbs'
                }
            ]
        },
        {
            segment_id: 's002',
            passenger_id: 'p002',
            seat: '73B',
            seat_type: 'World Business',
            product_info: [
                {
                    title: 'Lounge',
                    value: 'Complimentary lounge access'
                },
                {
                    title: 'Baggage',
                    value: '1 extra bag 50lbs'
                }
            ]
        }
    ];

    let priceInfo = [
        {
            title: 'Fuel surcharge',
            amount: 1597,
            currency: 'USD'
        }
    ];

    await mBot.api.sendItineraryTemplate({
        userId: process.env.TEST_FBID,
        introMessage: 'Here\'s your flight itinerary.',
        locale: 'en_US',
        pnrNumber: 'ABCDEF',
        passengerInfo: passengerInfo,
        flightInfo: flightInfo,
        passengerSegmentInfo: passengerSegmentInfo,
        priceInfo: priceInfo,
        basePrice: 12206,
        tax: 200,
        totalPrice: 14003,
        currency: 'USD'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendFlightUpdateTemplate()', async () => {

    let updateFlightInfo = {
        flight_number: 'KL123',
        departure_airport: {
            airport_code: 'SFO',
            city: 'San Francisco',
            terminal: 'T4',
            gate: 'G8'
        },
        arrival_airport: {
            airport_code: 'AMS',
            city: 'Amsterdam',
            terminal: 'T4',
            gate: 'G8'
        },
        flight_schedule: {
            boarding_time: '2015-12-26T10:30',
            departure_time: '2015-12-26T11:30',
            arrival_time: '2015-12-27T07:30'
        }
    };

    await mBot.api.sendFlightUpdateTemplate({
        userId: process.env.TEST_FBID,
        introMessage: 'Your flight is delayed',
        updateType: 'delay',
        locale: 'en_US',
        pnrNumber: 'CF23G2',
        updateFlightInfo: updateFlightInfo
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('sendQuickReplies()', async () => {

    let quickReplies = [
        {
            content_type:'text',
            title:'Red',
            payload:'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
        },
        {
            content_type:'text',
            title:'Green',
            payload:'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN'
        }
    ];

    await mBot.api.sendQuickReplies({
        userId: process.env.TEST_FBID,
        text: 'Selecciona una opcion',
        quickReplies: quickReplies
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id')
                .hasProperty('message_id');
        })
        .catch(error=>{
            test.fail(error)
        });

});

run('sendAction()', async () => {

    await mBot.api.sendAction({
        userId: process.env.TEST_FBID,
        senderAction: 'typing_on'
    })
        .then(response => {
            test.object(response)
                .hasProperty('recipient_id');
        })
        .catch(error=>{
            test.fail(error)
        });

});

run('getUserProfile()', async () => {

    await mBot.api.getUserProfile(process.env.TEST_FBID)
        .then(response => {

            test.object(response)
                .hasProperty('first_name')
                .hasProperty('last_name')
                .hasProperty('profile_pic')
                .hasProperty('locale')
                .hasProperty('timezone')
                .hasProperty('gender')
                .hasProperty('is_payment_enabled');
        })
        .catch(error=>{
            test.fail(error);
        });
});

run('setPersistentMenu()', async () => {
    let persistentMenu = [
        {
            locale: 'default',
            composer_input_disabled: false,
            call_to_actions: [
                {
                    title: 'Mi cuenta',
                    type: 'nested',
                    call_to_actions: [
                        {
                            title: 'ver perfil',
                            type: 'postback',
                            payload: 'PAYBILL_PAYLOAD'
                        },
                        {
                            title: 'opciones',
                            type: 'postback',
                            payload: 'HISTORY_PAYLOAD'
                        },
                        {
                            title: 'wishlist',
                            type: 'postback',
                            payload: 'CONTACT_INFO_PAYLOAD'
                        }
                    ]
                },
                {
                    type: 'web_url',
                    title: 'blog',
                    url: 'http://petershats.parseapp.com/hat-news',
                    webview_height_ratio: 'full'
                }
            ]
        },
        {
            locale: 'en_US',
            composer_input_disabled: false
        }
    ];

    await mBot.api.setPersistentMenu(persistentMenu)
        .then(response => {
            test.object(response)
                .hasProperty('result', 'success');

        })
        .catch(error=>{
            test.fail(error)
        });
});

run('setStartButton()', async () => {

    await mBot.api.setStartButton('startButton')
        .then(response => {
            test.object(response).hasProperty('result', 'success')
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('readGreeting()', async () => {
    await mBot.api.readGreeting()
        .then(response => {
            test.object(response).hasProperty('data')
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('setGreeting()', async () => {
    let greeting = [
        {
            locale: 'default',
            text: 'Hola, {{user_first_name}} Bienvenido a Botmarley chatbot'
        }, {
            locale: 'en_US',
            text: 'Hi, {{user_first_name}} Welcome to Botmarley chatbot'
        }
    ];

    await mBot.api.setGreeting(greeting)
        .then(response => {
            test.object(response).hasProperty('result', 'success')
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('readWhitelistedDomains()', async () => {
    await mBot.api.readWhitelistedDomains()
        .then(response => {
            test.object(response).hasProperty('data')
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('addWhitelistDomain()', async () => {
    await mBot.api.addWhitelistDomain([whitelistedUrl])
        .then(response => {
            test.object(response).hasProperty('result', 'success')
        })
        .catch(error=>{
            test.fail(error)
        });
});

run('deleteWhitelistDomain()', async () => {
    await mBot.api.deleteWhitelistDomain([whitelistedUrl])
         .then(response => {
            test.object(response).hasProperty('result', 'success')
         })
         .catch(error=>{
            test.fail(error)
         });
});
