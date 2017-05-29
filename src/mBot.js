'use strict';

const EventEmitter = require('events');
const request = require('superagent');

// messenger api
const messengerApi = {
    /*
     *
     * Send text message to users
     * @param {number} userId  - facebook user id to send message
     * @param {string} message - Message text
     *
     * */
    sendTextMessage: async function sendTextMessage({
        userId,
        message
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                text: message
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     *
     * Send attachments (audio, file, image or video) to users
     * @param {number} userId     - facebook user id to send message
     * @param {string} type       - attachment type (audio, file.. and so on)
     * @param {string} payloadUrl - attachment url
     *
     * */
    sendAttachment: async function sendAttachment({
        userId,
        type,
        payloadUrl
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment:{
                    type: type,
                    payload:{
                        url: payloadUrl
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     *
     * Send button template
     * @param {number} userId - facebook user id to send message
     * @param {string} text   -   Text that appears in main body
     * @param {array} buttons - Set of buttons that appear as call-to-actions
     *
     * */
    sendButtonTemplate: async function sendButtonTemplate({
        userId,
        text,
        buttons
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message:{
                attachment:{
                    type: 'template',
                    payload:{
                        template_type: 'button',
                        text: text,
                        buttons: buttons
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     * Send generic template
     * @param {number} userId  - facebook user id to send message
     * @param {array} elements - Data for each bubble in message
     *
     * */
    sendGenericTemplate: async function sendGenericTemplate({
        userId,
        elements
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: elements
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     * Send list template
     * @param {number} userId  - facebook user id to send message
     * @param {array} elements - List view elements (maximum of 4 elements and minimum of 2 elements)
     * @param {array} buttons  - List of buttons associated on the list template message (maximum of 1 button)
     * @param {string} type    - large or compact
     *
     * */
    sendListTemplate: async function sendListTemplate({
        userId,
        elements,
        buttons,
        type
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'list',
                        top_element_style: type,
                        elements: elements,
                        buttons: buttons
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     * Send receipt template
     * @param {number} userId        - facebook user id to send message
     * @param {string} recipientName - Recipient's name
     * @param {number} orderNumber   - Order number
     * @param {string} currency      - Currency for order
     * @param {string} paymentMethod - Payment method details. This can be a custom string. ex: 'Visa 1234'
     * @param {string} orderUrl      - URL of order
     * @param {number} timestamp     - Timestamp of the order, in seconds
     * @param {array} elements       - Items in order
     * @param {object} addres        - Shipping address
     * @param {object} summary       - Payment summary
     * @param {array} adjustments    - Payment adjustments
     *
     * */
    sendReceiptTemplate: async function sendReceiptTemplate({
        userId,
        recipientName,
        orderNumber,
        merchantName,
        currency,
        paymentMethod,
        timestamp,
        orderUrl,
        elements,
        address,
        summary,
        adjustments
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'receipt',
                        recipient_name: recipientName,
                        merchant_name: merchantName,
                        order_number: orderNumber,
                        currency: currency,
                        payment_method: paymentMethod,
                        timestamp: timestamp,
                        order_url: orderUrl,
                        elements: elements,
                        address: address,
                        summary: summary,
                        adjustments: adjustments
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });

    },
    /*
     * Send boarding pass template
     * @param {number} userId       - facebook user id to send message
     * @param {string} introMessage - Introduction message
     * @param {string} locale       - Two-letter language region code
     * @param {array} boardingPass  - Boarding passes for passengers
     *
     * */
    sendBoardingPassTemplate: async function sendBoardingPassTemplate({
        userId,
        introMessage,
        locale,
        boardingPass
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'airline_boardingpass',
                        intro_message: introMessage,
                        locale: locale,
                        boarding_pass: boardingPass
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });

    },
    /*
     * Send checkin template
     * @param {number} userId       - facebook user id to send message
     * @param {string} introMessage - Introduction message
     * @param {string} locale       - Two-letter language region code
     * @param {array} pnrNumber     - Boarding passes for passengers
     * @param {array} flightInfo    - Boarding passes for passengers
     * @param {array} checkinUrl    - Boarding passes for passengers
     *
     * */
    sendCheckinTemplate: async function sendCheckinTemplate({
        userId,
        introMessage,
        locale,
        pnrNumber,
        flightInfo,
        checkinUrl
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'airline_checkin',
                        intro_message: introMessage,
                        locale: locale,
                        pnr_number: pnrNumber,
                        flight_info: flightInfo,
                        checkin_url: checkinUrl
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });

    },
    /*
     * Send itinerary template
     * @param {number} userId              - facebook user id to send message
     * @param {string} introMessage        - Introduction message
     * @param {string} locale              - Two-letter language region code
     * @param {string} pnrNumber           - Passenger name record number (Booking Number)
     * @param {array} passengerInfo        - Information about a passenger
     * @param {array} flightInfo           - Information about a flight
     * @param {array} passengerSegmentInfo - Information unique to passenger/segment pair
     * @param {array} priceInfo            - Itemization of the total price
     * @param {number} basePrice           - Base price amount
     * @param {number} tax                 - Tax amount
     * @param {number} totalPrice          - Total price for the booking
     * @param {string} currency            - Pricing currency
     *
     * */
    sendItineraryTemplate: async function sendItineraryTemplate({
        userId,
        introMessage,
        locale,
        pnrNumber,
        passengerInfo,
        flightInfo,
        passengerSegmentInfo,
        priceInfo,
        basePrice,
        tax,
        totalPrice,
        currency
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'airline_itinerary',
                        intro_message: introMessage,
                        locale: locale,
                        pnr_number: pnrNumber,
                        passenger_info: passengerInfo,
                        flight_info: flightInfo,
                        passenger_segment_info: passengerSegmentInfo,
                        price_info: priceInfo,
                        base_price: basePrice,
                        tax: tax,
                        total_price: totalPrice,
                        currency: currency
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });

    },
    /*
     * Send flight update template
     * @param {number} userId         - facebook user id to send message
     * @param {string} introMessage   - Introduction message
     * @param {string} updateType     - Type of update for this notification
     * @param {string} locale         - Two-letter language region code
     * @param {string} pnrNumber      - Passenger name record number (Booking Number)
     * @param {array} upateFlightInfo - Information about a flight
     *
     * */
    sendFlightUpdateTemplate: async function sendFlightUpdateTemplate({
        userId,
        introMessage,
        updateType,
        locale,
        pnrNumber,
        updateFlightInfo
    }) {
        let data = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'airline_update',
                        intro_message: introMessage,
                        update_type: updateType,
                        locale: locale,
                        pnr_number: pnrNumber,
                        update_flight_info: updateFlightInfo
                    }
                }
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });

    },
    /*
     *
     * Send quick replies
     * @param {number} userId    - facebook user id to send message
     * @param {string} message   - Message text
     * @param {array} quickReply - Array of quick_reply to be sent with messages
     *
     * */
    sendQuickReplies: async function sendQuickReplies({
        userId,
        text,
        quickReplies
    }) {

        let data = {
            recipient: {
                id: userId
            },
            message: {
                text: text,
                quick_replies: quickReplies
            }
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     *
     * Send action
     * @param {number} userId       - facebook user id to send message
     * @param {string} senderAction - action to send
     *
     * */
    sendAction: async function sendAction({
        userId,
        senderAction
    }) {

        let data = {
            recipient: {
                id: userId
            },
            sender_action: senderAction
        };

        const url = mBot.apiUrl + 'me/messages?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send(data)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     * Get user profile information
     * @param {number} userId -facebook user id to get profile
     *
     * */
    getUserProfile: async function getUserProfile(userId){

        const url = mBot.apiUrl + userId + '?fields=first_name,last_name,profile_pic,locale,timezone,gender,is_payment_enabled,last_ad_referral&access_token=' + mBot.pageToken;

        return await request
            .get(url)
            .then(result=>{
                //console.log('AUI', result);
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });

    },
    /*
     *
     * Set persistent menu
     * @param {array} persistentMenu - Array of menu data
     *
     * */
    setPersistentMenu: async function setPersistentMenu(persistentMenu) {

        const url = mBot.apiUrl + 'me/messenger_profile?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send({
                persistent_menu: persistentMenu
            })
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     *
     * Set start button
     * @param {string} payload - payload string
     *
     * */
    setStartButton: async function setStartButton(payload) {

        const url = mBot.apiUrl + 'me/messenger_profile?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send({
                get_started: {
                    payload: payload
                }
            })
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     *
     * Set greeting message
     * @param {array} greeting - array of greeting data
     *
     * */
    setGreeting: async function setGreeting(greeting) {

        const url = mBot.apiUrl + 'me/messenger_profile?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send({
                greeting: greeting
            })
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     *
     * Read greeting message
     * @param {array} greeting - array of greeting data
     *
     * */
    readGreeting: async function readGreeting() {

        let url = mBot.apiUrl + 'me/messenger_profile?fields=greeting&access_token=' + mBot.pageToken;

        return await request
            .get(url)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     * Read Whitelisted Domains
     *
     * */
    readWhitelistedDomains: async function readWhitelistedDomains() {
        let url = mBot.apiUrl + 'me/messenger_profile?fields=whitelisted_domains&access_token=' + mBot.pageToken;

        return await request
            .get(url)
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     * Add Whitelist Domain
     * @param {array} domains - A list of domains being used with URL Buttons and Messenger Extensions. All domains must be valid and use https. Up to 10 domains allowed.
     *
     * */
    addWhitelistDomain: async function addWhitelistDomain(domains) {

        const url = mBot.apiUrl + 'me/messenger_profile?access_token=' + mBot.pageToken;

        return await request
            .post(url)
            .set('Content-Type', 'application/json')
            .send({
                whitelisted_domains: domains
            })
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    },
    /*
     * Delete Whitelist Domain
     * @param {array} domains - A list of domains being used with URL Buttons and Messenger Extensions. All domains must be valid and use https. Up to 10 domains allowed.
     *
     * */
    deleteWhitelistDomain: async function deleteWhitelistDomain() {

        const url = mBot.apiUrl + 'me/messenger_profile?access_token=' + mBot.pageToken;

        return await request
            .delete(url)
            .send({
                fields: ['whitelisted_domains']
            })
            .then(result=>{
                return JSON.parse(result.text);
            })
            .catch(result=>{
                let text = JSON.parse(result.response.text);
                let error = text.error;
                throw new Error(error.message);
            });
    }
};

const mBot = Object.setPrototypeOf({
    // Facebook Graph API version
    apiUrl: null,
    // API methods object
    api: messengerApi,
    // verify token for webhook usage
    verifyToken: null,
    // Facebook Page Access Token
    pageToken: null,
    /*
     * handlePayload()
     * Handle incoming data from messenger platform
     * @param {object} payload - data from facebook messenger platform
     *
     * */
    handlePayload: async function handlePayload(payload) {

        let store = {};

        // process entry arrays
        await payload.map(entry => {
            store.id = entry.id;
            store.time = entry.time;

            // process message array
            entry.messaging.map(event => {

                // store shared info
                store.senderId = event.sender.id;
                store.recipientId = event.recipient.id;
                store.timestamp = event.timestamp;

                // check for referral
                if (event.referral) {
                    store.referral = event.referral;
                }

                // check for postback events
                else if (event.postback) {
                    store.postback = event.postback.payload;
                }

                else {
                    store.mid = event.message.mid;
                    store.seq = event.message.seq;

                    // check for quick reply
                    if (event.message.quick_reply) {
                        store.quickReply = event.message.quick_reply;
                    }

                    // check for text message
                    if (event.message.text) {
                        store.text = event.message.text;
                    }

                    // check for attachments
                    else if (event.message.attachments) {

                        let attachment = event.message.attachments[0];

                        // check for sticker
                        if (event.message.sticker_id) {
                            store.stickerId = event.message.sticker_id;
                            store.stickerUrl = attachment.payload.url;
                        }

                        // check for image
                        else if (attachment.type === 'image') {
                            store.image = attachment.payload;
                        }

                        // check for audio
                        else if (attachment.type === 'audio') {
                            store.audio = attachment.payload
                        }

                        // check for video
                        else if (attachment.type === 'video') {
                            store.video = attachment.payload;
                        }

                        // check for location
                        else if (attachment.type === 'location') {
                            store.location = attachment.payload;
                        }

                    }

                }

            });
        });

        // event emitter function based on stored data
        (data => {

            if (data.referral) {
                mBot.emit('referral', data);
            }

            else if (data.postback) {
                mBot.emit('postback', data);
            }

            else if (data.quickReply) {
                mBot.emit('quickReply', data);
            }

            else if (data.text) {
                mBot.emit('text', data);
            }

            else if (data.stickerId) {
                mBot.emit('sticker', data);
            }

            else if (data.image) {
                mBot.emit('image', data);
            }

            else if (data.audio) {
                mBot.emit('audio', data);
            }

            else if (data.video) {
                mBot.emit('video', data);
            }

            else if (data.location) {
                mBot.emit('location', data);
            }

        })(store);
    },
    /*
     * koa()
     * Allow to run mBot library as koajs middleware
     * @param {string} apiVersion  - facebook graph api version
     * @param {string} endpoint    - endpoint for webhook usage
     * @param {string} verifyToken - verifyToken for webhook usage
     * @param {string} pageToken   - facebook page access token
     *
     * */
    koa: function koa({
        apiVersion,
        endpoint,
        verifyToken,
        pageToken
    }) {

        // set api url
        this.apiUrl = 'https://graph.facebook.com/' + apiVersion + '/';

        // set default option for endpoint name
        let url = endpoint === undefined ? '/messenger' : endpoint;

        // check for mandatory access tokens
        let token = ((pToken, vToken)=>{
            if (pToken === undefined ||
                vToken === undefined) {
                throw new Error('you must set valid values for both pageToken and verifyToken params');
            } else {
                // store facebook page access token on main object
                this.pageToken = pToken;
                this.verifyToken = vToken;

                return {
                    page: pToken,
                    verify: vToken
                }
            }
        })(pageToken, verifyToken);

        // return koa middelware
        return async function mBotKoa(ctx, next) {

            if (ctx.path === url && ctx.method === 'GET') {
                if (ctx.query['hub.verify_token'] === token.verify) {
                    ctx.type = 'text/plain; charset=utf-8';
                    ctx.body = ctx.query['hub.challenge'];
                    ctx.status  = 200;
                } else {
                    ctx.status = 401;
                }
            }

            else if (ctx.path === url && ctx.method === 'POST') {
                //console.log(ctx.request.body.entry[0].messaging);
                if (ctx.request.body.object === 'page') {
                    let payload = ctx.request.body.entry;
                    mBot.handlePayload(payload);
                    ctx.type = 'text/plain; charset=utf-8';
                    ctx.status = 200;
                } else {
                    ctx.status = 400;
                }
            }

            await next();
        }
    },
    /*
     * init()
     * Allow to run mBot library stand alone
     * @param {string} apiVersion  - facebook graph api version
     * @param {string} endpoint    - endpoint for webhook usage
     * @param {string} verifyToken - verifyToken for webhook usage
     * @param {string} pageToken   - facebook page access token
     *
     * */
    init: function init({
        apiVersion,
        endpoint,
        verifyToken,
        pageToken
    }) {

        // set api url
        this.apiUrl = 'https://graph.facebook.com/' + apiVersion + '/';

        // set default option for endpoint name
        let url = endpoint === undefined ? '/messenger' : endpoint;

        // check for mandatory access tokens
        ((pToken, vToken)=>{
            if (pToken === undefined ||
                vToken === undefined) {
                throw new Error('you must set valid values for both pageToken and verifyToken params');
            } else {
                // store facebook page access token on main object
                this.pageToken = pToken;
                this.verifyToken = vToken;

                return {
                    page: pToken,
                    verify: vToken
                }
            }
        })(pageToken, verifyToken);
    }

}, EventEmitter.prototype);

module.exports = mBot;

