# mBot-nodejs 
Build chatbots for Facebook Messenger on top of NodeJS

##### Requeriments

- NodeJS v7.10.0
- NPM v4.2.0


## Getting started

### How to install
```
npm install mbot-nodejs --save

or 

yarn add mbot-nodejs
```
___
## How to use

### Using the KoaJs middleware way:

If you are writing a KoaJs application, you can attach this library as a **middleware**.

#### Example
In your main koa app file:

```
const Koa = require('koa');
// you will nedd a bodyparser
const bodyParser = require('koa-bodyparser');
const server = new Koa();

// 1. Require the mBot module
const mBot = require('mbot-nodejs');

// 2. Make sure you are running a bodyparser middleware before the mBot middleware
server.use(bodyParser());

// 3. Set mBot middleware with a configuration object as parameter. 
server.use(mBot.koa({
    apiVersion: 'v2.8',
    verifyToken: process.env.VERIFY_TOKEN,
    pageToken: process.env.FB_PAGE_ACCESS_TOKEN
}));

// 4. Use event listeners to get data from facebook messenger
mBot.on('text', data => {
    console.log(data);
});
``` 
Check mBot API documentation for more information about available events.


### Using the alternative way:
If you are using other framework or none at all to write you application, you can use the **alternative way** in order to work with this library.

First you need to run **mBot.init()** method with a configuration object as parameter in your main app file:

#### Example
 
```
const mBot = require('mbot-nodejs);

mBot.init({
    apiVersion: 'v2.8',
    verifyToken: process.env.VERIFY_TOKEN,
    pageToken: process.env.FB_PAGE_ACCESS_TOKEN
});
```

Then use the **mBot.handlePayload()** method inside the route wich handle the post request from facebook messenger that contain the messenger data and pass the **payload** param to the method:

The **payload** param correspond to the data in the **req.body.entry** object.

Check messenger webhook reference documentation [here](https://developers.facebook.com/docs/messenger-platform/webhook-reference#subscribe)

#### Example
In your route module: ``` ../route/messenger.js```
```
const mBot = require('mbot-nodejs);

post('/messenger', function (req, res) {
    if (req.body.object === 'page') {
        let payload = req.body.entry;
        mBot.handlePayload(payload);
    }
});
```

Now you will be able to listen to events to get data from facebook messenger. 

In your main app file:

```
mBot.on('text', data => {
    console.log(data);
});
```
Check mBot API documentation for more information about available events.


# mBot API
## mBot.koa({}): 
Use this method to run mBot library as a **koajs middleware**

Pass an object as parameter with messenger webhook configuration data:

***Required parameters*** :

    @param {string} apiVersion  - facebook graph api version
    @param {string} verifyToken - verifyToken for facebook app webhook configuration. 
    @param {string} pageToken   - facebook messenger page access token
    
Optional parameters:

    @param {string} endpoint - facebook webhook endpoint name - '/messenger' by default

#### Example
In your main koajs app file:
    
```
const Koa = require('koa');;
const server = new Koa();

server.use(mBot.koa({
    apiVersion: 'v2.8',
    verifyToken: process.env.VERIFY_TOKEN,
    pageToken: process.env.FB_PAGE_ACCESS_TOKEN,
    endpoint: '/messenger-webhook'
}));
```

## mBot.init({}): 
Use this method to run mBot as an alternative way to the koajs middlware style.

Pass an object as parameter with messenger webhook configuration data:

***Required parameters*** :

    @param {string} apiVersion  - facebook graph api version
    @param {string} verifyToken - verifyToken for facebook app webhook configuration. 
    @param {string} pageToken   - facebook messenger page access token
    
Optional parameters:

    @param {string} endpoint - facebook webhook endpoint name - '/messenger' by default

#### Example
In your main app file:
    
```
mBot.init({
    apiVersion: 'v2.8',
    verifyToken: process.env.VERIFY_TOKEN,
    pageToken: process.env.FB_PAGE_ACCESS_TOKEN,
    endpoint: '/messenger-webhook'
});
```

## mBot.handlePayload(payload):
This method handle the incoming data (payload) from facebook messenger and emit different events depending on the received data.
**If you are working with KoaJs you don't need to use this method directly**.

Also this method work as an alternative way to use the library if you are **not** working with KoaJs.

Check messenger webhook reference [here](https://developers.facebook.com/docs/messenger-platform/webhook-reference#subscribe)

***Required parameters*** :

    @param {array} payload - facebook messenger incomming data (req.body.entry object)

#### Example
In your route module, for example: ``` ../route/messenger.js```
```
const mBot = require('mbot-nodejs);

post('/messenger', function (req, res) {
    if (req.body.object === 'page') {
        let payload = req.body.entry;
        mBot.handlePayload(payload);
    }
});
```

#### Events
This method will emit different events depending on the received data, valid events are:
- referral
- postback
- quickReply
- text
- sticker
- image
- audio
- video
- location

#### Listening to events
You can listen for those events on this way.

In your main app file: 

```
// Listen for text event 
mBot.on('text', data => {
    console.log(data);
});

// Listen for postback event 
mBot.on('postback', data => {
    console.log(data);
});

// Listen for image event
mBot.on('image', data => {
    console.log(data);
});
```
#### The data object
The data object contains information about received data from facebook messenger.
Check messenger webhook reference [here](https://developers.facebook.com/docs/messenger-platform/webhook-reference#subscribe)

```
{
    id              : Page ID of page
    time            : Time of update (epoch time in milliseconds)
    senderId        : Sender user ID
    recipientId     : Recipient user ID
    timestamp       : Message Timestamp
    mid             : Message ID
    seq             : Message sequence number
}

```
Also, this object will contain an extra key with information depending on the received event, e.g: 

If you receive an image event then the object will looks like:
```
{
    ... 
    image: {
        url: 'https://path-to-image-file'
    }
}
```

or if you receive a text event then the object will looks like:

```
{
    ... 
    text: 'some text'
}
```

# mBot Send API
Allows you to work with messenger send API.

All this methods are asynchronous functions.

Check messenger Send API reference [here](https://developers.facebook.com/docs/messenger-platform/send-api-reference)
 :

## mBot.api.sendTextMessage({}):
Send text message to the specified messenger user ID.

***Required parameters*** :
    
    @param {number} userId  - facebook messenger user id to send message
    @param {string} message - Message text

#### Example
```
mBot.on('text', async data => {
    await mBot.api.sendTextMessage({
        userId: data.senderId,
        message: 'hey dude!'
    }).catch(error=>{console.log('EVENT text - METHOD mBot.api.sendTextMessage() :' + error)});
});
```

## mBot.api.sendAttachment({}):
Send attachments (audio, file, image or video) ***URLs*** to users.

***Required parameters*** :

    @param {number} userId     - facebook messenger user id to send message
    @param {string} type       - attachment type (audio, file.. and so on)
    @param {string} payloadUrl - attachment url

#### Example 
```
mBot.api.sendAttachment({
   userId: data.senderId,
   type: 'audio',
   payloadUrl: 'https://URL/FILE.mp3'
})
.then(response=>{console.log(METHOD mBot.api.sendAttachment() :' + response)})
.catch(error=>{console.log(METHOD mBot.api.sendAttachment() :' + error)});
```

## mBot.api.sendButtonTemplate({}):
Send button template.

***Required parameters*** :

    @param {number} userId - facebook messenger user id to send message
    @param {string} text   - text that appears in main body
    @param {array} buttons - set of buttons that appear as call-to-actions

#### Example 
```
mBot.on('text', async data => {
    if (data.text === 'show buttons') {
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
            userId: data.senderId,
            text: 'our buttons',
            buttons: buttons
        }).catch(error=>{console.log('METHOD mBot.api.sendButtonTemplate() :' + error)});
    }
});
```

## mBot.api.sendGenericTemplate({}):
Send generic template.

***Required parameters*** :

    @param {number} userId  - facebook messenger user id to send message
    @param {array} elements - data for each bubble in message

#### Example
```
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

mBot.api.sendGenericTemplate({
    userId: data.senderId,
    elements: elements
}).catch(error=>{console.log('METHOD mBot.api.sendGenericTemplate() :' + error)});
```

## mBot.api.sendListTemplate({}):
Send list template.
You need to whitelist your URL first to work with this method. 

***Required parameters*** :

    @param {number} userId  - facebook messenger user id to send message
    @param {array} elements - list view elements (maximum of 4 elements and minimum of 2 elements)
    @param {array} buttons  - list of buttons associated on the list template message (maximum of 1 button)
    @param {string} type    - large or compact

#### Example
```
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

mBot.api.sendListTemplate({
    userId: data.senderId,
    elements: elements,
    buttons:  buttons,
    type: 'large'
}).catch(error=>{console.log('METHOD mBot.api.sendListTemplate() :' + error)});
```

## mBot.api.sendReceiptTemplate({}):
Send receipt template.

***Required parameters*** :

    @param {number} userId        - facebook messenger user id to send message
    @param {string} recipientName - recipient's name
    @param {number} orderNumber   - order number
    @param {string} currency      - currency for order
    @param {string} paymentMethod - payment method details. This can be a custom string. ex: 'Visa 1234'
    @param {string} orderUrl      - uRL of order
    @param {number} timestamp     - timestamp of the order, in seconds
    @param {array} elements       - items in order
    @param {object} address       - shipping address
    @param {object} summary       - payment summary
    @param {array} adjustments    - payment adjustments

#### Example
```
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

mBot.api.sendReceiptTemplate({
    userId: data.senderId,
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
}).catch(error=>{console.log('METHOD mBot.api.sendReceiptTemplate() :' + error)});
```

## mBot.api.sendBoardingPassTemplate({}):
Send boarding pass template.

***Required parameters*** :

    @param {number} userId       - facebook messenger user id to send message
    @param {string} introMessage - introduction message
    @param {string} locale       - two-letter language region code
    @param {array} boardingPass  - boarding passes for passengers

#### Example
```
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

mBot.api.sendBoardingPassTemplate({
    userId: data.senderId,
    introMessage: 'You are checked in.',
    locale: 'en_US',
    boardingPass: boardingPass
}).catch(error=>{console.log('METHOD mBot.api.sendBoardingPassTemplate() :' + error)});
```

## mBot.api.sendCheckinTemplate({}):
Send checkin template.

***Required parameters*** :

    @param {number} userId       - facebook messenger user id to send message
    @param {string} introMessage - introduction message
    @param {string} locale       - two-letter language region code
    @param {array} pnrNumber     - passenger name record number (Booking Number)
    @param {array} flightInfo    - information about a flight
    @param {array} checkinUrl    - url for passengers to check-in

#### Example
```
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

mBot.api.sendCheckinTemplate({
    userId: data.senderId,
    introMessage: 'Check-in is available now.',
    locale: 'en_US',
    pnrNumber: 'ABCDEF',
    flightInfo: flightInfo,
    checkinUrl: 'https:\/\/www.airline.com\/check-in'
}).catch(error=>{console.log('METHOD mBot.api.sendCheckinTemplate() :' + error)});
```

## mBot.api.sendItineraryTemplate({}):
Send itinerary template.

***Required parameters*** :

    @param {number} userId              - facebook messenger user id to send message
    @param {string} introMessage        - introduction message
    @param {string} locale              - two-letter language region code
    @param {string} pnrNumber           - passenger name record number (Booking Number)
    @param {array} passengerInfo        - information about a passenger
    @param {array} flightInfo           - information about a flight
    @param {array} passengerSegmentInfo - information unique to passenger/segment pair
    @param {array} priceInfo            - itemization of the total price
    @param {number} basePrice           - base price amount
    @param {number} tax                 - tax amount
    @param {number} totalPrice          - total price for the booking
    @param {string} currency            - pricing currency
    
#### Example
```
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

mBot.api.sendItineraryTemplate({
    userId: data.senderId,
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
}).catch(error=>{console.log('METHOD mBot.api.sendItiniraryTemplate() :' + error)});
```

## mBot.api.sendFlightUpdateTemplate({}):
Send flight update template.

***Required parameters*** :

    @param {number} userId         - facebook messenger user id to send message
    @param {string} introMessage   - introduction message
    @param {string} updateType     - type of update for this notification
    @param {string} locale         - two-letter language region code
    @param {string} pnrNumber      - passenger name record number (Booking Number)
    @param {array} upateFlightInfo - information about a flight

#### Example
```
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

mBot.api.sendFlightUpdateTemplate({
    userId: data.senderId,
    introMessage: 'Your flight is delayed',
    updateType: 'delay',
    locale: 'en_US',
    pnrNumber: 'CF23G2',
    updateFlightInfo: updateFlightInfo
}).catch(error=>{console.log('METHOD mBot.api.sendFlightUpdateTemplate() :' + error)});
```

## mBot.api.sendQuickReplies({}):
Send quick replies.

***Required parameters*** :

    @param {number} userId    - facebook messenger user id to send message
    @param {string} message   - Message text
    @param {array} quickReply - Array of quick_reply to be sent with messages

#### Example
```
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

mBot.api.sendQuickReplies({
    userId: process.env.TEST_FBID,
    text: 'Selecciona una opcion',
    quickReplies: quickReplies
}).catch(error=>{console.log('METHOD mBot.api.sendQuickReplies() :' + error)});
```

## mBot.api.sendAction({}):
Send action.

***Required parameters*** :

    @param {number} userId - facebook messenger user id to send message
    @param {string} senderAction - action to send
    
#### Example
```
mBot.api.sendAction({
    userId: process.env.TEST_FBID,
    senderAction: 'typing_on'
}).catch(error=>{console.log('METHOD mBot.api.sendAction() :' + error)});
```

## mBot.api.getUserProfile({}):
Get user profile information.

***Required parameters*** :

    @param {number} userId - facebook messenger user id to get profile information

#### Example
```
mBot.on('text', async data => {
    await mBot.api.getUserProfile(data.senderId)
        .then(response=>{console.log('profile info: ', response)})
        .catch(error=>{console.log('METHOD mBot.api.getUserProfile() :' + error)});
});
```

## mBot.api.setPersistentMenu({}):
Set persistent menu.

***Required parameters*** :

    @param {array} persistentMenu - Array of menu data

#### Example
```
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

mBot.api.setPersistentMenu(persistentMenu)
    .catch(error=>{console.log('METHOD mBot.api.setPersistentMenu() :' + error)});
```

## mBot.api.setStartButton({}):
Set start button.

***Required parameters*** :

    @param {string} payload - payload string

#### Example
```
mBot.api.setStartButton('startButton')
    .catch(error=>{console.log('METHOD mBot.api.setStartButton() :' + error)});
```

## mBot.api.setGreeting({}):
Set greeting message.

***Required parameters*** :

    @param {array} greeting - array of greeting data

#### Example
```
let greeting = [
    {
        locale: 'default',
        text: 'Hola, {{user_first_name}} Bienvenido a Botmarley chatbot'
    }, {
        locale: 'en_US',
        text: 'Hi, {{user_first_name}} Welcome to Botmarley chatbot'
    }
];

mBot.api.setGreeting(greeting)
    .catch(error=>{console.log('METHOD mBot.api.setGreeting() :' + error)});
```

## mBot.api.readGreeting({}):
Read greeting message.

***Required parameters*** :

    @param {array} greeting - array of greeting data

#### Example
```
mBot.api.readGreeting()
    .then(response=>{console.log('greeting: ', response)})
    .catch(error=>{console.log('METHOD mBot.api.readGreeting() :' + error)});
```

## mBot.api.readWhitelistedDomains({}):
Read Whitelisted Domains.

#### Example
```
mBot.api.readWhitelistedDomains()
    .then(response=>{console.log('domains: ', response)})
    .catch(error=>{console.log('METHOD mBot.api.readWhitelistedDomains() :' + error)});
    
```

## mBot.api.addWhitelistDomain({}):
Add Whitelist Domain.

***Required parameters*** :

    @param {array} domains - A list of domains being used with URL Buttons and Messenger Extensions. All domains must be valid and use https. Up to 10 domains allowed.

#### Example
```
const whitelistedUrl = 'https://some-url.net';

mBot.api.addWhitelistDomain([whitelistedUrl])
    .catch(error=>{console.log('METHOD mBot.api.addWhitelistDomain() :' + error)});
```

## mBot.api.deleteWhitelistDomain({}):
Delete Whitelist Domain.

***Required parameters*** :

    @param {array} domains - A list of domains being used with URL Buttons and Messenger Extensions. All domains must be valid and use https. Up to 10 domains allowed.

#### Example
```
const whitelistedUrl = 'https://some-url.net';

mBot.api.deleteWhitelistDomain([whitelistedUrl])
    .catch(error=>{console.log('METHOD mBot.api.deleteWhitelistDomain() :' + error)});
```
## TESTING
```
npm run unit
npm run watch:unit
npm run report
```

## License

    mBot-nodejs, Build chatbots for Facebook Messenger on top of NodeJS
    Copyright (C) 2017 Felipe L. S. Guzmám - contacto@lgsus.online

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

