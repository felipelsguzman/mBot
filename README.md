# mBot-nodejs 
NodeJS library to build chatbots for Facebook Messenger

##### Requeriments

- NodeJS v7.10.0
- NPM v4.2.0


## Getting started

### How to install
`npm install mbot-nodejs --save` 

### How to use
#### Using the KoaJs middleware way:

If you are writing a KoaJs application, you can attach this library as a **middleware**.

#### Example
In your main koa app file:

```
const Koa = require('koa');
// you will nedd a bodyparser
const bodyParser = require('koa-bodyparser');
const server = new Koa();

// 1. Import the mBot module
const mBot = require('mbot-nodejs');

// 2. Make sure you are running a bodyparser middleware before the mBot middleware
server.use(bodyParser());

// 3. Set mBot middleware with a configuration object
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


#### Using the alternative way:
If you are using other framework to write you application, you can use the **alternative way** in order to work with this library. 

Use the **mBot.handlePayload()** method inside the route wich handle the post request from facebook messenger each time you get a message and pass the **payload** param to the method:
 
The **payload** param is the data in the **req.body.entry** object.

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

Then you will be able to listen to events to get data from facebook messenger:

```
mBot.on('text', data => {
    console.log(data);
});
```

# API
## mBot.koa({}): 
Use this method to run mBot library as a **koajs middleware**

Use an object with parameters for set the facebook application webhook configuration:

Mandatory parameters _(you need set valid values on this parameters in order to work)_:

    @param {string} apiVersion - facebook graph api version
    @param {string} verifyToken - verifyToken for facebook app webhook configuration. 
    @param {string} pageToken - facebook messenger page access token
    
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

## mBot.handlePayload(payload):
This method handle the incoming data (payload) from facebook messenger and emit different events depending on the received data.
**If you are working with KoaJs you don't need to use this method directly**.

Also this method work as an alternative way to use the library if you are not working with KoaJs.

Mandatory parameters _(you need set valid values on this parameters in order to work)_:

    @param {string} payload - facebook messenger incomming data (req.body.entry object)

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
This method will emit differents events depending on the received data, the posible events are:

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
You can listen to those events on this way: 

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

## License

    mBot-nodejs, NodeJS library to build chatbots for Facebook Messenger
    Copyright (C) 2017 Felipe L. S. Guzmám - contacto@lgsus.online

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

